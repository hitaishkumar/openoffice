type PantryCategory = {
  id: string;
  name: string;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCategories(): Promise<PantryCategory[]> {
  const res = await fetch("/api/pantry/categories");
  await sleep(5000); // 1 second delay
  const json: ApiResponse<PantryCategory[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to fetch categories");
  }

  return json.data;
}
