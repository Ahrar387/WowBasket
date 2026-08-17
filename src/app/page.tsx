export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ExternalLink, TrendingUp, Zap, Shield } from "lucide-react";
import {
  getFeaturedProducts,
  getTrendingProducts,
  getTopMonthlyProducts,
} from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { formatPrice, formatDiscount, cn } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";

import { supabaseServer } from "@/lib/supabase-server";

export default async function HomePage() {
const [
  featured,
  trending,
  topMonthly,
  homepage,
] = await Promise.all([
  getFeaturedProducts(8),
  getTrendingProducts(8),
  getTopMonthlyProducts(8),
  supabaseServer
    .from("homepage")
    .select("*")
    .limit(1)
    .maybeSingle(),
]);

const hero = homepage.data;

  return (
    <div className="space-y-16 pb-16">
     {/* Hero */}
<section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
  <div className="container-site py-16 sm:py-24">

    <div className="grid items-center gap-12 lg:grid-cols-2">

      {/* Left */}
      <div>

        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/20 px-4 py-1.5 text-sm font-medium text-brand-300 mb-6">
          <Zap className="h-3.5 w-3.5 fill-current" />
          Updated Daily
        </div>

        <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl">
          {hero?.hero_title || "Best Deals Across"}
        </h1>

        <p className="mb-8 text-lg text-gray-300">
          {hero?.hero_subtitle ||
            "Discover handpicked products at the best prices."}
        </p>

        <Link
          href={hero?.hero_button_link || "/products"}
          className="btn-primary px-8 py-3 text-base"
        >
          {hero?.hero_button_text || "Browse Products"}
        </Link>

      </div>

      {/* Right */}
      <div className="flex justify-center">

        {hero?.hero_image ? (

          <Image
            src={hero.hero_image}
            alt="Hero"
            width={600}
            height={600}
            priority
            className="rounded-2xl shadow-2xl"
          />

        ) : (

          <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 text-gray-400">
            Upload Hero Image
          </div>

        )}

      </div>

    </div>

  </div>
</section>

      {/* Categories */}
      <section className="container-site">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Shop by Category</h2>
          <Link href="/categories" className="text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1">
            All categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/categories/${cat.id}`}
              className="card flex flex-col items-center gap-2 p-3 sm:p-4 text-center hover:shadow-card-hover hover:border-brand-200 transition-all duration-200 group">
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-site">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-sm text-gray-500 mt-1">Handpicked by our editors</p>
            </div>
            <Link href="/products?featured=true" className="text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
          </div>
        </section>
      )}

      {/* Trust bar */}
      <section className="bg-brand-500">
        <div className="container-site py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-white text-center">
            {[
              ["🛡️","100% Verified","All links are checked and safe"],
              ["⚡","Daily Updates","Fresh deals every morning"],
              ["💰","Best Prices","We compare across stores"],
              ["🚚","Free Delivery","On qualifying orders"],
            ].map(([icon,title,desc]) => (
              <div key={title}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className="font-bold text-sm">{title}</div>
                <div className="text-xs text-brand-100 mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="container-site">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-5 w-5 text-brand-500" />
                <h2 className="section-title">Trending Now</h2>
              </div>
              <p className="text-sm text-gray-500">Most popular products this week</p>
            </div>
            <Link href="/products?trending=true" className="text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
      {/* Most Clicked This Month */}
{topMonthly.length > 0 && (
  <section className="container-site">
    <div className="flex items-center justify-between mb-6">

      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h2 className="section-title">
            Most Clicked This Month
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          Products customers are viewing the most
        </p>
      </div>

      <Link
        href="/products"
        className="text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1"
      >
        View all
        <ArrowRight className="h-4 w-4" />
      </Link>

    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

      {topMonthly.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
        />
      ))}

    </div>
  </section>
)}
    </div>
  );
}
