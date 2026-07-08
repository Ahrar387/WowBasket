 "use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("categories")
      .insert([
        {
          name,
          slug,
        },
      ]);

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }

    alert("Category Saved Successfully ✅");

    setName("");
    setSlug("");
  }

  return (
    <div className="max-w-xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Add Category
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
            placeholder="Enter category name"
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
            placeholder="grocery"
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Save Category
        </button>
      </form>
    </div>
  );
}