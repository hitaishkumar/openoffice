import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { pool } from "../../route";

export async function GET() {
  try {
    const query = `SELECT category_id, name FROM pantry_categories ORDER BY name ASC;`;
    const result = await pool.query(query);

    // Format as simple objects
    const data = result.rows.map((row) => ({
      id: row.category_id,
      name: row.name,
    }));

    const response: ApiResponse<typeof data> = {
      success: true,
      data: data,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
