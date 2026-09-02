"use client";
import { CATEGORIES } from "@/lib/categories";
import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);



  const [product, setProduct] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
    image: "",
    affiliate_store: "Other",
    affiliate_url: "",
    featured: false,
    trending: false,
    in_stock: true,
  });

  useEffect(() => {
  fetchProduct();
}, []);

  

  async function fetchProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setProduct({
      name: data.name || "",
      category: data.category || "",
      brand: data.brand || "",
      description: data.description || "",
      image: data.image || "",
      affiliate_store: data.affiliate_store || "Other",
      affiliate_url: data.affiliate_url || "",
      featured: data.featured || false,
      trending: data.trending || false,
      in_stock: data.in_stock ?? true,
    });

    setLoading(false);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;

    setProduct((prev) => ({
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

    setProduct((prev) => ({
      ...prev,
      image: data.publicUrl,
    }));

    setUploading(false);

    alert("Image Updated Successfully ✅");
  }
    async function handleUpdate() {
    setSaving(true);

    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        category: product.category,
        brand: product.brand,
        description: product.description,
        image: product.image,
        affiliate_store: product.affiliate_store,
        affiliate_url: product.affiliate_url,
        featured: product.featured,
        trending: product.trending,
        in_stock: product.in_stock,
      })
      .eq("id", String(params.id));

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product Updated Successfully ✅");

    router.push("/admin/products");
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-lg font-semibold">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold">
        Edit Product
      </h1>

      <div className="space-y-6 rounded-xl bg-white p-6 shadow">        <div>
          <label className="mb-2 block font-medium">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
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
              value={product.category}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            >
              <option value="">
                Select Category
              </option>

              {CATEGORIES.map((category) => (
  <option
    key={category.id}
    value={category.id}
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
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
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

          {product.image && (
            <img
              src={product.image}
              alt="Preview"
              className="mt-4 h-48 rounded-lg border object-cover"
            />
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium">
              Affiliate Store
            </label>

            <select
              name="affiliate_store"
              value={product.affiliate_store}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            >
              <option>Amazon</option>
              <option>Flipkart</option>
              <option>Myntra</option>
              <option>Ajio</option>
              <option>Meesho</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Affiliate URL
            </label>

            <input
              type="url"
              name="affiliate_url"
              value={product.affiliate_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border p-3"
            />
          </div>

        </div>

        <div className="flex flex-wrap gap-6">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={product.featured}
              onChange={handleChange}
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="trending"
              checked={product.trending}
              onChange={handleChange}
            />
            Trending
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="in_stock"
              checked={product.in_stock}
              onChange={handleChange}
            />
            In Stock
          </label>

        </div>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Product"}
        </button>

      </div>
    </div>
  );
}