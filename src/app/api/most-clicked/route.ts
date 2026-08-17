import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const startOfMonth = new Date();

  startOfMonth.setDate(1);

  startOfMonth.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("product_clicks")
    .select("product_id")
    .gte("clicked_at", startOfMonth.toISOString());

  if (error) {
    return NextResponse.json([]);
  }

  const counter = new Map<string, number>();

  data.forEach((item) => {
    counter.set(
      item.product_id,
      (counter.get(item.product_id) || 0) + 1
    );
  });

 const ids = Array.from(counter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map((x) => x[0]);

  if (ids.length === 0) {
    return NextResponse.json([]);
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", ids);

  return NextResponse.json(products ?? []);
}