import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { z } from "zod";

const createBookingSchema = z.object({
  room_id: z.string().uuid({ message: "Invalid room ID" }),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  booked_by: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("room_id");
    const status = searchParams.get("status") || "confirmed";

    const where: any = {
      status,
    };

    if (roomId) {
      where.room_id = roomId;
    }

    const bookings = await prisma.meeting_room_bookings.findMany({
      where,
      include: {
        meeting_rooms: true, 
      },
      orderBy: {
        start_time: "asc",
      },
    });

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: bookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch bookings",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = createBookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { room_id, title, description, start_time, end_time, booked_by } =
      validation.data;

    const conflicts = await prisma.meeting_room_bookings.findMany({
      where: {
        room_id,
        status: "confirmed",
        OR: [
          {
            start_time: {
              lt: end_time,
            },
            end_time: {
              gt: start_time,
            },
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Room is not available during the requested time",
        },
        { status: 409 }
      );
    }

    const booking = await prisma.meeting_room_bookings.create({
      data: {
        room_id,
        title,
        description,
        start_time,
        end_time,
        booked_by,
        status: "confirmed",
      },
      include: {
        meeting_rooms: true, 
      },
    });

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to create booking",
        data: null,
      },
      { status: 500 }
    );
  }
}