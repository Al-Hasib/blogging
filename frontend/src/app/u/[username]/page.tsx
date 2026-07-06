"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { api } from "@/lib/api";
import type { PublicUser, Post, PaginatedResponse } from "@/lib/types";

export default function AuthorPage() {
  const params = useParams();
  const [author, setAuthor] = useState<PublicUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, postsData] = await Promise.all([
          api.get<PublicUser>(`/users/${params.username}/`),
          api.get<PaginatedResponse<Post>>(`/posts/?author__username=${params.username}`),
        ]);
        setAuthor(userData);
        setPosts(postsData.results);
      } catch (err) {
        console.error("Failed to load author", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.username]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </main>
      </>
    );
  }

  if (!author) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-gray-500">লেখক পাওয়া যায়নি</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          {author.profile.avatar && (
            <img
              src={author.profile.avatar}
              alt=""
              className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
            />
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {author.profile.bangla_display_name || author.username}
          </h1>
          {author.profile.bio && (
            <p className="mt-2 text-gray-600">{author.profile.bio}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {author.post_count} টি পোস্ট
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </>
  );
}
