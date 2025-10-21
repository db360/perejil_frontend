import { useEffect, useState } from "react";
import { pageService } from "../api/services/pageService";
import type { WordPressPage } from "../types/types";
import { extractGalleryImages, extractTextContent, type GalleryImage } from "../lib/utils";
import { apiClient } from "../api/client";

interface PageWithExtras extends Omit<WordPressPage, 'content' | 'excerpt' | '_embedded'> {
  mediaUrl?: string;
  galleryImages?: GalleryImage[];
  textContent?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

const pageCache: Record<string, PageWithExtras | null> = {};

export function usePagesByslug(slug: string) {
  const [data, setData] = useState<PageWithExtras | null>(null);
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

        if (!page) {
          setData(null);
          pageCache[slug] = null;
          return;
        }

        let mediaUrl: string | undefined = undefined;
        let galleryImages: GalleryImage[] = [];
        let textContent: string | undefined = undefined;

        // 🎬 PRIORIDAD 1: Video destacado personalizado (campo ACF/custom)
        if (page.video_destacado?.url) {
          mediaUrl = page.video_destacado.url;
          console.log('✅ Video destacado (custom field):', mediaUrl);
        }
        // Prioridad 2: Imagen/video destacado con _embed
        else if (page._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          mediaUrl = page._embedded['wp:featuredmedia'][0].source_url;
          console.log('✅ Media URL from _embedded:', mediaUrl);
        }
        // Prioridad 3: Fetch manual si tiene featured_media
        else if (page.featured_media && page.featured_media > 0) {
          try {
            const mediaResponse = await apiClient.get(`/wp-json/wp/v2/media/${page.featured_media}`);
            mediaUrl = mediaResponse.data?.source_url;
            console.log('✅ Media URL from fetch:', mediaUrl);
          } catch (err) {
            console.error('❌ Error fetching featured media:', err);
          }
        }
        // Prioridad 4: Buscar vídeos en los attachments de la página
        else {
          try {
            const attachmentsResponse = await apiClient.get(`/wp-json/wp/v2/media?parent=${page.id}`);
            const attachments = attachmentsResponse.data;

            interface AttachmentMedia {
              mime_type?: string;
              media_type?: string;
              source_url?: string;
            }
            const videoAttachment = attachments.find((media: AttachmentMedia) =>
              media.mime_type === 'video/mp4' ||
              media.mime_type === 'video/webm' ||
              media.media_type === 'video'
            );

            if (videoAttachment) {
              mediaUrl = videoAttachment.source_url;
              console.log('✅ Video encontrado en attachments:', mediaUrl);
            }
          } catch (err) {
            console.error('❌ Error fetching attachments:', err);
          }
        }

        // Fallback 5: Imagen de Yoast OG
        if (!mediaUrl && page.yoast_head_json?.og_image?.[0]?.url) {
          mediaUrl = page.yoast_head_json.og_image[0].url;
        }

        // Extraer imágenes de la galería del content
        if (page.content?.rendered) {
          galleryImages = extractGalleryImages(page.content.rendered);
          textContent = extractTextContent(page.content.rendered);
        }

        // Extraer datos SEO de Yoast
        const seoTitle = page.yoast_head_json?.og_title || page.yoast_head_json?.title;
        const seoDescription = page.yoast_head_json?.og_description;
        const ogImage = page.yoast_head_json?.og_image?.[0]?.url;

        // Crear objeto limpio
        const pageWithMedia: PageWithExtras = {
          id: page.id,
          slug: page.slug,
          title: page.title,
          featured_media: page.featured_media,
          meta: page.meta,
          video_destacado: page.video_destacado,
          yoast_head_json: page.yoast_head_json,
          mediaUrl,
          galleryImages,
          textContent,
          seoTitle,
          seoDescription,
          ogImage,
        };

        console.log('✅ Final data:', pageWithMedia);

        setData(pageWithMedia);
        pageCache[slug] = pageWithMedia;
      })
      .catch(err => {
        console.error('❌ Error loading page:', err);
        setError(err.message || "Error al cargar la página");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return { data, loading, error };
}
