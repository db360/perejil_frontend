import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function useSEO({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
}: SEOProps) {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title;
    }

    // Meta tags helper
    const setMetaTag = (selector: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        const [attr, value] = selector.replace(/[[\]]/g, '').split('=');
        meta.setAttribute(attr, value.replace(/"/g, ''));
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (description) {
      setMetaTag('meta[name="description"]', description);
    }
    if (ogTitle) {
      setMetaTag('meta[property="og:title"]', ogTitle);
    }
    if (ogDescription) {
      setMetaTag('meta[property="og:description"]', ogDescription);
    }
    if (ogImage) {
      setMetaTag('meta[property="og:image"]', ogImage);
    }
  }, [title, description, ogTitle, ogDescription, ogImage]);
}