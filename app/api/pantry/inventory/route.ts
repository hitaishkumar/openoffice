import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { pool } from "../../route";

// 1. Define the UI interface as the data model
export interface InventoryItem {
  // Existing fields
  item_id: string;
  name: string;
  category: string;
  unit: string;
  current_quantity: number;
  max_capacity: number;
  min_threshold: number;
  status: "out" | "low" | "ok";
  percent: number;

  // All other columns from pantry_items
  is_perishable: boolean;
  shelf_life_days: number;
  default_min_threshold: number;
  default_max_capacity: number;
  created_at: string;
  updated_at: string;
}
export async function GET() {
  try {
    const query = `
      SELECT 
        i.*, -- This selects all columns from pantry_items
        c.name as category_name,
        s.current_quantity,
        s.max_capacity,
        s.min_threshold,
        CASE 
          WHEN s.current_quantity = 0 THEN 'out'
          WHEN s.current_quantity <= s.min_threshold THEN 'low'
          ELSE 'ok'
        END as status,
        ROUND((s.current_quantity / NULLIF(s.max_capacity, 0)) * 100) as percent
      FROM pantry_items i
      JOIN pantry_stock s ON i.item_id = s.item_id
      JOIN pantry_categories c ON i.category_id = c.category_id;
    `;

    const result = await pool.query(query);

    // Map all fields, including the new ones
    const data: InventoryItem[] = result.rows.map((row) => ({
      ...row, // Spread all properties from the database row
      category: row.category_name,
      current_quantity: Number(row.current_quantity) || 0,
      max_capacity: Number(row.max_capacity) || 0,
      min_threshold: Number(row.min_threshold) || 0,
      percent: Number(row.percent) || 0,
      status: row.status as "out" | "low" | "ok",
    }));

    const response: ApiResponse<InventoryItem[]> = {
      success: true,
      data: data,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
      { status: 500 },
    );
  }
}
