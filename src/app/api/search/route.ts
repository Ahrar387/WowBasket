import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabaseServer
    .from("products")
    .select("id, name, slug, image")
    .ilike("name", `%${q}%`)
    .limit(5);

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}