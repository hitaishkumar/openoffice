import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const facilities = await prisma.meeting_room_facilities.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: facilities },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET FACILITIES ERROR:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch facilities", data: null },
      { status: 500 }
    );
  }
}
