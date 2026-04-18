import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { pool } from "../../route";

type PantryCategory = {
  id: string;
  name: string;
};

export async function GET() {
  try {
    const query = `SELECT category_id, name FROM pantry_categories ORDER BY name ASC;`;
    const result = await pool.query(query);

    const data: PantryCategory[] = result.rows.map((row) => ({
      id: row.category_id,
      name: row.name,
    }));

    const response: ApiResponse<PantryCategory[]> = {
      success: true,
      data,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch categories",
        data: null,
      },
      { status: 500 },
    );
  }
}
