import { Card, CardContent } from "@/components/ui/card";

export default function SupplierKPIs() {
  const data = [
    { label: "Total Suppliers", value: "42" },
    { label: "Active", value: "36" },
    { label: "Blacklisted", value: "3" },
    { label: "Total Spend", value: "₹24.6L" },
    { label: "Pending Payments", value: "₹3.2L" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 p-4 border-b">
      {data.map((d) => (
        <Card key={d.label} className="rounded-none">
          <CardContent className="p-3 text-xs">
            <div className="text-muted-foreground">{d.label}</div>
            <div className="font-semibold">{d.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
