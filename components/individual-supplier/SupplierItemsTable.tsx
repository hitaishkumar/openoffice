// FILE: components/supplier/SupplierItemsTable.tsx
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Button } from "../ui/button";

const data = [
  {
    item_name: "Milk",
    category: "Dairy",
    supplied: 1200,
    price: 40,
    last: "12 Mar",
    status: "ok",
  },
];

export default function SupplierItemsTable() {
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { header: "Item", accessorKey: "item_name" },
      { header: "Category", accessorKey: "category" },
      { header: "Supplied", accessorKey: "supplied" },
      { header: "Price", accessorKey: "price" },
      { header: "Last", accessorKey: "last" },
      {
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
            <Button size="sm">Order</Button>
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

  return (
    <div className="border rounded-none">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          {table.getHeaderGroups().map((h) => (
            <tr key={h.id}>
              {h.headers.map((header) => (
                <th key={header.id} className="p-2 text-left">
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
            <tr key={row.id} className="border-t">
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
