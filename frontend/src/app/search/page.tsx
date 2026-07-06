"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { api } from "@/lib/api";
import type { Post, PaginatedResponse } from "@/lib/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchQuery(query);
    if (query) {
      setLoading(true);
      api.get<PaginatedResponse<Post>>(`/search/?q=${encodeURIComponent(query)}`)
        .then((data) => setResults(data.results))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [query]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery)}`);
      setLoading(true);
      api.get<PaginatedResponse<Post>>(`/search/?q=${encodeURIComponent(searchQuery)}`)
        .then((data) => setResults(data.results))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">অনুসন্ধান</h1>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Bangla বা English এ অনুসন্ধান করুন..."
              className="flex-1 rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              অনুসন্ধান
            </button>
          </div>
        </form>

        {loading ? (
          <p className="text-gray-500">অনুসন্ধান চলছে...</p>
        ) : query ? (
          results.length === 0 ? (
            <p className="text-gray-500">কোনো ফলাফল পাওয়া যায়নি</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )
        ) : null}
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </main>
      </>
    }>
      <SearchContent />
    </Suspense>
  );
}
