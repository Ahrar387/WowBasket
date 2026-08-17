"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Star,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import type { ProductCard as PC } from "@/types";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: PC;
  priority?: boolean;
}) {
  const rating = product.rating ?? 0;
const {
  isWishlisted,
  toggleWishlist,
} = useWishlist();

const liked = isWishlisted(product.id);
  const [tracking, setTracking] = useState(false);

async function handleAffiliateClick() {
  if (tracking) return;

  const affiliateUrl = product.affiliate_url?.trim();

  if (!affiliateUrl) {
    alert("Affiliate link is not available for this product.");
    return;
  }

  let validUrl: URL;

  try {
    validUrl = new URL(affiliateUrl);

    if (!["http:", "https:"].includes(validUrl.protocol)) {
      throw new Error("Invalid URL protocol");
    }
  } catch {
    alert("This affiliate link is invalid.");
    return;
  }

  setTracking(true);

  try {
    await fetch("/api/track-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product.id,
        product_name: product.name,
        affiliate_store: product.affiliate_store,
      }),
    });
  } catch (err) {
    console.error("Click tracking failed:", err);
  }

  window.open(
    validUrl.toString(),
    "_blank",
    "noopener,noreferrer"
  );

  setTracking(false);
}

  const storeColor =
    product.affiliate_store === "Amazon"
      ? "bg-amber-50 text-amber-800 border border-amber-200"
      : "bg-blue-50 text-blue-800 border border-blue-200";

  return (
    <article className="card group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gray-50"
      >
<button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product.id);
  }}
  aria-label="Wishlist"
  className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:scale-110"
>
  <Heart
    className={cn(
      "h-5 w-5 transition-all",
      liked
        ? "fill-red-500 text-red-500"
        : "text-gray-500"
    )}
  />
</button>

        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {product.badge}
          </span>
        )}

      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">

        <span
          className={cn(
            "badge self-start text-xs",
            storeColor
          )}
        >
          {product.affiliate_store}
        </span>

        <div>

          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.brand}
          </p>

          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors hover:text-brand-600"
          >
            {product.name}
          </Link>

        </div>
                {product.rating && (
          <div className="flex items-center gap-1">

            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}

            <span className="ml-1 text-xs text-gray-500">
              {rating.toFixed(1)}

              {product.review_count
                ? ` (${product.review_count.toLocaleString("en-IN")})`
                : ""}
            </span>

          </div>
        )}

        <div className="mt-auto pt-3">

          <button
            onClick={handleAffiliateClick}
            disabled={tracking}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ExternalLink className="h-4 w-4" />

            {tracking
              ? "Opening..."
              : `View on ${product.affiliate_store}`}

          </button>

        </div>

      </div>

    </article>
  );
}
export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden rounded-2xl">

      <div className="skeleton aspect-square" />

      <div className="space-y-3 p-4">

        <div className="skeleton h-4 w-20 rounded-full" />

        <div className="space-y-2">

          <div className="skeleton h-3 w-24" />

          <div className="skeleton h-4 w-full" />

          <div className="skeleton h-4 w-3/4" />

        </div>

        <div className="skeleton h-3 w-24" />

        <div className="skeleton h-11 w-full rounded-xl" />

      </div>

    </div>
  );
}