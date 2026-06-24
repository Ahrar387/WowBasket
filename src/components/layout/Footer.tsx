import Link from "next/link";
import { Zap } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-16">
      <div className="container-site py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white">Trend<span className="text-brand-400">Kart</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-3">India&apos;s curated affiliate marketplace. Handpicked deals from Amazon &amp; Flipkart, updated daily.</p>
            <p className="text-xs text-gray-600">*We earn commissions from qualifying purchases.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0,6).map(c => (
                <li key={c.id}><Link href={`/categories/${c.id}`} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Browse</h4>
            <ul className="space-y-2">
              {[["All Products","/products"],["Best Deals","/products?sortBy=discount"],["Top Rated","/products?sortBy=rating"],["Categories","/categories"]].map(([l,h]) => (
                <li key={h}><Link href={h} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Info</h4>
            <ul className="space-y-2">
              {[["About Us","/about"],["Disclosure","/disclosure"],["Privacy Policy","/privacy"],["Terms","/terms"]].map(([l,h]) => (
                <li key={h}><Link href={h} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} TrendKart. All rights reserved.</p>
          <p className="text-xs text-gray-500">🇮🇳 Made in India &nbsp;·&nbsp; Prices in ₹ INR &nbsp;·&nbsp; Amazon &amp; Flipkart affiliate</p>
        </div>
      </div>
    </footer>
  );
}
