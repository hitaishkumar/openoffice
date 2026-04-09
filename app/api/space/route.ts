// app/api/floor-plan/route.ts

import { pool } from "../route";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id: floorId } = body;

    if (!floorId) {
      return Response.json({ error: "floorId is required" }, { status: 400 });
    }

    const result = await pool.query(
      `
      SELECT 
        cell_type,
        COUNT(*) as count
      FROM floor_cells
      WHERE floor_id = $1
        AND cell_type IS NOT NULL
      GROUP BY cell_type
      ORDER BY cell_type;
      `,
      [floorId],
    );

    return Response.json({
      data: result.rows,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Database Error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
