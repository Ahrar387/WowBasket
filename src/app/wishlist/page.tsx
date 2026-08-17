"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import type { ProductCard as Product } from "@/types";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getProducts({
        pageSize: 500,
      });

      setProducts(
        res.data.filter((p) =>
          wishlist.includes(p.id)
        )
      );
    }

    load();
  }, [wishlist]);

  return (
    <div className="container-site py-8">

  <div className="mb-8 flex items-center justify-between">

  <div>
    <h1 className="section-title">
      ❤️ My Wishlist
    </h1>

    <p className="mt-2 text-sm text-gray-500">
      {products.length} Product
      {products.length !== 1 ? "s" : ""} Saved
    </p>
  </div>

  {products.length > 0 && (
    <button
      onClick={() => {
        localStorage.removeItem("wishlist");
        window.location.reload();
      }}
      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
    >
      Clear Wishlist
    </button>
  )}

</div>

     {products.length === 0 ? (
  <div className="card flex flex-col items-center justify-center p-12 text-center">

    <div className="mb-5 text-6xl">
      ❤️
    </div>

    <h2 className="mb-3 text-3xl font-bold">
      Your Wishlist is Empty
    </h2>

    <p className="mb-8 max-w-md text-gray-500">
      Save your favourite products here and compare them later before shopping.
    </p>

    <a
      href="/products"
      className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
      Browse Products
    </a>

  </div>
) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
            />
          ))}

        </div>
      )}

    </div>
  );
}