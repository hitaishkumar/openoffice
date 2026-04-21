import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "../../route";

export const pantryItemSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    unit: z.string().min(1, "Unit is required"),

    category_id: z
      .string()
      .uuid({ message: "Invalid category ID", version: "v7" }),
    pantry_id: z
      .string()
      .uuid({ message: "Invalid category ID", version: "v7" }),

    is_perishable: z.boolean().default(false),

    shelf_life_days: z.number().int().positive().optional(),

    default_min_threshold: z.number().nonnegative(),
    default_max_capacity: z.number().positive(),

    initial_stock: z.number().nonnegative().default(0),
  })
  .superRefine((data, ctx) => {
    if (data.is_perishable && !data.shelf_life_days) {
      ctx.addIssue({
        code: "custom",
        path: ["shelf_life_days"],
        message: "Shelf life is required for perishable items",
      });
    }
  });

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
          details: validation.error,
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
      pantry_id,
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
      `INSERT INTO pantry_stock (item_id, current_quantity, max_capacity, min_threshold,pantry_id) VALUES ($1, $2, $3, $4,$5)`,
      [
        itemId,
        initial_stock,
        default_max_capacity,
        default_min_threshold,
        pantry_id,
      ],
    );

    await pool.query("COMMIT");

    const success_response: ApiResponse<{ item_id: string }> = {
      success: true,
      data: { item_id: itemId },
    };
    return NextResponse.json(success_response);
  } catch (error) {
    await pool.query("ROLLBACK");
    const error_response: ApiResponse<{ item_id: string }> = {
      success: false,
      error: JSON.stringify(error),
      message: "failed to add item ",
    };
    return NextResponse.json(error_response);
  }
}
