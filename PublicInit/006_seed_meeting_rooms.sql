-- Seed Meeting Room Facilities
INSERT INTO meeting_room_facilities (facility_id, name)
VALUES 
    ('019d7bdf-c346-7942-a9da-21909f9c748f'::uuid, 'Projector'),
    ('019d7bdf-c346-7942-a9da-21909f9c7490'::uuid, 'Whiteboard'),
    ('019d7bdf-c346-7942-a9da-21909f9c7491'::uuid, 'Video Conference'),
    ('019d7bdf-c346-7942-a9da-21909f9c7492'::uuid, 'AC'),
    ('019d7bdf-c346-7942-a9da-21909f9c7493'::uuid, 'Sound System'),
    ('019d7bdf-c346-7942-a9da-21909f9c7494'::uuid, 'Phone'),
    ('019d7bdf-c346-7942-a9da-21909f9c7495'::uuid, 'Tables'),
    ('019d7bdf-c346-7942-a9da-21909f9c7496'::uuid, 'Chairs')
ON CONFLICT DO NOTHING;

-- Seed Meeting Rooms
INSERT INTO meeting_rooms (room_id, floor_id, room_code, name, capacity, status)
VALUES 
    ('019d7bdf-c346-7942-a9da-21909f9c7500'::uuid, '019d6e02-0c66-73e7-9317-0cce79e88eb7'::uuid, 'CR-A1', 'Conference Room A', 12, 'available'),
    ('019d7bdf-c346-7942-a9da-21909f9c7501'::uuid, '019d6e02-0c66-73e7-9317-0cce79e88eb7'::uuid, 'CR-B1', 'Conference Room B', 8, 'booked'),
    ('019d7bdf-c346-7942-a9da-21909f9c7502'::uuid, '019d6e02-0c66-73e7-9317-0cce79e88eb7'::uuid, 'CR-C1', 'Executive Board Room', 20, 'available'),
    ('019d7bdf-c346-7942-a9da-21909f9c7503'::uuid, '019d6e02-0c66-73e7-9317-0cce79e88eb7'::uuid, 'WS-D1', 'Workshop Room D', 15, 'maintenance'),
    ('019d7bdf-c346-7942-a9da-21909f9c7504'::uuid, '019d6e02-0c66-73e7-9317-0cce79e88eb7'::uuid, 'CR-E1', 'Brainstorm Room', 6, 'booked'),
    ('019d7bdf-c346-7942-a9da-21909f9c7505'::uuid, '019d6e02-0c66-73e7-9317-0cce79e88eb7'::uuid, 'CR-F1', 'Focus Room F', 4, 'available')
ON CONFLICT (floor_id, room_code) DO NOTHING;

-- Assign Facilities to Meeting Rooms
-- Conference Room A: Projector, Whiteboard, AC
INSERT INTO meeting_room_facility_assignments (id, room_id, facility_id)
VALUES 
    ('019d7cdf-c346-7942-a9da-21909f9c7600'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7500'::uuid, '019d7bdf-c346-7942-a9da-21909f9c748f'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7601'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7500'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7490'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7602'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7500'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7492'::uuid)
ON CONFLICT DO NOTHING;

-- Conference Room B: Projector, Video Conference, AC
INSERT INTO meeting_room_facility_assignments (id, room_id, facility_id)
VALUES 
    ('019d7cdf-c346-7942-a9da-21909f9c7603'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7501'::uuid, '019d7bdf-c346-7942-a9da-21909f9c748f'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7604'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7501'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7491'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7605'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7501'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7492'::uuid)
ON CONFLICT DO NOTHING;

-- Executive Board Room: Projector, Video Conference, Whiteboard, AC, Sound System
INSERT INTO meeting_room_facility_assignments (id, room_id, facility_id)
VALUES 
    ('019d7cdf-c346-7942-a9da-21909f9c7606'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7502'::uuid, '019d7bdf-c346-7942-a9da-21909f9c748f'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7607'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7502'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7491'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7608'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7502'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7490'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7609'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7502'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7492'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c760a'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7502'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7493'::uuid)
ON CONFLICT DO NOTHING;

-- Workshop Room D: Whiteboard, Tables, Chairs
INSERT INTO meeting_room_facility_assignments (id, room_id, facility_id)
VALUES 
    ('019d7cdf-c346-7942-a9da-21909f9c760b'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7503'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7490'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c760c'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7503'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7495'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c760d'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7503'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7496'::uuid)
ON CONFLICT DO NOTHING;

-- Brainstorm Room: Whiteboard, AC, Projector
INSERT INTO meeting_room_facility_assignments (id, room_id, facility_id)
VALUES 
    ('019d7cdf-c346-7942-a9da-21909f9c760e'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7504'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7490'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c760f'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7504'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7492'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7610'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7504'::uuid, '019d7bdf-c346-7942-a9da-21909f9c748f'::uuid)
ON CONFLICT DO NOTHING;

-- Focus Room F: AC, Whiteboard, Phone
INSERT INTO meeting_room_facility_assignments (id, room_id, facility_id)
VALUES 
    ('019d7cdf-c346-7942-a9da-21909f9c7611'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7505'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7492'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7612'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7505'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7490'::uuid),
    ('019d7cdf-c346-7942-a9da-21909f9c7613'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7505'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7494'::uuid)
ON CONFLICT DO NOTHING;

-- Seed some bookings
INSERT INTO meeting_room_bookings (booking_id, room_id, title, description, start_time, end_time, booked_by, status)
VALUES 
    ('019d7ddf-c346-7942-a9da-21909f9c7700'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7501'::uuid, 'Team Standup', 'Daily team standup meeting', now() + interval '1 hour', now() + interval '2 hours', 'john@company.com', 'confirmed'),
    ('019d7ddf-c346-7942-a9da-21909f9c7701'::uuid, '019d7bdf-c346-7942-a9da-21909f9c7504'::uuid, 'Design Review', 'Weekly design review session', now() + interval '4 hours', now() + interval '5.5 hours', 'jane@company.com', 'confirmed')
ON CONFLICT DO NOTHING;
