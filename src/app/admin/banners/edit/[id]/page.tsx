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
  subtitle: "",
  button_text: "",
  link: "",
  image: "",
  sort_order: 0,
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
  title: data.title || "",
  subtitle: data.subtitle || "",
  button_text: data.button_text || "",
  link: data.link || "",
  image: data.image || "",
  sort_order: data.sort_order || 0,
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
  subtitle: form.subtitle,
  button_text: form.button_text,
  link: form.link,
  image: form.image,
  sort_order: form.sort_order,
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
    Banner Subtitle
  </label>

  <input
    value={form.subtitle}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        subtitle: e.target.value,
      }))
    }
    className="w-full rounded-lg border p-3"
  />
</div>

<div>
  <label className="mb-2 block font-medium">
    Button Text
  </label>

  <input
    value={form.button_text}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        button_text: e.target.value,
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
    type="url"
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
<div>
  <label className="mb-2 block font-medium">
    Banner Order
  </label>

  <input
    type="number"
    value={form.sort_order}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        sort_order: Number(e.target.value),
      }))
    }
    className="w-full rounded-lg border p-3"
  />
</div>

         <img
  src={form.image}
  alt="Banner Preview"
  className="h-40 w-full rounded-lg border object-cover"
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

<label className="flex items-center gap-3">
  <input
    type="checkbox"
    checked={form.active}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        active: e.target.checked,
      }))
    }
  />

  <span className="font-medium">
    Active Banner
  </span>
</label>
<button
  onClick={handleUpdate}
  className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
>
  Update Banner
</button>
        </div>

      </div>

    </div>
  );
}