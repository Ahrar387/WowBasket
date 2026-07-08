"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-3 text-gray-600">
        Welcome to your Admin Panel 🚀
      </p>
    </div>
  );
}