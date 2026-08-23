import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabaseServer } from "@/lib/supabase-server";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabaseServer
    .from("seo_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return {
    metadataBase: new URL("https://wowbasket.in"),

    title: {
      default: data?.site_title || "WOW BASKET",
      template: `%s | ${data?.site_title || "WOW BASKET"}`,
    },

    description:
      data?.meta_description ||
      "Discover the best online shopping deals across India's top stores.",

    keywords: data?.meta_keywords
      ? data.meta_keywords.split(",")
      : [],

    authors: [
      {
        name: data?.site_title || "WOW BASKET",
      },
    ],

    creator: data?.site_title || "WOW BASKET",

    publisher: data?.site_title || "WOW BASKET",

    robots: {
      index: true,
      follow: true,
    },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },

    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: data?.site_title || "WOW BASKET",
      title: data?.site_title || "WOW BASKET",
      description:
        data?.meta_description ||
        "Discover the best online shopping deals.",
      url: "https://wowbasket.in",

      images: data?.og_image
        ? [
            {
              url: data.og_image,
              width: 1200,
              height: 630,
              alt: data?.site_title || "WOW BASKET",
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: data?.site_title || "WOW BASKET",
      description:
        data?.meta_description ||
        "Discover the best online shopping deals.",
      images: data?.og_image ? [data.og_image] : [],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <WishlistProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </WishlistProvider>
      </body>
    </html>
  );
}