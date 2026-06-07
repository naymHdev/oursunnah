import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Noor — Islamic Lifestyle & Modest Fashion',
  description: 'Premium Islamic lifestyle brand offering modest fashion, prayer essentials, and home decor crafted with intention and elegance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400:1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <body>
        {children}
      </body>
    </html>
  );
}
