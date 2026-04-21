import { Card, CardContent, CardHeader } from "@/components/ui/card";

const kpis = [
  { label: "Total Supplied", value: "12,480 units" },
  { label: "Total Orders", value: "184" },
  { label: "Total Paid", value: "₹8.4L" },
  { label: "Pending", value: "₹1.2L" },
  { label: "Avg Delivery", value: "1.8 days" },
];

export default function SupplierKPIs() {
  return (
    <div className="grid grid-cols-5 gap-4 p-4 border-b">
      {kpis.map((k) => (
        <Card key={k.label} className="rounded-none">
          <CardHeader className="">
            <div className="text-muted-foreground">{k.label}</div>
          </CardHeader>
          <CardContent className="px-4 text-xs">
            <div className="font-semibold">{k.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
