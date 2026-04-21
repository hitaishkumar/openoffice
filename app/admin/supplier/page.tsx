"use client";

import SupplierFilters from "@/components/supplier/SupplierFilters";
import SupplierKPIs from "@/components/supplier/SupplierKPIs";
import SupplierTable from "@/components/supplier/SupplierTable";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="h-full w-full flex flex-col">
      {/* HEADER */}
      <div className="border-b p-4 flex justify-between">
        <div className="text-lg font-semibold">Suppliers</div>

        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Add Supplier</Button>
        </div>
      </div>

      {/* KPI */}
      <SupplierKPIs />

      {/* BODY */}
      <div className="grid grid-cols-6 flex-1">
        <div className="col-span-1 border-r">
          <SupplierFilters />
        </div>

        <div className="col-span-4 p-4">
          <SupplierTable />
        </div>
      </div>
    </div>
  );
}
