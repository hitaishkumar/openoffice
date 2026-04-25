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
import { useEffect, useState } from "react";

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

type RoomStats = {
  total: number;
  available: number;
  booked: number;
  maintenance: number;
};

type Floor = {
  floor_id: string;
  name: string;
  building?: string;
  created_at?: string;
};

const Page = () => {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [stats, setStats] = useState<RoomStats>({
    total: 0,
    available: 0,
    booked: 0,
    maintenance: 0,
  });
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [roomsRes, statsRes, floorsRes] = await Promise.all([
          fetch("/api/meeting-rooms"),
          fetch("/api/meeting-rooms/stats"),
          fetch("/api/floors"),
        ]);

        if (!roomsRes.ok) throw new Error("Failed to fetch rooms");
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        if (!floorsRes.ok) throw new Error("Failed to fetch floors");

        const roomsData = await roomsRes.json();
        const statsData = await statsRes.json();
        const floorsData = await floorsRes.json();

        setRooms(roomsData.data || []);
        setStats(statsData.data || {});
        setFloors(floorsData.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load meeting rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddRoom = async (newRoom: MeetingRoom) => {
    try {
      setRooms((prev) => [...prev, newRoom]);

      const statsRes = await fetch("/api/meeting-rooms/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data || {});
      }
    } catch (err) {
      console.error("Error updating room list:", err);
    }
  };

  const filteredRooms = selectedFloor
    ? rooms.filter((room) => room.floor === selectedFloor)
    : rooms;

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading meeting rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
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
                    {stats.available} rooms
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-6 text-xs font-medium">Booked</div>
                  <div className="col-span-6 text-right text-xs font-bold text-blue-600">
                    {stats.booked} rooms
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-6 text-xs font-medium">
                    Maintenance
                  </div>
                  <div className="col-span-6 text-right text-xs font-bold text-orange-600">
                    {stats.maintenance} rooms
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
              {floors.map((floor) => (
                <Button
                  key={floor.floor_id}
                  variant={selectedFloor === floor.name ? "default" : "ghost"}
                  className="w-full justify-start text-xs"
                  onClick={() => setSelectedFloor(floor.name)}
                >
                  {floor.name}
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
              totalRooms={stats.total}
              availableRooms={stats.available}
              bookedRooms={stats.booked}
              maintenanceRooms={stats.maintenance}
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

export default Page;
