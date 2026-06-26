import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Sunnah — Admin Dashboard",
  description: "Admin portal for Our Sunnah Islamic Commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
