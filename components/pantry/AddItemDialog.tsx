"use client";
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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function AddPantryDialog() {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    unit: "",
    is_perishable: false,
    shelf_life_days: 0,
    default_min_threshold: 0,
    default_max_capacity: 0,
    initial_stock: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/pantry/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    // ... handle response
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Item</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-red-50/80">
        <DialogHeader>
          <DialogTitle>Add New Pantry Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Unit (pcs/kg/L)</Label>
              <Select defaultValue="banana">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position={"popper"}>
                  <SelectGroup>
                    <SelectItem value="banana">Piece</SelectItem>
                    <SelectItem value="grapes">ml</SelectItem>
                    <SelectItem value="pineapple">gm</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Stock</Label>
              <Input
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initial_stock: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Min Threshold</Label>
              <Input
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    default_min_threshold: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Max Capacity</Label>
              <Input
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    default_max_capacity: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <Label htmlFor="airplane-mode">Item is perishable</Label>
          <Switch
            id="airplane-mode"
            className="text-red-300 border-2"
            checked={formData.is_perishable}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_perishable: checked })
            }
          />

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="align-item">Align Item</FieldLabel>
              <FieldDescription>
                Toggle to align the item with the trigger.
              </FieldDescription>
            </FieldContent>
            <Switch id="align-item" />
          </Field>

          <DialogFooter>
            <Button type="submit">Create Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
