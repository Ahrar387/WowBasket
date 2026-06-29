import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";

export const metadata: Metadata = {
  title: "All Products — Best Deals",
  description: "Browse all curated products with the best deals from Amazon and Flipkart.",
};

interface Props {
  searchParams: Promise<{
    category?: string;
    sortBy?: string;
    page?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const sortBy = sp.sortBy ?? "newest";
  const category = sp.category;
  const search = sp.search;

  const result = await getProducts({
    category,
    sortBy,
    page,
    search,
    pageSize: 12,
  });

  return (
    <div className="container-site py-8 space-y-6">
      <div>
        <h1 className="section-title">
          {category
            ? `${category.charAt(0).toUpperCase()}${category.slice(1)}`
            : "All Products"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {result.total.toLocaleString("en-IN")} products found
        </p>
      </div>

      <Suspense>
        <FilterBar
          currentCategory={category}
          currentSort={sortBy}
        />
      </Suspense>

      {result.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No products found
          </h2>
          <p className="text-gray-500">
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {result.data.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              priority={i < 4}
            />
          ))}
        </div>
      )}

      <Suspense>
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
        />
      </Suspense>
    </div>
  );
}
