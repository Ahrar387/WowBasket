"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    site_name: "",
    tagline: "",
    logo: "",
    favicon: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);

    const { data } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (data) {
      setForm({
        site_name: data.site_name || "",
        tagline: data.tagline || "",
        logo: data.logo || "",
        favicon: data.favicon || "",
        phone: data.phone || "",
        email: data.email || "",
      });
    }

    setLoading(false);
  }

  async function uploadImage(
    file: File,
    folder: "logo" | "favicon"
  ) {
   const extension = file.name.split(".").pop();

const fileName = `${folder}-${Date.now()}.${extension}`;


const { error } = await supabase.storage
  .from("banners")
  .upload(fileName, file);
    if (error) {
      alert(error.message);
      return "";
    }

   const { data } = supabase.storage
  .from("banners")
  .getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleLogoUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = await uploadImage(file, "logo");

    if (!url) return;

    setForm((prev) => ({
      ...prev,
      logo: url,
    }));

    alert("Logo Uploaded Successfully ✅");
  }

  async function handleFaviconUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = await uploadImage(file, "favicon");

    if (!url) return;

    setForm((prev) => ({
      ...prev,
      favicon: url,
    }));

    alert("Favicon Uploaded Successfully ✅");
  }

  async function handleSaveSettings() {
    const { data } = await supabase
      .from("settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    let error;

    if (data) {
      ({ error } = await supabase
        .from("settings")
        .update({
          site_name: form.site_name,
          tagline: form.tagline,
          logo: form.logo,
          favicon: form.favicon,
          phone: form.phone,
          email: form.email,
        })
        .eq("id", data.id));
    } else {
      ({ error } = await supabase
        .from("settings")
        .insert({
          site_name: form.site_name,
          tagline: form.tagline,
          logo: form.logo,
          favicon: form.favicon,
          phone: form.phone,
          email: form.email,
        }));
    }

    if (error) {
      alert(error.message);
      return;
    }

    alert("Settings Saved Successfully ✅");
  }

  if (loading) {
    return <p>Loading Settings...</p>;
  }

  return (
    <div className="max-w-5xl">

      <h1 className="mb-8 text-3xl font-bold">
        Website Settings
      </h1>

   <div className="space-y-8 rounded-xl bg-white p-6 shadow">
            <div>
          <h2 className="mb-4 text-xl font-semibold">
            General Settings
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <input
              type="text"
              value={form.site_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  site_name: e.target.value,
                }))
              }
              placeholder="Website Name"
              className="rounded-lg border p-3"
            />

            <input
              type="text"
              value={form.tagline}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tagline: e.target.value,
                }))
              }
              placeholder="Website Tagline"
              className="rounded-lg border p-3"
            />

          </div>
        </div>


        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Branding
          </h2>

          <div className="space-y-5">

            <div>
              <label className="mb-2 block font-medium">
                Website Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full rounded-lg border p-3"
              />

              {form.logo && (
                <img
                  src={form.logo}
                  className="mt-4 h-24 rounded-lg border object-contain"
                  alt="Logo Preview"
                />
              )}
            </div>


            <div>
              <label className="mb-2 block font-medium">
                Website Favicon
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFaviconUpload}
                className="w-full rounded-lg border p-3"
              />

              {form.favicon && (
                <img
                  src={form.favicon}
                  className="mt-4 h-20 w-20 rounded-lg border object-contain"
                  alt="Favicon Preview"
                />
              )}
            </div>

          </div>
        </div>


        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Contact Details
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              placeholder="Phone Number"
              className="rounded-lg border p-3"
            />


            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="Email Address"
              className="rounded-lg border p-3"
            />

          </div>
        </div>


        <button
          onClick={handleSaveSettings}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Save Settings
        </button>


      </div>

    </div>
  );
}
  