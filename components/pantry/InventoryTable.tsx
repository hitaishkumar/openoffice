"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { LogItemConsumption } from "./LogItemConsumption";

export type Item = {
  name: string;
  category: string;
  status: "out" | "low" | "ok";
  stock: string;
  percent: number;
  capacity: string;
  expiry: string;
  consumed: string;
};

export function InventoryTable() {
  const data: Item[] = [
    {
      name: "Cheese slices",
      category: "Dairy",
      status: "out",
      stock: "0 / 30 pcs",
      percent: 0,
      capacity: "0%",
      expiry: "12 Apr 2026 (2d)",
      consumed: "18 pcs",
    },
    {
      name: "Sugar sachets",
      category: "Beverages",
      status: "low",
      stock: "6 / 200 pcs",
      percent: 3,
      capacity: "3%",
      expiry: "01 Jun 2027",
      consumed: "120 pcs",
    },
    {
      name: "Cornflakes",
      category: "Dry goods",
      status: "low",
      stock: "1 / 8 kg",
      percent: 13,
      capacity: "13%",
      expiry: "30 Jun 2026",
      consumed: "4 kg",
    },
    {
      name: "Tissue boxes",
      category: "Hygiene",
      status: "low",
      stock: "3 / 20 boxes",
      percent: 15,
      capacity: "15%",
      expiry: "—",
      consumed: "12 boxes",
    },
    {
      name: "Instant coffee",
      category: "Beverages",
      status: "low",
      stock: "12 / 60 pcs",
      percent: 20,
      capacity: "20%",
      expiry: "01 Nov 2026",
      consumed: "38 pcs",
    },
    {
      name: "Milk (UHT 1L)",
      category: "Dairy",
      status: "low",
      stock: "4 / 20 L",
      percent: 20,
      capacity: "20%",
      expiry: "18 Apr 2026 (8d)",
      consumed: "22 L",
    },
    {
      name: "Poha",
      category: "Dry goods",
      status: "low",
      stock: "2 / 10 kg",
      percent: 20,
      capacity: "20%",
      expiry: "01 Dec 2026",
      consumed: "5 kg",
    },
    {
      name: "Hand sanitiser",
      category: "Hygiene",
      status: "low",
      stock: "2 / 10 btl",
      percent: 20,
      capacity: "20%",
      expiry: "01 Aug 2026",
      consumed: "6 btl",
    },
    {
      name: "Namkeen mix",
      category: "Snacks",
      status: "ok",
      stock: "8 / 30 packs",
      percent: 27,
      capacity: "27%",
      expiry: "20 May 2026",
      consumed: "14 packs",
    },
  ];

  const getStatusStyle = (status: Item["status"]) => {
    if (status === "out") return "bg-red-100 text-red-700";
    if (status === "low") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getBarColor = (status: Item["status"]) => {
    if (status === "out") return "bg-red-500";
    if (status === "low") return "bg-yellow-500";
    return "bg-green-500";
  };

  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        header: "Item",
        accessorKey: "name",
      },
      {
        header: "Category",
        accessorKey: "category",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const status = getValue<Item["status"]>();
          return (
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                status,
              )}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        header: "Stock",
        accessorKey: "stock",
        cell: ({ row }) => {
          const percent = row.original.percent;
          const status = row.original.status;

          return (
            <div className="space-y-1">
              <div className="text-xs font-medium">{row.original.stock}</div>

              <div className="h-1.5 bg-muted rounded">
                <div
                  className={`h-full ${getBarColor(status)}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        header: "Capacity",
        accessorKey: "capacity",
      },
      {
        header: "Expiry",
        accessorKey: "expiry",
      },
      {
        header: "Consumed/mo",
        accessorKey: "consumed",
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Edit
              </Button>

              {/* ✅ PASS DATA HERE */}
              <LogItemConsumption item={item} />
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="p-2 text-left font-medium">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t hover:bg-muted/50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
