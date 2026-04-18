"use client";
import SupplierFinance from "@/components/individual-supplier/SupplierFinance";
import SupplierHeader from "@/components/individual-supplier/SupplierHeader";
import SupplierInsights from "@/components/individual-supplier/SupplierInsights";
import SupplierItemsTable from "@/components/individual-supplier/SupplierItemsTable";
import SupplierKPIs from "@/components/individual-supplier/SupplierKPIs";

export default function Page() {
  return (
    <div className="h-full w-6xl border-r border-b ">
      <SupplierHeader />
      <SupplierKPIs />

      <div className="grid grid-cols-4  w-full">
        <div className="col-span-1 border-r border-b overflow-y-auto">
          <SupplierInsights />
        </div>

        <div className="col-span-2 overflow-y-auto p-4">
          <SupplierItemsTable />
        </div>

        <div className="col-span-1 border-l border-b overflow-y-auto">
          <SupplierFinance />
        </div>
      </div>
    </div>
  );
}
