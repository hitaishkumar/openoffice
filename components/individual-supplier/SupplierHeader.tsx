// FILE: components/supplier/SupplierHeader.tsx
import { Button } from "@/components/ui/button";
import EditSupplierSheet from "./EditSupplierSheet";

export default function SupplierHeader() {
  return (
    <div className="border-b w-full px-4 py-2 flex items-center justify-between">
      <div>
        <div className="text-xl font-semibold">FreshFarm Supplies Pvt Ltd</div>
        <div className="text-xs text-muted-foreground">
          SUP-01923 · Mumbai · Onboarded Jan 2024
        </div>
      </div>
      <div className="flex gap-2">
        <Button>New Order</Button>
        <EditSupplierSheet />
        <Button variant="destructive">Deactivate</Button>
      </div>
    </div>
  );
}
