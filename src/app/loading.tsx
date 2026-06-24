import { ProductCardSkeleton } from "@/components/product/ProductCard";
export default function Loading() {
  return (
    <div className="container-site py-8">
      <div className="skeleton h-8 w-48 mb-6 rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
