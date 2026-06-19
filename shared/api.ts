/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ─── Netflix / Supabase Types ─────────────────────────────────────────────

export interface Content {
  id: string;
  title: string;
  description: string | null;
  backdrop_path: string | null;
  poster_path: string | null;
  content_type: "movie" | "series";
  year: string | null;
  rating: string | null;
  seasons: string | null;
  match_percentage: number | null;
  is_hero: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  card_type: "backdrop" | "poster" | "continue";
  created_at: string;
}

export interface CategoryContent {
  id: string;
  category_id: string;
  content_id: string;
  display_order: number;
  rank: number | null;
  progress: number | null;
  label: string | null;
  contents: Content;
}

export interface CategoryWithContents extends Category {
  category_contents: CategoryContent[];
}
