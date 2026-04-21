import { Supplier } from "@/app/api/supplier/list/route";
import { ApiResponse } from "@/app/types/api";
import { sleep } from "../../pantry/categories/get_categories";

export async function listSuppliers(): Promise<Supplier[]> {
  const res = await fetch("/api/supplier/list");
  await sleep(1000); // 1 second delay
  const json: ApiResponse<Supplier[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to fetch pantry list");
  }

  return json.data;
}
