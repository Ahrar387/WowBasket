"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ResponsiveContainer,
  
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState(0);
  const [categories, setCategories] = useState(0);
  const [banners, setBanners] = useState(0);
  const [featured, setFeatured] = useState(0);
  const [trending, setTrending] = useState(0);

  const [recentProducts, setRecentProducts] = useState<any[]>([]);
const [totalClicks, setTotalClicks] = useState(0);

const [todayClicks, setTodayClicks] = useState(0);

const [topProduct, setTopProduct] = useState("No Data");

const [recentClicks, setRecentClicks] = useState<any[]>([]);
const [topProducts, setTopProducts] = useState<
  { name: string; clicks: number }[]
>([]);

const [amazonClicks, setAmazonClicks] = useState(0);

const [flipkartClicks, setFlipkartClicks] = useState(0);
const [last7Days, setLast7Days] = useState<
  { day: string; clicks: number }[]
>([]);
const [filter, setFilter] = useState("7");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
async function loadAnalytics(days: number) {
  const now = new Date();

  const fromDate = new Date(now);

  if (days === 1) {
    fromDate.setHours(0, 0, 0, 0);
  } else {
    fromDate.setDate(fromDate.getDate() - days + 1);
    fromDate.setHours(0, 0, 0, 0);
  }

  const { data: clicks, error } = await supabase
    .from("product_clicks")
    .select("*")
    .gte("clicked_at", fromDate.toISOString())
    .order("clicked_at", { ascending: false });

  if (error) {
    console.error("Analytics error:", error);
    return;
  }

  const clickData = clicks || [];

  // -------------------------
  // Recent Clicks
  // -------------------------
  setRecentClicks(clickData.slice(0, 20));

  // -------------------------
  // Selected Period Clicks
  // -------------------------
  setTotalClicks(clickData.length);

  // -------------------------
  // Today's Clicks
  // -------------------------
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayCount = clickData.filter((item) => {
    const clickedAt = new Date(item.clicked_at);

    return clickedAt >= today && clickedAt < tomorrow;
  }).length;

  setTodayClicks(todayCount);

  // -------------------------
  // Amazon / Flipkart
  // -------------------------
  setAmazonClicks(
    clickData.filter(
      (item) => item.affiliate_store === "Amazon"
    ).length
  );

  setFlipkartClicks(
    clickData.filter(
      (item) => item.affiliate_store === "Flipkart"
    ).length
  );

  // -------------------------
  // Top Products
  // -------------------------
  const productMap: Record<string, number> = {};

  clickData.forEach((item) => {
    const name = item.product_name || "Unknown Product";

    productMap[name] = (productMap[name] || 0) + 1;
  });

  const sortedProducts = Object.entries(productMap)
    .map(([name, clicks]) => ({
      name,
      clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  setTopProducts(sortedProducts.slice(0, 10));

  setTopProduct(
    sortedProducts[0]?.name || "No Data"
  );

  // -------------------------
  // Chart
  // -------------------------
  const chartMap: Record<string, number> = {};

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    const key = date.toISOString().split("T")[0];

    chartMap[key] = 0;
  }

  clickData.forEach((item) => {
    const key = item.clicked_at.split("T")[0];

    if (chartMap[key] !== undefined) {
      chartMap[key]++;
    }
  });

  const chartData = Object.entries(chartMap).map(
    ([day, clicks]) => ({
      day: day.slice(5),
      clicks,
    })
  );

  setLast7Days(chartData);
}
const loadAnalyticsRef = useCallback(
  async (days: number) => {
    await loadAnalytics(days);
  },
  []
);

  useEffect(() => {
 

  async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const [
        productsRes,
        categoriesRes,
        bannersRes,
        featuredRes,
        trendingRes,
      ] = await Promise.all([
        supabase
          .from("products")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("categories")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("banners")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("featured", true),

        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("trending", true),
      ]);

      setProducts(productsRes.count || 0);
      setCategories(categoriesRes.count || 0);
      setBanners(bannersRes.count || 0);
      setFeatured(featuredRes.count || 0);
      setTrending(trendingRes.count || 0);

      const { data: recent } = await supabase
        .from("products")
        .select("id,name,price")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentProducts(recent || []);


// Recent Clicks
const { data: clicks } = await supabase
  .from("product_clicks")
  .select("*")
  .order("clicked_at", { ascending: false });
  

setRecentClicks(clicks || []);

// Top Product
const { data: allClicks } = await supabase
  .from("product_clicks")
  .select("product_name");

if (allClicks) {
  const map: Record<string, number> = {};

  allClicks.forEach((item) => {
    map[item.product_name] =
      (map[item.product_name] || 0) + 1;
  });



 const sortedProducts = Object.entries(map)
  .map(([name, clicks]) => ({
    name,
    clicks,
  }))
  .sort((a, b) => b.clicks - a.clicks)
  .slice(0, 10);

setTopProducts(sortedProducts);
const chartMap: Record<string, number> = {};

let totalDays = 7;

if (filter === "1") totalDays = 1;
if (filter === "30") totalDays = 30;
if (filter === "month") {
  totalDays = new Date().getDate();
}

for (let i = totalDays - 1; i >= 0; i--) {
  const d = new Date();
  d.setDate(d.getDate() - i);

  const key = d.toISOString().split("T")[0];

  chartMap[key] = 0;
}

clicks?.forEach((item) => {
  const key = item.clicked_at.split("T")[0];

  if (chartMap[key] !== undefined) {
    chartMap[key]++;
  }
});

const chartData = Object.entries(chartMap).map(
  ([day, clicks]) => ({
    day: day.slice(5),
    clicks,
  })
);

setLast7Days(chartData);
if (sortedProducts.length > 0) {
  setTopProduct(sortedProducts[0].name);
} else {
  setTopProduct("No Data");
}
await loadAnalytics(Number(filter));
}
      setLoading(false);
    }

    checkUser();
    const channel = supabase
  .channel("product_clicks_live")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "product_clicks",
    },
    async () => {
      const days =
        filter === "1"
          ? 1
          : filter === "7"
          ? 7
          : filter === "30"
          ? 30
          : 365;

      await loadAnalyticsRef(days);
    }
  )
  .subscribe();

return () => {
  supabase.removeChannel(channel);
};
 }, [router, filter]);
function exportExcel() {
  const rows = topProducts.map((item, index) => ({
    Rank: index + 1,
    Product: item.name,
    Clicks: item.clicks,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Top Products"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(file, "WOW_BASKET_Analytics.xlsx");
}
function exportPDF() {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("WOW BASKET Analytics Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [["Rank", "Product", "Clicks"]],
    body: topProducts.map((item, index) => [
      index + 1,
      item.name,
      item.clicks,
    ]),
  });

  doc.save("WOW_BASKET_Analytics.pdf");
}
  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Dashboard
      </h1>
   <button
  onClick={async () => {
    setFilter("1");
    await loadAnalytics(1);
  }}
  className={`rounded-lg px-4 py-2 ${
    filter === "1"
      ? "bg-blue-600 text-white"
      : "bg-gray-200 hover:bg-gray-300"
  }`}
>
  Today
</button>

<button
  onClick={async () => {
    setFilter("7");
    await loadAnalytics(7);
  }}
  className={`rounded-lg px-4 py-2 ${
    filter === "7"
      ? "bg-blue-600 text-white"
      : "bg-gray-200 hover:bg-gray-300"
  }`}
>
  Last 7 Days
</button>

<button
  onClick={async () => {
    setFilter("30");
    await loadAnalytics(30);
  }}
  className={`rounded-lg px-4 py-2 ${
    filter === "30"
      ? "bg-blue-600 text-white"
      : "bg-gray-200 hover:bg-gray-300"
  }`}
>
  Last 30 Days
</button>

<button
  onClick={async () => {
    setFilter("365");
    await loadAnalytics(365);
  }}
  className={`rounded-lg px-4 py-2 ${
    filter === "365"
      ? "bg-blue-600 text-white"
      : "bg-gray-200 hover:bg-gray-300"
  }`}
>
  This Year
</button>
<div className="mb-8 flex flex-wrap gap-4">

  <button
  onClick={exportExcel}
  className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
>
  📊 Export Excel
</button>

  <button
  onClick={exportPDF}
  className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
>
  📄 Export PDF
</button>

</div>
      {/* Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 h-3 w-16 rounded bg-blue-600"></div>
          <p className="text-gray-500">Products</p>
          <h2 className="mt-2 text-4xl font-bold">
            {products}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 h-3 w-16 rounded bg-green-600"></div>
          <p className="text-gray-500">Categories</p>
          <h2 className="mt-2 text-4xl font-bold">
            {categories}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 h-3 w-16 rounded bg-purple-600"></div>
          <p className="text-gray-500">Banners</p>
          <h2 className="mt-2 text-4xl font-bold">
            {banners}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 h-3 w-16 rounded bg-orange-500"></div>
          <p className="text-gray-500">Featured</p>
          <h2 className="mt-2 text-4xl font-bold">
            {featured}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 h-3 w-16 rounded bg-red-600"></div>
          <p className="text-gray-500">Trending</p>
          <h2 className="mt-2 text-4xl font-bold">
            {trending}
          </h2>
        </div>

      </div>
{/* Analytics Cards */}

<div className="mt-8 grid gap-6 md:grid-cols-5">

  <div className="rounded-xl bg-white p-6 shadow">
    <div className="mb-4 h-3 w-16 rounded bg-cyan-600"></div>

    <p className="text-gray-500">
      Total Clicks
    </p>

    <h2 className="mt-2 text-4xl font-bold">
      {totalClicks}
    </h2>
  </div>

  <div className="rounded-xl bg-white p-6 shadow">
    <div className="mb-4 h-3 w-16 rounded bg-emerald-600"></div>

    <p className="text-gray-500">
      Today's Clicks
    </p>

    <h2 className="mt-2 text-4xl font-bold">
      {todayClicks}
    </h2>
  </div>

  <div className="rounded-xl bg-white p-6 shadow">
    <div className="mb-4 h-3 w-16 rounded bg-yellow-500"></div>

    <p className="text-gray-500">
      Top Product
    </p>

    <h2 className="mt-2 text-lg font-bold">
      {topProduct}
    </h2>
  </div>
<div className="rounded-xl bg-white p-6 shadow">
  <div className="mb-4 h-3 w-16 rounded bg-orange-500"></div>

  <p className="text-gray-500">
    Amazon Clicks
  </p>

  <h2 className="mt-2 text-4xl font-bold">
    {amazonClicks}
  </h2>
</div>

<div className="rounded-xl bg-white p-6 shadow">
  <div className="mb-4 h-3 w-16 rounded bg-sky-500"></div>

  <p className="text-gray-500">
    Flipkart Clicks
  </p>

  <h2 className="mt-2 text-4xl font-bold">
    {flipkartClicks}
  </h2>
</div>
</div>
      {/* Recent Products */}
      <div className="mt-10 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold">
          Recent Products
        </h2>

        {recentProducts.length === 0 ? (

          <p className="text-gray-500">
            No products found.
          </p>

        ) : (

          <div className="space-y-3">

            {recentProducts.map((product) => (

              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <p className="font-semibold">
                  {product.name}
                </p>

                <span className="font-bold text-blue-600">
                  ₹{product.price}
                </span>
              </div>

            ))}

          </div>

        )}

      </div>
      {/* Recent Clicks */}

<div className="mt-10 rounded-xl bg-white p-6 shadow">

  <h2 className="mb-4 text-xl font-bold">
    Recent Clicks
  </h2>

  {recentClicks.length === 0 ? (

    <p className="text-gray-500">
      No clicks found.
    </p>

  ) : (

    <div className="space-y-3">

     {recentClicks.slice(0, 5).map((click) => (

        <div
          key={click.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >

          <div>

            <p className="font-semibold">
              {click.product_name}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(click.clicked_at).toLocaleString()}
            </p>

          </div>

        </div>

      ))}

    </div>

  )}

</div>

{/* Top Clicked Products */}

<div className="mt-10 rounded-xl bg-white p-6 shadow">

  <h2 className="mb-4 text-xl font-bold">
    Top Clicked Products
  </h2>

  {topProducts.length === 0 ? (

    <p className="text-gray-500">
      No click data found.
    </p>

  ) : (

    <div className="space-y-3">

      {topProducts.map((item, index) => (

        <div
          key={item.name}
          className="flex items-center justify-between rounded-lg border p-3"
        >

          <div className="flex items-center gap-3">

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              {index + 1}
            </span>

            <p className="font-semibold">
              {item.name}
            </p>

          </div>

          <span className="rounded-lg bg-green-100 px-3 py-1 font-bold text-green-700">
            {item.clicks} Clicks
          </span>

        </div>

      ))}

    </div>

  )}

</div>
{/* Last 7 Days Click Chart */}

<div className="mt-10 rounded-xl bg-white p-6 shadow">

 <h2 className="mb-6 text-xl font-bold">
  {filter === "1"
    ? "Today's Clicks"
    : filter === "7"
    ? "Last 7 Days Clicks"
    : filter === "30"
    ? "Last 30 Days Clicks"
    : filter === "365"
    ? "This Year Clicks"
    : "Analytics"}
</h2>

  <div className="h-[320px]">

    <ResponsiveContainer width="100%" height="100%">

      <LineChart data={last7Days}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="day" />

        <YAxis allowDecimals={false} />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#2563eb"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>
    </div>
  );
}