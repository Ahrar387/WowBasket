"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, []);

  async function fetchCategory() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }

    setName(data.name);
    setSlug(data.slug);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
      })
      .eq("id", params.id);

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }

    alert("Category Updated Successfully ✅");

    router.push("/admin/categories");
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-xl p-6">

      <h1 className="mb-6 text-3xl font-bold">
        Edit Category
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border bg-white p-6 shadow"
      >

        <div>
          <label className="mb-2 block font-medium">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Slug
          </label>

          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Update Category
        </button>

      </form>

    </div>
  );
}