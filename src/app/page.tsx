import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ExternalLink, TrendingUp, Zap, Shield } from "lucide-react";
import { getFeaturedProducts, getTrendingProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { formatPrice, formatDiscount, cn } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";

export default async function HomePage() {
  const [featured, trending] = await Promise.all([getFeaturedProducts(8), getTrendingProducts(8)]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container-site py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 rounded-full px-4 py-1.5 text-sm font-medium text-brand-300 mb-6">
              <Zap className="h-3.5 w-3.5 fill-current" /> Updated daily with fresh deals
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-4">
              Best Deals Across<br />
              <span className="text-brand-400">Amazon & Flipkart</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Handpicked products, verified discounts, and price comparisons — all in one place. No ads, no spam.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary text-base px-6 py-3">
                Browse All Deals <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/categories" className="btn-secondary text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Shop by Category
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-400">
              {[["✅","Verified Deals"],["🔄","Updated Daily"],["💰","Best Prices"],["🚀","1000+ Products"]].map(([icon,label]) => (
                <div key={label} className="flex items-center gap-2"><span>{icon}</span><span>{label}</span></div>
              ))}
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
    </div>
  );
}
