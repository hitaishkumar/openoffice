// FILE: components/supplier/SupplierInsights.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupplierInsights() {
  return (
    <div className="space-y-4 p-4">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div>Reliability: 92%</div>
          <div>On-time: 87%</div>
          <div>Rejection: 2.1%</div>
          <div>Quality: 4.5/5</div>
        </CardContent>
      </Card>

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[40, 25, 20, 15].map((p, i) => (
            <div key={i} className="space-y-1">
              <div className="text-xs">Category {i + 1}</div>
              <div className="h-2 bg-muted rounded">
                <div className="h-full bg-primary" style={{ width: `${p}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Risk Flags</CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          <div>Late delivery (3x)</div>
          <div>Price increased 12%</div>
        </CardContent>
      </Card>
    </div>
  );
}
