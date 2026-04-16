"use client";

import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { LogItemConsumption } from "./LogItemConsumption";

export interface Item {
  name: string;
  category: string;
  status: "out" | "low" | "ok" | "over";
  current_quantity: number;
  max_capacity: number;
  percent: number;
  expiry?: string; // Added from your original requirements
  consumed?: string; // Added from your original requirements
  unit: string;
}
// Helper styles kept outside to prevent recreation on render
const getStatusStyle = (status: Item["status"]) =>
  status === "out"
    ? "bg-red-100 text-red-700"
    : status === "low"
      ? "bg-yellow-100 text-yellow-700"
      : status === "over"
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700";

const getBarColor = (status: Item["status"]) =>
  status === "out"
    ? "bg-red-500"
    : status === "low"
      ? "bg-yellow-500"
      : "bg-green-500";

export function InventoryTable() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pantry/inventory")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        console.log(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      { header: "Item", accessorKey: "name" },
      { header: "Category", accessorKey: "category" },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const { percent, status } = row.original;
          const evalStatus = percent > 100 ? "over" : status;
          return (
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(evalStatus)}`}
            >
              {percent > 100 ? "over" : status}
            </span>
          );
        },
      },
      {
        header: "Stock",
        cell: ({ row }) => {
          const { current_quantity, max_capacity, percent, status, unit } =
            row.original;
          return (
            <div className="space-y-1">
              <div className="text-xs font-medium">
                {current_quantity} / {max_capacity} {unit}
              </div>
              <div className="h-1.5 bg-muted rounded w-24">
                <div
                  className={`h-full ${getBarColor(status)}`}
                  style={{ width: `${percent > 100 ? 100 : percent}%` }}
                />
              </div>
            </div>
          );
        },
      },
      { header: "Quota", accessorKey: "max_capacity" },
      { header: "Expiry", accessorKey: "expiry" },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
            <LogItemConsumption item={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <div>Loading inventory...</div>;

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
