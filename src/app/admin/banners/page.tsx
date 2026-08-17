"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Banner = {
  id: string;
  title: string;
  image: string;
  link: string;
  active: boolean;
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
  useEffect(() => {
    fetchBanners();
  }, []);

 async function fetchBanners() {
  setLoading(true);
  setError("");

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Banners fetch error:", error);
    setBanners([]);
    setError("Banners load nahi ho paaye. Please try again.");
    setLoading(false);
    return;
  }

  setBanners(data || []);
  setLoading(false);
}
async function handleDelete(id: string) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this banner?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("banners")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Banner Deleted Successfully ✅");

  fetchBanners();
}
if (loading) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-lg font-medium text-gray-600">
        Loading Banners...
      </p>
    </div>
  );
}

if (error) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-700">
        Unable to load banners
      </h2>

      <p className="mt-2 text-red-600">
        {error}
      </p>

      <button
        onClick={fetchBanners}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Banners
        </h1>

        <Link
          href="/admin/banners/add"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          No banners found.
        </div>
      ) : (
       <div className="overflow-hidden rounded-xl border bg-white shadow">
  <table className="w-full">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-4 text-left">
          Image
        </th>

        <th className="p-4 text-left">
          Title
        </th>

        <th className="p-4 text-left">
          Link
        </th>

        <th className="p-4 text-left">
          Status
        </th>

        <th className="p-4 text-center">
          Actions
        </th>
      </tr>
    </thead>
<tbody>
  {banners.map((banner) => (
    <tr
      key={banner.id}
      className="border-t hover:bg-gray-50"
    >
      <td className="p-4">
        <img
  src={banner.image || "/wow-basket.png"}
  alt={banner.title}
  className="h-14 w-24 rounded-lg border object-cover"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/wow-basket.png";
  }}
/>
      </td>

      <td className="p-4 font-medium">
        {banner.title}
      </td>

      <td className="p-4">
        {banner.link}
      </td>

      <td className="p-4">
        {banner.active ? (
          <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
            Active
          </span>
        ) : (
          <span className="rounded bg-red-100 px-3 py-1 text-sm text-red-700">
            Inactive
          </span>
        )}
      </td>

      <td className="p-4 text-center">
        <div className="flex justify-center gap-2">
          <Link
  href={`/admin/banners/edit/${banner.id}`}
  className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
>
  Edit
</Link>

          <button
  onClick={() => handleDelete(banner.id)}
  className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
>
  Delete
</button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
  </table>
</div>
      )}
    </div>
  );
}