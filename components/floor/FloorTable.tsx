"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
type CellType = string | null;
const floorMatrix: (string | null)[][] = [
  // Row 0 — North wall: Lifts + Staircase + WS banks facing north (A, B, C)
  [
    "LIFT",
    "LIFT",
    "STAIR",
    "A01",
    "A02",
    "A03",
    "A04",
    "A05",
    "A06",
    null,
    "A07",
    "A08",
    "A09",
    "A10",
    "A11",
    "A12",
    null,
    "B01",
    "B02",
    "B03",
    "B04",
    "B05",
    "B06",
    null,
    "C01",
    "C02",
    "C03",
    "C04",
    "C05",
    "C06",
  ],

  // Row 1 — Second WS row (north-facing), same three blocks
  [
    "LIFT",
    "LIFT",
    "STAIR",
    "A13",
    "A14",
    "A15",
    "A16",
    "A17",
    "A18",
    null,
    "A19",
    "A20",
    "A21",
    "A22",
    "A23",
    "A24",
    null,
    "B07",
    "B08",
    "B09",
    "B10",
    "B11",
    "B12",
    null,
    "C07",
    "C08",
    "C09",
    "C10",
    "C11",
    "C12",
  ],

  // Row 2 — 1.7m corridor (north side)
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],

  // Row 3 — Reception + 6S meeting rooms + locker banks (north mid)
  [
    "RECEP",
    "RECEP",
    "RECEP",
    "MR6",
    "MR6",
    "MR6",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    null,
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "MR6",
    "MR6",
    "MR6",
    "LOCKER",
    "LOCKER",
    "LOCKER",
  ],

  // Row 4 — 4S meeting rooms + locker banks (south face of mid zone)
  [
    "RECEP",
    "RECEP",
    "RECEP",
    "MR4",
    "MR4",
    "MR4",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    null,
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "MR4",
    "MR4",
    "MR4",
    "LOCKER",
    "LOCKER",
    "LOCKER",
  ],

  // Row 5 — 1.7m corridor (mid)
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],

  // Row 6 — WS banks facing south (A south, B south, C south)
  [
    null,
    null,
    null,
    "A25",
    "A26",
    "A27",
    "A28",
    "A29",
    "A30",
    null,
    "A31",
    "A32",
    "A33",
    "A34",
    "A35",
    "A36",
    null,
    "B13",
    "B14",
    "B15",
    "B16",
    "B17",
    "B18",
    null,
    "C13",
    "C14",
    "C15",
    "C16",
    "C17",
    "C18",
  ],

  // Row 7 — Second south-facing WS row
  [
    null,
    null,
    null,
    "A37",
    "A38",
    "A39",
    "A40",
    "A41",
    "A42",
    null,
    "A43",
    "A44",
    "A45",
    "A46",
    "A47",
    "A48",
    null,
    "B19",
    "B20",
    "B21",
    "B22",
    "B23",
    "B24",
    null,
    "C19",
    "C20",
    "C21",
    "C22",
    "C23",
    "C24",
  ],

  // Row 8 — Staircase (south) + 1.5m corridor
  [
    "STAIR",
    "STAIR",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],

  // Row 9 — Collab areas + Pantry + Lobby + Hub + Server room
  [
    "STAIR",
    "STAIR",
    null,
    "COLAB",
    "COLAB",
    "COLAB",
    "COLAB",
    "COLAB",
    "COLAB",
    null,
    "PANTRY",
    "PANTRY",
    "PANTRY",
    "LOBBY",
    "LOBBY",
    "LOBBY",
    "LOBBY",
    "LOBBY",
    "HUB",
    "HUB",
    "SERVER",
    "SERVER",
    null,
    "COLAB",
    "COLAB",
    "COLAB",
    "COLAB",
    "COLAB",
    "COLAB",
    null,
  ],

  // Row 10 — Collab + Telephone booths + Lobby secondary
  [
    null,
    null,
    null,
    "COLAB",
    "COLAB",
    "TELBOOTH",
    "TELBOOTH",
    null,
    null,
    null,
    "PANTRY",
    "PANTRY",
    "PANTRY",
    "LOBBY",
    "LOBBY",
    "LOBBY",
    "LOBBY",
    "LOBBY",
    "HUB",
    "HUB",
    "SERVER",
    "SERVER",
    null,
    "COLAB",
    "COLAB",
    "TELBOOTH",
    "TELBOOTH",
    null,
    null,
    null,
  ],

  // Row 11 — 1.5m corridor with ducts centre
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "DUCT",
    "DUCT",
    "DUCT",
    "DUCT",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],

  // Row 12 — WS block D (north-facing) + Cubicles (east end)
  [
    null,
    null,
    null,
    "D01",
    "D02",
    "D03",
    "D04",
    "D05",
    "D06",
    null,
    "D07",
    "D08",
    "D09",
    "D10",
    "D11",
    "D12",
    null,
    "D13",
    "D14",
    "D15",
    "D16",
    "D17",
    "D18",
    null,
    "CUBICLE",
    "CUBICLE",
    "CUBICLE",
    "CUBICLE",
    "CUBICLE",
    "CUBICLE",
  ],

  // Row 13 — WS block D row 2 + Cubicles
  [
    null,
    null,
    null,
    "D19",
    "D20",
    "D21",
    "D22",
    "D23",
    "D24",
    null,
    "D25",
    "D26",
    "D27",
    "D28",
    "D29",
    "D30",
    null,
    "D31",
    "D32",
    "D33",
    "D34",
    "D35",
    "D36",
    null,
    "CUBICLE",
    "CUBICLE",
    "CUBICLE",
    "CUBICLE",
    "CUBICLE",
    "CUBICLE",
  ],

  // Row 14 — 1.7m corridor (south zone)
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],

  // Row 15 — HAT workstations (1.8×0.6m, south wall) + Lockers + South MR6 + Toilets
  [
    null,
    null,
    null,
    "HAT01",
    "HAT02",
    "HAT03",
    "HAT04",
    "HAT05",
    "HAT06",
    "HAT07",
    "HAT08",
    "HAT09",
    "HAT10",
    "HAT11",
    "HAT12",
    "HAT13",
    null,
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    null,
    "MR6",
    "MR6",
    null,
    "TOILET-G",
    "TOILET-G",
    "TOILET-L",
  ],

  // Row 16 — Electrical panel + HAT workstations + Lockers + South MR4 + Toilets
  [
    "ELEC",
    "ELEC",
    null,
    "HAT14",
    "HAT15",
    "HAT16",
    "HAT17",
    "HAT18",
    "HAT19",
    "HAT20",
    "HAT21",
    "HAT22",
    "HAT23",
    "HAT24",
    "HAT25",
    null,
    null,
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    "LOCKER",
    null,
    "MR4",
    "MR4",
    null,
    "TOILET-G",
    "TOILET-G",
    "TOILET-L",
  ],

  // Row 17 — South wall: Storage + Planter strip + Toilets
  [
    "ELEC",
    "STORAGE",
    "STORAGE",
    "PLANTER",
    "PLANTER",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "PLANTER",
    "PLANTER",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "STORAGE",
    "PLANTER",
    "PLANTER",
    "STORAGE",
    "STORAGE",
    "TOILET-G",
    "TOILET-G",
    "TOILET-L",
  ],
];
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
export function FloorTable() {
  const cols = floorMatrix[0].length;

  // Convert matrix → table data

  const data = useMemo(() => {
    return floorMatrix.map((row) => {
      const obj: Record<string, CellType> = {};
      row.forEach((cell, i) => {
        obj[`col_${i}`] = cell;
      });
      return obj;
    });
  }, []);

  // Generate columns dynamically
  const columns = useMemo<ColumnDef<Record<string, CellType>>[]>(
    () =>
      Array.from({ length: cols }, (_, i) => ({
        accessorKey: `col_${i}`,
        cell: ({ getValue, row }) => {
          const seat = getValue<CellType>();
          const ri = row.index;

          if (!seat) {
            return <div className=" h-5" />;
          }

          return (
            <div
              key={`${ri}-${i}-${seat}`}
              className={`h-5 p-0 m-0 rounded-xs  flex items-center justify-center font-medium text-xs overflow-clip ${getCellStyle(
                seat,
              )}`}
              title={seat}
            >
              {seat.slice(0, 1) + "."}
            </div>
          );
        },
      })),
    [cols],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full h-fit overflow-auto pb-4">
      <div className="bg-border">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="flex">
            {row.getVisibleCells().map((cell) => (
              <div
                key={cell.id}
                className="flex-1 min-w-[25px] border hover:bg-red-400"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
