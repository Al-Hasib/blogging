"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await api.get<Post>(`/posts/${params.slug}/`);
        setPost(data);
        // Increment view count
        api.post(`/posts/${params.slug}/view/`, {}).catch(() => {});
      } catch (err) {
        console.error("Failed to load post", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params.slug]);

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
          {/* Meta */}
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

          {/* Cover Image */}
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="mb-8 w-full rounded-lg object-cover"
            />
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content_html ? (
              <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
            ) : post.content ? (
              renderTiptapContent(post.content)
            ) : null}
          </div>
        </article>

        {/* Comments */}
        <Comments postSlug={params.slug as string} />
      </main>
    </>
  );
}
