import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AnalyticsSalesChart,
  AnalyticsTopProducts,
  AnalyticsCategoryChart,
} from "./analytics-sales-chart";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Analytics" subtitle="Revenue and Performance Insights" />
        <main className="p-6 space-y-6">
          {/* Sales Over Time */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-xl">Sales Over Time</CardTitle>
                  <p className="text-xs uppercase tracking-widest text-brand-stone font-sans mt-0.5">
                    Revenue trend across the selected period
                  </p>
                </div>
                <span className="text-xs uppercase tracking-widest text-brand-stone font-sans border border-brand-beige-dark rounded-md px-3 py-1.5">
                  Smooth Area
                </span>
              </div>
            </CardHeader>
            <CardContent className="h-56">
              <AnalyticsSalesChart />
            </CardContent>
          </Card>

          {/* Bottom charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Top 5 Products</CardTitle>
                <p className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                  Best performing items by revenue
                </p>
              </CardHeader>
              <CardContent>
                <AnalyticsTopProducts />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Category Performance</CardTitle>
                <p className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                  Revenue share by category
                </p>
              </CardHeader>
              <CardContent>
                <AnalyticsCategoryChart />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
