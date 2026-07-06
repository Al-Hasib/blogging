"use client";

import { useEffect, useState } from "react";
import { api, getToken } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { Comment as CommentType } from "@/lib/types";

export function Comments({ postSlug }: { postSlug: string }) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<CommentType[]>(`/posts/${postSlug}/comments/`)
      .then(setComments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    try {
      const token = getToken();
      const data = await api.post<CommentType>(
        `/posts/${postSlug}/comments/`,
        { body, parent: replyTo },
        token || undefined
      );
      if (replyTo) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyTo
              ? { ...c, replies: [...(c.replies || []), data] }
              : c
          )
        );
      } else {
        setComments((prev) => [...prev, data]);
      }
      setBody("");
      setReplyTo(null);
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  }

  function renderComment(comment: CommentType, isReply = false) {
    return (
      <div key={comment.id} className={isReply ? "ml-8 mt-4" : "mt-6"}>
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {comment.author_name}
            </span>
            <time>{formatDate(comment.created_at)}</time>
          </div>
          <p className="text-gray-800">{comment.body}</p>
          {isAuthenticated && !isReply && (
            <button
              onClick={() => setReplyTo(comment.id)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              উত্তর দিন
            </button>
          )}
        </div>
        {comment.replies?.map((reply) => renderComment(reply, true))}
      </div>
    );
  }

  return (
    <section className="border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        মন্তব্য ({comments.length})
      </h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="mb-2 text-sm text-gray-500">
              কারো উত্তরে: <button onClick={() => setReplyTo(null)} className="text-blue-600">বাতিল</button>
            </div>
          )}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="আপনার মন্তব্য লিখুন..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            মন্তব্য করুন
          </button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-gray-500">
          মন্তব্য করতে <a href="/login" className="text-blue-600">লগইন</a> করুন
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">লোড হচ্ছে...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">কোনো মন্তব্য নেই</p>
      ) : (
        comments.map((c) => renderComment(c))
      )}
    </section>
  );
}
