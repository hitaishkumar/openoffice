"use client";
import { AddMeetingRoomDialog } from "@/components/meeting-rooms/AddRoomDialog";
import { MeetingRoomsList } from "@/components/meeting-rooms/MeetingRoomsList";
import RoomSummary from "@/components/meeting-rooms/RoomSummary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { useState } from "react";

type MeetingRoom = {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  status: "available" | "booked" | "maintenance";
  facilities: string[];
  nextBooking: string | null;
  bookingTime: string;
};

const page = () => {
  const initialRooms: MeetingRoom[] = [
    {
      id: "CR-A1",
      name: "Conference Room A",
      floor: "2nd Floor",
      capacity: 12,
      status: "available" as const,
      facilities: ["Projector", "Whiteboard", "AC"],
      nextBooking: null,
      bookingTime: "—",
    },
    {
      id: "CR-B1",
      name: "Conference Room B",
      floor: "2nd Floor",
      capacity: 8,
      status: "booked" as const,
      facilities: ["Projector", "Video Conference", "AC"],
      nextBooking: "Team Standup",
      bookingTime: "10:00 AM - 11:00 AM",
    },
    {
      id: "CR-C1",
      name: "Executive Board Room",
      floor: "3rd Floor",
      capacity: 20,
      status: "available" as const,
      facilities: [
        "Projector",
        "Video Conference",
        "Whiteboard",
        "AC",
        "Sound System",
      ],
      nextBooking: null,
      bookingTime: "—",
    },
    {
      id: "WS-D1",
      name: "Workshop Room D",
      floor: "Ground Floor",
      capacity: 15,
      status: "maintenance" as const,
      facilities: ["Whiteboard", "Tables", "Chairs"],
      nextBooking: "Maintenance",
      bookingTime: "09:00 AM - 05:00 PM",
    },
    {
      id: "CR-E1",
      name: "Brainstorm Room",
      floor: "2nd Floor",
      capacity: 6,
      status: "booked" as const,
      facilities: ["Whiteboard", "AC", "Projector"],
      nextBooking: "Design Review",
      bookingTime: "02:00 PM - 03:30 PM",
    },
    {
      id: "CR-F1",
      name: "Focus Room F",
      floor: "3rd Floor",
      capacity: 4,
      status: "available" as const,
      facilities: ["AC", "Whiteboard", "Phone"],
      nextBooking: null,
      bookingTime: "—",
    },
  ];

  const [rooms, setRooms] = useState<MeetingRoom[]>(initialRooms);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleAddRoom = (newRoom: MeetingRoom) => {
    setRooms([...rooms, newRoom]);
  };

  const filteredRooms = selectedFloor
    ? rooms.filter((room) => room.floor === selectedFloor)
    : rooms;

  return (
    <div className="h-full w-full">
      {/* NAVBAR */}
      <div className="border-b w-full h-15">
        <div className="flex gap-4 items-center justify-end pr-4 h-full">
          <Button
            className="shadow-sm"
            variant="secondary"
            onClick={() => setShowCalendar(true)}
          >
            <Calendar /> View Calendar
          </Button>
          <AddMeetingRoomDialog onAddRoom={handleAddRoom} />
        </div>
      </div>

      {/* CALENDAR MODAL */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Meeting Room Calendar</DialogTitle>
            <DialogDescription>
              View and manage all room bookings
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Calendar integration coming soon</p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 h-fit min-w-full">
        {/* LEFT PANE */}
        <div className="col-span-1 overflow-y-scroll border-r">
          {/* SUMMARY STATS */}
          <Card className="rounded-none border-b">
            <CardHeader>
              <CardTitle>Room Status</CardTitle>
              <CardDescription>QuickOverview</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="grid grid-cols-12 items-center gap-2">
                  {/* Status label */}
                  <div className="col-span-6 text-xs font-medium">
                    Available
                  </div>
                  <div className="col-span-6 text-right text-xs font-bold text-green-600">
                    3 rooms
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-6 text-xs font-medium">Booked</div>
                  <div className="col-span-6 text-right text-xs font-bold text-blue-600">
                    2 rooms
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-6 text-xs font-medium">
                    Maintenance
                  </div>
                  <div className="col-span-6 text-right text-xs font-bold text-orange-600">
                    1 room
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* UPCOMING BOOKINGS */}
          <Card className="rounded-none border-b">
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Today & Tomorrow</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {rooms
                .filter((r) => r.status === "booked")
                .map((room) => (
                  <Card
                    key={room.id}
                    className="border-none rounded-lg bg-muted/50 p-3"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{room.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {room.nextBooking}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {room.bookingTime}
                      </div>
                    </div>
                  </Card>
                ))}
            </CardContent>
          </Card>

          {/* FILTERS */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Filter by Floor</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Button
                key="all"
                variant={selectedFloor === null ? "default" : "ghost"}
                className="w-full justify-start text-xs"
                onClick={() => setSelectedFloor(null)}
              >
                All Floors
              </Button>
              {["Ground Floor", "2nd Floor", "3rd Floor"].map((floor) => (
                <Button
                  key={floor}
                  variant={selectedFloor === floor ? "default" : "ghost"}
                  className="w-full justify-start text-xs"
                  onClick={() => setSelectedFloor(floor)}
                >
                  {floor}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT PANE */}
        <div className="col-span-3 overflow-y-scroll">
          <div className="p-6 space-y-6">
            {/* SUMMARY CARDS */}
            <RoomSummary
              totalRooms={rooms.length}
              availableRooms={
                rooms.filter((r) => r.status === "available").length
              }
              bookedRooms={rooms.filter((r) => r.status === "booked").length}
              maintenanceRooms={
                rooms.filter((r) => r.status === "maintenance").length
              }
            />

            {/* ROOMS TABLE */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">All Meeting Rooms</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your office meeting rooms
                </p>
              </div>
              <MeetingRoomsList rooms={filteredRooms} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
