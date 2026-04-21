"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditSupplierSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit Supplier</Button>
      </SheetTrigger>

      <SheetContent className="min-w-5/6 min-h-screen">
        <div className="flex flex-row justify-end gap-2 pt-12 pr-4">
          <Button variant="outline">Cancel</Button>

          <Button>Save</Button>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2 px-4">
          {/* BASIC */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
              {/* full width */}
              <div className="col-span-2 grid gap-2">
                <Label>Supplier Name</Label>
                <Input
                  className="rounded-none"
                  defaultValue="FreshFarm Supplies Pvt Ltd"
                />
              </div>

              <div className="grid gap-2">
                <Label>Supplier Code</Label>
                <Input className="rounded-none" defaultValue="SUP-01923" />
              </div>

              <div className="grid gap-2">
                <Label>GST Number</Label>
                <Input className="rounded-none" />
              </div>

              <div className="grid gap-2">
                <Label>PAN</Label>
                <Input className="rounded-none" />
              </div>

              {/* full width */}
              <div className="col-span-2 grid gap-2">
                <Label>Description</Label>
                <Textarea className="rounded-none" />
              </div>
            </CardContent>
          </Card>

          {/* CONTACT */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2 grid gap-2">
                <Label>Contact Name</Label>
                <Input className="rounded-none" />
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input className="rounded-none" />
              </div>

              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input className="rounded-none" />
              </div>
            </CardContent>
          </Card>

          {/* ADDRESS */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2 grid gap-2">
                <Label>Street</Label>
                <Input className="rounded-none" />
              </div>

              <div className="grid gap-2">
                <Label>City</Label>
                <Input className="rounded-none" />
              </div>

              <div className="grid gap-2">
                <Label>State</Label>
                <Input className="rounded-none" />
              </div>

              <div className="grid gap-2">
                <Label>Pincode</Label>
                <Input className="rounded-none" />
              </div>

              <div className="grid gap-2">
                <Label>Country</Label>
                <Input className="rounded-none" />
              </div>
            </CardContent>
          </Card>

          {/* FINANCE */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Bank Name</Label>
                <Input className="rounded-none" />
              </div>

              <div className="col-span-1 grid gap-2">
                <Label>Account Number</Label>
                <Input className="rounded-none" />
              </div>
              <div className=" col-span-1 grid gap-2">
                <Label>IFSC</Label>
                <Input className="rounded-none" />
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
