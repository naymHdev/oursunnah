import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { OverviewChart } from "./overview-chart";

const stats = [
  { label: "Total Revenue", value: "$48,320", change: "+12%", up: true },
  { label: "Orders Today", value: "34", change: "+8%", up: true },
  { label: "Active Products", value: "218", change: "+5%", up: true },
  { label: "New Users", value: "91", change: "+14%", up: true },
];

const recentOrders = [
  { id: "#OS-1042", customer: "Amina Rahman", total: "$128.00", status: "delivered" },
  { id: "#OS-1043", customer: "Yusuf Khan", total: "$84.50", status: "pending" },
  { id: "#OS-1044", customer: "Fatima Noor", total: "$212.90", status: "processing" },
  { id: "#OS-1045", customer: "Omar Ali", total: "$56.00", status: "delivered" },
];

const lowStock = [
  { name: "Prayer Mat - Olive", desc: "Premium woven collection", left: 8 },
  { name: "Miswak Pack", desc: "Natural oral care", left: 12 },
  { name: "Attar - Oud Blend", desc: "Signature fragrance", left: 5 },
  { name: "Tasbih Beads", desc: "Handcrafted wood", left: 9 },
];

const statusVariantMap: Record<string, "delivered" | "pending" | "processing"> = {
  delivered: "delivered",
  pending: "pending",
  processing: "processing",
};

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Overview" subtitle="Dashboard Summary" />
        <main className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs uppercase tracking-widest text-brand-stone font-sans font-medium">
                      {stat.label}
                    </CardTitle>
                    <span className="flex items-center gap-0.5 text-xs text-brand-emerald-pale font-sans">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-serif text-3xl text-brand-charcoal">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl">Weekly Sales</CardTitle>
                <span className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                  Last 7 Days
                </span>
              </div>
            </CardHeader>
            <CardContent className="h-52">
              <OverviewChart />
            </CardContent>
          </Card>

          {/* Recent Orders + Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle>Recent Orders</CardTitle>
                  <span className="text-[10px] uppercase tracking-widest text-brand-stone font-sans">
                    Latest Activity
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-sans text-xs text-brand-stone">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.customer}</TableCell>
                        <TableCell className="text-brand-gold font-medium">{order.total}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariantMap[order.status]}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Low Stock */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <span className="text-[10px] uppercase tracking-widest text-brand-stone font-sans">
                    Restock Soon
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {lowStock.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-brand-cream border border-brand-beige-dark"
                  >
                    <div>
                      <p className="text-sm font-medium text-brand-charcoal font-sans">{item.name}</p>
                      <p className="text-xs text-brand-stone font-sans">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium font-sans">{item.left} left</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
