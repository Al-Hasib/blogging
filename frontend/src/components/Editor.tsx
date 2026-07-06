"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { createLowlight, common } from "lowlight";
import { useCallback } from "react";

const lowlight = createLowlight(common);

interface EditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Image,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "এখানে লিখুন... (Bangla + English supported)",
      }),
      Underline,
    ],
    content: Object.keys(content).length > 0 ? content : {
      type: "doc",
      content: [{ type: "paragraph", content: [] }],
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-4",
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-gray-200">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-3 py-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-1.5 text-sm ${editor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-1.5 text-sm ${editor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded p-1.5 text-sm ${editor.isActive("underline") ? "bg-gray-200" : "hover:bg-gray-100"}`}
          title="Underline"
        >
          <u>U</u>
        </button>
        <span className="mx-1 text-gray-300">|</span>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded p-1.5 text-sm ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : "hover:bg-gray-100"}`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded p-1.5 text-sm ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : "hover:bg-gray-100"}`}
          title="Heading 3"
        >
          H3
        </button>
        <span className="mx-1 text-gray-300">|</span>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-1.5 text-sm ${editor.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-100"}`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-1.5 text-sm ${editor.isActive("orderedList") ? "bg-gray-200" : "hover:bg-gray-100"}`}
          title="Ordered List"
        >
          1. List
        </button>
        <span className="mx-1 text-gray-300">|</span>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`rounded p-1.5 text-sm ${editor.isActive("codeBlock") ? "bg-gray-200" : "hover:bg-gray-100"}`}
          title="Code Block"
        >
          {"</>"}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded p-1.5 text-sm ${editor.isActive("blockquote") ? "bg-gray-200" : "hover:bg-gray-100"}`}
          title="Quote"
        >
          "
        </button>
        <button
          onClick={addImage}
          className="rounded p-1.5 text-sm hover:bg-gray-100"
          title="Image"
        >
          🖼
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
