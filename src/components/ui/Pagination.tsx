import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { page: number; totalPages: number; onChange: (p: number) => void; }

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }
  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="btn-secondary p-2 disabled:opacity-40" aria-label="Previous">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) => p === "..." ? (
        <span key={`e${i}`} className="px-3 py-2 text-sm text-gray-400">…</span>
      ) : (
        <button key={p} onClick={() => onChange(p as number)}
          className={cn("px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
            p === page ? "bg-brand-500 text-white shadow-sm" : "hover:bg-gray-100 text-gray-700")}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="btn-secondary p-2 disabled:opacity-40" aria-label="Next">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
