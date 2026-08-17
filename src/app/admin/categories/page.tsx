"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
  setLoading(true);
  setError("");

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Categories fetch error:", error);
    setCategories([]);
    setError("Categories load nahi ho paayi. Please try again.");
    setLoading(false);
    return;
  }

  setCategories(data || []);
  setLoading(false);
}

  async function deleteCategory(id: string) {
    const ok = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }

    alert("Category Deleted Successfully ✅");

    fetchCategories();
  }

  if (loading) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-lg font-medium text-gray-600">
        Loading Categories...
      </p>
    </div>
  );
}

if (error) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-700">
        Unable to load categories
      </h2>

      <p className="mt-2 text-red-600">
        {error}
      </p>

      <button
        onClick={fetchCategories}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

  return (
    <div className="p-6">

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-3xl font-bold">
          Categories
        </h1>

        <Link
          href="/admin/categories/add"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Add Category
        </Link>

      </div>

      {categories.length === 0 ? (

        <div className="rounded-xl border bg-white p-10 text-center shadow">
          <p className="text-lg text-gray-500">
            No Categories Found
          </p>
        </div>

      ) : (

        <div className="overflow-hidden rounded-xl border bg-white shadow">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Slug</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {categories.map((category) => (

                <tr
                  key={category.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {category.name}
                  </td>

                  <td className="p-4">
                    {category.slug}
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <Link
                        href={`/admin/categories/edit/${category.id}`}
                        className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteCategory(category.id)}
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