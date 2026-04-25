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

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CirclePlus, Users, Loader2 } from "lucide-react";
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

interface AddMeetingRoomDialogProps {
  onAddRoom: (room: MeetingRoom) => void;
}

type Facility = {
  facility_id: string;
  name: string;
};

type Floor = {
  floor_id: string;
  name: string;
  building?: string;
};

export function AddMeetingRoomDialog({ onAddRoom }: AddMeetingRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [floorId, setFloorId] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch facilities and floors on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [facilitiesRes, floorsRes] = await Promise.all([
          fetch("/api/meeting-rooms/facilities"),
          fetch("/api/floors"),
        ]);

        if (facilitiesRes.ok) {
          const data = await facilitiesRes.json();
          setFacilities(data.data || []);
        }

        if (floorsRes.ok) {
          const data = await floorsRes.json();
          setFloors(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFacility = (facilityId: string) => {
    setSelectedFacilityIds((prev) =>
      prev.includes(facilityId)
        ? prev.filter((f) => f !== facilityId)
        : [...prev, facilityId]
    );
  };

  const handleSubmit = async () => {
    if (!name || !roomCode || !floorId || !capacity) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        floor_id: floorId,
        room_code: roomCode,
        name,
        capacity: parseInt(capacity),
        status: "available",
        facility_ids: selectedFacilityIds,
      };

      const response = await fetch("/api/meeting-rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create room");
        return;
      }

      const result = await response.json();

      // Format response for the page
      const selectedFloor = floors.find((f) => f.floor_id === floorId);
      const selectedFacilityNames = facilities
        .filter((f) => selectedFacilityIds.includes(f.facility_id))
        .map((f) => f.name);

      const newRoom: MeetingRoom = {
        id: result.data.id,
        name: result.data.name,
        floor: selectedFloor?.name || "Unknown Floor",
        capacity: result.data.capacity,
        status: result.data.status,
        facilities: selectedFacilityNames,
        nextBooking: null,
        bookingTime: "—",
      };

      onAddRoom(newRoom);

      // Reset form
      setName("");
      setRoomCode("");
      setFloorId("");
      setCapacity("");
      setSelectedFacilityIds([]);
      setOpen(false);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("An error occurred while creating the room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="h-4 w-4 mr-1" />
          Add Room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Meeting Room</DialogTitle>
          <DialogDescription>
            Register a new meeting room to your space inventory
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <FieldGroup>
              <Field>
                <Label htmlFor="room-name">Room Name *</Label>
                <Input
                  id="room-name"
                  placeholder="e.g., Conference Room A"
                  className="mt-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
              </Field>

              <Field>
                <Label htmlFor="room-code">Room Code *</Label>
                <Input
                  id="room-code"
                  placeholder="e.g., CR-01"
                  className="mt-2"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  disabled={submitting}
                />
              </Field>

              <Field>
                <Label htmlFor="floor">Floor *</Label>
                <Select value={floorId} onValueChange={setFloorId} disabled={submitting}>
                  <SelectTrigger id="floor" className="mt-2">
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Floors</SelectLabel>
                      {floors.map((floor) => (
                        <SelectItem key={floor.floor_id} value={floor.floor_id}>
                          {floor.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label htmlFor="capacity" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Capacity (people) *
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="e.g., 12"
                  className="mt-2"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  disabled={submitting}
                />
              </Field>
            </FieldGroup>

            <div className="space-y-3">
              <Label>Facilities</Label>
              <div className="grid grid-cols-2 gap-3">
                {facilities.map((facility) => (
                  <div key={facility.facility_id} className="flex items-center gap-2">
                    <Checkbox
                      id={facility.facility_id}
                      checked={selectedFacilityIds.includes(facility.facility_id)}
                      onCheckedChange={() => toggleFacility(facility.facility_id)}
                      disabled={submitting}
                    />
                    <Label
                      htmlFor={facility.facility_id}
                      className="text-sm cursor-pointer"
                    >
                      {facility.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Add Room"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
