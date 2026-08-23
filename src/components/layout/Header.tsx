"use client";

import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";
import { supabase } from "@/lib/supabase";
import { useWishlist } from "@/context/WishlistContext";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [mobileOpen, setMobile] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [logo, setLogo] = useState("/wow-basket.png");
  const [siteName, setSiteName] = useState("WOW BASKET");

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { wishlist } = useWishlist();

  const searchRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", fn, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", fn);
    };
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (
        catRef.current &&
        !catRef.current.contains(e.target as Node)
      ) {
        setCatOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", fn);

    return () => {
      document.removeEventListener("mousedown", fn);
    };
  }, []);

  useEffect(() => {
    setMobile(false);
    setCatOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("settings")
        .select("logo, site_name")
        .limit(1)
        .maybeSingle();

      if (!data) return;

      if (data.logo) {
        setLogo(data.logo);
      }

      if (data.site_name) {
        setSiteName(data.site_name);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );

        if (!res.ok) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        const data = await res.json();

        setSuggestions(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => {
      clearTimeout(delay);
    };
  }, [query]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const q = query.trim();

    if (!q) return;

    router.push(`/search?q=${encodeURIComponent(q)}`);

    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function handleKeyDown(
    e: KeyboardEvent<HTMLInputElement>
  ) {
    if (
      !showSuggestions ||
      suggestions.length === 0
    ) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (
      e.key === "Enter" &&
      selectedIndex >= 0
    ) {
      e.preventDefault();

      router.push(
        `/products/${suggestions[selectedIndex].slug}`
      );

      setShowSuggestions(false);
      setQuery("");
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow duration-200",
        scrolled &&
          "shadow-sm border-b border-gray-100"
      )}
    >
      <div className="container-site">
        <div className="flex h-16 items-center gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
          >
            <Image
              src={logo}
              alt={siteName}
              width={180}
              height={50}
              style={{
                width: "auto",
                height: "auto",
              }}
              priority
            />
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-xl"
          >
            <div
              ref={searchRef}
              className="relative w-full"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

              <input
                type="search"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Search mobiles, laptops..."
                className="input pl-10 h-10 w-full"
              />

              {showSuggestions &&
                suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border bg-white shadow-xl overflow-hidden z-50">
                    {suggestions.map(
                      (item, index) => (
                        <Link
                          key={item.id}
                          href={`/products/${item.slug}`}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 hover:bg-gray-100",
                            selectedIndex === index &&
                              "bg-gray-100"
                          )}
                          onClick={() => {
                            setShowSuggestions(false);
                            setQuery("");
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />

                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        </Link>
                      )
                    )}
                  </div>
                )}
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {[
              {
                label: "Home",
                href: "/",
              },
              {
                label: "Products",
                href: "/products",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "btn-ghost text-sm",
                  pathname === l.href &&
                    "bg-brand-50 text-brand-600"
                )}
              >
                {l.label}
              </Link>
            ))}

            {/* Categories */}
            <div
              ref={catRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setCatOpen((o) => !o)
                }
                className={cn(
                  "btn-ghost text-sm flex items-center gap-1",
                  catOpen && "bg-gray-100"
                )}
              >
                Categories

                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    catOpen && "rotate-180"
                  )}
                />
              </button>

              {catOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 card p-2 shadow-card-hover">
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.id}`}
                        onClick={() =>
                          setCatOpen(false)
                        }
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-base">
                          {cat.icon}
                        </span>

                        <span className="font-medium text-gray-800">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            <Link
              href="/wishlist"
              className="relative btn-ghost p-2"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />

              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center px-1">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() =>
                setMobile((o) => !o)
              }
              className="lg:hidden btn-ghost p-2"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="hidden lg:block border-t border-gray-100 bg-gray-50">
        <div className="container-site">
          <div className="flex overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-500 whitespace-nowrap border-b-2 border-transparent hover:border-brand-400 hover:text-brand-600 transition-colors",
                  pathname ===
                    `/categories/${cat.id}` &&
                    "border-brand-500 text-brand-600"
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 space-y-3">
          <form
            onSubmit={handleSearch}
            className="pt-3"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

              <input
                type="search"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search products..."
                className="input pl-10 h-11"
              />
            </div>
          </form>

          <nav className="space-y-1">
            {[
              {
                label: "Home",
                href: "/",
              },
              {
                label: "Products",
                href: "/products",
              },
              {
                label: "Wishlist",
                href: "/wishlist",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50",
                  pathname === l.href &&
                    "bg-brand-50 text-brand-600"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div>
            <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Categories
            </p>

            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-gray-50"
                >
                  <span>{cat.icon}</span>

                  <span className="font-medium text-gray-800">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}