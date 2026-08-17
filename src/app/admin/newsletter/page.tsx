import { supabaseServer } from "@/lib/supabase-server";

import NewsletterActions from "./NewsletterActions";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export default async function NewsletterPage() {
  const { data: subscribers, error } = await supabaseServer
    .from("newsletter_subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Newsletter subscribers error:", error);
  }

  const list = subscribers ?? [];

  return (
    <div className="space-y-6 p-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Newsletter Subscribers
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage people subscribed to your WOW BASKET newsletter.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Subscribers
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {list.length}
          </p>
        </div>

      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Subscriber List
          </h2>
        </div>

        {list.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No newsletter subscribers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-5 py-3 font-semibold text-gray-700">
                    Email
                  </th>

                  <th className="px-5 py-3 font-semibold text-gray-700">
                    Subscribed At
                  </th>
     <th className="px-5 py-3 text-right font-semibold text-gray-700">
  Actions
</th>
                </tr>
              </thead>

              <tbody className="divide-y">

                {list.map((subscriber, index) => (
                  <tr
                    key={subscriber.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-900">
                      {subscriber.email}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {subscriber.created_at
                        ? new Date(subscriber.created_at).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short",
})
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
  <NewsletterActions id={subscriber.id} />
</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}