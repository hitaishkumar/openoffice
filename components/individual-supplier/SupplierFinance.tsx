// FILE: components/supplier/SupplierFinance.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupplierFinance() {
  return (
    <div className="p-4 space-y-4">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1 ">
          <div className="border-b">Total: ₹9.6L</div>
          <div className="border-b">Paid: ₹8.4L</div>
          <div className="border-b">Pending: ₹1.2L</div>
        </CardContent>
      </Card>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>

        <CardContent className="p-0 border-t">
          {/* HEADER */}
          <div className="grid grid-cols-3 px-4 py-2 text-[10px] text-muted-foreground border-b">
            <div>Amount</div>
            <div className="text-center">Date</div>
            <div className="text-right">Status</div>
          </div>

          {/* BODY */}
          <div className="max-h-[400px] overflow-y-auto text-xs">
            {Array.from({ length: 30 }).map((_, i) => {
              const paid = i % 3 !== 0;

              const tx = {
                date: `${12 - (i % 10)} Mar 2023`,
                amount: `${(20 + i) * 1000}`,
                status: paid ? "paid" : "pending",
                method: i % 2 === 0 ? "UPI" : "NEFT",
                by: i % 2 === 0 ? "A" : "B",
              };

              return (
                <div
                  key={i}
                  className="grid grid-cols-3 items-center px-4 py-2 border-b last:border-none hover:bg-muted/50 transition"
                >
                  {/* LEFT: Amount + meta */}
                  <div className="flex flex-col">
                    <span className="font-medium">
                      ₹{Number(tx.amount).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {tx.by} · {tx.method}
                    </span>
                  </div>

                  {/* CENTER: Date */}
                  <div className="text-center text-muted-foreground text-[10px]">
                    {tx.date}
                  </div>

                  {/* RIGHT: Status */}
                  <div className="flex justify-end">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        tx.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
