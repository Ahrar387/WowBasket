"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [settings, setSettings] = useState({
    site_name: "WOW BASKET",
    phone: "",
    email: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

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
      phone: data.phone || "",
      email: data.email || "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSending(true);

    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

    setSending(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Message Sent Successfully ✅");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  return (
    <div className="container-site py-12">
      <h1 className="mb-8 text-4xl font-bold">
        Contact Us
      </h1>

      <div className="grid gap-10 lg:grid-cols-2">

        {/* Contact Form */}

        <div className="rounded-xl bg-white p-8 shadow">

          <h2 className="mb-6 text-2xl font-semibold">
            Send us a Message
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-lg border p-3"
            />

            <input
              type="email"
              placeholder="Your Email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full rounded-lg border p-3"
            />

            <input
              type="text"
              placeholder="Subject"
              required
              value={form.subject}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
              className="w-full rounded-lg border p-3"
            />

            <textarea
              rows={6}
              placeholder="Your Message"
              required
              value={form.message}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
              className="w-full rounded-lg border p-3"
            />

            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>

        {/* Contact Details */}

        <div className="rounded-xl bg-white p-8 shadow">

          <h2 className="mb-6 text-2xl font-semibold">
            Contact Information
          </h2>

          <div className="space-y-6">

            <div>
              <h3 className="font-semibold">
                Website
              </h3>

              <p>{settings.site_name}</p>
            </div>

            <div>
              <h3 className="font-semibold">
                Email
              </h3>

              <p>{settings.email || "Not Available"}</p>
            </div>

            <div>
              <h3 className="font-semibold">
                Phone
              </h3>

              <p>{settings.phone || "Not Available"}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}