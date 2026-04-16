"use client";
import { AddPantryDialog } from "@/components/pantry/AddItemDialog";
import { InventoryTable } from "@/components/pantry/InventoryTable";
import UsageSummary from "@/components/pantry/UsageSummary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
const page = () => {
  const items = [
    { name: "Instant coffee", percent: 20, need: "48 pcs" },
    { name: "Sugar sachets", percent: 3, need: "194 pcs" },
    { name: "Milk (UHT 1L)", percent: 20, need: "16 L" },
    { name: "Poha", percent: 20, need: "8 kg" },
    { name: "Tissue boxes", percent: 15, need: "17 boxes" },
    { name: "Hand sanitiser", percent: 20, need: "8 btl" },
    { name: "Cheese slices", percent: 0, need: "30 pcs" },
    { name: "Cornflakes", percent: 13, need: "7 kg" },
  ];
  return (
    <div className="h-full w-full">
      {/* NAVBAR */}
      <div className="border-b w-full h-15">
        <div className="flex gap-4 items-center justify-end pr-4 h-full">
          <Button className="shadow-sm" variant="secondary">
            <Plus /> Replenish Order
          </Button>
          <AddPantryDialog />
        </div>
      </div>

      <div className="grid grid-cols-4 h-fit min-w-full">
        {/* LEFT PANE */}
        <div className="col-span-1 overflow-y-scroll border-r">
          <Card className="rounded-none h-2/7">
            <CardHeader>
              <CardTitle>Consumtion by Category</CardTitle>
              <CardDescription>goruped by month</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2 ">
                {[10, 20, 30, 40, 50, 60, 70].map((percent) => {
                  return (
                    <div className="grid grid-cols-12 items-center gap-2 ">
                      {/* Category */}
                      <div className="col-span-3 text-xs text-muted-foreground">
                        {percent + "catrogys"}
                      </div>

                      {/* Progress bar */}
                      <div className="col-span-7 h-2 rounded-sm bg-muted overflow-hidden">
                        <div
                          className="h-full bg-red-400"
                          style={{
                            width: `${percent}%`,
                            opacity: percent / 100,
                          }}
                        />
                      </div>

                      {/* Value */}
                      <div className="col-span-2 text-right text-xs font-medium">
                        300
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none">
            <CardHeader className="">
              <CardTitle>Repelenishment Queue</CardTitle>
              <CardDescription>goruped by month</CardDescription>
            </CardHeader>

            <CardContent className="">
              {items.map((item) => {
                const status =
                  item.percent === 0 ? "out" : item.percent < 25 ? "low" : "ok";

                return (
                  <Card
                    key={item.name}
                    className="border-none rounded-none px-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{item.name}</div>

                        <div className="text-xs text-muted-foreground">
                          {item.percent}% remaining · need {item.need}
                        </div>
                      </div>

                      {/* Status Badge */}
                      {status === "out" ? (
                        <div className="text-xs h-fit px-1 flex items-center justify-center rounded-full bg-red-100 text-red-700">
                          Out of stock
                        </div>
                      ) : status === "low" ? (
                        <div className="text-xs h-fit px-1 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                          Low stock
                        </div>
                      ) : (
                        <div className="text-xs h-fit px-1 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                          In stock
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* RGIHT PANEL */}
        <div className="col-span-3 flex flex-col space-y-6 overflow-scroll">
          {/* <FloorPlan /> */}
          {/* <FloorTable floorId="019d6e02-0c66-73e7-9317-0cce79e88eb7" /> */}
          {/* SPACE LIST */}
          <div className="border-b p-4">
            <UsageSummary />
          </div>
          <div className="p-4">
            <InventoryTable />
          </div>

          {/* <FloorCanvas /> */}
        </div>
      </div>
      {/* <div className="col-span-3 flex flex-col space-y-6 overflow-scroll"></div> */}
    </div>
  );
};

export default page;
