"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Armchair,
  Building2,
  Coffee,
  Cpu,
  DoorOpen,
  Layers,
  Lock,
  Monitor,
  Phone,
  Server,
  Toilet,
  Trees,
  Users,
  Warehouse,
} from "lucide-react";
import { useEffect, useState } from "react";

type SpaceTypeCount = {
  cell_type: string;
  count: number;
};

export const spaceTypeLabelMap: Record<string, string> = {
  WORKSTATION_STD: "Workstation",
  WORKSTATION_SML: "Small WS",
  WORKSTATION_HAT: "Hot Desk",

  MR4: "Meeting Room (4)",
  MR6: "Meeting Room (6)",
  COLAB_18S: "Collab Area",

  TELBOOTH: "Phone Booth",
  LOCKER: "Locker",
  CUBICLE: "Cubicle",

  PANTRY: "Pantry",
  SERVER_ROOM: "Server Room",
  HUB_ROOM: "Hub Room",

  LIFT: "Lift",
  STAIRCASE: "Staircase",
  LOBBY: "Lobby",

  STORAGE: "Storage",
  PLANTER: "Planter",

  TOILET_GENTS: "Gents Toilet",
  TOILET_LADIES: "Ladies Toilet",

  DUCT: "Duct",
  ELEC_PANEL: "Electrical Panel",
  RECEPTION: "Reception",
};

export const spaceTypeIconMap: Record<string, React.ElementType> = {
  WORKSTATION_STD: Monitor,
  WORKSTATION_SML: Monitor,
  WORKSTATION_HAT: Monitor,

  MR4: Users,
  MR6: Users,
  COLAB_18S: Users,

  TELBOOTH: Phone,
  LOCKER: Lock,
  CUBICLE: Armchair,

  PANTRY: Coffee,
  SERVER_ROOM: Server,
  HUB_ROOM: Cpu,

  LIFT: Building2,
  STAIRCASE: Layers,
  LOBBY: DoorOpen,

  STORAGE: Warehouse,
  PLANTER: Trees,

  TOILET_GENTS: Toilet,
  TOILET_LADIES: Toilet,

  DUCT: Layers,
  ELEC_PANEL: Cpu,
  RECEPTION: Users,
};

export function SpaceTypeCard({ floorId }: { floorId: string }) {
  const [data, setData] = useState<SpaceTypeCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(JSON.stringify({ id: floorId }));
    fetch("/api/space", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: floorId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch spaces", err);
        setLoading(false);
      });
  }, [floorId]);

  return (
    <Card className="rounded-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wide">
          SPACE TYPE
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-xs text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {data.map((item) => {
              const Icon = spaceTypeIconMap[item.cell_type];
              const label = spaceTypeLabelMap[item.cell_type] || item.cell_type;

              const isLong = label.length > 10;

              return (
                <Button
                  key={item.cell_type}
                  variant="outline"
                  className={`text-xs flex justify-between items-center ${
                    isLong ? "col-span-2" : ""
                  }`}
                >
                  {isLong ? (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        {Icon && (
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{label}</span>
                      </div>

                      <span className="text-muted-foreground">
                        {Number(item.count)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        {Icon && (
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{label}</span>
                      </div>

                      <span className="text-muted-foreground">
                        {Number(item.count)}
                      </span>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
