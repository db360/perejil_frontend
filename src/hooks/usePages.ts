import { useEffect, useState } from "react";
import { pageService } from "../api/services/pageService";
import type { WordPressPage } from "../types/types";
import { apiClient } from "../api/client";

const pageCache: Record<string, (WordPressPage & { mediaUrl?: string }) | null> = {};

export function usePagesByslug(slug: string) {
  const [data, setData] = useState<(WordPressPage & { mediaUrl?: string }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    if (pageCache[slug] !== undefined) {
      setData(pageCache[slug]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    pageService.getPagesBySlug(slug)
      .then(async res => {
        const page = res.data?.[0] ?? null;
        let mediaUrl: string | undefined = undefined;

        // Si hay attachment, haz fetch y extrae source_url
        if (page?._links?.["wp:attachment"]?.[0]?.href) {
          try {
            const mediaRes = await apiClient.get(page._links["wp:attachment"][0].href.replace("http://localhost:8882", "")); // quita el host si usas baseURL
            const mediaObj = mediaRes.data?.[0];
            mediaUrl = mediaObj?.source_url;
          } catch {
            // Si falla, ignora
            setError("Error al cargar la imagen adjunta ");
          }
        }

        const pageWithMedia = page ? { ...page, mediaUrl } : null;

        setData(pageWithMedia);

        pageCache[slug] = pageWithMedia;
      })
      .catch(err => setError(err.message || "Error al cargar la página"))
      .finally(() => setLoading(false));
  }, [slug]);

  return { data, loading, error };
}
