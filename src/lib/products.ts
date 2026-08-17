import { supabase } from "./supabase";
import type { Product, ProductCard, ProductFilters, PaginatedResponse } from "@/types";

const CARD_COLS = "id,name,slug,image,category,brand,price,original_price,discount_percent,rating,review_count,affiliate_url,affiliate_store,badge,in_stock,featured,trending";
const PAGE_SIZE = 12;

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<ProductCard>> {
  const { category, search, sortBy = "newest", page = 1, pageSize = PAGE_SIZE } = filters;
const minPrice = (filters as any).minPrice;
const maxPrice = (filters as any).maxPrice;
const brand = (filters as any).brand;
  let q = supabase.from("products").select(CARD_COLS, { count: "exact" }).eq("in_stock", true);

  if (category) q = q.eq("category", category);
  if (search)   q = q.or(`name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);
if (brand) q = q.eq("brand", brand);

if (minPrice) q = q.gte("price", Number(minPrice));

if (maxPrice) q = q.lte("price", Number(maxPrice));
  switch (sortBy) {
    case "price_asc":  q = q.order("price", { ascending: true });  break;
    case "price_desc": q = q.order("price", { ascending: false }); break;
    case "rating":     q = q.order("rating", { ascending: false }); break;
    case "discount":   q = q.order("discount_percent", { ascending: false }); break;
    default:           q = q.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  q = q.range(from, from + pageSize - 1);

  const { data, error, count } = await q;
  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as ProductCard[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (error) return null;
  return data as Product;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCard[]> {
  const { data } = await supabase.from("products").select(CARD_COLS)
    .eq("featured", true).eq("in_stock", true).order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as ProductCard[];
}

export async function getTrendingProducts(limit = 8): Promise<ProductCard[]> {
  const { data } = await supabase.from("products").select(CARD_COLS)
    .eq("trending", true).eq("in_stock", true).order("rating", { ascending: false }).limit(limit);
  return (data ?? []) as ProductCard[];
}

export async function getRelatedProducts(category: string, excludeId: string, limit = 4): Promise<ProductCard[]> {
  const { data } = await supabase.from("products").select(CARD_COLS)
    .eq("category", category).neq("id", excludeId).eq("in_stock", true)
    .order("rating", { ascending: false }).limit(limit);
  return (data ?? []) as ProductCard[];
}

export async function getAllSlugs(): Promise<string[]> {
  const { data } = await supabase.from("products").select("slug");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
export async function getMostClickedProducts(
  limit = 6
): Promise<ProductCard[]> {

  const { data: clicks } = await supabase
    .from("product_clicks")
    .select("product_id");

  if (!clicks || clicks.length === 0) {
    return [];
  }

  const counter = new Map<string, number>();

  clicks.forEach((c) => {
    counter.set(
      c.product_id,
      (counter.get(c.product_id) || 0) + 1
    );
  });

  const ids = Array.from(counter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map((x) => x[0]);

  const { data } = await supabase
    .from("products")
    .select(CARD_COLS)
    .in("id", ids);

  return (data ?? []) as ProductCard[];
}
export async function getMoreProducts(
  excludeId: string,
  limit = 12
): Promise<ProductCard[]> {

  const { data } = await supabase
    .from("products")
    .select(CARD_COLS)
    .neq("id", excludeId)
    .eq("in_stock", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as ProductCard[];
}
export async function getDashboardStats() {
  const { data: products } = await supabase
    .from("products")
    .select("affiliate_store,category,click_count,monthly_click_count");

  const totalProducts = products?.length ?? 0;

  const totalClicks = products?.reduce(
    (sum, p) => sum + (p.click_count ?? 0),
    0
  ) ?? 0;

  const monthlyClicks = products?.reduce(
    (sum, p) => sum + (p.monthly_click_count ?? 0),
    0
  ) ?? 0;

  const amazonClicks = products
    ?.filter((p) => p.affiliate_store === "Amazon")
    .reduce((sum, p) => sum + (p.click_count ?? 0), 0) ?? 0;

  const flipkartClicks = products
    ?.filter((p) => p.affiliate_store === "Flipkart")
    .reduce((sum, p) => sum + (p.click_count ?? 0), 0) ?? 0;

  return {
    totalProducts,
    totalClicks,
    monthlyClicks,
    amazonClicks,
    flipkartClicks,
  };
}
export async function getBestDeals(
  limit = 8
): Promise<ProductCard[]> {

  const { data } = await supabase
    .from("products")
    .select(CARD_COLS)
    .eq("in_stock", true)
    .order("discount_percent", {
      ascending: false,
    })
    .limit(limit);

  return (data ?? []) as ProductCard[];
}
export async function getTopMonthlyProducts(
  limit = 10
): Promise<ProductCard[]> {

  const { data } = await supabase
    .from("products")
    .select(CARD_COLS)
    .eq("in_stock", true)
    .order("monthly_click_count", {
      ascending: false,
    })
    .limit(limit);

  return (data ?? []) as ProductCard[];
}