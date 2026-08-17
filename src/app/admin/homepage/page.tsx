"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomepagePage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_button_text: "",
    hero_button_link: "",
    hero_image: "",
  });

  useEffect(() => {
    fetchHomepage();
  }, []);

  async function fetchHomepage() {
    setLoading(true);

    const { data } = await supabase
      .from("homepage")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (data) {
      setForm({
        hero_title: data.hero_title || "",
        hero_subtitle: data.hero_subtitle || "",
        hero_button_text: data.hero_button_text || "",
        hero_button_link: data.hero_button_link || "",
        hero_image: data.hero_image || "",
      });
    }

    setLoading(false);
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName = `hero-${Date.now()}.${file.name
      .split(".")
      .pop()}`;

    const { error } = await supabase.storage
      .from("homepage")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("homepage")
      .getPublicUrl(fileName);

    setForm((prev) => ({
      ...prev,
      hero_image: data.publicUrl,
    }));

    alert("Hero Image Uploaded Successfully ✅");
  }

  async function handleSave() {
    const { data } = await supabase
      .from("homepage")
      .select("id")
      .limit(1)
      .maybeSingle();

    let error;

    if (data) {
      ({ error } = await supabase
        .from("homepage")
        .update({
          hero_title: form.hero_title,
          hero_subtitle: form.hero_subtitle,
          hero_button_text: form.hero_button_text,
          hero_button_link: form.hero_button_link,
          hero_image: form.hero_image,
        })
        .eq("id", data.id));
    } else {
      ({ error } = await supabase
        .from("homepage")
        .insert({
          hero_title: form.hero_title,
          hero_subtitle: form.hero_subtitle,
          hero_button_text: form.hero_button_text,
          hero_button_link: form.hero_button_link,
          hero_image: form.hero_image,
        }));
    }

    if (error) {
      alert(error.message);
      return;
    }

    alert("Homepage Updated Successfully ✅");
  }

  if (loading) {
    return <p>Loading Homepage...</p>;
  }
    return (
    <div className="max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold">
        Homepage Settings
      </h1>

      <div className="space-y-8 rounded-xl bg-white p-6 shadow">

        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Hero Section
          </h2>

          <div className="grid gap-6">

            <input
              type="text"
              value={form.hero_title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  hero_title: e.target.value,
                }))
              }
              placeholder="Hero Title"
              className="rounded-lg border p-3"
            />

            <textarea
              value={form.hero_subtitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  hero_subtitle: e.target.value,
                }))
              }
              placeholder="Hero Subtitle"
              rows={4}
              className="rounded-lg border p-3"
            />

            <input
              type="text"
              value={form.hero_button_text}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  hero_button_text: e.target.value,
                }))
              }
              placeholder="Button Text"
              className="rounded-lg border p-3"
            />

            <input
              type="text"
              value={form.hero_button_link}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  hero_button_link: e.target.value,
                }))
              }
              placeholder="Button Link (Example: /products)"
              className="rounded-lg border p-3"
            />

            <div>
              <label className="mb-2 block font-medium">
                Hero Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-lg border p-3"
              />

              {form.hero_image && (
                <img
                  src={form.hero_image}
                  alt="Hero Preview"
                  className="mt-4 h-48 rounded-lg border object-cover"
                />
              )}
            </div>

          </div>
        </div>

        <button
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Save Homepage
        </button>

      </div>
    </div>
  );
}