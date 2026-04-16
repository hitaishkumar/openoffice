import { ApiResponse } from "@/app/types/api";
import { useEffect, useState } from "react";
// types/ui.ts
export interface UsageSummaryStats {
  totalItems: number;
  totalCategories: number;
  outOfStock: number;
  lowStock: number;
  expiringSoon: number;
}
export const transformSummaryData = (
  response: ApiResponse<any>,
): UsageSummaryStats => {
  // Map raw API fields to clean UI fields
  return {
    totalItems: Number(response.data?.total_items) || 0,
    totalCategories: Number(response.data?.total_categories) || 0,
    outOfStock: Number(response.data?.out_of_stock) || 0,
    lowStock: Number(response.data?.low_stock) || 0,
    expiringSoon: Number(response.data?.expiring_soon) || 0,
  };
};

const UsageSummary = () => {
  const [stats, setStats] = useState<UsageSummaryStats | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/pantry/summary");
        const json: ApiResponse<any> = await res.json();

        if (json.success) {
          // Transform here!
          setStats(transformSummaryData(json));
          console.log(transformSummaryData(json));
        }
      } catch (err) {
        console.error("Mapping error:", err);
      }
    };
    loadData();
  }, []);

  if (!stats) return <div>Loading...</div>;
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="">
          <div className="text-muted-foreground text-xs">Total Items</div>
          <div className="text-2xl font-bold py-1">{stats.totalItems}</div>
          <div className="px-1 rounded-xl shadow-sm bg-blue-100/50 text-xs text-black-500/60">
            {stats.totalCategories} categories
          </div>
        </div>
        <div className="">
          <div className="text-muted-foreground text-xs">Out of Stock</div>
          <div className="text-2xl font-bold py-1">{stats.outOfStock}</div>
          <div className="px-1 rounded-xl shadow-sm bg-red-100/50 text-xs text-black-300/60">
            needs immediate restock
          </div>
        </div>
        <div className="">
          <div className="text-muted-foreground text-xs">Low Stock</div>
          <div className="text-2xl font-bold py-1">{stats.lowStock}</div>
          <div className="px-1 rounded-xl shadow-sm bg-amber-100/50 text-xs text-black-300/60">
            below reorder threshold
          </div>
        </div>
        <div className="">
          <div className="text-muted-foreground text-xs">Expiring Soon</div>
          <div className="text-2xl font-bold py-1">{stats.expiringSoon}</div>
          <div className="px-1 rounded-xl shadow-sm bg-amber-100/50 text-xs text-black-300/60">
            within 7 days
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageSummary;
