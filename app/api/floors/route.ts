import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const floors = await prisma.floors.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: floors },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET FLOORS ERROR:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch floors", data: null },
      { status: 500 }
    );
  }
}
