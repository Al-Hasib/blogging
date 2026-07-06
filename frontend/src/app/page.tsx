"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { api } from "@/lib/api";
import type { Post, Category, PaginatedResponse } from "@/lib/types";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsData, catsData] = await Promise.all([
          api.get<PaginatedResponse<Post>>("/posts/"),
          api.get<Category[]>("/categories/"),
        ]);
        setPosts(postsData.results);
        setCategories(catsData as unknown as Category[]);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            বাংলায় প্রোগ্রামিং ব্লগ
          </h1>
          <p className="text-lg text-gray-600">
            প্রোগ্রামিং, প্রযুক্তি, এবং ডেভেলপমেন্ট বিষয়ক লেখা পড়ুন ও লিখুন
          </p>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="mb-12">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  {cat.name_bn}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Posts */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            সাম্প্রতিক পোস্ট
          </h2>
          {loading ? (
            <p className="text-gray-500">লোড হচ্ছে...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">কোনো পোস্ট পাওয়া যায়নি</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
