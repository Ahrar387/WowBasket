import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      product_id,
      product_name,
      affiliate_store,
    } = body;

    if (!product_id || !product_name) {
      return NextResponse.json(
        {
          error: "Missing product data",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabase
      .from("product_clicks")
      .insert({
        product_id,
        product_name,
        affiliate_store,
      });
await supabase.rpc("increment_product_click", {
  product_id_input: product_id,
});
    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}