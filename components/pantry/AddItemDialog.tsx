"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CirclePlus,
  Coffee,
  Cookie,
  Droplets,
  Milk,
  Package,
  Wrench,
} from "lucide-react";

export function AddPantryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Pantry Item</DialogTitle>
          <DialogDescription>
            Add a new item to pantry inventory.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <FieldGroup>
            {/* Item Name */}
            <Field>
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" placeholder="e.g. Biscuits" />
            </Field>

            {/* Category */}
            <Field>
              <Label>Category</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="beverages">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-muted-foreground" />
                        Beverages
                      </div>
                    </SelectItem>

                    <SelectItem value="snacks">
                      <div className="flex items-center gap-2">
                        <Cookie className="h-4 w-4 text-muted-foreground" />
                        Snacks
                      </div>
                    </SelectItem>

                    <SelectItem value="dairy">
                      <div className="flex items-center gap-2">
                        <Milk className="h-4 w-4 text-muted-foreground" />
                        Dairy
                      </div>
                    </SelectItem>

                    <SelectItem value="dry">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        Dry Goods
                      </div>
                    </SelectItem>

                    <SelectItem value="hygiene">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-muted-foreground" />
                        Hygiene
                      </div>
                    </SelectItem>

                    <SelectItem value="equipment">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        Equipment
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            {/* Grid Fields */}
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label htmlFor="stock">Current Stock</Label>
                <Input id="stock" type="number" placeholder="0" />
              </Field>

              <Field>
                <Label htmlFor="capacity">Max Capacity</Label>
                <Input id="capacity" type="number" placeholder="0" />
              </Field>

              <Field>
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" placeholder="e.g. pcs / kg" />
              </Field>

              <Field>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" type="date" />
              </Field>
            </div>

            {/* Supplier / Notes */}
            <Field>
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" placeholder="Optional" />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
