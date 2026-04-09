"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Info, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

type CellType = string | null;

// Refined color palette for a cleaner look
const getCellStyle = (id: CellType): string => {
  if (!id) return "bg-transparent";

  const map: Record<string, string> = {
    LIFT: "bg-slate-200 text-slate-600 border-slate-300",
    STAIRCASE: "bg-slate-200 text-slate-600 border-slate-300",
    RECEPTION: "bg-blue-100 text-blue-700 border-blue-200",
    LOBBY: "bg-indigo-50 text-indigo-600 border-indigo-100",
    MR6: "bg-orange-100 text-orange-700 border-orange-200",
    MR4: "bg-amber-100 text-amber-700 border-amber-200",
    COLAB_18S: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PANTRY: "bg-pink-50 text-pink-700 border-pink-100",
    SERVER_ROOM: "bg-zinc-800 text-zinc-100 border-zinc-900",
    LOCKER: "bg-slate-50 text-slate-500 border-slate-200",
  };

  if (map[id]) return map[id];

  // Workstation defaults
  if (id.includes("WORKSTATION"))
    return "bg-white text-slate-900 border-slate-200 shadow-sm";

  return "bg-muted/30 text-muted-foreground border-transparent";
};

export function FloorTableV2({
  floorId,
  selectedType,
}: {
  floorId: string;
  selectedType: string | null;
}) {
  const [floorData, setFloorData] = useState<{
    matrix: string[][];
    max_cols: number;
  }>({
    matrix: [],
    max_cols: 0,
  });

  console.log("selected TYPE in Table", selectedType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/floorplan/", {
      method: "POST",
      body: JSON.stringify({ id: floorId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFloorData(data);
        setLoading(false);
      });
  }, [floorId]);

  const data = useMemo(
    () =>
      (floorData?.matrix || []).map((row) => {
        const obj: Record<string, string | null> = {};
        (row || []).forEach((cell, i) => {
          obj[`col_${i}`] = cell;
        });
        return obj;
      }),
    [floorData],
  );

  const columns = useMemo(
    () =>
      Array.from({ length: floorData?.max_cols || 0 }, (_, i) => ({
        accessorKey: `col_${i}`,
        cell: ({ getValue }: any) => {
          const seat = getValue();
          if (!seat) return <div className="h-6 w-8" />;

          const isMatch = selectedType ? seat.startsWith(selectedType) : true;

          return (
            <div
              className={`
              h-6 w-8 rounded-sm border flex items-center justify-center text-[9px] font-semibold transition-all hover:ring-2 hover:ring-primary/20 cursor-default
              ${isMatch ? getCellStyle(seat) : "opacity-20 grayscale"}
            `}
            >
              {seat.split("_").pop()?.slice(0, 3)}
            </div>
          );
        },
      })),
    [floorData?.max_cols, selectedType], // ✅ THIS is the fix
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading)
    return (
      <div className="flex h-[400px] w-full items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Calculating floor dynamics...</span>
      </div>
    );

  return (
    <div className="px-0">
      {/* Improved Legend */}
      <div className="mt-6 flex flex-wrap gap-4 items-center text-muted-foreground">
        <div className="flex items-center gap-1.5 text-xs">
          <Info className="h-3.5 w-3.5" />
          <span className="font-medium">Legend:</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <LegendItem color="bg-white border-slate-200" label="Workstation" />
        <LegendItem
          color="bg-orange-100 border-orange-200"
          label="Meeting Room"
        />
        <LegendItem color="bg-emerald-50 border-emerald-200" label="Collab" />
        <LegendItem color="bg-zinc-800" label="Infrastructure" />
      </div>
      {/* Scrollable Map Area */}
      <div className="rounded-md  bg-muted/20 p-4">
        <ScrollArea className="w-fit whitespace-nowrap rounded-md">
          <div
            className="grid p-1 "
            style={{
              gridTemplateColumns: `repeat(${floorData.max_cols}, 39px)`,
              width: "fit-content",
            }}
          >
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-3 w-3 rounded-full border ${color}`} />
      <span className="text-[11px] font-medium">{label}</span>
    </div>
  );
}
