CREATE TABLE suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT uuidv7(),

-- Basic Info
supplier_name TEXT NOT NULL,
display_name TEXT,
supplier_code TEXT UNIQUE,

-- Contact Info
contact_person_name TEXT,
contact_email TEXT,
contact_phone TEXT,
contact_alternate_phone TEXT,

-- Address Info
address_line1 TEXT,
address_line2 TEXT,
city TEXT,
state TEXT,
country TEXT DEFAULT 'India',
postal_code TEXT,

-- Business Info
gst_number TEXT,
pan_number TEXT,
business_type TEXT, -- e.g. distributor, manufacturer
registration_number TEXT,

-- Operational Config
is_active BOOLEAN DEFAULT TRUE,
is_preferred BOOLEAN DEFAULT FALSE,
lead_time_days INT, -- avg delivery time

-- Communication Config
supplier_notes TEXT,

-- Performance / Meta
tags TEXT[], -- flexible UI filters (e.g. ["fast-delivery", "priority"])

-- Payments
bank_name TEXT, account_number TEXT, ifsc TEXT, upi_id TEXT,

-- Audit Fields
created_at TIMESTAMPTZ DEFAULT now(),
    created_by TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by TEXT
);

-- Predefined UUIDv7 list


WITH supplier_ids AS (
    SELECT supplier_id, idx
    FROM unnest(ARRAY[
        '019da055-ce25-7588-b036-a62ec8bcc9bf'::uuid,
        '019da055-ce25-7fc8-a8f4-9fce3f23e804'::uuid,
        '019da055-ce25-72de-96fb-dbd75683827b'::uuid,
        '019da055-ce25-7e08-9e0e-f4b60f94b8a6'::uuid,
        '019da055-ce25-7bee-9c4d-8b2d3c35eb04'::uuid,
        '019da055-ce25-72a4-bbc5-f08300cd7640'::uuid,
        '019da055-ce25-7f68-b53d-b3e54025dd5e'::uuid,
        '019da055-ce25-70f7-97b4-3db0c0207ad0'::uuid,
        '019da055-ce25-78e5-92ca-5eb46c56d549'::uuid,
        '019da055-ce25-7d5f-b205-810d5735c073'::uuid,
        '019da055-ce25-7e86-bd92-2aa49366cfe5'::uuid,
        '019da055-ce25-70ad-b717-63db957e2f8f'::uuid,
        '019da055-ce25-78b0-9062-9c24d2286b1b'::uuid,
        '019da055-ce25-77b3-874d-347ae7cdc072'::uuid,
        '019da055-ce25-7b7e-a10e-e64d9d23b999'::uuid,
        '019da055-ce25-7c6d-8427-1a1a811ef216'::uuid,
        '019da055-ce25-72f0-89d6-b9adf6e32055'::uuid,
        '019da055-ce25-7ec4-9824-331d346fa384'::uuid,
        '019da055-ce25-718c-af10-e7b0b92fc6e4'::uuid,
        '019da055-ce25-713b-9e16-a3e48dcd6645'::uuid
    ]) WITH ORDINALITY AS t(supplier_id, idx)
),

names AS (
    SELECT name, idx
    FROM unnest(ARRAY[
        'Alpha Traders','Beta Supplies','Gamma Distributors','Delta Wholesale','Epsilon Retail',
        'Zeta Enterprises','Eta Logistics','Theta Traders','Iota Suppliers','Kappa Goods',
        'Lambda Mart','Mu Distributors','Nu Supplies','Xi Enterprises','Omicron Traders',
        'Pi Wholesale','Rho Suppliers','Sigma Retail','Tau Traders','Omega Distributors'
    ]) WITH ORDINALITY AS t(name, idx)
),

cities AS (
    SELECT city, idx
    FROM unnest(ARRAY[
        'Mumbai','Delhi','Bangalore','Hyderabad','Chennai',
        'Pune','Kolkata','Ahmedabad','Jaipur','Surat',
        'Lucknow','Indore','Nagpur','Bhopal','Patna',
        'Chandigarh','Coimbatore','Kochi','Visakhapatnam','Noida'
    ]) WITH ORDINALITY AS t(city, idx)
)


INSERT INTO suppliers (
    supplier_id,
    supplier_name,
    display_name,
    supplier_code,
    contact_person_name,
    contact_email,
    contact_phone,
    contact_alternate_phone,
    address_line1,
    city,
    state,
    postal_code,
    gst_number,
    pan_number,
    business_type,
    registration_number,
    is_active,
    is_preferred,
    lead_time_days,
    supplier_notes,
    tags,
    bank_name,
    account_number,
    ifsc,
    upi_id,
    created_by,
    updated_by
)
SELECT
    s.supplier_id,
    n.name,
    n.name || ' Pvt Ltd',
    'SUP-' || lpad(s.idx::text, 4, '0'),

    'Contact ' || s.idx,
    'supplier' || s.idx || '@example.com',
    '9' || (100000000 + s.idx)::text,
    '8' || (100000000 + s.idx)::text,

    'Street ' || s.idx,
    c.city,
    'State ' || s.idx,
    lpad((400000 + s.idx)::text, 6, '0'),

    'GSTIN' || s.idx,
    'PAN' || s.idx,
    CASE WHEN s.idx % 2 = 0 THEN 'Distributor' ELSE 'Manufacturer' END,
    'REG' || s.idx,

    TRUE,
    (s.idx % 3 = 0),

    (random() * 10 + 1)::int,

    'Test supplier ' || s.idx,
    ARRAY['fast-delivery','priority'],

    'HDFC Bank',
    '00012345678' || s.idx,
    'HDFC000' || lpad(s.idx::text, 4, '0'),
    'supplier' || s.idx || '@upi',

    'seed_script',
    'seed_script'

FROM supplier_ids s
JOIN names n ON s.idx = n.idx
JOIN cities c ON s.idx = c.idx;