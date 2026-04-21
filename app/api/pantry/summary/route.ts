import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { pool } from "../../route";

interface UsageSummaryData {
  total_items: number;
  total_categories: number;
  out_of_stock: number;
  low_stock: number;
  expiring_soon: number;
}

export async function GET() {
  try {
    const query = `
      SELECT 
        COUNT(i.item_id) as total_items,
        COUNT(DISTINCT i.category_id) as total_categories,
        COUNT(CASE WHEN s.current_quantity = 0 THEN 1 END) as out_of_stock,
        COUNT(CASE WHEN s.current_quantity > 0 AND s.current_quantity <= s.min_threshold THEN 1 END) as low_stock,
        COUNT(CASE WHEN i.is_perishable = true AND i.shelf_life_days <= 7 THEN 1 END) as expiring_soon
      FROM pantry_items i
      LEFT JOIN pantry_stock s ON i.item_id = s.item_id;
    `;

    const result = await pool.query(query);
    const row = result.rows[0];

    // Map the database row to your interface, converting strings to numbers
    const summaryData: UsageSummaryData = {
      total_items: Number(row.total_items) || 0,
      total_categories: Number(row.total_categories) || 0,
      out_of_stock: Number(row.out_of_stock) || 0,
      low_stock: Number(row.low_stock) || 0,
      expiring_soon: Number(row.expiring_soon) || 0,
    };

    const response: ApiResponse<UsageSummaryData> = {
      success: true,
      data: summaryData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Database error:", error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch inventory summary",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
