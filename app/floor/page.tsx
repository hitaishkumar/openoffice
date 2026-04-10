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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleX, Plus } from "lucide-react";
import { useState } from "react";

const page = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showBookingSidebar, setShowBookingSidebar] = useState(false);

  const handleBooking = () => {
    console.log("Booking button clicked");
    setShowBookingSidebar(true);
  };

  return (
    <div className="h-full">
      {/* NAVBAR */}
      <div className="border-b w-full h-15">
        <div className="flex gap-4 items-center justify-end pr-4 h-full">
          <div className="bg-blue-200/20 border h-12 w-18 rounded-sm flex flex-col items-center justify-center">
            <span className="text-green-700 font-bold">100</span>
            <span className="text-xs text-gray-400 font-bold">Available</span>
          </div>
          <div className="bg-blue-200/20 border h-12 w-18 rounded-sm flex flex-col items-center justify-center">
            <span className="text-green-700 font-bold">100</span>
            <span className="text-xs text-gray-400 font-bold">Available</span>
          </div>
          <div className="bg-blue-200/20 border h-12 w-18 rounded-sm flex flex-col items-center justify-center">
            <span className="text-green-700 font-bold">100</span>
            <span className="text-xs text-gray-400 font-bold">Available</span>
          </div>
          <Button onClick={handleBooking} className="h-12">
            {" "}
            <Plus /> New Booking
          </Button>
          {showBookingSidebar && (
            <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 flex flex-col overflow-y-auto">
              <div className="flex flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-bold">New Booking</h2>
                <CircleX onClick={() => setShowBookingSidebar(false)} className="cursor-pointer" />
              </div>
              
              <div className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Enter your name" />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label>Email ID</Label>
                  <Input type="email" placeholder="Enter your email" />
                </div>

                {/* Booking Date Field */}
                <div className="space-y-2">
                  <Label>Booking Date</Label>
                  <Input type="date" />
                </div>

                {/* Seat Type Field */}
                <div className="space-y-2">
                  <Label>Seat Type</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option value="">Select seat type</option>
                    <option value="workstation">Workstation</option>
                    <option value="meeting-room">Meeting Room</option>
                    <option value="private-office">Private Office</option>
                    <option value="conference-room">Conference Room</option>
                  </select>
                </div>

                {/* Confirm Button */}
                <Button className="w-full mt-6">Confirm Booking</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <div className="inline-grid grid-cols-4 border-4 w-full bg-red-400 h-full">
        <div className="bg-yellow-200/50 flex flex-col">
          <div className="border-8 flex-1/4">Date</div>
          <div className="border-8 flex-1/4 inline-grid grid-cols-2 gap-2">
            <div className="w-40 h-10 border">1</div>
            <div className="w-40 h-10 border">1</div>
            <div className="w-40 h-10 border">1</div>
            <div className="w-40 h-10 border">1</div>
          </div>
          <div className="border-8 flex-2/4">Date</div>
        </div>
        <div className=" bg-blue-500/50 col-span-3">02</div>
      </div>
      */}
      <div className="grid grid-cols-4 h-full w-full ">
        {/* LEFT PANEL */}

        <div className="col-span-1 overflow-y-scroll">
          {/* DATE & TIME */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>DATE & TIME</CardTitle>
              <CardDescription>Select Duration of Booking</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input value="07 Apr 2026" readOnly />
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

          {/* SPACE TYPE */}
          <SpaceTypeCard
            selectedType={selectedType}
            onSelect={setSelectedType}
            floorId="019d6e02-0c66-73e7-9317-0cce79e88eb7"
          />

          {/* SPACE LIST */}
          <Card className="rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wide">
                18 SPACES
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="p-3 flex items-center justify-between cursor-pointer transition-colors hover:border-primary"
                >
                  <div>
                    <div className="font-medium">Workstation A0{i}</div>
                    <div className="text-sm text-muted-foreground">
                      1.8×0.6m · Row A
                    </div>
                  </div>

                  <div className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Available
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RGIHT PANEL */}
        <div className="col-span-3 flex flex-col space-y-6 overflow-scroll">
          {/* <FloorPlan /> */}
          {/* <FloorTable floorId="019d6e02-0c66-73e7-9317-0cce79e88eb7" /> */}
          <FloorTableV2
            selectedType={selectedType}
            floorId="019d6e02-0c66-73e7-9317-0cce79e88eb7"
          />

          {/* <FloorCanvas /> */}
        </div>
      </div>
    </div>
  );
};

export default page;
