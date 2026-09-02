"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import type { ProductCard as Product } from "@/types";

const STORAGE_KEY = "wow_basket_recently_viewed";

export default function RecentlyViewed({
  currentProductId,
}: {
  currentProductId: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    let ids: string[] = [];

    if (stored) {
      try {
        ids = JSON.parse(stored);
      } catch {
        ids = [];
      }
    }

    const updatedIds = [
      currentProductId,
      ...ids.filter((id) => id !== currentProductId),
    ].slice(0, 10);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedIds)
    );

    async function loadRecentlyViewed() {
      try {
        const recentIds = updatedIds
          .filter((id) => id !== currentProductId)
          .slice(0, 8);

        if (recentIds.length === 0) return;

        const result = await getProducts({
          pageSize: 500,
        });

        const recent = recentIds
          .map((id) =>
            result.data.find(
              (product) => product.id === id
            )
          )
          .filter(Boolean) as Product[];

        setProducts(recent);
      } catch (error) {
        console.error(
          "Recently viewed error:",
          error
        );
      }
    }

    loadRecentlyViewed();
  }, [currentProductId]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="container-site mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="section-title">
            Recently Viewed
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Products you viewed recently
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-semibold text-brand-500 hover:text-brand-600"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="card group overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                {product.name}
              </p>

              <p className="mt-2 font-bold text-brand-600">
                ₹{Number(product.price ?? 0).toLocaleString("en-IN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}