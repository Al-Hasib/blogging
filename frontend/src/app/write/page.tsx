"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Editor } from "@/components/Editor";
import { api, getToken } from "@/lib/api";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [excerpt, setExcerpt] = useState("");
  const [postId, setPostId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const token = getToken();
      if (postId) {
        await api.patch(`/posts/${postId}/`, { title, content, excerpt }, token || undefined);
      } else {
        const data = await api.post<{ slug: string }>(
          "/posts/",
          { title, content, excerpt, status: "draft" },
          token || undefined
        );
        setPostId(data.slug);
      }
    } catch (err) {
      console.error("Failed to save", err);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    await handleSave();
    if (!postId) return;
    try {
      const token = getToken();
      await api.post(`/posts/${postId}/publish/`, {}, token || undefined);
      router.push(`/posts/${postId}`);
    } catch (err) {
      console.error("Failed to publish", err);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">নতুন পোস্ট</h1>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? "সেভ হচ্ছে..." : "খসড়া সেভ"}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              প্রকাশ করুন
            </button>
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="পোস্টের শিরোনাম লিখুন..."
          className="mb-6 w-full border-0 border-b border-gray-300 pb-2 text-3xl font-bold text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        />

        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="সংক্ষিপ্ত বিবরণ (সারাংশ)..."
          rows={2}
          className="mb-6 w-full rounded-lg border border-gray-300 p-3 text-gray-600 focus:border-blue-500 focus:outline-none"
        />

        <Editor content={content} onChange={setContent} />
      </main>
    </>
  );
}
