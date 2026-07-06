"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch {
      setError("লগইন ব্যর্থ হয়েছে। ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          লগইন
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ব্যবহারকারীর নাম
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "লোড হচ্ছে..." : "লগইন"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            নিবন্ধন করুন
          </Link>
        </p>
      </main>
    </>
  );
}
