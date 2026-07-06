import React from "react";

type TiptapNode = {
  type: string;
  text?: string;
  content?: TiptapNode[];
  marks?: { type: string; attrs?: Record<string, string> }[];
  attrs?: Record<string, string | number | boolean>;
};

function renderNode(node: TiptapNode, key: number): React.ReactNode {
  if (node.type === "text") {
    let text = node.text || "";
    if (node.marks) {
      for (const mark of node.marks) {
        switch (mark.type) {
          case "bold":
            text = `<strong>${text}</strong>`;
            break;
          case "italic":
            text = `<em>${text}</em>`;
            break;
          case "code":
            text = `<code>${text}</code>`;
            break;
          case "link":
            text = `<a href="${mark.attrs?.href || "#"}">${text}</a>`;
            break;
          case "underline":
            text = `<u>${text}</u>`;
            break;
          case "strike":
            text = `<s>${text}</s>`;
            break;
        }
      }
    }
    return <span key={key} dangerouslySetInnerHTML={{ __html: text }} />;
  }

  const children = node.content?.map((child, i) => renderNode(child, i)) || null;

  switch (node.type) {
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const level = (node.attrs?.level as number) || 2;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag key={key}>{children}</Tag>;
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "codeBlock":
      return (
        <pre key={key} className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{node.content?.[0]?.text || ""}</code>
        </pre>
      );
    case "blockquote":
      return <blockquote key={key} className="border-l-4 border-gray-300 pl-4 italic">{children}</blockquote>;
    case "image":
      return (
        <img
          key={key}
          src={node.attrs?.src as string}
          alt={node.attrs?.alt as string || ""}
          className="my-4 rounded-lg"
        />
      );
    case "horizontalRule":
      return <hr key={key} className="my-8" />;
    case "hardBreak":
      return <br key={key} />;
    default:
      return children || null;
  }
}

export function renderTiptapContent(content: Record<string, unknown>): React.ReactNode {
  const doc = content as TiptapNode;
  if (!doc?.content) return null;
  return <div className="space-y-4">{doc.content.map((node, i) => renderNode(node, i))}</div>;
}
