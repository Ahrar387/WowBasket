"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  featured: boolean;
  in_stock: boolean;
};
type Category = {
  id: string;
  name: string;
};
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] = useState("All");
const [featuredOnly, setFeaturedOnly] = useState(false);
const [categories, setCategories] = useState<Category[]>([]);
 useEffect(() => {
  fetchProducts();
  fetchCategories();
}, []);
async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
  .select("id,name,image,category,brand,price,featured,in_stock")
    .order("created_at", { ascending: false });

  if (!error && data) {
    setProducts(data);
  }

  setLoading(false);
}
async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (error) {
    console.log(error);
    return;
  }

  setCategories(data || []);
}
// 👇 YE NAYA FUNCTION YAHAN ADD KARO
async function handleDelete(id: string) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Product Deleted Successfully ✅");

  fetchProducts();
}
const filteredProducts = products.filter((product) => {
  const matchesSearch =
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase()) ||
    product.brand.toLowerCase().includes(search.toLowerCase());

  const matchesCategory =
    categoryFilter === "All" ||
    product.category === categoryFilter;

  return matchesSearch && matchesCategory;
});
if (loading) {
  return (
    <p className="text-lg font-medium">
      Loading products...
    </p>
  );
}

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex-1 mr-4">
  <input
    type="text"
    placeholder="Search products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full rounded-lg border p-3"
  />
</div>
<select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  className="rounded-lg border p-3"
>
  <option value="All">
    All Categories
  </option>

  {categories.map((category) => (
    <option
      key={category.id}
      value={category.name}
    >
      {category.name}
    </option>
  ))}
</select>
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={featuredOnly}
    onChange={(e) => setFeaturedOnly(e.target.checked)}
  />

  Featured Only
</label>
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <Link
          href="/admin/products/add"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

     {filteredProducts.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          <p className="text-gray-500">
            No products found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
<th className="p-4 text-left">
  Image
</th>

<th className="p-4 text-left">
  Name
</th>
                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Brand
                </th>

                <th className="p-4 text-left">
                  Price
                </th>

                <th className="p-4 text-left">
                  Stock
                </th>
<th className="p-4 text-center">
  Featured
</th>
                <th className="p-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
  <img
    src={product.image}
    alt={product.name}
    className="h-14 w-14 rounded-lg border object-cover"
  />
</td>
                  <td className="p-4 font-medium">
                    {product.name}
                  </td>

                  <td className="p-4">
                    {product.category}
                  </td>

                  <td className="p-4">
                    {product.brand}
                  </td>

                  <td className="p-4">
                    ₹{product.price}
                  </td>

                  <td className="p-4">
                    {product.in_stock ? (
                      <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
                        In Stock
                      </span>
                    ) : (
                      <span className="rounded bg-red-100 px-3 py-1 text-sm text-red-700">
                        Out of Stock
                      </span>
                    )}
                  </td>
<td className="p-4 text-center">
  {product.featured ? (
    <span className="rounded bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
      ⭐ Featured
    </span>
  ) : (
    <span className="text-gray-400">
      —
    </span>
  )}
</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">

                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                      >
                        Edit
                      </Link>

                      <button
  onClick={() => handleDelete(product.id)}
  className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
>
  Delete
</button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}