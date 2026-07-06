import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate, truncate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        {post.category_name && (
          <Link
            href={`/category/${post.category}`}
            className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
          >
            {post.category_name}
          </Link>
        )}
        <span>{post.reading_time_minutes} মিনিট পড়া</span>
      </div>

      <Link href={`/posts/${post.slug}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
          {post.title}
        </h3>
      </Link>

      {post.excerpt && (
        <p className="text-sm text-gray-600 mb-4">
          {truncate(post.excerpt, 150)}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <Link
          href={`/u/${post.author}`}
          className="hover:text-gray-700"
        >
          {post.author_name}
        </Link>
        <time>{formatDate(post.created_at)}</time>
      </div>
    </article>
  );
}
