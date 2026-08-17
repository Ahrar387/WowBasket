"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  const [settings, setSettings] = useState({
    
    site_name: "WOW BASKET",
    tagline: "",
    logo: "",
    phone: "",
    email: "",
  });
const [email, setEmail] = useState("");
const [newsletterStatus, setNewsletterStatus] = useState("");
const [newsletterLoading, setNewsletterLoading] = useState(false);
  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!data) return;

    setSettings({
      site_name: data.site_name || "WOW BASKET",
      tagline: data.tagline || "",
      logo: data.logo || "",
      phone: data.phone || "",
      email: data.email || "",
    });
  }
async function handleNewsletterSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  if (!email.trim()) {
    setNewsletterStatus("Please enter your email.");
    return;
  }

  setNewsletterLoading(true);
  setNewsletterStatus("");

  try {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setNewsletterStatus(
        data.error || "Something went wrong."
      );
      return;
    }

    setNewsletterStatus(
      "Successfully subscribed! 🎉"
    );

    setEmail("");
  } catch (error) {
    console.error("Newsletter error:", error);

    setNewsletterStatus(
      "Unable to subscribe right now."
    );
  } finally {
    setNewsletterLoading(false);
  }
}
  return (
    <footer className="mt-16 bg-gray-900 text-white">
      <div className="container-site py-12">

        <div className="grid gap-10 md:grid-cols-4">

          <div className="md:col-span-1">

            <Link
              href="/"
              className="mb-5 flex items-center gap-3"
            >
              {settings.logo ? (
                <Image
                  src={settings.logo}
                  alt={settings.site_name}
                  width={170}
                  height={50}
                />
              ) : (
                <span className="text-2xl font-bold">
                  {settings.site_name}
                </span>
              )}
            </Link>

            <p className="text-sm leading-7 text-gray-400">
              {settings.tagline}
            </p>
                        <div className="mt-5 space-y-2 text-sm text-gray-400">

              {settings.phone && (
                <p>
                  📞 {settings.phone}
                </p>
              )}

              {settings.email && (
                <p>
                  ✉️ {settings.email}
                </p>
              )}

            </div>

          </div>

          <div>

            <h3 className="mb-4 text-lg font-semibold">
              Categories
            </h3>

            <ul className="space-y-2">

              {CATEGORIES.slice(0, 6).map((category) => (

                <li key={category.id}>

                  <Link
                    href={`/categories/${category.id}`}
                    className="text-gray-400 transition hover:text-white"
                  >
                    {category.name}
                  </Link>

                </li>

              ))}

            </ul>

          </div>

          <div>

            <h3 className="mb-4 text-lg font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-2">

              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-white"
                >
                  Categories
                </Link>
              </li>

            </ul>

          </div>

          <div>

            <h3 className="mb-4 text-lg font-semibold">
              Information
            </h3>

            <ul className="space-y-2">

              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>

            </ul>

          </div>

        </div>
        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-950 p-6 sm:p-8">
  <div className="grid gap-6 md:grid-cols-2 md:items-center">

    <div>
      <h3 className="text-xl font-bold text-white">
        📧 Stay Updated with WOW BASKET
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-400">
        Subscribe to get the latest deals, trending products,
        and special offers directly in your inbox.
      </p>
    </div>

    <div>
      <form
        onSubmit={handleNewsletterSubmit}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="h-12 flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-brand-500"
          disabled={newsletterLoading}
        />

        <button
          type="submit"
          disabled={newsletterLoading}
          className="h-12 rounded-xl bg-brand-500 px-6 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {newsletterLoading
            ? "Subscribing..."
            : "Subscribe"}
        </button>
      </form>

      {newsletterStatus && (
        <p className="mt-3 text-sm text-gray-400">
          {newsletterStatus}
        </p>
      )}
    </div>

  </div>
</div>
                <div className="mt-10 border-t border-gray-800 pt-6">

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-400 md:flex-row">

            <p>
              © {new Date().getFullYear()} {settings.site_name}. All Rights Reserved.
            </p>

            <p>
              Made with ❤️ in India
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}