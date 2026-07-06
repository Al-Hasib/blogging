"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { api, getToken } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Post, PaginatedResponse } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    async function fetchPosts() {
      try {
        const token = getToken();
        const data = await api.get<PaginatedResponse<Post>>(
          `/posts/?author=${user?.username}`,
          token || undefined
        );
        setPosts(data.results);
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [isAuthenticated, authLoading, user, router]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ড্যাশবোর্ড</h1>
            <p className="text-sm text-gray-500">
              স্বাগতম, {user?.profile?.bangla_display_name || user?.username}
            </p>
          </div>
          <Link
            href="/write"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            নতুন পোস্ট
          </Link>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            আপনার পোস্টসমূহ
          </h2>
          {loading ? (
            <p className="text-gray-500">লোড হচ্ছে...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">কোনো পোস্ট নেই। প্রথম পোস্ট লিখুন!</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {post.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : post.status === "in_review"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {post.status === "published"
                          ? "প্রকাশিত"
                          : post.status === "in_review"
                          ? "পর্যালোচনায়"
                          : "খসড়া"}
                      </span>
                      <span>{post.reading_time_minutes} মিনিট</span>
                      <time>{formatDate(post.created_at)}</time>
                    </div>
                  </div>
                  <Link
                    href={`/write/${post.slug}/edit`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    সম্পাদনা
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
