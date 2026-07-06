import React from "react";

type TiptapMark = {
  type: string;
  attrs?: Record<string, string>;
};

type TiptapNode = {
  type: string;
  text?: string;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  attrs?: Record<string, string | number | boolean>;
};

function sanitizeUrl(url: string): string {
  if (!url) return "";
  const allowedProtocols = ["http:", "https:", "mailto:", "tel:"];
  try {
    const parsed = new URL(url, "https://example.com");
    if (!allowedProtocols.includes(parsed.protocol)) return "";
    return url;
  } catch {
    return "";
  }
}

function renderText(text: string, marks?: TiptapMark[], key?: number): React.ReactNode[] {
  let elements: React.ReactNode[] = [text];

  if (marks) {
    for (const mark of marks) {
      switch (mark.type) {
        case "bold":
          elements = [React.createElement("strong", { key }, ...elements)];
          break;
        case "italic":
          elements = [React.createElement("em", { key }, ...elements)];
          break;
        case "code":
          elements = [React.createElement("code", { key, className: "rounded bg-gray-100 px-1 py-0.5 text-sm" }, ...elements)];
          break;
        case "underline":
          elements = [React.createElement("u", { key }, ...elements)];
          break;
        case "strike":
          elements = [React.createElement("s", { key }, ...elements)];
          break;
        case "link": {
          const href = sanitizeUrl(mark.attrs?.href || "");
          if (!href) break;
          elements = [React.createElement("a", { key, href, className: "text-blue-600 underline hover:text-blue-800", rel: "noopener noreferrer", target: "_blank" }, ...elements)];
          break;
        }
      }
    }
  }

  return elements;
}

function renderNode(node: TiptapNode, key: number): React.ReactNode {
  if (node.type === "text") {
    const rendered = renderText(node.text || "", node.marks, key);
    return React.createElement(React.Fragment, { key }, ...rendered);
  }

  const children = node.content?.map((child, i) => renderNode(child, i)) || null;

  switch (node.type) {
    case "paragraph":
      return React.createElement("p", { key, className: "mb-4" }, children);
    case "heading": {
      const level = Math.min(Math.max((node.attrs?.level as number) || 2, 1), 6);
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      const headingClasses: Record<string, string> = {
        h1: "text-3xl font-bold mb-4 mt-8",
        h2: "text-2xl font-bold mb-3 mt-6",
        h3: "text-xl font-semibold mb-2 mt-4",
        h4: "text-lg font-semibold mb-2 mt-4",
      };
      return React.createElement(Tag, { key, className: headingClasses[Tag] || "font-bold mb-2 mt-4" }, children);
    }
    case "bulletList":
      return React.createElement("ul", { key, className: "mb-4 list-disc pl-6" }, children);
    case "orderedList":
      return React.createElement("ol", { key, className: "mb-4 list-decimal pl-6" }, children);
    case "listItem":
      return React.createElement("li", { key, className: "mb-1" }, children);
    case "codeBlock":
      return React.createElement("pre", { key, className: "mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100" },
        React.createElement("code", null, node.content?.[0]?.text || "")
      );
    case "blockquote":
      return React.createElement("blockquote", { key, className: "mb-4 border-l-4 border-gray-300 pl-4 italic text-gray-600" }, children);
    case "image": {
      const src = sanitizeUrl((node.attrs?.src as string) || "");
      if (!src) return null;
      return React.createElement("img", {
        key,
        src,
        alt: (node.attrs?.alt as string) || "",
        className: "my-4 rounded-lg",
      });
    }
    case "horizontalRule":
      return React.createElement("hr", { key, className: "my-8 border-gray-200" });
    case "hardBreak":
      return React.createElement("br", { key });
    default:
      return children || null;
  }
}

export function renderTiptapContent(content: Record<string, unknown>): React.ReactNode {
  const doc = content as TiptapNode;
  if (!doc?.content) return null;
  return React.createElement("div", { className: "space-y-4" },
    ...doc.content.map((node, i) => renderNode(node, i))
  );
}
