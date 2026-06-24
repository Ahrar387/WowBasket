import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse products by category — mobiles, laptops, fashion, beauty, books and more.",
};

export default function CategoriesPage() {
  return (
    <div className="container-site py-10">
      <div className="mb-8">
        <h1 className="section-title">All Categories</h1>
        <p className="text-gray-500 mt-2">Find the best deals in every category</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => (
          <Link key={cat.id} href={`/categories/${cat.id}`}
            className="card p-6 flex flex-col items-center text-center hover:shadow-card-hover hover:border-brand-200 transition-all duration-200 group">
            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{cat.description}</p>
            <span className="text-xs font-semibold text-brand-500 flex items-center gap-1">
              Browse <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
