-- Insert Pantry
INSERT INTO pantries (pantry_id, floor_cell_id, name)
VALUES (
    '019d7adf-c346-7942-a9da-21909f9c748f'::uuid,
    '019d6e02-0c66-73e7-9317-0cce79e88eb7_0_0',
    'Pantry Seed'
);

-- Insert Categories
INSERT INTO pantry_categories (category_id, name, created_by)
VALUES 
    ('019d7adf-c346-7942-a9da-21909f9c748f'::uuid, 'Beverages', 'admin'),
    ('019d7adf-c346-79e2-8ccf-00b32af0ebef'::uuid, 'Snacks', 'admin'),
    ('019d7adf-c346-7412-9eeb-781f5293398c'::uuid, 'Dairy', 'admin'),
    ('019d7adf-c346-7f14-8377-d3eb089f0445'::uuid, 'Dry Goods', 'admin'),
    ('019d7adf-c346-7b7d-8ad3-5e568cf81992'::uuid, 'Hygiene', 'admin'),
    ('019d7adf-c346-74b4-a7a1-c70979fcd8c5'::uuid, 'Equipment', 'admin');

-- Insert Pantry Items with price_per_unit
INSERT INTO
    pantry_items (
        unit,
        name,
        category_id,
        price_per_unit,
        is_perishable,
        shelf_life_days,
        default_min_threshold,
        default_max_capacity
    )
SELECT t.unit, t.name, c.category_id, t.price_per_unit, t.is_perishable, t.shelf_life_days, t.min_threshold, t.max_capacity
FROM (
        VALUES (
                'pack',
                'Instant Coffee',
                'Beverages',
                450.00,
                false,
                365,
                5,
                50
            ),
            (
                'pack',
                'Tea Bags (Tata)',
                'Beverages',
                180.50,
                false,
                365,
                10,
                100
            ),
            (
                'pack',
                'Green Tea Bags',
                'Beverages',
                220.00,
                false,
                365,
                5,
                50
            ),
            (
                'box',
                'Hot Chocolate Powder',
                'Beverages',
                320.00,
                false,
                180,
                2,
                20
            ),
            (
                'gm',
                'Sugar Cubes',
                'Beverages',
                45.50,
                false,
                365,
                2,
                20
            ),
            (
                'ml',
                'Milk (UHT 1L)',
                'Dairy',
                55.00,
                true,
                7,
                5,
                20
            ),
            (
                'pack',
                'Cheese Slices',
                'Dairy',
                280.00,
                true,
                10,
                2,
                15
            ),
            (
                'gm',
                'Butter (Salted)',
                'Dairy',
                520.00,
                true,
                30,
                2,
                10
            ),
            (
                'pack',
                'Yogurt Cups',
                'Dairy',
                25.50,
                true,
                14,
                4,
                20
            ),
            (
                'ml',
                'Cream (Cooking)',
                'Dairy',
                180.00,
                true,
                21,
                2,
                10
            ),
            (
                'gm',
                'Cornflakes',
                'Dry Goods',
                280.00,
                false,
                180,
                2,
                10
            ),
            (
                'gm',
                'Oats (Rolled)',
                'Dry Goods',
                320.00,
                false,
                200,
                2,
                10
            ),
            (
                'gm',
                'Rice (Basmati)',
                'Dry Goods',
                75.00,
                false,
                365,
                5,
                25
            ),
            (
                'gm',
                'Pasta (Penne)',
                'Dry Goods',
                120.00,
                false,
                365,
                3,
                15
            ),
            (
                'gm',
                'Lentils (Moong Dal)',
                'Dry Goods',
                95.50,
                false,
                365,
                2,
                10
            ),
            (
                'gm',
                'Biscuits (Marie)',
                'Snacks',
                60.00,
                false,
                120,
                5,
                30
            ),
            (
                'pack',
                'Namkeen Mix',
                'Snacks',
                85.00,
                false,
                90,
                5,
                25
            ),
            (
                'pack',
                'Potato Chips',
                'Snacks',
                50.00,
                false,
                60,
                5,
                20
            ),
            (
                'gm',
                'Granola Bars',
                'Snacks',
                180.00,
                false,
                90,
                10,
                50
            ),
            (
                'gm',
                'Dry Fruits (Almonds)',
                'Snacks',
                650.00,
                false,
                180,
                1,
                5
            ),
            (
                'gm',
                'Tissue Boxes',
                'Hygiene',
                90.00,
                false,
                365,
                5,
                20
            ),
            (
                'gm',
                'Hand Sanitiser',
                'Hygiene',
                120.00,
                false,
                365,
                2,
                10
            ),
            (
                'gm',
                'Surface Disinfectant',
                'Hygiene',
                180.00,
                false,
                365,
                1,
                5
            ),
            (
                'gm',
                'Soap Bars',
                'Hygiene',
                45.00,
                false,
                730,
                5,
                20
            ),
            (
                'gm',
                'Paper Towels',
                'Hygiene',
                125.00,
                false,
                730,
                2,
                10
            ),
            (
                'gm',
                'Paper Cups',
                'Equipment',
                180.00,
                false,
                730,
                50,
                500
            ),
            (
                'gm',
                'Stirrers (Wooden)',
                'Equipment',
                50.00,
                false,
                730,
                100,
                1000
            ),
            (
                'gm',
                'Coffee Filter Papers',
                'Equipment',
                95.00,
                false,
                730,
                20,
                100
            ),
            (
                'gm',
                'Napkins',
                'Equipment',
                70.00,
                false,
                730,
                10,
                100
            ),
            (
                'gm',
                'Cleaning Sponges',
                'Equipment',
                85.00,
                false,
                365,
                2,
                10
            )
    ) AS t (
        unit,
        name,
        category_name,
        price_per_unit,
        is_perishable,
        shelf_life_days,
        min_threshold,
        max_capacity
    )
    JOIN pantry_categories c ON c.name = t.category_name ON CONFLICT (name, category_id) DO NOTHING;

-- Insert Initial Stock
INSERT INTO
    pantry_stock (
        pantry_id,
        item_id,
        current_quantity,
        max_capacity,
        min_threshold,
        updated_at
    )
SELECT (
        SELECT pantry_id
        FROM pantries
        LIMIT 1
    ),
    item_id,
    0,
    default_max_capacity,
    default_min_threshold,
    now()
FROM
    pantry_items ON CONFLICT (pantry_id, item_id) DO NOTHING;

-- Insert Initial Restock Transactions
INSERT INTO
    pantry_transactions (
        pantry_id,
        item_id,
        quantity,
        unit,
        transaction_type,
        notes
    )
SELECT p.pantry_id, i.item_id, 10, i.unit, 'RESTOCK', 'Initial seed transaction'
FROM pantries p
    CROSS JOIN pantry_items i
LIMIT 200;

-- Insert Mixed Consumption & Restock Transactions
INSERT INTO
    pantry_transactions (
        pantry_id,
        item_id,
        quantity,
        unit,
        transaction_type,
        notes
    )
SELECT
    p.pantry_id,
    i.item_id,
    CASE
        WHEN i.name LIKE '%Coffee%' THEN 20
        ELSE -2
    END,
    i.unit,
    CASE
        WHEN i.name LIKE '%Coffee%' THEN 'RESTOCK'
        ELSE 'CONSUME'
    END,
    'Auto-generated test data'
FROM pantries p
    CROSS JOIN pantry_items i
WHERE
    i.name IN (
        'Instant Coffee',
        'Sugar Cubes',
        'Milk (UHT 1L)'
    );

-- Insert Batch Transactions
INSERT INTO
    pantry_transactions (
        pantry_id,
        item_id,
        quantity,
        unit,
        transaction_type,
        notes
    )
SELECT
    p.pantry_id,
    i.item_id,
    CASE
        WHEN i.name IN (
            'Instant Coffee',
            'Sugar Cubes',
            'Tea Bags (Tata)'
        ) THEN 50
        WHEN i.name IN (
            'Milk (UHT 1L)',
            'Cheese Slices',
            'Cornflakes'
        ) THEN -2
        ELSE -1
    END as qty,
    i.unit,
    CASE
        WHEN i.name IN (
            'Instant Coffee',
            'Sugar Cubes',
            'Tea Bags (Tata)'
        ) THEN 'RESTOCK'
        ELSE 'CONSUME'
    END as trans_type,
    'Auto-generated batch: ' || CASE
        WHEN i.name IN (
            'Instant Coffee',
            'Sugar Cubes',
            'Tea Bags (Tata)'
        ) THEN 'Initial Supply'
        ELSE 'Daily Usage'
    END as notes
FROM pantries p
    CROSS JOIN pantry_items i
WHERE
    i.name IN (
        'Instant Coffee',
        'Sugar Cubes',
        'Tea Bags (Tata)',
        'Milk (UHT 1L)',
        'Cheese Slices',
        'Cornflakes',
        'Namkeen Mix',
        'Biscuits (Marie)',
        'Hand Sanitiser'
    )
ORDER BY trans_type DESC;

-- Insert Purchase Header
DO $$
DECLARE
    v_purchase_id UUID := uuidv7();
    v_pantry_id UUID;
    v_supplier_id UUID;
BEGIN
    -- Get IDs
    SELECT pantry_id INTO v_pantry_id FROM pantries LIMIT 1;
    SELECT supplier_id INTO v_supplier_id FROM pantry_suppliers LIMIT 1;

    -- Insert Purchase
    INSERT INTO pantry_purchases (purchase_id, pantry_id, supplier_id, total_cost, purchased_at)
    VALUES (v_purchase_id, v_pantry_id, v_supplier_id, 1500.00, now());

    -- Insert Purchase Items with realistic prices
    INSERT INTO pantry_purchase_items (purchase_id, item_id, quantity, cost_per_unit)
    SELECT 
        v_purchase_id,
        item_id,
        10,
        price_per_unit * 0.85  -- 15% wholesale discount
    FROM pantry_items
    WHERE name IN ('Instant Coffee', 'Sugar Cubes', 'Tea Bags (Tata)');
END $$;

-- Insert Second Purchase with Different Items
DO $$
DECLARE
    v_purchase_id UUID := uuidv7();
    v_pantry_id UUID;
    v_supplier_id UUID;
BEGIN
    SELECT pantry_id INTO v_pantry_id FROM pantries LIMIT 1;
    SELECT supplier_id INTO v_supplier_id FROM pantry_suppliers LIMIT 1;

    INSERT INTO pantry_purchases (purchase_id, pantry_id, supplier_id, total_cost, purchased_at)
    VALUES (v_purchase_id, v_pantry_id, v_supplier_id, 3000.00, now() - INTERVAL '1 day');

    INSERT INTO pantry_purchase_items (purchase_id, item_id, quantity, cost_per_unit)
    SELECT 
        v_purchase_id,
        item_id,
        5,
        price_per_unit * 0.80  -- 20% wholesale discount
    FROM pantry_items
    WHERE name IN ('Cornflakes', 'Oats (Rolled)', 'Rice (Basmati)');
END $$;

-- Insert Third Purchase
DO $$
DECLARE
    v_purchase_id UUID := uuidv7();
    v_pantry_id UUID;
    v_supplier_id UUID;
BEGIN
    SELECT pantry_id INTO v_pantry_id FROM pantries LIMIT 1;
    SELECT supplier_id INTO v_supplier_id FROM pantry_suppliers LIMIT 1;

    INSERT INTO pantry_purchases (purchase_id, pantry_id, supplier_id, total_cost, purchased_at)
    VALUES (v_purchase_id, v_pantry_id, v_supplier_id, 2500.00, now() - INTERVAL '2 days');

    INSERT INTO pantry_purchase_items (purchase_id, item_id, quantity, cost_per_unit)
    SELECT 
        v_purchase_id,
        item_id,
        8,
        price_per_unit * 0.90  -- 10% wholesale discount
    FROM pantry_items
    WHERE name IN ('Milk (UHT 1L)', 'Cheese Slices', 'Butter (Salted)', 'Yogurt Cups');
END $$;