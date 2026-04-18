"use client";

import { Supplier } from "@/app/api/supplier/list/route";
import { LIST_SUPPLIERS } from "@/app/constant/keys";
import { listSuppliers } from "@/app/mutations/supplier/list/list_suppliers";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

// const supplierQuery = useQuery()

// const data = Array.from({ length: 20 }).map((_, i) => ({
//   name: `Supplier ${i + 1}`,
//   category: i % 2 === 0 ? "Dairy" : "Snacks",
//   reliability: `${80 + (i % 20)}%`,
//   spend: `${(i + 5) * 10000}`,
//   pending: `${(i % 5) * 2000}`,
//   status: i % 7 === 0 ? "blacklisted" : "active",
// }));

export default function SupplierTable() {
  const supplierQuery = useQuery({
    queryKey: [LIST_SUPPLIERS],
    queryFn: listSuppliers,
    enabled: true,
    refetchInterval: 3000,
  });
  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "supplier_name",
      },
      {
        header: "City",
        accessorKey: "city",
      },
      {
        header: "Type",
        accessorKey: "business_type",
      },
      {
        header: "Lead Time",
        cell: ({ row }) => <div>{row.original.lead_time_days ?? "-"} days</div>,
      },
      {
        header: "Payment",
        accessorKey: "payment_terms",
      },
      {
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              row.original.is_active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.original.is_active ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              View
            </Button>
            <Button size="sm">Edit</Button>
          </div>
        ),
      },
    ],
    [],
  );
  const table = useReactTable({
    data: supplierQuery.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-none">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="p-2 text-left">
                  {flexRender(h.column.columnDef.header, h.getContext())}
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
