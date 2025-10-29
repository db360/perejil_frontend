import { useEffect } from 'react';

interface YoastSEOData {
  title?: string;
  og_description?: string;
  og_image?: Array<{ url: string; width?: number; height?: number }>;
  og_title?: string;
  canonical?: string;
  schema?: unknown;
  meta_description?: string;
  og_type?: string;
  og_locale?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
}

interface SEOProps {
  // Datos directos (prioridad alta)
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  schema?: object;

  // Datos de Yoast (se extraen automáticamente)
  yoastData?: YoastSEOData;

  // Datos específicos de la página/producto
  featuredImage?: string;
  pageType?: 'website' | 'article' | 'product' | 'restaurant';
}

export function useSEO({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  canonical,
  schema,
  yoastData,
  featuredImage,
  pageType = 'website'
}: SEOProps) {
  useEffect(() => {
    // 🎯 SISTEMA DE PRIORIDADES INTELIGENTE

    // 1. Title: Manual > Yoast og_title > Yoast title > Fallback
    const finalTitle = title ||
                      yoastData?.og_title ||
                      yoastData?.title ||
                      'Bar El Perejil - Restaurante Tradicional';

    // 2. Description: Manual > Yoast og_description > Yoast meta_description > Fallback
    const finalDescription = description ||
                           yoastData?.og_description ||
                           yoastData?.meta_description ||
                           'Disfruta de la auténtica cocina tradicional en Bar El Perejil. Menú casero y ambiente acogedor.';

    // 3. OG Image: Manual > Yoast og_image > Featured Image > Fallback
    const finalOgImage = ogImage ||
                        yoastData?.og_image?.[0]?.url ||
                        featuredImage ||
                        '/img/logoPerejil.png';

    // 4. OG Title: Manual > Yoast og_title > Final Title
    const finalOgTitle = ogTitle || yoastData?.og_title || finalTitle;

    // 5. OG Description: Manual > Yoast og_description > Final Description
    const finalOgDescription = ogDescription || yoastData?.og_description || finalDescription;

    // 6. Canonical: Manual > Yoast canonical > Current URL
    const finalCanonical = canonical || yoastData?.canonical || window.location.href;

    // 📝 Aplicar metadatos
    document.title = finalTitle;

    const setMetaTag = (selector: string, content: string) => {
      if (!content) return; // No crear tags vacíos

      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        const [attr, value] = selector.replace(/[[\]]/g, '').split('=');
        meta.setAttribute(attr, value.replace(/"/g, ''));
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Meta tags básicos
    setMetaTag('meta[name="description"]', finalDescription);
    setMetaTag('meta[name="keywords"]', 'restaurante, bar, comida tradicional, menú casero, Bar El Perejil, kit digital');
    setMetaTag('meta[name="author"]', 'Bar El Perejil');
    setMetaTag('meta[name="robots"]', 'index, follow');

    // Open Graph
    setMetaTag('meta[property="og:title"]', finalOgTitle);
    setMetaTag('meta[property="og:description"]', finalOgDescription);
    setMetaTag('meta[property="og:type"]', yoastData?.og_type || pageType);
    setMetaTag('meta[property="og:locale"]', yoastData?.og_locale || 'es_ES');
    setMetaTag('meta[property="og:url"]', finalCanonical);
    setMetaTag('meta[property="og:site_name"]', 'Bar El Perejil');

    if (finalOgImage) {
      setMetaTag('meta[property="og:image"]', finalOgImage);
      setMetaTag('meta[property="og:image:alt"]', finalOgTitle);

      // Dimensiones de imagen si están disponibles
      if (yoastData?.og_image?.[0]?.width) {
        setMetaTag('meta[property="og:image:width"]', yoastData.og_image[0].width.toString());
      }
      if (yoastData?.og_image?.[0]?.height) {
        setMetaTag('meta[property="og:image:height"]', yoastData.og_image[0].height.toString());
      }
    }

    // Twitter Cards
    setMetaTag('meta[name="twitter:card"]', yoastData?.twitter_card || 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', yoastData?.twitter_title || finalOgTitle);
    setMetaTag('meta[name="twitter:description"]', yoastData?.twitter_description || finalOgDescription);
    if (yoastData?.twitter_image || finalOgImage) {
      setMetaTag('meta[name="twitter:image"]', yoastData?.twitter_image || finalOgImage);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = finalCanonical;

    // Schema.org JSON-LD (priorizar Yoast schema)
    const finalSchema = schema || yoastData?.schema;
    if (finalSchema) {
      let schemaScript = document.querySelector('#schema-ld') as HTMLScriptElement | null;
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-ld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(finalSchema);
    }

    // 🍽️ Schema específico para restaurante si no hay otro
    if (!finalSchema && pageType === 'restaurant') {
      const restaurantSchema = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Bar El Perejil",
        "description": finalDescription,
        "image": finalOgImage,
        "url": finalCanonical,
        "telephone": "+34912345678",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Calle Ejemplo, 123",
          "addressLocality": "Madrid",
          "postalCode": "28001",
          "addressCountry": "ES"
        },
        "servesCuisine": "Spanish",
        "priceRange": "€€",
        "openingHours": [
          "Mo-Fr 12:00-24:00",
          "Sa 12:00-02:00",
          "Su 12:00-22:00"
        ]
      };

      let schemaScript = document.querySelector('#schema-ld') as HTMLScriptElement | null;
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-ld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(restaurantSchema);
    }

  }, [title, description, ogTitle, ogDescription, ogImage, canonical, schema, yoastData, featuredImage, pageType]);
}