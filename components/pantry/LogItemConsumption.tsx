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
import { Badge } from "../ui/badge";
import { Item } from "./InventoryTable";

type Props = {
  item: Item;
};

const getBarColor = (status: Item["status"]) => {
  if (status === "out") return "bg-red-500";
  if (status === "low") return "bg-yellow-500";
  return "bg-green-500";
};
export function LogItemConsumption({ item }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const quantity = Number(form.get("quantity"));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Use</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Log Usage</DialogTitle>
          <DialogDescription>
            Record consumption for this item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {/* ✅ Read-only Item Info */}
            <Field>
              <Label>Item</Label>
              <div className="text-sm font-medium">{item.name}</div>
            </Field>

            <Field>
              <Label>Category</Label>
              <div className="text-sm text-muted-foreground">
                {item.category}
              </div>
            </Field>

            <Field>
              <Label className="flex justify-between">
                Available Stock
                <Badge variant={"destructive"}>OVER BOOKED</Badge>
              </Label>

              <div className="text-sm text-muted-foreground">
                {item.current_quantity}
              </div>
            </Field>
            <Field>
              <Label>Max Stock</Label>
              <div className="space-y-1">
                <div className="text-xs font-medium">{item.max_capacity}</div>

                <div className="h-1.5 bg-muted rounded">
                  <div
                    className={`h-full ${getBarColor(item.status)}`}
                    style={{
                      width: `${item.percent > 100 ? 100 : item.percent}%`,
                    }}
                  />
                </div>
              </div>
            </Field>

            {/* ✅ Only input needed */}
            <Field>
              <Label htmlFor="quantity">Consumption</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder={`Enter in ${item.unit}`}
                required
                min={1}
                max={item.max_capacity}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Log Usage</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
