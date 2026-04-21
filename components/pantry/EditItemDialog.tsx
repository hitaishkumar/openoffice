"use client";
import { GET_CATEGORIES, LIST_PANTRIES } from "@/app/constant/keys";
import { fetchCategories } from "@/app/mutations/pantry/categories/get_categories";
import { callapi } from "@/app/types/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { listPantries } from "@/app/mutations/pantry/list/list_pantries";
import { Controller, useForm } from "react-hook-form";
import { InventoryItem, UpdateFormValues, UpdateItemResponse } from "./types";

type Props = {
  inventoryItem: InventoryItem;
};

export function EditItemDialog({ inventoryItem }: Props) {
  const { register, handleSubmit, control, watch } = useForm<UpdateFormValues>({
    defaultValues: {
      is_perishable: inventoryItem.is_perishable,
    },
  });
  const onSubmit = async (formData: UpdateFormValues) => {
    try {
      console.log("formData", formData);
      const data = await callapi<UpdateItemResponse>("/api/pantry/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      toast.success(`Item Added (ID: ${data.item_id})`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // Queries
  const { data, isFetching, refetch } = useQuery({
    queryKey: [GET_CATEGORIES],
    queryFn: fetchCategories,
    enabled: true,
    refetchInterval: 10000,
  });
  const listPantriesQuery = useQuery({
    queryKey: [LIST_PANTRIES],
    queryFn: listPantries,
    enabled: true,
    refetchInterval: 3000,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-xl rounded-sm bg-red-50/80">
        <DialogHeader>
          <DialogTitle>Edit Pantry Item</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 grid grid-cols-2 gap-2"
        >
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              {...register("name")}
              defaultValue={inventoryItem.item_name}
            />
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label>Unit</Label>
            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={inventoryItem.unit}
                  disabled
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="pcs">Piece</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="l">Litre</SelectItem>
                    <SelectItem value="gm">gm</SelectItem>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Category + Refresh */}
          <div className="space-y-2">
            <Label>Category</Label>

            <div className="flex gap-2">
              <Controller
                control={control}
                name="category_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={inventoryItem.category_id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent position="popper">
                      {data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {/* 🔥 Refresh + Submit */}
              <Button type="button" variant="outline" onClick={() => refetch()}>
                <RefreshCcw className={cn(isFetching && "animate-spin")} />
              </Button>
            </div>
          </div>

          {/* PANTRIES */}
          <div className="space-y-2">
            <Label>Pantry</Label>

            <div className="flex gap-2">
              <Controller
                control={control}
                name="pantry_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={inventoryItem.pantry_id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent position="popper">
                      {listPantriesQuery.data?.map((item) => (
                        <SelectItem key={item.pantry_id} value={item.pantry_id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {/* 🔥 Refresh + Submit */}
              <Button
                type="button"
                variant="outline"
                onClick={() => listPantriesQuery.refetch()}
              >
                <RefreshCcw
                  className={cn(listPantriesQuery.isFetching && "animate-spin")}
                />
              </Button>
            </div>
          </div>
          {/* Stock */}
          <div className="space-y-2">
            <Label>Stock</Label>
            <Input
              disabled
              type="number"
              defaultValue={inventoryItem.current_quantity}
              {...register("initial_stock", { valueAsNumber: true })}
            />
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label>Unit Cost</Label>
            <Input
              defaultValue={"₹" + inventoryItem.price_per_unit}
              type="text"
              disabled
            />
          </div>

          {/* Min Threshold */}
          <div className="space-y-2">
            <Label>Min Threshold</Label>
            <Input
              defaultValue={inventoryItem.min_threshold}
              type="number"
              {...register("default_min_threshold", { valueAsNumber: true })}
            />
          </div>

          {/* Max Capacity */}
          <div className="space-y-2">
            <Label>Max Capacity</Label>
            <Input
              defaultValue={inventoryItem.max_capacity}
              type="number"
              {...register("default_max_capacity", { valueAsNumber: true })}
            />
          </div>

          {/* Perishable */}
          <div className="flex items-center gap-4">
            <Label>Perishable</Label>

            <Controller
              control={control}
              name="is_perishable"
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onValueChange={(val) => field.onChange(val === "yes")}
                  className="flex gap-4"
                >
                  <div
                    className={`flex gap-2 items-center px-3 py-1.5 rounded-md border cursor-pointer transition
        ${field.value ? "bg-muted border-primary shadow-sm" : "border-border"}`}
                  >
                    <RadioGroupItem value="yes" id="perishable-yes" />
                    <Label htmlFor="perishable-yes" className="cursor-pointer">
                      Yes
                    </Label>
                  </div>

                  <div
                    className={`flex gap-2 items-center px-3 py-1.5 rounded-md border cursor-pointer transition
        ${!field.value ? "bg-muted border-primary shadow-sm" : "border-border"}`}
                  >
                    <RadioGroupItem value="no" id="perishable-no" />
                    <Label htmlFor="perishable-no" className="cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />

            {/* Shelf life */}
            <Input
              type="number"
              placeholder="Days"
              defaultValue={inventoryItem.shelf_life_days ?? 0}
              disabled={!watch("is_perishable")}
              {...register("shelf_life_days", { valueAsNumber: true })}
              className="w-20"
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              <PlusCircle /> Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
