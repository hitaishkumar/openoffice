// app/api/floor-plan/route.ts

export async function GET(req: Request) {
  // 1. Ensure the request actually contains JSON

  return Response.json("Healthy form page");
}
