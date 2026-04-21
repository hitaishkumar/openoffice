import { pool } from "@/app/api/route";
import { ApiResponse } from "@/app/types/api";
import { NextRequest, NextResponse } from "next/server";
import { Supplier } from "../../list/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supplier_name } = body;

    if (!supplier_name) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "supplier_name is required",
          data: null,
        },
        { status: 400 },
      );
    }

    const result = await pool.query(
      `
      SELECT *
      FROM suppliers
      WHERE LOWER(supplier_name) = LOWER($1)
      `,
      [supplier_name],
    );

    if (result.rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Supplier not found",
          data: null,
        },
        { status: 404 },
      );
    }

    const data: Supplier = result.rows[0];

    return NextResponse.json<ApiResponse<Supplier>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET SUPPLIER BY NAME ERROR:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch supplier",
        data: null,
      },
      { status: 500 },
    );
  }
}
