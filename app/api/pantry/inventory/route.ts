import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { pool } from "../../route";

export interface InventoryItem {
  item_id: string;
  item_name: string;
  category_id: string;
  unit: string;
  price_per_unit: number;
  is_perishable: boolean;
  shelf_life_days: number | null;
  created_at: string;
  updated_at: string;

  category_name: string;

  pantry_id: string;
  pantry_name: string;

  current_quantity: number;
  max_capacity: number | null;
  min_threshold: number | null;

  status: "out" | "low" | "ok" | "over";
  percent: number;
}

export async function GET() {
  try {
    const query = `
      SELECT 
        i.item_id,
        i.name,
        i.category_id,
        i.unit,
        i.price_per_unit,
        i.is_perishable,
        i.shelf_life_days,
        i.created_at,
        i.updated_at,

        c.name AS category_name,

        s.pantry_id,
        p.name AS pantry_name,

        s.current_quantity,
        s.max_capacity,
        s.min_threshold,

        CASE 
          WHEN s.current_quantity = 0 THEN 'out'
          WHEN s.current_quantity <= s.min_threshold THEN 'low'
          WHEN s.current_quantity >= s.max_capacity THEN 'over'
          ELSE 'ok'
        END AS status,

        ROUND((s.current_quantity / NULLIF(s.max_capacity, 0)) * 100) AS percent

      FROM pantry_items i
      JOIN pantry_stock s ON i.item_id = s.item_id
      JOIN pantry_categories c ON i.category_id = c.category_id
      JOIN pantries p ON s.pantry_id = p.pantry_id

      ORDER BY i.created_at DESC;
    `;

    const result = await pool.query(query);

    const data: InventoryItem[] = result.rows.map((row) => ({
      item_id: row.item_id,
      item_name: row.name,
      category_id: row.category_id,
      category_name: row.category_name,
      pantry_id: row.pantry_id,
      pantry_name: row.pantry_name,
      current_quantity: Number(row.current_quantity) || 0,
      unit: row.unit,
      price_per_unit: Number(row.price_per_unit) || 0,
      is_perishable: row.is_perishable,
      shelf_life_days: row.shelf_life_days,
      max_capacity: row.max_capacity,
      min_threshold: row.min_threshold,
      created_at: row.created_at,
      updated_at: row.updated_at,

      status: row.status,
      percent: Number(row.percent) || 0,
    }));

    return NextResponse.json<ApiResponse<InventoryItem[]>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("FETCH INVENTORY ERROR:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch inventory",
        data: null,
      },
      { status: 500 },
    );
  }
}
