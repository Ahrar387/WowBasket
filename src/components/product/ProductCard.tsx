import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { cn, formatPrice, formatDiscount } from "@/lib/utils";
import type { ProductCard as PC } from "@/types";

export default function ProductCard({ product, priority = false }: { product: PC; priority?: boolean }) {
  const discount = formatDiscount(product.discount_percent);
  const rating = product.rating ?? 0;
  const storeColor = product.affiliate_store === "Amazon"
    ? "bg-amber-50 text-amber-800 border border-amber-200"
    : "bg-blue-50 text-blue-800 border border-blue-200";

  return (
    <article className="card group flex flex-col overflow-hidden hover:shadow-card-hover transition-shadow duration-200">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        <Image src={product.image} alt={product.name} fill
          sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300" priority={priority} />
        {product.badge && (
          <span className="absolute top-2 left-2 badge bg-brand-500 text-white shadow-sm">{product.badge}</span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 badge bg-green-500 text-white shadow-sm">{discount}</span>
        )}
      </Link>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className={cn("badge self-start text-xs", storeColor)}>{product.affiliate_store}</span>
        <div>
          <p className="text-xs font-medium text-gray-400 mb-0.5 uppercase tracking-wide">{product.brand}</p>
          <Link href={`/products/${product.slug}`}
            className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-brand-600 transition-colors">
            {product.name}
          </Link>
        </div>
        {product.rating && (
          <div className="flex items-center gap-1">
            {Array.from({length:5},(_,i) => (
              <Star key={i} className={cn("h-3 w-3", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
            ))}
            <span className="text-xs text-gray-400 ml-0.5">{rating.toFixed(1)}{product.review_count ? ` (${product.review_count.toLocaleString("en-IN")})` : ""}</span>
          </div>
        )}
        <div className="flex items-baseline gap-2 flex-wrap mt-auto pt-1">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>
        <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer sponsored"
          className="btn-primary mt-1 w-full text-center"
          aria-label={`Buy ${product.name} on ${product.affiliate_store}`}>
          <ExternalLink className="h-4 w-4" /> Buy on {product.affiliate_store}
        </a>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="space-y-1.5"><div className="skeleton h-3 w-24" /><div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-3/4" /></div>
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-6 w-28" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
