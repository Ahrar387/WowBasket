"use client";

import { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
type Category = {
  id: string;
  name: string;
};
export default function AddProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    brand: "",
    description: "",
    image: "",
    price: "",
    original_price: "",
    discount_percent: "",
    featured: false,
    in_stock: true,
    trending: false,
  });
useEffect(() => {
  fetchCategories();
}, []);

async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (error) {
    alert(error.message);
    return;
  }

  setCategories(data || []);
}
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }
async function handleImageUpload(
  e: ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  if (!file) return;

  setUploading(true);

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  if (error) {
    alert(error.message);
    setUploading(false);
    return;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  setForm((prev) => ({
    ...prev,
    image: data.publicUrl,
  }));

  setUploading(false);

  alert("Image Uploaded Successfully ✅");
}
 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setLoading(true);

  const { error } = await supabase.from("products").insert([
    {
      name: form.name,
      slug:
        form.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),

      category: form.category,
      brand: form.brand,

      description: form.description,

      image: form.image,

      price: Number(form.price || 0),

      original_price: Number(form.original_price || 0),

      discount_percent: Number(form.discount_percent || 0),

      featured: form.featured,

      in_stock: form.in_stock,

      trending: form.trending,

      rating: 0,

      review_count: 0,

      affiliate_url: "",

     affiliate_store: "Other",

      badge: "",

      features: [],

      tags: [],
    },
  ]);

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Product Added Successfully ✅");

  router.push("/admin/products");
}

  return (
    <div className="max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold">
        Add New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl bg-white p-6 shadow"
      >
        <div>
          <label className="mb-2 block font-medium">
            Product Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              Category
            </label>

            <select
  name="category"
  value={form.category}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      category: e.target.value,
    }))
  }
  className="w-full rounded-lg border p-3"
>
  <option value="">
    Select Category
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
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Brand
            </label>

            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              type="text"
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>
<div>
  <label className="mb-2 block font-medium">
    Product Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="w-full rounded-lg border p-3"
  />

  {uploading && (
    <p className="mt-2 text-blue-600">
      Uploading image...
    </p>
  )}

  {form.image && (
    <img
      src={form.image}
      alt="Preview"
      className="mt-4 h-40 rounded-lg border object-cover"
    />
  )}
</div>
<div className="grid gap-6 md:grid-cols-3">
  <div>
    <label className="mb-2 block font-medium">
      Price
    </label>

    <input
      name="price"
      value={form.price}
      onChange={handleChange}
      type="number"
      className="w-full rounded-lg border p-3"
    />
  </div>

  <div>
    <label className="mb-2 block font-medium">
      Original Price
    </label>

    <input
      name="original_price"
      value={form.original_price}
      onChange={handleChange}
      type="number"
      className="w-full rounded-lg border p-3"
    />
  </div>

  <div>
    <label className="mb-2 block font-medium">
      Discount %
    </label>

    <input
      name="discount_percent"
      value={form.discount_percent}
      onChange={handleChange}
      type="number"
      className="w-full rounded-lg border p-3"
    />
  </div>
</div>

<div>
  <label className="mb-2 block font-medium">
    Description
  </label>

  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    rows={5}
    className="w-full rounded-lg border p-3"
  />
</div>

<div className="flex flex-wrap gap-6">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      name="featured"
      checked={form.featured}
      onChange={handleChange}
    />
    Featured
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      name="in_stock"
      checked={form.in_stock}
      onChange={handleChange}
    />
    In Stock
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      name="trending"
      checked={form.trending}
      onChange={handleChange}
    />
    Trending
  </label>
</div>
        <button
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}