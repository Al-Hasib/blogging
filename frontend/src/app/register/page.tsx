"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirm) {
      setError("পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.password_confirm);
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "নিবন্ধন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          নিবন্ধন
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {(["username", "email", "password", "password_confirm"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field === "username" ? "ব্যবহারকারীর নাম" :
                 field === "email" ? "ইমেইল" :
                 field === "password" ? "পাসওয়ার্ড" : "পাসওয়ার্ড নিশ্চিতকরণ"}
              </label>
              <input
                type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "লোড হচ্ছে..." : "নিবন্ধন"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            লগইন করুন
          </Link>
        </p>
      </main>
    </>
  );
}
