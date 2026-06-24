import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import ProductCard from "@/components/product/ProductCard";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import { Suspense } from "react";

interface Props { params: Promise<{ category: string }>; searchParams: Promise<{ sortBy?: string; page?: string }> }

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.id === category);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `Best ${cat.name} Deals`,
    description: `${cat.description}. Compare prices and find the best deals on ${cat.name}.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const sp = await searchParams;
  const cat = CATEGORIES.find(c => c.id === category);
  if (!cat) notFound();

  const page = parseInt(sp.page ?? "1");
  const sortBy = sp.sortBy ?? "newest";
  const result = await getProducts({ category, sortBy, page, pageSize: 12 });

  return (
    <div className="container-site py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-brand-500">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/categories" className="hover:text-brand-500">Categories</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-700 font-medium">{cat.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="text-5xl">{cat.icon}</div>
        <div>
          <h1 className="section-title">{cat.name}</h1>
          <p className="text-gray-500 mt-1">{cat.description} · {result.total.toLocaleString("en-IN")} products</p>
        </div>
      </div>

      <Suspense><FilterBar currentCategory={category} currentSort={sortBy} showCategoryFilter={false} /></Suspense>

      {result.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">{cat.icon}</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No products yet</h2>
          <p className="text-gray-500 mb-6">We&apos;re adding {cat.name} products soon. Check back later!</p>
          <Link href="/products" className="btn-primary">Browse All Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {result.data.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
        </div>
      )}

      <Suspense><Pagination page={result.page} totalPages={result.totalPages} onChange={() => {}} /></Suspense>
    </div>
  );
}
