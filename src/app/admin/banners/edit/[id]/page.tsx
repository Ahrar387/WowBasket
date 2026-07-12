"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditBannerPage() {
  const { id } = useParams();
const router = useRouter();
  const [loading, setLoading] = useState(true);
const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    link: "",
    image: "",
    active: true,
  });

  useEffect(() => {
    fetchBanner();
  }, []);

  async function fetchBanner() {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      title: data.title,
      link: data.link,
      image: data.image,
      active: data.active,
    });

    setLoading(false);
  }
  async function handleImageUpload(
  e: React.ChangeEvent<HTMLInputElement>
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

  alert("Image Uploaded Successfully ✅");
}
async function handleUpdate() {
  const { error } = await supabase
    .from("banners")
  .update({
  title: form.title,
  link: form.link,
  image: form.image,
  active: form.active,
})
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Banner Updated Successfully ✅");
  router.push("/admin/banners");
}

  if (loading) {
    return <p>Loading Banner...</p>;
  }

  return (
    <div className="max-w-3xl">

      <h1 className="mb-8 text-3xl font-bold">
        Edit Banner
      </h1>

      <div className="rounded-xl bg-white p-6 shadow">

        <div className="space-y-5">

          <div>
            <label className="mb-2 block font-medium">
              Banner Title
            </label>

           <input
  value={form.title}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      title: e.target.value,
    }))
  }
  className="w-full rounded-lg border p-3"
/>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Banner Link
            </label>

           <input
  value={form.link}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      link: e.target.value,
    }))
  }
  className="w-full rounded-lg border p-3"
/>
          </div>

          <img
            src={form.image}
            className="h-40 rounded-lg border"
          />
         

<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="w-full rounded-lg border p-3"
/>

{uploading && (
  <p className="text-blue-600">
    Uploading image...
  </p>
)}

<button
  onClick={handleUpdate}
  className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
>
  Update Banner
</button>

        </div>

      </div>

    </div>
  );
}