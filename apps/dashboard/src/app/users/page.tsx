"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserCheck, Sparkles, Search, ChevronLeft, ChevronRight } from "lucide-react";

const stats = [
  { label: "Total Customers", value: "12,480", icon: Users },
  { label: "Active", value: "9,842", icon: UserCheck },
  { label: "New This Month", value: "428", icon: Sparkles },
];

const users = [
  { initials: "AH", name: "Amina Hassan", email: "amina.hassan@email.com", joined: "12 Jan 2025", orders: 24, status: "active" },
  { initials: "OM", name: "Omar Malik", email: "omar.malik@email.com", joined: "28 Dec 2024", orders: 18, status: "active" },
  { initials: "ZS", name: "Zainab Siddiq", email: "zainab.siddiq@email.com", joined: "03 Feb 2025", orders: 31, status: "inactive" },
  { initials: "FN", name: "Fatima Noor", email: "fatima.noor@email.com", joined: "19 Jan 2025", orders: 12, status: "active" },
  { initials: "IR", name: "Ibrahim Rahman", email: "ibrahim.rahman@email.com", joined: "07 Dec 2024", orders: 9, status: "inactive" },
  { initials: "SA", name: "Sara Ahmed", email: "sara.ahmed@email.com", joined: "22 Jan 2025", orders: 16, status: "active" },
  { initials: "YK", name: "Yusuf Khan", email: "yusuf.khan@email.com", joined: "11 Nov 2024", orders: 7, status: "inactive" },
  { initials: "LN", name: "Layla Nasser", email: "layla.nasser@email.com", joined: "05 Feb 2025", orders: 21, status: "active" },
];

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Users" subtitle="Customer Management for Our Sunnah" />
        <main className="p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label}>
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-brand-stone font-sans mb-1">{s.label}</p>
                      <p className="font-serif text-3xl text-brand-charcoal">{s.value}</p>
                    </div>
                    <Icon className="h-5 w-5 text-brand-gold" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search by name or email"
              leftIcon={<Search className="h-3.5 w-3.5" />}
              className="max-w-xs"
            />
            <Select>
              <SelectTrigger className="w-36 h-10">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <span className="ml-auto text-xs uppercase tracking-widest text-brand-stone font-sans">
              {users.length} Customers
            </span>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Order Count</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.email} className="cursor-pointer">
                      <TableCell className="pl-5">
                        <Avatar>
                          <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-brand-stone text-xs font-sans">{user.email}</TableCell>
                      <TableCell className="text-brand-stone text-xs font-sans">{user.joined}</TableCell>
                      <TableCell className="text-brand-gold font-medium text-center">{user.orders}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "active" : "inactive"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-brand-beige-dark">
                <p className="text-xs text-brand-stone font-sans">Showing 1 to 8 of 12,480 customers</p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {[1, 2, 3].map((p) => (
                    <Button
                      key={p}
                      variant={p === 1 ? "primary" : "ghost"}
                      size="icon"
                      className="h-8 w-8 rounded-full text-xs"
                    >
                      {p}
                    </Button>
                  ))}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
