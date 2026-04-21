import { Input } from "@/components/ui/input";

export default function SupplierFilters() {
  return (
    <div className="p-4 grid gap-4 text-sm">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Search</div>
        <Input placeholder="Search supplier..." />
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1">Status</div>
        <div className="grid gap-2">
          <div>All</div>
          <div>Active</div>
          <div>Blacklisted</div>
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1">Category</div>
        <div className="grid gap-2">
          <div>Dairy</div>
          <div>Snacks</div>
          <div>Cleaning</div>
        </div>
      </div>
    </div>
  );
}
