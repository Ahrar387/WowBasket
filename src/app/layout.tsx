import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "WOW BASKET — Discover Unique Finds",
    template: "%s | WOW BASKET",
  },
  description:
    "Discover unique products and the best deals at WOW BASKET.",
  keywords: ["wow basket", "shopping", "deals", "offers", "online shopping"],
  openGraph: {
    type: "website",
    siteName: "WOW BASKET",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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