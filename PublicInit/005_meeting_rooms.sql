-- Meeting Rooms Tables

CREATE TABLE meeting_rooms (
    room_id UUID PRIMARY KEY DEFAULT uuidv7(),
    floor_id UUID NOT NULL REFERENCES floors(floor_id) ON DELETE CASCADE,
    room_code TEXT NOT NULL,
    name TEXT NOT NULL,
    capacity INT NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(floor_id, room_code)
);

CREATE TABLE meeting_room_facilities (
    facility_id UUID PRIMARY KEY DEFAULT uuidv7(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE meeting_room_facility_assignments (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    room_id UUID NOT NULL REFERENCES meeting_rooms(room_id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES meeting_room_facilities(facility_id) ON DELETE CASCADE,
    UNIQUE(room_id, facility_id)
);

CREATE TABLE meeting_room_bookings (
    booking_id UUID PRIMARY KEY DEFAULT uuidv7(),
    room_id UUID NOT NULL REFERENCES meeting_rooms(room_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    booked_by TEXT,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_meeting_rooms_floor ON meeting_rooms(floor_id);
CREATE INDEX idx_meeting_rooms_status ON meeting_rooms(status);
CREATE INDEX idx_meeting_room_facility_assignments_room ON meeting_room_facility_assignments(room_id);
CREATE INDEX idx_meeting_room_facility_assignments_facility ON meeting_room_facility_assignments(facility_id);
CREATE INDEX idx_meeting_room_bookings_room ON meeting_room_bookings(room_id);
CREATE INDEX idx_meeting_room_bookings_time ON meeting_room_bookings(start_time, end_time);
CREATE INDEX idx_meeting_room_bookings_status ON meeting_room_bookings(status);

-- Function to update meeting room status based on bookings
CREATE OR REPLACE FUNCTION update_room_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update room status based on active bookings
    UPDATE meeting_rooms
    SET status = CASE
        WHEN status = 'maintenance' THEN 'maintenance'
        WHEN EXISTS (
            SELECT 1 FROM meeting_room_bookings
            WHERE room_id = NEW.room_id
            AND status = 'confirmed'
            AND start_time <= now()
            AND end_time > now()
        ) THEN 'booked'
        ELSE 'available'
    END
    WHERE room_id = NEW.room_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_room_status_on_booking
AFTER INSERT OR UPDATE ON meeting_room_bookings
FOR EACH ROW
EXECUTE FUNCTION update_room_status();
