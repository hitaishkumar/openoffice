"use client";
import { FloorTableV2 } from "@/components/floor/FloorTableV2";
import { SpaceTypeCard } from "@/components/floor/SpaceList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const BookingPage = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [bookingData, setBookingData] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date(today);
  maxDateObj.setDate(today.getDate() + 7);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(minDate);

  return (
    <div className="h-full">
      <h1 className="p-4 text-2xl font-bold">Quick Book</h1>
      <div className="w-100 rounded-md p-4">
        <p className="text-muted-foreground text-sm">
          Select Date to check availability
        </p>
        <Input
          className="text-sm"
          type="date"
          value={selectedDate}
          min={minDate}
          max={maxDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
      </div>

      <div className="grid h-full w-full grid-cols-4">
        {/* LEFT PANEL */}
        <div className="col-span-1 overflow-y-scroll">
          <SpaceTypeCard
            selectedType={selectedType}
            onSelect={setSelectedType}
            floorId="019d6e02-0c66-73e7-9317-0cce79e88eb7"
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-3 flex flex-col space-y-6 overflow-scroll">
          <FloorTableV2
            selectedType={selectedType}
            floorId="019d6e02-0c66-73e7-9317-0cce79e88eb7"
            onBook={(cell) => {
              setBookingData(cell);
              setIsBookingOpen(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
