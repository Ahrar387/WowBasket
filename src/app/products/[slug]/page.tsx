import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Star, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getAllSlugs } from "@/lib/products";
import { formatPrice, formatDiscount, cn } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — Best Price`,
    description: product.description.slice(0, 155),
    openGraph: { title: product.name, description: product.description.slice(0, 155), images: [product.image] },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id, 4);
  const discount = formatDiscount(product.discount_percent);
  const rating = product.rating ?? 0;
  const storeColor = product.affiliate_store === "Amazon"
    ? "bg-amber-500 hover:bg-amber-600"
    : "bg-blue-600 hover:bg-blue-700";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { "@type": "Brand", name: product.brand },
    ...(product.rating && { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.review_count ?? 1, bestRating: 5 } }),
    offers: { "@type": "Offer", price: product.price, priceCurrency: "INR", availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: product.affiliate_url },
  };

  return (
    <div className="container-site py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link href="/products" className="hover:text-brand-500 transition-colors">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link href={`/categories/${product.category}`} className="hover:text-brand-500 transition-colors capitalize">{product.category}</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-gray-600 line-clamp-1">{product.name}</span>
      </nav>

      {/* Main product layout */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div className="card p-6 flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-md">
            <Image src={product.image} alt={product.name} fill
              className="object-contain" sizes="(max-width:1024px) 90vw, 45vw" priority />
            {product.badge && (
              <span className="absolute top-3 left-3 badge bg-brand-500 text-white text-sm px-3 py-1">{product.badge}</span>
            )}
            {discount && (
              <span className="absolute top-3 right-3 badge bg-green-500 text-white text-sm px-3 py-1">{discount}</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("badge text-xs", product.affiliate_store === "Amazon" ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-blue-50 text-blue-800 border border-blue-200")}>
                {product.affiliate_store}
              </span>
              <span className="text-sm text-gray-400 capitalize">{product.category}</span>
            </div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({length:5},(_,i) => (
                  <Star key={i} className={cn("h-5 w-5", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
                ))}
              </div>
              <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>
              {product.review_count && <span className="text-sm text-gray-400">({product.review_count.toLocaleString("en-IN")} reviews)</span>}
            </div>
          )}

          {/* Price */}
          <div className="card p-5 space-y-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.original_price)}</span>
              )}
              {discount && <span className="badge bg-green-100 text-green-700 text-sm px-3 py-1">{discount}</span>}
            </div>
            {product.original_price && product.original_price > product.price && (
              <p className="text-sm text-green-600 font-medium">
                You save {formatPrice(product.original_price - product.price)} on this deal
              </p>
            )}
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="space-y-3 pt-2">
            <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer sponsored"
              className={cn("flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all active:scale-95 shadow-lg", storeColor)}>
              <ExternalLink className="h-5 w-5" />
              Buy on {product.affiliate_store}
            </a>
            <p className="text-xs text-center text-gray-400">
              You will be redirected to {product.affiliate_store}. Prices may vary. *Affiliate link.
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card p-6 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
        <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {product.tags.map(tag => (
              <span key={tag} className="badge bg-gray-100 text-gray-600 px-3 py-1 text-sm">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="section-title mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/products" className="btn-ghost inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>
    </div>
  );
}
