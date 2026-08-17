"use client";

import Link from "next/link";

export default function PagesPage() {
  const pages = [
    {
      title: "About Us",
      slug: "about",
    },
    {
      title: "Privacy Policy",
      slug: "privacy",
    },
    {
      title: "Terms & Conditions",
      slug: "terms",
    },
    {
      title: "Contact Us",
      slug: "contact",
    },
  ];

  return (
    <div className="max-w-5xl">

      <h1 className="mb-8 text-3xl font-bold">
        Pages Manager
      </h1>

      <div className="grid gap-6 md:grid-cols-2">

        {pages.map((page) => (

          <div
            key={page.slug}
            className="rounded-xl border bg-white p-6 shadow"
          >

            <h2 className="mb-2 text-xl font-semibold">
              {page.title}
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Edit this page from admin panel.
            </p>

            <Link
              href={`/admin/pages/${page.slug}`}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Edit Page
            </Link>

          </div>

        ))}

      </div>

    </div>
  );
}