import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: { default: "TrendKart — India's Curated Affiliate Marketplace", template: "%s | TrendKart" },
  description: "Discover the best deals across Amazon & Flipkart. Curated products, verified discounts, updated daily.",
  keywords: ["deals","offers","affiliate","amazon","flipkart","india","discount"],
  openGraph: { type: "website", siteName: "TrendKart", locale: "en_IN" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
