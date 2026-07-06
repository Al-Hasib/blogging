export interface User {
  id: number;
  username: string;
  email: string;
  profile: {
    bangla_display_name: string;
    bio: string;
    avatar: string | null;
    twitter: string;
    github: string;
    website: string;
  };
}

export interface PublicUser {
  id: number;
  username: string;
  profile: {
    bangla_display_name: string;
    bio: string;
    avatar: string | null;
    twitter: string;
    github: string;
    website: string;
  };
  post_count: number;
}

export interface Category {
  id: number;
  name_bn: string;
  name_en: string;
  slug: string;
  description: string;
  post_count: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  author: number;
  author_name: string;
  author_avatar?: string;
  content?: Record<string, unknown>;
  content_html?: string;
  excerpt: string;
  cover_image: string | null;
  category: number | null;
  category_name: string | null;
  tags: string[];
  status: "draft" | "in_review" | "published";
  published_at: string | null;
  reading_time_minutes: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post: number;
  author: number;
  author_name: string;
  author_avatar: string | null;
  parent: number | null;
  body: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  replies: Comment[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
