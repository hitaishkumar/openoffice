// app/api/floor-plan/route.ts
import { Pool } from "pg";

export const dynamic = "force-dynamic";

export const globalForPg = global as unknown as { pool: Pool };
export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: process.env.POSTGRES_URL,
    connectionTimeoutMillis: 5000,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool;
export async function GET(req: Request) {
  // 1. Ensure the request actually contains JSON

  return Response.json("Healthy");
}
