import { ApiResponse } from "@/app/types/api";
import { sleep } from "../categories/get_categories";

type Pantry = {
  pantry_id: string;
  floor_cell_id: string;
  name: string;
  created_at: string;
};

export async function listPantries(): Promise<Pantry[]> {
  const res = await fetch("/api/pantry/list");
  await sleep(5000); // 1 second delay
  const json: ApiResponse<Pantry[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to fetch pantry list");
  }

  return json.data;
}
