# TrendKart — Next.js 14 Affiliate Marketplace

A modern, SEO-friendly affiliate product website built with **Next.js 14**, **Tailwind CSS**, and **Supabase**.

---

## ⚡ Quick Start (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) → Create a new project (free tier works)
2. Go to **SQL Editor** → **New Query**
3. Paste the contents of `supabase/schema.sql` and click **Run**
4. This creates the table + inserts 12 sample products automatically

### 3. Add environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and fill in your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase: Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase: Settings → API → anon/public key

### 4. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Header + Footer)
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   ├── not-found.tsx           # 404 page
│   ├── loading.tsx             # Loading skeleton
│   ├── error.tsx               # Error boundary
│   ├── products/
│   │   ├── page.tsx            # Product listing (with filters + pagination)
│   │   └── [slug]/page.tsx     # Product detail page
│   ├── categories/
│   │   ├── page.tsx            # All categories grid
│   │   └── [category]/page.tsx # Category listing
│   └── search/
│       └── page.tsx            # Search results
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky header with search + nav
│   │   └── Footer.tsx          # Footer with links
│   ├── product/
│   │   └── ProductCard.tsx     # Product card + skeleton
│   └── ui/
│       ├── FilterBar.tsx       # Category + sort filters
│       └── Pagination.tsx      # Page navigation
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── products.ts             # All DB queries (data layer)
│   ├── categories.ts           # Category metadata
│   └── utils.ts                # formatPrice, cn, helpers
└── types/
    └── index.ts                # TypeScript types
```

---

## 🛠️ Adding Products

### Option A: Supabase Dashboard (Recommended)
1. Go to Supabase → **Table Editor** → `products`
2. Click **Insert row** and fill in the fields
3. The site updates automatically (no redeploy needed)

### Key fields to fill:
| Field | Example |
|-------|---------|
| `name` | "Samsung Galaxy S24" |
| `slug` | "samsung-galaxy-s24" ← must be unique, URL-friendly |
| `description` | Full product description |
| `image` | Direct image URL (Unsplash, Amazon CDN, etc.) |
| `category` | One of: mobiles, laptops, electronics, fashion, home, beauty, books, accessories |
| `brand` | "Samsung" |
| `price` | 79999 (in rupees, no decimals) |
| `original_price` | 99999 (for showing discount) |
| `discount_percent` | 20 |
| `affiliate_url` | Full Amazon/Flipkart URL |
| `affiliate_store` | "Amazon" or "Flipkart" |
| `featured` | true/false |
| `trending` | true/false |

### Option B: SQL Insert
```sql
INSERT INTO products (name, slug, description, image, category, brand, price, original_price, discount_percent, affiliate_url, affiliate_store, in_stock, featured, trending)
VALUES ('My Product', 'my-product', 'Description here', 'https://image-url.com/img.jpg', 'mobiles', 'Brand', 25000, 30000, 17, 'https://amazon.in/...', 'Amazon', true, false, true);
```

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set these environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production URL)

---

## 🔮 Future-Ready Structure

The codebase is organized to easily add:

| Feature | Where to add |
|---------|-------------|
| **Admin Panel** | `src/app/admin/` + Supabase RLS admin policy |
| **User Accounts** | `src/app/auth/` + Supabase Auth |
| **Wishlist** | `src/app/api/wishlist/` + `wishlists` table |
| **Own Products** | Add `is_own_product` flag to products table |
| **Razorpay** | `src/app/api/payment/` + Razorpay SDK |
| **Analytics** | Add to `src/app/layout.tsx` |
| **Blog/SEO Pages** | `src/app/blog/` |

---

## 📋 Features

- ✅ Homepage with hero, categories, featured & trending products
- ✅ Product listing with sorting (newest, discount, rating, price)
- ✅ Product detail page with features, rating, related products
- ✅ Category pages (8 categories)
- ✅ Search across name, brand, description
- ✅ Pagination
- ✅ Buy Now → opens affiliate URL in new tab
- ✅ Mobile responsive (works on all screen sizes)
- ✅ SEO optimized (metadata, JSON-LD, sitemap-ready)
- ✅ Loading skeletons
- ✅ Error handling & 404 page
- ✅ TypeScript throughout
