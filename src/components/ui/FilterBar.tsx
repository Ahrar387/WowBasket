"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "discount",   label: "Best Discount" },
  { value: "rating",     label: "Top Rated" },
  { value: "price_asc",  label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
];

interface Props { currentCategory?: string; currentSort?: string; showCategoryFilter?: boolean; }

export default function FilterBar({ currentCategory, currentSort = "newest", showCategoryFilter = true }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    router.push(`?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />
      {showCategoryFilter && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => update("category", "")}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
              !currentCategory ? "bg-brand-500 text-white border-brand-500" : "bg-white border-gray-200 text-gray-600 hover:border-brand-300")}>
            All
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => update("category", cat.id)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                currentCategory === cat.id ? "bg-brand-500 text-white border-brand-500" : "bg-white border-gray-200 text-gray-600 hover:border-brand-300")}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      )}
      <select value={currentSort} onChange={e => update("sortBy", e.target.value)}
        className="ml-auto select text-sm py-1.5 h-9 w-auto pr-8">
        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
