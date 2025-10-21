export interface WordPressPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  featured_media: number;
  meta?: Record<string, unknown>;
  video_destacado?: {
    id: number;
    url: string;
    mime_type: string;
  };
  yoast_head_json?: {
    title?: string;
    og_description?: string;
    og_image?: Array<{ url: string }>;
    og_title?: string;
    canonical?: string;
    schema?: unknown;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      id: number;
      source_url: string;
      media_details?: {
        sizes?: Record<string, { source_url: string }>;
      };
    }>;
  };
}
