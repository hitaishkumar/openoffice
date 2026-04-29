CREATE TABLE bookings (
    -- Internal unique identifier for each booking
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User details
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    
    -- Booking details
    booking_date DATE NOT NULL,
    
    -- Seat details (mapping to your floorData)
    seat_id UUID NOT NULL, -- floor_cell_id
    row_num INTEGER NOT NULL,
    col_num INTEGER NOT NULL,
    cell_type VARCHAR(50) NOT NULL, -- WORKSTATION_HAT, WORKSTATION_STD, etc.
    
    -- Metadata
    status VARCHAR(20) DEFAULT 'confirmed', -- For future 'cancelled' or 'checked-in' logic
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- CRITICAL: Prevent the same seat from being booked more than once on the same date
    CONSTRAINT unique_seat_booking_per_day UNIQUE (seat_id, booking_date)
);

-- Indexing for fast lookups by date (common for floor plan rendering)
CREATE INDEX idx_booking_date ON bookings(booking_date);

-- Indexing for user email to quickly find "My Bookings"
CREATE INDEX idx_user_email ON bookings(user_email);