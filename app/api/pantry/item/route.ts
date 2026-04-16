import { z } from "zod";

export const pantryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.string().uuid("Invalid category ID"),
  unit: z.string().min(1, "Unit is required"),
  is_perishable: z.boolean().default(false),
  shelf_life_days: z.number().int().optional(),
  default_min_threshold: z.number().nonnegative(),
  default_max_capacity: z.number().positive(),
  // Optional: stock data if you want to initialize it during creation
  initial_stock: z.number().nonnegative().default(0),
});

import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { pool } from "../../route";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate payload with Zod
    const validation = pantryItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data",
          details: validation.error.format(),
        },
        { status: 400 },
      );
    }

    const {
      name,
      category_id,
      unit,
      is_perishable,
      shelf_life_days,
      default_min_threshold,
      default_max_capacity,
      initial_stock,
    } = validation.data;

    await pool.query("BEGIN");

    // 2. Insert Item
    const itemRes = await pool.query(
      `INSERT INTO pantry_items 
       (name, category_id, unit, is_perishable, shelf_life_days, default_min_threshold, default_max_capacity) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING item_id`,
      [
        name,
        category_id,
        unit,
        is_perishable,
        shelf_life_days,
        default_min_threshold,
        default_max_capacity,
      ],
    );

    const itemId = itemRes.rows[0].item_id;

    // 3. Initialize Stock
    await pool.query(
      `INSERT INTO pantry_stock (item_id, current_quantity, max_capacity, min_threshold) VALUES ($1, $2, $3, $4)`,
      [itemId, initial_stock, default_max_capacity, default_min_threshold],
    );

    await pool.query("COMMIT");

    const response: ApiResponse<{ item_id: string }> = {
      success: true,
      data: { item_id: itemId },
    };
    return NextResponse.json(response);
  } catch (error) {
    await pool.query("ROLLBACK");
    return NextResponse.json(
      { success: false, error: "Failed to create pantry item" },
      { status: 500 },
    );
  }
}
