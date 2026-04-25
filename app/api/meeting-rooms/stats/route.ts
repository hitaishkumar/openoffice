import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";

type RoomStats = {
  total: number;
  available: number;
  booked: number;
  maintenance: number;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const floorId = searchParams.get("floor_id");

    const where: any = floorId ? { floor_id: floorId } : {};

    // Single query to group by status and get counts
    const counts = await prisma.meeting_rooms.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    });

    // Initialize stats object
    const stats: RoomStats = {
      total: 0,
      available: 0,
      booked: 0,
      maintenance: 0,
    };

    // Populate counts from the group by result
    counts.forEach((group) => {
      const count = group._count.status;
      if (group.status === 'available') stats.available = count;
      if (group.status === 'booked') stats.booked = count;
      if (group.status === 'maintenance') stats.maintenance = count;
    });

    // Calculate total from the mapped values
    stats.total = stats.available + stats.booked + stats.maintenance;

    return NextResponse.json<ApiResponse<RoomStats>>(
      {
        success: true,
        data: stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET STATS ERROR:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch room statistics",
        data: null,
      },
      { status: 500 }
    );
  }
}