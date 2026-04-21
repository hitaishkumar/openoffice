CREATE TABLE pantries (
    pantry_id UUID PRIMARY KEY DEFAULT uuidv7 (),
    floor_cell_id TEXT UNIQUE REFERENCES floor_cells (floor_cell_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pantry_categories (
    category_id UUID PRIMARY KEY DEFAULT uuidv7 (),
    name TEXT UNIQUE NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pantry_items (
    item_id UUID PRIMARY KEY DEFAULT uuidv7 (),
    name TEXT NOT NULL,
    category_id UUID REFERENCES pantry_categories (category_id),
    unit TEXT NOT NULL,
    price_per_unit NUMERIC NOT NULL DEFAULT 0,
    is_perishable BOOLEAN DEFAULT false,
    shelf_life_days INT,
    default_min_threshold NUMERIC,
    default_max_capacity NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (name, category_id)
);

CREATE TABLE pantry_stock (
    pantry_id UUID REFERENCES pantries (pantry_id) ON DELETE CASCADE,
    item_id UUID REFERENCES pantry_items (item_id) ON DELETE CASCADE,
    current_quantity NUMERIC NOT NULL DEFAULT 0,
    max_capacity NUMERIC,
    min_threshold NUMERIC,
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (pantry_id, item_id)
);

CREATE TABLE pantry_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuidv7 (),
    pantry_id UUID NOT NULL REFERENCES pantries (pantry_id),
    item_id UUID NOT NULL REFERENCES pantry_items (item_id),
    quantity NUMERIC NOT NULL, -- +ve restock, -ve consume
    unit TEXT NOT NULL,
    transaction_type TEXT CHECK (
        transaction_type IN (
            'RESTOCK',
            'CONSUME',
            'ADJUST'
        )
    ) NOT NULL,
    performed_by UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    CHECK (
        (
            transaction_type = 'RESTOCK'
            AND quantity > 0
        )
        OR (
            transaction_type = 'CONSUME'
            AND quantity < 0
        )
        OR (transaction_type = 'ADJUST')
    )
);

CREATE TABLE pantry_suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT uuidv7 (),
    name TEXT UNIQUE NOT NULL,
    contact TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pantry_purchases (
    purchase_id UUID PRIMARY KEY DEFAULT uuidv7 (),
    pantry_id UUID REFERENCES pantries (pantry_id),
    supplier_id UUID REFERENCES pantry_suppliers (supplier_id),
    total_cost NUMERIC NOT NULL CHECK (total_cost >= 0),
    purchased_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pantry_purchase_items (
    id UUID PRIMARY KEY DEFAULT uuidv7 (),
    purchase_id UUID REFERENCES pantry_purchases (purchase_id) ON DELETE CASCADE,
    item_id UUID REFERENCES pantry_items (item_id),
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    cost_per_unit NUMERIC NOT NULL CHECK (cost_per_unit >= 0)
);

-- 1. Fix the negative stock prevention logic
CREATE OR REPLACE FUNCTION prevent_negative_stock()
RETURNS TRIGGER AS $$
DECLARE
    current_qty NUMERIC;
BEGIN
    -- Use COALESCE to handle items that don't have a stock row yet
    SELECT COALESCE(current_quantity, 0) INTO current_qty
    FROM pantry_stock
    WHERE pantry_id = NEW.pantry_id
      AND item_id = NEW.item_id;

    -- Block the transaction if it would result in negative stock
    IF (current_qty + NEW.quantity) < 0 THEN
        RAISE EXCEPTION 'Insufficient stock for item %: Current (%) + Requested (%)', 
            NEW.item_id, current_qty, NEW.quantity;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Ensure stock updates handle the initial insert correctly
CREATE OR REPLACE FUNCTION update_stock()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pantry_stock (pantry_id, item_id, current_quantity, updated_at)
  VALUES (NEW.pantry_id, NEW.item_id, NEW.quantity, now())
  ON CONFLICT (pantry_id, item_id)
  DO UPDATE SET
    current_quantity = pantry_stock.current_quantity + NEW.quantity,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_negative
BEFORE INSERT ON pantry_transactions
FOR EACH ROW
EXECUTE FUNCTION prevent_negative_stock();

CREATE TRIGGER trg_update_stock
AFTER INSERT ON pantry_transactions
FOR EACH ROW
EXECUTE FUNCTION update_stock();

CREATE INDEX idx_transactions_pantry_item ON pantry_transactions (pantry_id, item_id);

CREATE INDEX idx_transactions_created_at ON pantry_transactions (created_at);

CREATE INDEX idx_stock_low ON pantry_stock (pantry_id, current_quantity);