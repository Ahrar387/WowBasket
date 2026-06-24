export type Category = "mobiles"|"laptops"|"electronics"|"fashion"|"home"|"beauty"|"books"|"accessories";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: Category;
  brand: string;
  price: number;
  original_price: number | null;
  discount_percent: number | null;
  rating: number | null;
  review_count: number | null;
  affiliate_url: string;
  affiliate_store: string;
  badge: string | null;
  features: string[] | null;
  tags: string[] | null;
  in_stock: boolean;
  featured: boolean;
  trending: boolean;
  created_at: string;
}

export type ProductCard = Pick<Product,
  "id"|"name"|"slug"|"image"|"category"|"brand"|"price"|"original_price"|
  "discount_percent"|"rating"|"review_count"|"affiliate_url"|"affiliate_store"|
  "badge"|"in_stock"|"featured"|"trending"
>;

export interface CategoryMeta {
  id: Category;
  name: string;
  icon: string;
  description: string;
  count?: number;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
