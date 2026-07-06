const BANGLA_DIGITS: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
};

export function toBanglaNumerals(num: number): string {
  return String(num).replace(/\d/g, (d) => BANGLA_DIGITS[d] || d);
}

export function formatDate(dateStr: string, bangla = false): string {
  const date = new Date(dateStr);
  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  if (bangla) {
    return `${toBanglaNumerals(day)} ${month} ${toBanglaNumerals(year)}`;
  }
  return `${day} ${month} ${year}`;
}

export function estimateReadingTime(content: unknown): number {
  const text = extractText(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 160));
}

function extractText(node: unknown): string {
  if (typeof node === "string") return node;
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (n.type === "text") return String(n.text || "");
  const content = n.content;
  if (Array.isArray(content)) {
    return content.map(extractText).join(" ");
  }
  return "";
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}
