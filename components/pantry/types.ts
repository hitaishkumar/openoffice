import { UUID } from "crypto";

export type FormValues = {
  name: string;
  unit: string;
  pantry_id: UUID;
  pantry_name: string;
  category_id: UUID;
  initial_stock: number;
  unit_cost: number;
  default_min_threshold: number;
  default_max_capacity: number;
  is_perishable: boolean;
  shelf_life_days?: number;
};

export type CreateItemResponse = {
  item_id: string;
};

export type UpdateFormValues = {
  name: string;
  unit: string;
  pantry_id: UUID;
  pantry_name: string;
  category_id: UUID;
  initial_stock: number;
  unit_cost: number;
  default_min_threshold: number;
  default_max_capacity: number;
  is_perishable: boolean;
  shelf_life_days?: number;
};

export type UpdateItemResponse = {
  item_id: string;
};

export interface InventoryItem {
  item_id: string;
  item_name: string;
  category_id: string;
  unit: string;
  price_per_unit: number;
  is_perishable: boolean;
  shelf_life_days: number | null;
  created_at: string;
  updated_at: string;

  category_name: string;

  pantry_id: string;
  pantry_name: string;

  current_quantity: number;
  max_capacity: number;
  min_threshold: number;

  status: "out" | "low" | "ok" | "over";
  percent: number;
}
