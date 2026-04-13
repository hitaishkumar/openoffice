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
import { CirclePlus, DoorOpen, Users } from "lucide-react";
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

interface AddMeetingRoomDialogProps {
  onAddRoom: (room: MeetingRoom) => void;
}

export function AddMeetingRoomDialog({ onAddRoom }: AddMeetingRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [floor, setFloor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const facilities = [
    "Projector",
    "Video Conference",
    "Whiteboard",
    "Phone",
    "Sound System",
    "AC",
    "WiFi",
    "Parking",
  ];

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility],
    );
  };

  const handleSubmit = () => {
    if (!name || !roomId || !floor || !capacity) {
      alert("Please fill in all required fields");
      return;
    }

    const newRoom: MeetingRoom = {
      id: roomId,
      name,
      floor,
      capacity: parseInt(capacity),
      status: "available",
      facilities: selectedFacilities.length > 0 ? selectedFacilities : ["Standard"],
      nextBooking: null,
      bookingTime: "—",
    };

    onAddRoom(newRoom);

    // Reset form
    setName("");
    setRoomId("");
    setFloor("");
    setCapacity("");
    setSelectedFacilities([]);
    setOpen(false);
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

        <FieldGroup>
          <Field>
            <Label htmlFor="room-name">Room Name</Label>
            <Input
              id="room-name"
              placeholder="e.g., Conference Room A"
              className="mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="room-id">Room ID</Label>
            <Input
              id="room-id"
              placeholder="e.g., CR-01"
              className="mt-2"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="floor">Floor</Label>
            <Select value={floor} onValueChange={setFloor}>
              <SelectTrigger id="floor" className="mt-2">
                <SelectValue placeholder="Select floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Floors</SelectLabel>
                  <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                  <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                  <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                  <SelectItem value="4th Floor">4th Floor</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Label htmlFor="capacity" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Capacity (people)
            </Label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g., 12"
              className="mt-2"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </Field>
        </FieldGroup>

        <div className="space-y-3">
          <Label>Facilities</Label>
          <div className="grid grid-cols-2 gap-3">
            {facilities.map((facility) => (
              <div key={facility} className="flex items-center gap-2">
                <Checkbox
                  id={facility}
                  checked={selectedFacilities.includes(facility)}
                  onCheckedChange={() => toggleFacility(facility)}
                />
                <Label htmlFor={facility} className="text-sm cursor-pointer">
                  {facility}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Add Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
