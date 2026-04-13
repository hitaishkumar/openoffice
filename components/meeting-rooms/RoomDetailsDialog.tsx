"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, Clock, MapPin } from "lucide-react";

interface RoomDetailsDialogProps {
  room: {
    id: string;
    name: string;
    floor: string;
    capacity: number;
    status: "available" | "booked" | "maintenance";
    facilities: string[];
    nextBooking: string | null;
    bookingTime: string;
  };
}

export function RoomDetailsDialog({ room }: RoomDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Details
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{room.name}</DialogTitle>
          <DialogDescription>{room.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* STATUS CARD */}
          <Card className="border-0 bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={
                    room.status === "available"
                      ? "default"
                      : room.status === "booked"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {room.status === "available"
                    ? "Available"
                    : room.status === "booked"
                      ? "Booked"
                      : "Maintenance"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* LOCATION & CAPACITY */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 bg-muted/50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Floor</span>
              </div>
              <div className="font-medium text-sm">{room.floor}</div>
            </Card>
            <Card className="border-0 bg-muted/50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Capacity</span>
              </div>
              <div className="font-medium text-sm">{room.capacity} people</div>
            </Card>
          </div>

          {/* FACILITIES */}
          <div>
            <h4 className="text-sm font-medium mb-2">Facilities</h4>
            <div className="flex gap-2 flex-wrap">
              {room.facilities.map((facility) => (
                <Badge key={facility} variant="secondary">
                  {facility}
                </Badge>
              ))}
            </div>
          </div>

          {/* CURRENT BOOKING */}
          {room.status !== "available" && (
            <Card className="border-0 bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Event</span>
                  <div className="font-medium text-sm">{room.nextBooking}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {room.bookingTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* NEXT AVAILABLE */}
          {room.status !== "available" && (
            <Card className="border-0 bg-green-50/50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Next Available
                  </span>
                  <span className="text-sm font-medium">04:00 PM Today</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {room.status === "available" && (
            <Button>Book Room</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
