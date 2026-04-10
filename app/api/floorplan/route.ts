// app/api/floor-plan/route.ts

import { pool } from "../route";

export type FloorCellNode = {
  row_num: number;
  col_num: number;
  floor_cell_id: string;
  cell_type: string;
  capacity: number;
  is_bookable: boolean;
  metadata: Record<string, any>;
};

export type FloorPlanResponse = {
  matrix: FloorCellNode[][];
  max_cols: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id: floorId } = body;

    if (!floorId) {
      return Response.json({ error: "floorId is required" }, { status: 400 });
    }

    const result = await pool.query<FloorPlanResponse>(
      `
  WITH bounds AS (
    SELECT 
      MIN(row_num) as min_row,
      MAX(row_num) as max_row,
      MIN(col_num) as min_col,
      MAX(col_num) as max_col
    FROM floor_cells
    WHERE floor_id = $1
  ),

  grid AS (
    SELECT 
      r AS row_num,
      c AS col_num
    FROM bounds,
    generate_series(min_row, max_row) r,
    generate_series(min_col, max_col) c
  ),

  cells AS (
    SELECT 
      g.row_num,
      g.col_num,
      fc.floor_cell_id,
      fc.cell_type,
      fc.capacity,
      fc.is_bookable,
      fc.metadata
    FROM grid g
    LEFT JOIN floor_cells fc
      ON fc.floor_id = $1
     AND fc.row_num = g.row_num
     AND fc.col_num = g.col_num
  ),

  matrix_data AS (
    SELECT 
      row_num,
      jsonb_agg(
        jsonb_build_object(
          'row_num', row_num,
          'col_num', col_num,
          'floor_cell_id', floor_cell_id,
          'cell_type', cell_type,
          'capacity', capacity,
          'is_bookable', is_bookable,
          'metadata', metadata
        )
        ORDER BY col_num
      ) AS row_cells
    FROM cells
    GROUP BY row_num
  )

  SELECT 
    COALESCE(jsonb_agg(row_cells ORDER BY row_num), '[]'::jsonb) AS matrix,
    COALESCE(MAX(jsonb_array_length(row_cells)), 0) AS max_cols
  FROM matrix_data;
  `,
      [floorId],
    );

    const responseData: FloorPlanResponse = result.rows[0] || {
      matrix: [],
      max_cols: 0,
    };

    return Response.json(responseData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Database Error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
