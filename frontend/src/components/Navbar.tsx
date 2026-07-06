"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            বাংলা টেক ব্লগ
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              অনুসন্ধান
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/write"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  লিখুন
                </Link>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  {user?.profile?.bangla_display_name || user?.username}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  লগআউট
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  নিবন্ধন
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
