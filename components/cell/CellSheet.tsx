"use client";

import { FloorCellNode } from "@/app/api/floorplan/route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  cell: FloorCellNode;
};

export function CellDetailsSheet({ cell }: Props) {
  const { register, handleSubmit, setValue, watch } = useForm<FloorCellNode>({
    defaultValues: cell, // ✅ use actual cell
  });

  const onSubmit = (data: FloorCellNode) => {
    console.log("Form Submit:", data);
  };

  const isBookable = watch("is_bookable");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="secondary" className="w-full">
          <Edit2 />
          Edit
        </Button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Cell Details</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {/* Cell Type */}
              <div className="space-y-2">
                <Label>Cell Type</Label>
                <Input {...register("cell_type")} />
              </div>

              {/* Cell ID */}
              <div className="space-y-2">
                <Label>Cell ID</Label>
                <Input {...register("floor_cell_id")} disabled />
              </div>

              {/* Row / Column */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Row</Label>
                  <Input type="number" {...register("row_num")} />
                </div>

                <div className="space-y-2">
                  <Label>Column</Label>
                  <Input type="number" {...register("col_num")} />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input type="number" {...register("capacity")} />
              </div>

              {/* Bookable */}
              <div className="flex items-center justify-between">
                <Label>Bookable</Label>
                <Switch
                  checked={!!isBookable}
                  onCheckedChange={(val) => setValue("is_bookable", val)}
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </form>
      </SheetContent>
    </Sheet>
  );
}
