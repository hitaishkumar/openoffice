// app/api/floor-plan/route.ts
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const globalForPg = global as unknown as { pool: Pool };
const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: process.env.POSTGRES_URL,
    connectionTimeoutMillis: 5000,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id: floorId } = body;

    if (!floorId) {
      return Response.json({ error: "floorId is required" }, { status: 400 });
    }

    /**
     * PG 18 Optimized Query:
     * We return an OBJECT with 'matrix' and 'max_cols'.
     * This prevents the frontend from crashing on null/undefined.
     */
    const result = await pool.query(
      `
      WITH matrix_data AS (
        SELECT 
          row_num, 
          jsonb_agg(cell_type ORDER BY col_num) as row_cells
        FROM floor_cells
        WHERE floor_id = $1
        GROUP BY row_num
      )
      SELECT 
        COALESCE(jsonb_agg(row_cells ORDER BY row_num), '[]'::jsonb) as matrix,
        COALESCE(MAX(jsonb_array_length(row_cells)), 0) as max_cols
      FROM matrix_data;
      `,
      [floorId],
    );

    // Ensure we always return an object even if rows is empty
    const responseData = result.rows[0] || { matrix: [], max_cols: 0 };

    // console.log("Data From Query" , result.rows[0])

    return Response.json(responseData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Database Error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
