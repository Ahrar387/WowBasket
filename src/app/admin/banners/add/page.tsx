"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddBannerPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    link: "",
    image: "",
    active: true,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
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
      .from("banners")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("banners")
      .getPublicUrl(fileName);

    setForm((prev) => ({
      ...prev,
      image: data.publicUrl,
    }));

    setUploading(false);

    alert("Banner Uploaded Successfully ✅");
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase
      .from("banners")
      .insert([
        {
          title: form.title,
          link: form.link,
          image: form.image,
          active: form.active,
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Banner Added Successfully ✅");

    router.push("/admin/banners");
  }

  return (
        <div className="max-w-3xl">

      <h1 className="mb-8 text-3xl font-bold">
        Add New Banner
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl bg-white p-6 shadow"
      >

        <div>
          <label className="mb-2 block font-medium">
            Banner Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Banner Link
          </label>

          <input
            type="text"
            name="link"
            value={form.link}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Banner Image
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
              alt="Banner Preview"
              className="mt-4 h-40 w-full rounded-lg border object-cover"
            />
          )}
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />

          Active Banner
        </label>

        <button
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Banner"}
        </button>

      </form>

    </div>
  );
}