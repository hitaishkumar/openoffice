import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { z } from "zod";

const createMeetingRoomSchema = z.object({
    floor_id: z.string().uuid({ message: "Invalid floor ID" }),
    room_code: z.string().min(1, "Room code is required"),
    name: z.string().min(1, "Name is required"),
    capacity: z.number().int().positive("Capacity must be positive"),
    status: z.enum(["available", "booked", "maintenance"]).default("available"),
    facility_ids: z.array(z.string().uuid()).optional().default([]),
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const floorId = searchParams.get("floor_id");
        const status = searchParams.get("status");

        const where: any = {};
        if (floorId) where.floor_id = floorId;
        if (status) where.status = status;

        const rooms = await prisma.meeting_rooms.findMany({
            where,
            include: {
                floors: true,
                meeting_room_facility_assignments: {
                    include: {
                        meeting_room_facilities: true,
                    },
                },
                meeting_room_bookings: {
                    where: {
                        status: "confirmed",
                        end_time: {
                            gt: new Date(),
                        },
                    },
                    orderBy: {
                        start_time: "asc",
                    },
                    take: 1,
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        const formatted = rooms.map((room) => ({
            id: room.room_id,
            name: room.name,
            floor_id: room.floor_id,
            floor: room.floors?.name || "Unknown Floor",
            capacity: room.capacity,
            status: room.status,
            facilities: room.meeting_room_facility_assignments.map(
                (f) => f.meeting_room_facilities.name
            ),
            nextBooking: room.meeting_room_bookings[0]?.title || null,
            bookingTime: room.meeting_room_bookings[0]
                ? `${room.meeting_room_bookings[0].start_time.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} - ${room.meeting_room_bookings[0].end_time.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}`
                : "—",
        }));

        return NextResponse.json<ApiResponse<any>>(
            { success: true, data: formatted },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET MEETING ROOMS ERROR:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = createMeetingRoomSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: "Invalid data",
                details: validation.error.format() 
            }, { status: 400 });
        }
        const { floor_id, room_code, name, capacity, status, facility_ids } = validation.data;
        const room = await prisma.meeting_rooms.create({
            data: {
                floor_id,
                room_code,
                name,
                capacity,
                status,
                meeting_room_facility_assignments: {
                    create: facility_ids.map((id) => ({
                        facility_id: id,
                    })),
                },
            },
            include: {
                meeting_room_facility_assignments: {
                    include: {
                        meeting_room_facilities: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                id: room.room_id,
                name: room.name,
                status: room.status,
                facilities: room.meeting_room_facility_assignments.map(
                    (f) => f.meeting_room_facilities.name
                ),
            },
        }, { status: 201 });
    } catch (error) {
        console.error("POST ERROR:", error);
        return NextResponse.json({ success: false, error: "Create failed" }, { status: 500 });
    }
}