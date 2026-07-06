"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { api } from "@/lib/api";
import type { Post, PaginatedResponse } from "@/lib/types";

export default function TagPage() {
  const params = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PaginatedResponse<Post>>(`/posts/?tags__name=${params.slug}`)
      .then((data) => setPosts(data.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.slug]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          ট্যাগ: {params.slug}
        </h1>
        {loading ? (
          <p className="text-gray-500">লোড হচ্ছে...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">কোনো পোস্ট নেই</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
