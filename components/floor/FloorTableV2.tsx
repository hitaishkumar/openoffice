"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Info, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { CellDetailsSheet } from "../cell/CellSheet";
import { PantryDetailsSheet } from "../cell/PantrySheet";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { spaceTypeLabelMap } from "./SpaceList";

type FloorCellNode = {
  row_num: number;
  col_num: number;
  floor_cell_id: string;
  cell_type: string;
  capacity: number;
  is_bookable: boolean;
  metadata: Record<string, any>;
};

type FloorPlanResponse = {
  matrix: FloorCellNode[][];
  max_cols: number;
};

type RowType = Record<string, FloorCellNode | null>;

// Refined color palette for a cleaner look
const getCellStyle = (floorCellNode: FloorCellNode): string => {
  if (!floorCellNode.cell_type) return "bg-transparent";

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

  if (map[floorCellNode.cell_type]) return map[floorCellNode.cell_type];

  // Workstation defaults
  if (floorCellNode.cell_type.includes("WORKSTATION"))
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
  const [floorData, setFloorData] = useState<FloorPlanResponse>({
    matrix: [],
    max_cols: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!floorId) return;

    fetch("/api/floorplan", {
      // ✅ removed trailing slash
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ required
      },
      body: JSON.stringify({ id: floorId }),
    })
      .then((res) => res.json())
      .then((data: FloorPlanResponse) => {
        setFloorData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch floor data", err);
        setLoading(false);
      });
  }, [floorId]);

  const data = useMemo<RowType[]>(
    () =>
      (floorData?.matrix || []).map((row) => {
        const obj: RowType = {};
        (row || []).forEach((cell, i) => {
          obj[`col_${i}`] = cell;
        });
        return obj;
      }),
    [floorData],
  );

  const columns = useMemo<ColumnDef<RowType>[]>(
    () =>
      Array.from({ length: floorData?.max_cols || 0 }, (_, i) => ({
        accessorKey: `col_${i}`,
        cell: ({ getValue }) => {
          const cell = getValue() as FloorCellNode;

          if (!cell) return <div className="h-6 w-8" />;

          const seat = cell.cell_type;
          const isMatch = selectedType ? seat?.startsWith(selectedType) : true;
          const label = spaceTypeLabelMap[cell.cell_type] || cell.cell_type;
          return (
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={`
                  p-1
                  h-6 w-8 rounded-sm border flex items-center justify-center text-[9px] font-semibold
                  transition-all hover:ring-2 hover:ring-primary/20 cursor-default cursor-pointer
                  ${isMatch ? getCellStyle(cell) : "opacity-20 grayscale"}
                `}
                >
                  {seat?.split("_").pop()?.slice(0, 3)}
                </div>
              </PopoverTrigger>

              <PopoverContent
                side="top"
                align="center"
                className="w-70 text-xs"
              >
                <div className="flex justify-between">
                  <div className="font-semibold text-sm">
                    {label || "Empty"}
                  </div>
                  {label ? (
                    <Badge>{seat}</Badge>
                  ) : (
                    <Badge variant={"destructive"} className="text-sm">
                      Not Assigned
                    </Badge>
                  )}
                </div>

                <div className="text-muted-foreground">
                  Row: {cell.row_num} | Col: {cell.col_num}
                </div>

                <div>
                  <span className="font-medium">Capacity:</span>{" "}
                  {cell.capacity ?? "-"}
                </div>

                <div>
                  <span className="font-medium">Bookable:</span>{" "}
                  {cell.is_bookable ? "Yes" : "No"}
                </div>
                {cell.floor_cell_id && (
                  <div className="truncate">
                    <span className="font-medium">ID:</span>{" "}
                    {cell.floor_cell_id}
                  </div>
                )}
                <div className="pt-2">
                  <CellDetailsSheet cell={cell} />
                  <PantryDetailsSheet cell={cell} />
                </div>

                {cell.metadata && Object.keys(cell.metadata).length > 0 && (
                  <div className="pt-1 border-t">
                    <span className="font-medium">Metadata:</span>
                    <pre className="text-[10px] mt-1 whitespace-pre-wrap">
                      {JSON.stringify(cell.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          );
        },
      })),
    [floorData?.max_cols, selectedType],
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
            className="grid "
            style={{
              gridTemplateColumns: `repeat(${floorData.max_cols}, 39px)`,
              width: "fit-content",
            }}
          >
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="p-0.5">
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
