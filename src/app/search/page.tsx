import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";

interface Props {
  searchParams: Promise<{
    q?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: q ? `"${q}" — Search Results` : "Search Products",
    description: `Search results for "${q}" on TrendKart.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;

  const query = sp.q?.trim() ?? "";
  const page = parseInt(sp.page ?? "1");
  const sortBy = sp.sortBy ?? "newest";

  const result = query
    ? await getProducts({
        search: query,
        sortBy,
        page,
        pageSize: 12,
      })
    : {
        data: [],
        total: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0,
      };

  return (
    <div className="container-site py-8 space-y-6">
      <div>
        <h1 className="section-title">
          {query ? (
            <>
              Results for{" "}
              <span className="text-brand-500">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            "Search Products"
          )}
        </h1>

        {query && (
          <p className="text-sm text-gray-500 mt-1">
            {result.total.toLocaleString("en-IN")} products found
          </p>
        )}
      </div>

      {!query ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="h-16 w-16 text-gray-200 mb-4" />

          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Search for anything
          </h2>

          <p className="text-gray-400">
            Try &ldquo;iPhone&rdquo;, &ldquo;Sony headphones&rdquo;,
            &ldquo;Nike shoes&rdquo;…
          </p>
        </div>
      ) : result.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🔍</div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No results for &ldquo;{query}&rdquo;
          </h2>

          <p className="text-gray-500 mb-6">
            Try different keywords or browse by category.
          </p>

          <Link href="/categories" className="btn-primary">
            Browse Categories
          </Link>
        </div>
      ) : (
        <>
          <Suspense>
            <FilterBar
              currentSort={sortBy}
              showCategoryFilter={false}
            />
          </Suspense>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {result.data.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                priority={i < 4}
              />
            ))}
          </div>

          <Suspense>
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}
