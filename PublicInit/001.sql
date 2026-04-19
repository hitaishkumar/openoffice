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
    floor_id UUID NOT NULL REFERENCES floors (floor_id) ON DELETE CASCADE,
    row_num INT NOT NULL,
    col_num INT NOT NULL,

    floor_cell_id TEXT GENERATED ALWAYS AS (
        floor_id::text || '_' || row_num || '_' || col_num
    ) STORED,

    cell_type TEXT,
    capacity INT DEFAULT 0,
    is_bookable BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',

    PRIMARY KEY (floor_cell_id),
    UNIQUE (floor_id, row_num, col_num)
);

CREATE INDEX idx_floor_cells_floor ON floor_cells (floor_id);

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

INSERT INTO
    floors (floor_id, name, building)
VALUES (
        '019d6e02-0c66-73e7-9317-0cce79e88eb7',
        '5th Floor – KFintech',
        'Alpha Tower, Bhubaneswar'
    ) ON CONFLICT (floor_id) DO NOTHING;


INSERT INTO floor_cells (
  floor_id,
  row_num,
  col_num,
  cell_type,
  capacity,
  is_bookable
)
SELECT
  '019d6e02-0c66-73e7-9317-0cce79e88eb7'::uuid,

  (s - 1) / 23,
  (s - 1) % 23,

  cell_type,

-- capacity
CASE cell_type
    WHEN 'MR6' THEN 6
    WHEN 'MR4' THEN 4
    WHEN 'COLAB_18S' THEN 18
    WHEN 'PANTRY' THEN 15
    WHEN 'WORKSTATION_STD' THEN 1
    WHEN 'WORKSTATION_HAT' THEN 1
    WHEN 'WORKSTATION_SML' THEN 1
    WHEN 'CUBICLE' THEN 1
    WHEN 'TELBOOTH' THEN 1
    ELSE 0
END,

-- bookable
cell_type IN (
    'WORKSTATION_STD',
    'WORKSTATION_HAT',
    'WORKSTATION_SML',
    'MR6',
    'MR4',
    'COLAB_18S',
    'TELBOOTH',
    'CUBICLE',
    'PANTRY'
)
FROM (
        SELECT
            s, CASE
                WHEN m <= 45 THEN 'WORKSTATION_STD'
                WHEN m <= 56 THEN 'WORKSTATION_HAT'
                WHEN m <= 61 THEN 'WORKSTATION_SML'
                WHEN m <= 72 THEN 'LOCKER'
                WHEN m <= 76 THEN 'COLAB_18S'
                WHEN m <= 79 THEN 'MR6'
                WHEN m <= 82 THEN 'MR4'
                WHEN m <= 84 THEN 'TELBOOTH'
                WHEN m = 85 THEN 'CUBICLE'
                WHEN m = 86 THEN 'PANTRY'
                WHEN m = 87 THEN 'HUB_ROOM'
                WHEN m = 88 THEN 'SERVER_ROOM'
                WHEN m = 89 THEN 'RECEPTION'
                WHEN m = 90 THEN 'LOBBY'
                WHEN m = 91 THEN 'LIFT'
                WHEN m = 92 THEN 'STAIRCASE'
                WHEN m = 93 THEN 'ELEC_PANEL'
                WHEN m = 94 THEN 'DUCT'
                WHEN m = 95 THEN 'TOILET_GENTS'
                WHEN m = 96 THEN 'TOILET_LADIES'
                WHEN m <= 98 THEN 'STORAGE'
                ELSE 'PLANTER'
            END AS cell_type
        FROM (
                SELECT s, (s % 100) AS m
                FROM generate_series (1, 540) s
            ) x
    ) t;




-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT
);
