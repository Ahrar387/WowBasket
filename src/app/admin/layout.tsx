"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Homepage", href: "/admin/homepage" },
    { name: "Products", href: "/admin/products" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Banners", href: "/admin/banners" },
    
    { name: "SEO", href: "/admin/seo" },
    { name: "Pages", href: "/admin/pages" },
    { name: "Messages", href: "/admin/messages" },
    { name: "Newsletter", href: "/admin/newsletter" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="border-b border-gray-700 p-6">
          <h1 className="text-2xl font-bold">WOW BASKET Admin</h1>
        </div>

        <nav className="space-y-2 p-4">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 transition ${
                pathname === item.href
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Right Side */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow">
          <h2 className="text-xl font-semibold">Admin Panel</h2>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}