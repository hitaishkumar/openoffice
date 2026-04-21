"use client";

import { LIST_PANTRY_INVENTORY } from "@/app/constant/keys";
import { getInventory } from "@/app/mutations/pantry/inventory/get_inventory";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { EditItemDialog } from "./EditItemDialog";
import { LogItemConsumption } from "./LogItemConsumption";
import { InventoryItem } from "./types";

// Helper styles kept outside to prevent recreation on render
const getStatusStyle = (status: InventoryItem["status"]) =>
  status === "out"
    ? "bg-red-100 text-red-700"
    : status === "low"
      ? "bg-yellow-100 text-yellow-700"
      : status === "over"
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700";

const getBarColor = (status: InventoryItem["status"]) =>
  status === "out"
    ? "bg-red-500"
    : status === "low"
      ? "bg-yellow-500"
      : "bg-green-500";

export function InventoryTable() {
  const inventoryQuery = useQuery({
    queryKey: [LIST_PANTRY_INVENTORY],
    queryFn: getInventory,
    enabled: true,
    refetchInterval: 3000,
  });

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      { header: "Item", accessorKey: "item_name" },
      { header: "Category", accessorKey: "category_name" },
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
          const {
            current_quantity,
            max_capacity,
            percent,
            status,
            unit,
            min_threshold,
          } = row.original;

          return (
            <div className="space-y-1 pr-4">
              <div className="flex items-center justify-between text-xs">
                {/* Min (left) */}
                <span className="text-muted-foreground">
                  {min_threshold ?? "-"}
                </span>

                {/* Current (center - slightly bigger) */}
                <span className="text-xs font-extrabold">
                  {current_quantity} {unit}
                </span>

                {/* Max (right) */}
                <span className="text-muted-foreground">
                  {max_capacity ?? "-"}
                </span>
              </div>

              {/* Progress bar (unchanged) */}
              <div className="h-1.5 bg-muted-foreground rounded w-full">
                <div
                  className={`h-full ${getBarColor(status)}`}
                  style={{ width: `${percent > 100 ? 100 : percent}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        header: "Expiry",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={row.original.is_perishable ? "default" : "outline"}
            >
              {row.original.is_perishable
                ? (() => {
                    const created = new Date(row.original.created_at);
                    const expiry = new Date(
                      created.getTime() +
                        (row.original.shelf_life_days ?? 0) *
                          24 *
                          60 *
                          60 *
                          1000,
                    );

                    const now = new Date();
                    const diffMs = expiry.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                    if (diffDays < 0) return "Expired";
                    if (diffDays === 0) return "Expires today";

                    return `${diffDays}d left`;
                  })()
                : "No Expiry"}{" "}
            </Button>
          </div>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <EditItemDialog inventoryItem={row.original} />
            <LogItemConsumption inventoryItem={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: inventoryQuery.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (inventoryQuery.isLoading) return <div>Loading inventory...</div>;

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
