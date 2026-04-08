CREATE EXTENSION IF NOT EXISTS btree_gist;

-- FLOORS
CREATE TABLE floors (
    floor_id UUID PRIMARY KEY DEFAULT uuidv7 (),
    name TEXT NOT NULL,
    building TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT now()
);

-- FLOOR CELLS
CREATE TABLE floor_cells (
    floor_cell_id UUID PRIMARY KEY DEFAULT uuidv7 (),
    floor_id UUID NOT NULL REFERENCES floors (floor_id) ON DELETE CASCADE,
    row_num INT NOT NULL, -- 'row' is a reserved keyword in some contexts, renamed for safety
    col_num INT NOT NULL,
    cell_type TEXT,
    UNIQUE (floor_id, row_num, col_num)
);

CREATE INDEX idx_floor_cells_floor ON floor_cells (floor_id);

-- SPACES
CREATE TABLE spaces (
    space_id UUID PRIMARY KEY DEFAULT uuidv7 (),
    floor_id UUID NOT NULL REFERENCES floors (floor_id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity INT DEFAULT 1,
    metadata JSONB DEFAULT '{}',
    UNIQUE (floor_id, code)
);

-- BOOKINGS
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuidv7 (),
    space_id UUID NOT NULL REFERENCES spaces (space_id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    start_time TIMESTAMPTZ NOT NULL, -- Use TIMESTAMPTZ for consistency
    end_time TIMESTAMPTZ NOT NULL,
    time_range TSTZRANGE,
    status TEXT DEFAULT 'booked',
    created_at TIMESTAMPTZ DEFAULT now(),
    CHECK (end_time > start_time)
);

-- Optimized Trigger Function
CREATE OR REPLACE FUNCTION set_time_range()
RETURNS trigger AS $$
BEGIN
  -- [ , ) means inclusive start, exclusive end
  NEW.time_range := tstzrange(NEW.start_time, NEW.end_time, '[)');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_time_range
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_time_range();

-- GIST Index for No Double Booking
-- This handles the overlap check (&&) and equality (=) for space_id
ALTER TABLE bookings
ADD CONSTRAINT no_overlap_booking EXCLUDE USING gist (
    space_id
    WITH
        =,
        time_range
    WITH
        &&
);

-- ============================================
-- SAMPLE DATA (Using valid UUIDv7 format)
-- ============================================

-- Seed a Floor

-- Seed Cells

-- ============================================================
-- ENUM / LOOKUP: all cell types present on KFintech 5th Floor
-- ============================================================
-- Bookable (spaces with capacity):
--   WORKSTATION_STD   – standard 1.800 x 0.600 m desk  (190 nos)
--   WORKSTATION_SML   – compact  0.900 x 0.600 m desk  ( 11 nos)
--   WORKSTATION_HAT   – hat/exi  1.800 x 0.600 m desk  ( 25 nos)
--   MR6               – 6-seat meeting room             (  2 nos north + 1 south)
--   MR4               – 4-seat meeting room             (  2 nos north + 1 south)
--   COLAB_18S         – 18-seat collaboration area      (  4 nos)
--   TELBOOTH          – telephone / focus booth         (  4 nos)
--   CUBICLE           – enclosed cubicle workstation    (  2 nos)
-- Non-bookable (infrastructure / amenity):
--   LIFT              – lift shaft
--   STAIRCASE         – staircase core
--   LOBBY             – central lift lobby
--   RECEPTION         – reception / security desk
--   LOCKER            – locker bank (239 total)
--   PANTRY            – pantry + printer + storage
--   HUB_ROOM          – network hub room
--   SERVER_ROOM       – server / IT room
--   ELEC_PANEL        – electrical & battery panel room
--   DUCT              – vertical service duct
--   TOILET_GENTS      – gents toilet
--   TOILET_LADIES     – ladies toilet
--   STORAGE           – storage / DB unit
--   PLANTER           – planter / green zone
--   CORRIDOR          – null / open circulation (stored as NULL in floor_cells)
-- ============================================================

CREATE OR REPLACE FUNCTION seed_floor_data(num_records INT)
RETURNS TABLE (
    floors_count      INT,
    cells_count       INT,
    spaces_count      INT,
    bookings_count    INT,
    execution_time_ms NUMERIC
) AS $$
DECLARE
    start_ts   TIMESTAMP;
    end_ts     TIMESTAMP;
    v_floor_id UUID;

    -- ── Exact counts from the K Fintech 5th-floor drawing ──────────
    -- Bookable types: weight drives how many cells of each type are
    -- generated when num_records cells are requested.
    -- Weights below mirror the real floor's proportional distribution.
    -- Infrastructure types share the remainder evenly.
    -- ───────────────────────────────────────────────────────────────
BEGIN
    start_ts := clock_timestamp();

    -- ── 1. Floor record ────────────────────────────────────────────
    INSERT INTO floors (floor_id,name, building)
    VALUES ('019d6e02-0c66-73e7-9317-0cce79e88eb7','5th Floor – KFintech', 'Alpha Tower, Bhubaneswar')
    RETURNING floor_id INTO v_floor_id;

    -- ── 2. Cells + Spaces ──────────────────────────────────────────
    --  Cell-type distribution is derived directly from the floor plan:
    --
    --  Type               | Approx % of total cells
    --  -------------------|------------------------
    --  WORKSTATION_STD    | 46 %   (largest share – 190 desks)
    --  WORKSTATION_HAT    | 11 %   (25 hat/exi desks along south wall)
    --  WORKSTATION_SML    |  5 %   (11 compact desks)
    --  LOCKER             | 11 %   (239 locker cells distributed in banks)
    --  COLAB_18S          |  4 %   (4 × 18-seat collab bays)
    --  MR6                |  3 %   (3 × 6-seat meeting rooms)
    --  MR4                |  3 %   (3 × 4-seat meeting rooms)
    --  TELBOOTH           |  2 %   (4 telephone / focus booths)
    --  CUBICLE            |  1 %   (2 enclosed cubicles)
    --  PANTRY             |  1 %
    --  HUB_ROOM           |  1 %
    --  SERVER_ROOM        |  1 %
    --  RECEPTION          |  1 %
    --  LOBBY              |  1 %
    --  LIFT               |  1 %
    --  STAIRCASE          |  1 %
    --  ELEC_PANEL         |  1 %
    --  DUCT               |  1 %
    --  TOILET_GENTS       |  1 %
    --  TOILET_LADIES      |  1 %
    --  STORAGE            |  2 %
    --  PLANTER            |  1 %
    --  -------------------|------------------------
    --  (corridors / null  stored as NULL – not inserted as cells)

    WITH cell_gen AS (
        INSERT INTO floor_cells (floor_id, row_num, col_num, cell_type)
        SELECT
            v_floor_id,
            -- row / col derived from a square-ish grid
            (s - 1) / GREATEST(CAST(sqrt(num_records) AS INT), 1),
            (s - 1) % GREATEST(CAST(sqrt(num_records) AS INT), 1),
            /*
             * Map each serial number to a cell type using the cumulative
             * percentage bands above.  A modulo of 100 gives a clean
             * 1-percent resolution; values are assigned in descending
             * frequency order so the most common types get the widest bands.
             *
             * Band edges (cumulative %):
             *  0 – 45  → WORKSTATION_STD   (46 slots)
             * 46 – 56  → WORKSTATION_HAT   (11 slots)
             * 57 – 61  → WORKSTATION_SML   ( 5 slots)
             * 62 – 72  → LOCKER            (11 slots)
             * 73 – 76  → COLAB_18S         ( 4 slots)
             * 77 – 79  → MR6               ( 3 slots)
             * 80 – 82  → MR4               ( 3 slots)
             * 83 – 84  → TELBOOTH          ( 2 slots)
             * 85       → CUBICLE           ( 1 slot )
             * 86       → PANTRY            ( 1 slot )
             * 87       → HUB_ROOM          ( 1 slot )
             * 88       → SERVER_ROOM       ( 1 slot )
             * 89       → RECEPTION         ( 1 slot )
             * 90       → LOBBY             ( 1 slot )
             * 91       → LIFT              ( 1 slot )
             * 92       → STAIRCASE         ( 1 slot )
             * 93       → ELEC_PANEL        ( 1 slot )
             * 94       → DUCT              ( 1 slot )
             * 95       → TOILET_GENTS      ( 1 slot )
             * 96       → TOILET_LADIES     ( 1 slot )
             * 97 – 98  → STORAGE           ( 2 slots)
             * 99       → PLANTER           ( 1 slot )
             */
            CASE (s % 100)
                WHEN 0  THEN 'WORKSTATION_STD'
                WHEN 1  THEN 'WORKSTATION_STD'
                WHEN 2  THEN 'WORKSTATION_STD'
                WHEN 3  THEN 'WORKSTATION_STD'
                WHEN 4  THEN 'WORKSTATION_STD'
                WHEN 5  THEN 'WORKSTATION_STD'
                WHEN 6  THEN 'WORKSTATION_STD'
                WHEN 7  THEN 'WORKSTATION_STD'
                WHEN 8  THEN 'WORKSTATION_STD'
                WHEN 9  THEN 'WORKSTATION_STD'
                WHEN 10 THEN 'WORKSTATION_STD'
                WHEN 11 THEN 'WORKSTATION_STD'
                WHEN 12 THEN 'WORKSTATION_STD'
                WHEN 13 THEN 'WORKSTATION_STD'
                WHEN 14 THEN 'WORKSTATION_STD'
                WHEN 15 THEN 'WORKSTATION_STD'
                WHEN 16 THEN 'WORKSTATION_STD'
                WHEN 17 THEN 'WORKSTATION_STD'
                WHEN 18 THEN 'WORKSTATION_STD'
                WHEN 19 THEN 'WORKSTATION_STD'
                WHEN 20 THEN 'WORKSTATION_STD'
                WHEN 21 THEN 'WORKSTATION_STD'
                WHEN 22 THEN 'WORKSTATION_STD'
                WHEN 23 THEN 'WORKSTATION_STD'
                WHEN 24 THEN 'WORKSTATION_STD'
                WHEN 25 THEN 'WORKSTATION_STD'
                WHEN 26 THEN 'WORKSTATION_STD'
                WHEN 27 THEN 'WORKSTATION_STD'
                WHEN 28 THEN 'WORKSTATION_STD'
                WHEN 29 THEN 'WORKSTATION_STD'
                WHEN 30 THEN 'WORKSTATION_STD'
                WHEN 31 THEN 'WORKSTATION_STD'
                WHEN 32 THEN 'WORKSTATION_STD'
                WHEN 33 THEN 'WORKSTATION_STD'
                WHEN 34 THEN 'WORKSTATION_STD'
                WHEN 35 THEN 'WORKSTATION_STD'
                WHEN 36 THEN 'WORKSTATION_STD'
                WHEN 37 THEN 'WORKSTATION_STD'
                WHEN 38 THEN 'WORKSTATION_STD'
                WHEN 39 THEN 'WORKSTATION_STD'
                WHEN 40 THEN 'WORKSTATION_STD'
                WHEN 41 THEN 'WORKSTATION_STD'
                WHEN 42 THEN 'WORKSTATION_STD'
                WHEN 43 THEN 'WORKSTATION_STD'
                WHEN 44 THEN 'WORKSTATION_STD'
                WHEN 45 THEN 'WORKSTATION_STD'
                WHEN 46 THEN 'WORKSTATION_HAT'
                WHEN 47 THEN 'WORKSTATION_HAT'
                WHEN 48 THEN 'WORKSTATION_HAT'
                WHEN 49 THEN 'WORKSTATION_HAT'
                WHEN 50 THEN 'WORKSTATION_HAT'
                WHEN 51 THEN 'WORKSTATION_HAT'
                WHEN 52 THEN 'WORKSTATION_HAT'
                WHEN 53 THEN 'WORKSTATION_HAT'
                WHEN 54 THEN 'WORKSTATION_HAT'
                WHEN 55 THEN 'WORKSTATION_HAT'
                WHEN 56 THEN 'WORKSTATION_HAT'
                WHEN 57 THEN 'WORKSTATION_SML'
                WHEN 58 THEN 'WORKSTATION_SML'
                WHEN 59 THEN 'WORKSTATION_SML'
                WHEN 60 THEN 'WORKSTATION_SML'
                WHEN 61 THEN 'WORKSTATION_SML'
                WHEN 62 THEN 'LOCKER'
                WHEN 63 THEN 'LOCKER'
                WHEN 64 THEN 'LOCKER'
                WHEN 65 THEN 'LOCKER'
                WHEN 66 THEN 'LOCKER'
                WHEN 67 THEN 'LOCKER'
                WHEN 68 THEN 'LOCKER'
                WHEN 69 THEN 'LOCKER'
                WHEN 70 THEN 'LOCKER'
                WHEN 71 THEN 'LOCKER'
                WHEN 72 THEN 'LOCKER'
                WHEN 73 THEN 'COLAB_18S'
                WHEN 74 THEN 'COLAB_18S'
                WHEN 75 THEN 'COLAB_18S'
                WHEN 76 THEN 'COLAB_18S'
                WHEN 77 THEN 'MR6'
                WHEN 78 THEN 'MR6'
                WHEN 79 THEN 'MR6'
                WHEN 80 THEN 'MR4'
                WHEN 81 THEN 'MR4'
                WHEN 82 THEN 'MR4'
                WHEN 83 THEN 'TELBOOTH'
                WHEN 84 THEN 'TELBOOTH'
                WHEN 85 THEN 'CUBICLE'
                WHEN 86 THEN 'PANTRY'
                WHEN 87 THEN 'HUB_ROOM'
                WHEN 88 THEN 'SERVER_ROOM'
                WHEN 89 THEN 'RECEPTION'
                WHEN 90 THEN 'LOBBY'
                WHEN 91 THEN 'LIFT'
                WHEN 92 THEN 'STAIRCASE'
                WHEN 93 THEN 'ELEC_PANEL'
                WHEN 94 THEN 'DUCT'
                WHEN 95 THEN 'TOILET_GENTS'
                WHEN 96 THEN 'TOILET_LADIES'
                WHEN 97 THEN 'STORAGE'
                WHEN 98 THEN 'STORAGE'
                ELSE         'PLANTER'   -- slot 99
            END
        FROM generate_series(1, num_records) s
        RETURNING floor_cell_id, cell_type, row_num, col_num
    ),

    -- ── 3. Spaces – capacity from the drawing's schedule ───────────
    --  Only cells that can be booked get a spaces row.
    --  Infrastructure cells (LIFT, STAIRCASE, LOBBY, RECEPTION,
    --  LOCKER, ELEC_PANEL, DUCT, TOILET_*, STORAGE, PLANTER) are
    --  skipped here – they have no bookable capacity.
    space_gen AS (
        INSERT INTO spaces (floor_id, code, type, capacity)
        SELECT
            v_floor_id,
            'LOC-' || row_num || '-' || col_num,
            cell_type,
            CASE cell_type
                -- meeting rooms: exact seat count from drawing
                WHEN 'MR6'            THEN 6
                WHEN 'MR4'            THEN 4
                -- collab bays: 18 seats per bay (drawing: COLAB AREA – 18S)
                WHEN 'COLAB_18S'      THEN 18
                -- workstations: always 1 person per desk
                WHEN 'WORKSTATION_STD' THEN 1
                WHEN 'WORKSTATION_HAT' THEN 1
                WHEN 'WORKSTATION_SML' THEN 1
                -- cubicle: small enclosed workstation for 1
                WHEN 'CUBICLE'        THEN 1
                -- telephone / focus booth: 1 person
                WHEN 'TELBOOTH'       THEN 1
                -- pantry: informal seating for ~15 (drawing note)
                WHEN 'PANTRY'         THEN 15
                -- hub & server: access-controlled, 0 bookable seats
                WHEN 'HUB_ROOM'       THEN 0
                WHEN 'SERVER_ROOM'    THEN 0
                ELSE 0
            END
        FROM cell_gen
        -- only insert bookable types (capacity > 0 or explicitly bookable)
        WHERE cell_type IN (
            'WORKSTATION_STD', 'WORKSTATION_HAT', 'WORKSTATION_SML',
            'MR6', 'MR4', 'COLAB_18S',
            'TELBOOTH', 'CUBICLE', 'PANTRY',
            'HUB_ROOM', 'SERVER_ROOM'   -- kept for inventory, not bookable by users
        )
        RETURNING space_id, type AS cell_type
    ),

    -- ── 4. Bookings – only user-bookable types ─────────────────────
    booking_gen AS (
        INSERT INTO bookings (space_id, user_id, start_time, end_time)
        SELECT
            space_id,
            uuidv7(),
            '2026-05-01 09:00:00+00'::timestamptz,
            '2026-05-01 10:00:00+00'::timestamptz
        FROM space_gen
        WHERE cell_type IN (
            'WORKSTATION_STD', 'WORKSTATION_HAT', 'WORKSTATION_SML',
            'MR6', 'MR4', 'COLAB_18S',
            'TELBOOTH', 'CUBICLE', 'PANTRY'
        )
        RETURNING space_id
    )
    -- FIX: Move the logic into a final SELECT within the CTE context
    SELECT 
        1::INT, 
        num_records, 
        (SELECT COUNT(*)::INT FROM spaces WHERE floor_id = v_floor_id),
        (SELECT COUNT(*)::INT FROM booking_gen), -- Count directly from the CTE
        CAST(EXTRACT(EPOCH FROM (clock_timestamp() - start_ts)) * 1000 AS NUMERIC)
    INTO floors_count, cells_count, spaces_count, bookings_count, execution_time_ms;

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ── Run it ─────────────────────────────────────────────────────────
-- SELECT * FROM seed_floor_data(226);   -- seed exactly 226 cells = real workstation count
-- or
SELECT * FROM seed_floor_data(540);   -- seed all cells including infra (approx full floor)