"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SeoPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    site_title: "",
    meta_description: "",
    meta_keywords: "",
    og_image: "",
    google_analytics: "",
    google_verification: "",
  });

  useEffect(() => {
    fetchSEO();
  }, []);

  async function fetchSEO() {
    setLoading(true);

    const { data } = await supabase
      .from("seo_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (data) {
      setForm({
        site_title: data.site_title || "",
        meta_description: data.meta_description || "",
        meta_keywords: data.meta_keywords || "",
        og_image: data.og_image || "",
        google_analytics: data.google_analytics || "",
        google_verification: data.google_verification || "",
      });
    }

    setLoading(false);
  }

  async function handleSaveSEO() {
    const { data } = await supabase
      .from("seo_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    let error;

    if (data) {
      ({ error } = await supabase
        .from("seo_settings")
        .update({
          site_title: form.site_title,
          meta_description: form.meta_description,
          meta_keywords: form.meta_keywords,
          og_image: form.og_image,
          google_analytics: form.google_analytics,
          google_verification: form.google_verification,
        })
        .eq("id", data.id));
    } else {
      ({ error } = await supabase
        .from("seo_settings")
        .insert({
          site_title: form.site_title,
          meta_description: form.meta_description,
          meta_keywords: form.meta_keywords,
          og_image: form.og_image,
          google_analytics: form.google_analytics,
          google_verification: form.google_verification,
        }));
    }

    if (error) {
      alert(error.message);
      return;
    }

    alert("SEO Settings Saved Successfully ✅");
  }

  if (loading) {
    return <p>Loading SEO...</p>;
  }

 
      return (
      <div className="max-w-5xl">

        <h1 className="mb-8 text-3xl font-bold">
          SEO Settings
        </h1>

        <div className="space-y-8 rounded-xl bg-white p-6 shadow">

          <div>

            <h2 className="mb-4 text-xl font-semibold">
              Search Engine Optimization
            </h2>

            <div className="grid gap-6">

              <input
                type="text"
                placeholder="Website Title"
                value={form.site_title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    site_title: e.target.value,
                  }))
                }
                className="rounded-lg border p-3"
              />

              <textarea
                rows={4}
                placeholder="Meta Description"
                value={form.meta_description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    meta_description: e.target.value,
                  }))
                }
                className="rounded-lg border p-3"
              />

              <textarea
                rows={3}
                placeholder="Meta Keywords (comma separated)"
                value={form.meta_keywords}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    meta_keywords: e.target.value,
                  }))
                }
                className="rounded-lg border p-3"
              />

              <input
                type="text"
                placeholder="Open Graph Image URL"
                value={form.og_image}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    og_image: e.target.value,
                  }))
                }
                className="rounded-lg border p-3"
              />

              <input
                type="text"
                placeholder="Google Analytics ID (G-XXXXXXXXXX)"
                value={form.google_analytics}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    google_analytics: e.target.value,
                  }))
                }
                className="rounded-lg border p-3"
              />

              <input
                type="text"
                placeholder="Google Search Console Verification"
                value={form.google_verification}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    google_verification: e.target.value,
                  }))
                }
                className="rounded-lg border p-3"
              />

              <button
                onClick={handleSaveSEO}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                Save SEO Settings
              </button>

            </div>

          </div>

        </div>

      </div>
    );
}