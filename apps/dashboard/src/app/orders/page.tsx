"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";

const filters = ["All", "Pending", "Processing", "Shipped", "Delivered"];

const orders = [
  {
    id: "#OS-20481",
    customer: { name: "Sara Ahmed", email: "sara@example.com", initials: "SA" },
    date: "12 Jun 2026",
    items: 3,
    total: "$128.00",
    paymentStatus: "paid",
    orderStatus: "delivered",
    products: [
      { name: "Prayer Mat - Olive", qty: 1, price: "$48.00" },
      { name: "Attar Gift Set", qty: 1, price: "$36.00" },
      { name: "Tasbih Beads", qty: 1, price: "$44.00" },
    ],
    subtotal: "$128.00",
    shipping: "$12.00",
    totalWithShipping: "$140.00",
    paymentMethod: "Visa ending 4821",
    address: "12 Al Noor Street, Apt 4B, Brooklyn, NY 11201",
  },
  {
    id: "#OS-20482",
    customer: { name: "Musa Umar", email: "musa@example.com", initials: "MU" },
    date: "12 Jun 2026",
    items: 1,
    total: "$42.00",
    paymentStatus: "pending",
    orderStatus: "processing",
    products: [{ name: "Miswak Pack", qty: 2, price: "$42.00" }],
    subtotal: "$42.00",
    shipping: "$8.00",
    totalWithShipping: "$50.00",
    paymentMethod: "Cash on Delivery",
    address: "45 Sunnah Ave, Toronto, ON M5V 2H1",
  },
  {
    id: "#OS-20483",
    customer: { name: "Fatima Ali", email: "fatima@example.com", initials: "FA" },
    date: "11 Jun 2026",
    items: 5,
    total: "$214.00",
    paymentStatus: "paid",
    orderStatus: "shipped",
    products: [
      { name: "Abaya - Black", qty: 1, price: "$120.00" },
      { name: "Hijab Set", qty: 2, price: "$54.00" },
      { name: "Attar - Rose Oud", qty: 1, price: "$40.00" },
    ],
    subtotal: "$214.00",
    shipping: "$15.00",
    totalWithShipping: "$229.00",
    paymentMethod: "Mastercard ending 9234",
    address: "8 Islamic Center Rd, London, UK E1 6RF",
  },
];

type Order = typeof orders[0];

const paymentVariant: Record<string, "paid" | "unpaid"> = {
  paid: "paid",
  pending: "unpaid",
};

const orderVariant: Record<string, "delivered" | "processing" | "shipped" | "pending"> = {
  delivered: "delivered",
  processing: "processing",
  shipped: "shipped",
  pending: "pending",
};

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0]);

  const filtered = activeFilter === "All"
    ? orders
    : orders.filter((o) => o.orderStatus.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Orders" subtitle="Manage customer orders with refined clarity" />
        <main className="p-6">
          {/* Filters */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {filters.map((f) => (
              <Button
                key={f}
                variant={activeFilter === f ? "gold" : "secondary"}
                size="sm"
                onClick={() => setActiveFilter(f)}
                className="rounded-full"
              >
                {f}
              </Button>
            ))}
          </div>

          <div className="flex gap-5">
            {/* Orders Table */}
            <Card className={selectedOrder ? "flex-1 min-w-0" : "w-full"}>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((order) => (
                      <TableRow
                        key={order.id}
                        className={`cursor-pointer ${selectedOrder?.id === order.id ? "bg-brand-cream" : ""}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <TableCell className="text-xs text-brand-stone font-sans">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">{order.customer.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium font-sans">{order.customer.name}</p>
                              <p className="text-xs text-brand-stone font-sans">{order.customer.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-brand-stone font-sans">{order.date}</TableCell>
                        <TableCell className="text-center">{order.items}</TableCell>
                        <TableCell className="text-brand-gold font-medium">{order.total}</TableCell>
                        <TableCell>
                          <Badge variant={paymentVariant[order.paymentStatus] ?? "default"}>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={orderVariant[order.orderStatus] ?? "default"}>
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Order Detail Panel */}
            {selectedOrder && (
              <div className="w-80 shrink-0">
                <Card className="sticky top-20">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-serif text-xl text-brand-charcoal">Order Detail</h3>
                        <p className="text-xs text-brand-stone font-sans">{selectedOrder.id}</p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-brand-cream transition-colors"
                      >
                        <X className="h-4 w-4 text-brand-stone" />
                      </button>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-cream mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{selectedOrder.customer.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium font-sans">{selectedOrder.customer.name}</p>
                        <p className="text-xs text-brand-stone font-sans">{selectedOrder.customer.email}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <p className="text-xs uppercase tracking-widest text-brand-stone font-sans">Items</p>
                        <p className="text-xs text-brand-stone font-sans">{selectedOrder.items} products</p>
                      </div>
                      <div className="space-y-2">
                        {selectedOrder.products.map((p) => (
                          <div key={p.name} className="flex justify-between items-center">
                            <div>
                              <p className="text-xs font-medium font-sans">{p.name}</p>
                              <p className="text-xs text-brand-stone font-sans">Qty {p.qty}</p>
                            </div>
                            <p className="text-xs font-medium font-sans text-brand-gold">{p.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-brand-beige-dark pt-3 space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs font-sans">
                        <span className="text-brand-stone">Subtotal</span>
                        <span>{selectedOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-xs font-sans">
                        <span className="text-brand-stone">Shipping</span>
                        <span>{selectedOrder.shipping}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium font-sans border-t border-brand-beige-dark pt-2 mt-2">
                        <span>Total</span>
                        <span className="text-brand-gold">{selectedOrder.totalWithShipping}</span>
                      </div>
                    </div>

                    {/* Payment & Address */}
                    <div className="border-t border-brand-beige-dark pt-3 space-y-2">
                      <div className="flex justify-between text-xs font-sans">
                        <span className="text-brand-stone">Payment Method</span>
                        <span className="text-right">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-xs font-sans">
                        <span className="text-brand-stone shrink-0">Shipping Address</span>
                        <span className="text-right ml-4">{selectedOrder.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
