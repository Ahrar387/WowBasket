"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    brand: "",
    price: 0,
    image: "",
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
      price: data.price || 0,
      image: data.image || "",
    });

    setLoading(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? Number(value)
          : value,
    }));
  }

  async function handleUpdate() {
    console.log("handleUpdate called");
    setSaving(true);

    const { data, error } = await supabase
      .from("products")
      .update({
        name: product.name,
        category: product.category,
        brand: product.brand,
        price: product.price,
      })
      .eq("id", String(params.id))
.select();
    setSaving(false);

console.log(error);
console.log(data);
if (error) {
  alert(error.message);
  return;
}

alert("Product Updated Successfully ✅");
    router.push("/admin/products");
  }

  if (loading) {
    return (
      <p className="text-lg font-medium">
        Loading Product...
      </p>
    );
  }

  return (
    <div className="max-w-5xl">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Product
      </h1>

      <div className="space-y-6 rounded-xl bg-white p-6 shadow">
              <div>
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

        <div>
          <label className="mb-2 block font-medium">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
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

        <div>
          <label className="mb-2 block font-medium">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        {product.image && (
          <div>
            <label className="mb-2 block font-medium">
              Current Image
            </label>

            <img
              src={product.image}
              alt={product.name}
              className="h-48 rounded-lg border object-cover"
            />
          </div>
        )}

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