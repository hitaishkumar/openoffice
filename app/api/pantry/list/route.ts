import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { pool } from "../../route";

type Pantry = {
  pantry_id: string;
  floor_cell_id: string;
  name: string;
  created_at: string;
};

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT pantry_id, floor_cell_id, name, created_at
       FROM pantries
       ORDER BY created_at DESC`,
    );

    const data: Pantry[] = result.rows;

    return NextResponse.json<ApiResponse<Pantry[]>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET PANTRIES ERROR:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch pantries",
        data: null,
      },
      { status: 500 },
    );
  }
}
