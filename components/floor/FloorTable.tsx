"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
type CellType = string | null;

const getCellStyle = (id: CellType): string => {
  if (!id) return "";

  // Structural / facilities
  const map: Record<string, string> = {
    LIFT: "bg-slate-100 border-slate-300 text-slate-600",
    STAIR: "bg-slate-50  border-slate-200 text-slate-500",
    RECEP: "bg-indigo-50 border-indigo-200 text-indigo-700",
    LOBBY: "bg-indigo-100 border-indigo-300 text-indigo-800",
    MR6: "bg-amber-100 border-amber-300 text-amber-800",
    MR4: "bg-yellow-100 border-yellow-300 text-yellow-800",
    COLAB: "bg-emerald-100 border-emerald-300 text-emerald-800",
    PANTRY: "bg-lime-100 border-lime-300 text-lime-800",
    HUB: "bg-violet-100 border-violet-300 text-violet-800",
    SERVER: "bg-sky-100 border-sky-300 text-sky-800",
    ELEC: "bg-red-100 border-red-300 text-red-800",
    LOCKER: "bg-orange-100 border-orange-300 text-orange-800",
    TELBOOTH: "bg-teal-100 border-teal-300 text-teal-800",
    CUBICLE: "bg-purple-100 border-purple-300 text-purple-800",
    "TOILET-G": "bg-red-400 border-green-200 text-green-700",
    "TOILET-L": "bg-red-600 border-green-200 text-green-700",
    DUCT: "bg-gray-100 border-gray-300 text-gray-600",
    STORAGE: "bg-slate-50 border-slate-200 text-slate-500",
    PLANTER: "bg-green-100 border-green-300 text-green-700",
  };

  if (map[id]) return map[id];

  // Workstations by zone prefix
  if (id.startsWith("HAT")) return "bg-sky-50 border-sky-200 text-sky-700";
  const prefix = id[0];
  switch (prefix) {
    case "A":
      return "bg-blue-50 border-blue-200 text-blue-700";
    case "B":
      return "bg-green-50 border-green-200 text-green-700";
    case "C":
      return "bg-purple-50 border-purple-200 text-purple-700";
    case "D":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    default:
      return "bg-muted";
  }
};
export function FloorTable({ floorId }: { floorId: string }) {
  // 1. Ensure your state always has a default structure
  const [floorData, setFloorData] = useState<{
    matrix: string[][];
    max_cols: number;
  }>({
    matrix: [],
    max_cols: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/floorplan/", {
      method: "POST",
      body: JSON.stringify({ id: floorId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFloorData(data);

        console.log("resposne form the API in Frontennd",data);
        setLoading(false);
      });
  }, [floorId]);

  // 2. Add the null-check in useMemo
  const data = useMemo(() => {
    // Use optional chaining and fallback to empty array
    return (floorData?.matrix || []).map((row) => {
      const obj: Record<string, string | null> = {};
      // Ensure row exists before forEach
      (row || []).forEach((cell, i) => {
        obj[`col_${i}`] = cell;
      });
      return obj;
    });
  }, [floorData]);

  const columns = useMemo(() => {
    const colCount = floorData?.max_cols || 0;
    return Array.from({ length: colCount }, (_, i) => ({
      accessorKey: `col_${i}`,
      cell: ({ getValue }: any) => {
        const seat = getValue();
        return (
          <div className={`h-6 w-full ${getCellStyle(seat)}`}>
            {seat ? seat.slice(0, 3) : ""}
          </div>
        );
      },
    }));
  }, [floorData?.max_cols]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading)
    return (
      <div className="p-10 animate-pulse text-center">Loading Floor Map...</div>
    );

  return (
    <div className="w-full overflow-hidden">
      {/* Mini Legend for R&D context */}
      <div className="p-2 bg-slate-50 border-t flex gap-4 text-[10px] text-slate-500 overflow-x-auto">
        <span>* A/B/C: Workstations</span>
        <span>* MR: Meeting Rooms</span>
        <span>* LIFT/STAIR: Facilities</span>
      </div>
      {/* Scrollable Container */}
      <div className="overflow-auto max-h-[80vh] relative">
        <div
          className="grid gap-0"
          style={{
            // This is the magic: it forces exactly X columns of 40px each
            gridTemplateColumns: `repeat(${floorData.max_cols}, 40px)`,
            width: "fit-content",
          }}
        >
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  className="outline-[0.5px] outline-slate-200"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
