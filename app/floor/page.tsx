"use client";
import { FloorTableV2 } from "@/components/floor/FloorTableV2";
import { SpaceTypeCard } from "@/components/floor/SpaceList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleX, Plus } from "lucide-react";
import { useState } from "react";

const Page = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [bookingData, setBookingData] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date(today);
  maxDateObj.setDate(today.getDate() + 7);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(minDate);

  const handleBooking = () => {
    setBookingData(null); // no prefill
    setIsBookingOpen(true);
  };

  return (
    <div className="h-full">
      {/* NAVBAR */}
      <div className="h-15 w-full border-b">
        <div className="flex h-full items-center justify-end gap-4 pr-4">
          <div className="flex h-12 w-18 flex-col items-center justify-center rounded-sm border bg-blue-200/20">
            <span className="font-bold text-green-700">100</span>
            <span className="text-xs font-bold text-gray-400">Available</span>
          </div>
          <div className="flex h-12 w-18 flex-col items-center justify-center rounded-sm border bg-blue-200/20">
            <span className="font-bold text-green-700">100</span>
            <span className="text-xs font-bold text-gray-400">Available</span>
          </div>
          <div className="flex h-12 w-18 flex-col items-center justify-center rounded-sm border bg-blue-200/20">
            <span className="font-bold text-green-700">100</span>
            <span className="text-xs font-bold text-gray-400">Available</span>
          </div>

          <Button onClick={handleBooking} className="h-12">
            <Plus /> New Booking
          </Button>
          {isBookingOpen && (
            <div className="fixed inset-0 z-[1] flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="mx-4 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
                {/* Modal Header */}
                <div className="flex flex-row items-center justify-between border-b px-6 py-4">
                  <h2 className="text-xl font-bold">New Booking</h2>
                  <CircleX
                    onClick={() => setIsBookingOpen(false)}
                    className="cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
                    size={24}
                  />
                </div>

                {/* Modal Content */}
                <div className="space-y-5 p-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Full Name</Label>
                    <Input placeholder="Enter your name" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email ID</Label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Booking Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      min={minDate}
                      max={maxDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>

                  {bookingData && (
                    <div className="rounded-md bg-gray-50 p-2 text-xs">
                      <div>
                        <strong>Selected Seat:</strong>
                      </div>
                      <div>
                        Row: {bookingData.row_num} | Col: {bookingData.col_num}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Seat Type</Label>
                    <select
                      value={
                        bookingData?.cell_type
                          ? bookingData.cell_type.toLowerCase()
                          : ""
                      }
                      className="border-input focus:ring-primary w-full rounded-md border px-3 py-2 text-sm font-medium focus:ring-2 focus:outline-none"
                      disabled={!!bookingData}
                    >
                      <option value="workstation">Workstation</option>
                      <option value="hot-desk">Hot Desk</option>
                      <option value="meeting-room-4">Meeting Room(4)</option>
                      <option value="meeting-room-6">Meeting Room(6)</option>
                      <option value="collab-area">Collab Area</option>
                      <option value="phone-booth">Phone Booth</option>
                    </select>
                  </div>
                  {!bookingData && (
                    <em className="text-muted-foreground text-xs">
                      *This will allot a booking randomly based on availability.
                      For specific seat selection, route to Quick Book.
                    </em>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 border-t px-6 py-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsBookingOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1">Confirm Booking</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid h-full w-full grid-cols-4">
        {/* LEFT PANEL */}
        <div className="col-span-1 overflow-y-scroll">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>DATE & TIME</CardTitle>
              <CardDescription>Select Duration of Booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input value={selectedDate} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input value="09:00 AM" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input value="06:00 PM" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          <SpaceTypeCard
            selectedType={selectedType}
            onSelect={setSelectedType}
            floorId="019d6e02-0c66-73e7-9317-0cce79e88eb7"
          />

          <Card className="rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wide">
                18 SPACES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="hover:border-primary flex cursor-pointer items-center justify-between p-3 transition-colors"
                >
                  <div>
                    <div className="font-medium">Workstation A0{i}</div>
                    <div className="text-muted-foreground text-sm">
                      1.8×0.6m · Row A
                    </div>
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                    Available
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
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

export default Page;
