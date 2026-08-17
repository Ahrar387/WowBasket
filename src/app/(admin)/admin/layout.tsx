import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            📊 Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            📦 Products
          </Link>

          <Link
            href="/admin/categories"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            📂 Categories
          </Link>

          <Link
            href="/admin/banners"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            🖼️ Banners
          </Link>

          <Link
            href="/admin/settings"
            className="block rounded-lg px-4 py-3 hover:bg-gray-800"
          >
            ⚙️ Settings
          </Link>
        </nav>
      </aside>

      {/* Right Side */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>

          <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}