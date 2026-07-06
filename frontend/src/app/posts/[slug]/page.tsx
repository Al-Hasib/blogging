"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Comments } from "@/components/Comments";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { renderTiptapContent } from "@/lib/render-tiptap";

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Post>(`/posts/${params.slug}/`);
      setPost(data);
      api.post(`/posts/${params.slug}/view/`, {}).catch(() => {});
    } catch (err) {
      console.error("Failed to load post", err);
      setError(err instanceof Error ? err.message : "পোস্ট লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPost}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </main>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-gray-500">পোস্ট পাওয়া যায়নি</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <article>
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              {post.category_name && (
                <Link
                  href={`/category/${post.category}`}
                  className="rounded bg-gray-100 px-2 py-0.5 text-xs hover:bg-gray-200"
                >
                  {post.category_name}
                </Link>
              )}
              {post.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="rounded bg-gray-100 px-2 py-0.5 text-xs hover:bg-gray-200"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href={`/u/${post.author}`} className="flex items-center gap-2 hover:text-gray-700">
                {post.author_avatar && (
                  <img
                    src={post.author_avatar}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <span>{post.author_name}</span>
              </Link>
              <time>{post.published_at ? formatDate(post.published_at) : ""}</time>
              <span>{post.reading_time_minutes} মিনিট পড়া</span>
              <span>{post.views_count} বার দেখা</span>
            </div>
          </div>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="mb-8 w-full rounded-lg object-cover"
            />
          )}

          <div className="prose prose-lg max-w-none mb-12">
            {post.content_html ? (
              <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
            ) : post.content ? (
              renderTiptapContent(post.content)
            ) : null}
          </div>
        </article>

        <Comments postSlug={params.slug as string} />
      </main>
    </>
  );
}
