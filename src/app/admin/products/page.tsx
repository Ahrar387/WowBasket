"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
    slug: string;
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
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
  setLoading(true);
  setError("");

  const { data, error } = await supabase
  .from("products")
  .select(
    "id,name,slug,image,category,brand,price,featured,in_stock"
  )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Products fetch error:", error);
    setProducts([]);
    setError("Products load nahi ho paaye. Please try again.");
    setLoading(false);
    return;
  }

  setProducts(data || []);
  setLoading(false);
}

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id,name")
      .order("name");

    if (!error && data) {
      setCategories(data);
    }
  }

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

function handleShare(product: Product) {
  const url = `${window.location.origin}/products/${product.slug}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert("WOW BASKET Product Link Copied ✅");
    })
    .catch(() => {
      alert("Unable to copy product link.");
    });
}

const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.brand
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    const matchesFeatured =
      !featuredOnly || product.featured;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesFeatured
    );
  });

  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

if (loading) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-lg font-medium text-gray-600">
        Loading products...
      </p>
    </div>
  );
}

if (error) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-700">
        Unable to load products
      </h2>

      <p className="mt-2 text-red-600">
        {error}
      </p>

      <button
        onClick={fetchProducts}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

  return (
    <div>      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="mt-1 text-gray-500">
            Manage all your products
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Add Product
        </Link>

      </div>

      <div className="mb-6 rounded-xl border bg-white p-4 shadow">

        <div className="grid gap-4 md:grid-cols-3">

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border p-3"
          />

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
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

          <label className="flex items-center gap-3 rounded-lg border p-3">

            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => {
                setFeaturedOnly(e.target.checked);
                setCurrentPage(1);
              }}
            />

            Featured Only

          </label>

        </div>

      </div>

      {paginatedProducts.length === 0 ? (

        <div className="rounded-xl border bg-white p-10 text-center">

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

              {paginatedProducts.map((product) => (              
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    <img
  src={product.image || "/wow-basket.png"}
  alt={product.name}
  className="h-14 w-14 rounded-lg border object-cover"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/wow-basket.png";
  }}
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
  onClick={() => handleShare(product)}
  className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
>
  Share
</button>
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

      {totalPages > 1 && (

        <div className="mt-8 flex items-center justify-center gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentPage(index + 1)
                }
                className={`rounded-lg px-4 py-2 ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "border"
                }`}
              >
                {index + 1}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>

        </div>

      )}

    </div>
  );
}