"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function EditPage() {
  const params = useParams();

  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState({
    id: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchPage();
  }, []);

  async function fetchPage() {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (data) {
      setPage({
        id: data.id,
        title: data.title,
        content: data.content,
      });
    }

    setLoading(false);
  }
    async function handleSave() {
    const { error } = await supabase
      .from("pages")
      .update({
        title: page.title,
        content: page.content,
      })
      .eq("id", page.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Page Updated Successfully ✅");
  }

  if (loading) {
    return <p>Loading...</p>;
  }
    return (
    <div className="max-w-6xl">
      <h1 className="mb-8 text-3xl font-bold">
        Edit Page
      </h1>

      <div className="rounded-xl bg-white p-6 shadow space-y-6">

        <div>
          <label className="mb-2 block font-semibold">
            Page Title
          </label>

          <input
            type="text"
            value={page.title}
            onChange={(e) =>
              setPage((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Page Content
          </label>

          <textarea
            rows={20}
            value={page.content}
            onChange={(e) =>
              setPage((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            className="w-full rounded-lg border p-3 font-mono"
          />
        </div>

        <button
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Save Page
        </button>

      </div>
    </div>
  );
}