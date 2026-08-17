"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMessages(data);
    }

    setLoading(false);
  }

  async function deleteMessage(id: string) {
    const ok = confirm("Delete this message?");

    if (!ok) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchMessages();
  }

  if (loading) {
    return <p>Loading Messages...</p>;
  }

  return (
    <div className="max-w-7xl">

      <h1 className="mb-8 text-3xl font-bold">
        Contact Messages
      </h1>

      <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Subject</th>

              <th className="p-4 text-left">Message</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-center">Action</th>

            </tr>

          </thead>

          <tbody>

            {messages.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="p-10 text-center text-gray-500"
                >
                  No Messages Found
                </td>

              </tr>

            ) : (

              messages.map((item) => (

                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="p-4 font-medium">
                    {item.name}
                  </td>

                  <td className="p-4">
                    {item.email}
                  </td>

                  <td className="p-4">
                    {item.subject}
                  </td>

                  <td className="p-4 max-w-sm">
                    {item.message}
                  </td>

                  <td className="p-4">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => deleteMessage(item.id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}