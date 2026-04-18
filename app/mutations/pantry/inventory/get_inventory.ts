import { InventoryItem } from "@/components/pantry/types";
import { sleep } from "../categories/get_categories";

export async function getInventory(): Promise<InventoryItem[]> {
  const res = await fetch("/api/pantry/inventory");
  await sleep(5000); // 1 second delay
  const json: ApiResponse<InventoryItem[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to fetch inventory");
  }
  return json.data;
}
