import { supabase } from "./supabase";
import type { Product, ProductCard, ProductFilters, PaginatedResponse } from "@/types";

const CARD_COLS = "id,name,slug,image,category,brand,price,original_price,discount_percent,rating,review_count,affiliate_url,affiliate_store,badge,in_stock,featured,trending";
const PAGE_SIZE = 12;

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<ProductCard>> {
  const { category, search, sortBy = "newest", page = 1, pageSize = PAGE_SIZE } = filters;

  let q = supabase.from("products").select(CARD_COLS, { count: "exact" }).eq("in_stock", true);

  if (category) q = q.eq("category", category);
  if (search)   q = q.or(`name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);

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
