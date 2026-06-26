"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Settings" subtitle="Store Configuration" />
        <main className="p-6 max-w-2xl space-y-6">
          {/* Store Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Store Name" defaultValue="Our Sunnah" />
              <Input label="Support Email" type="email" defaultValue="support@oursunnah.com" />
              <Select>
                <SelectTrigger label="Currency">
                  <SelectValue placeholder="USD — US Dollar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD — US Dollar</SelectItem>
                  <SelectItem value="bdt">BDT — Bangladeshi Taka</SelectItem>
                  <SelectItem value="gbp">GBP — British Pound</SelectItem>
                  <SelectItem value="eur">EUR — Euro</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Payment Gateway */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Payment Gateway</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Stripe Public Key" placeholder="pk_live_..." />
              <Input label="Stripe Secret Key" type="password" placeholder="sk_live_..." />
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Free Shipping Threshold ($)" type="number" defaultValue="75" />
              <Input label="Default Shipping Rate ($)" type="number" defaultValue="12" />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button variant="gold">Save Changes</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
