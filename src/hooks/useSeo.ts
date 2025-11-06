import { useEffect, useRef } from 'react';

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
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  schema?: object;
  yoastData?: YoastSEOData;
  featuredImage?: string;
  pageType?: 'website' | 'article' | 'product' | 'restaurant';
}

// 📋 Registro de metadatos creados para limpieza
const createdMetaTags = new Set<HTMLElement>();
let createdCanonicalLink: HTMLLinkElement | null = null;
let createdSchemaScript: HTMLScriptElement | null = null;

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
  const isInitialized = useRef(false);
  const lastConfigRef = useRef<string>('');

  useEffect(() => {
    // 🎯 Crear un hash de la configuración actual para detectar cambios
    const currentConfig = JSON.stringify({
      title, description, ogTitle, ogDescription, ogImage,
      canonical, schema, yoastData, featuredImage, pageType
    });

    // Si la configuración no ha cambiado, no hacer nada
    if (lastConfigRef.current === currentConfig && isInitialized.current) {
      return;
    }

    // 🧹 LIMPIEZA: Eliminar metadatos anteriores solo si es necesario
    cleanupPreviousMetadata();

    // 🎯 SISTEMA DE PRIORIDADES INTELIGENTE
    const finalTitle = title ||
                      yoastData?.og_title ||
                      yoastData?.title ||
                      'Bar El Perejil - Restaurante Tradicional';

    const finalDescription = description ||
                           yoastData?.og_description ||
                           yoastData?.meta_description ||
                           'Disfruta de la auténtica cocina tradicional en Bar El Perejil. Menú casero y ambiente acogedor.';

    const finalOgImage = ogImage ||
                        yoastData?.og_image?.[0]?.url ||
                        featuredImage ||
                        '/img/logoPerejil.png';

    const finalOgTitle = ogTitle || yoastData?.og_title || finalTitle;
    const finalOgDescription = ogDescription || yoastData?.og_description || finalDescription;
    const finalCanonical = canonical || yoastData?.canonical || window.location.href;

    // 📝 Aplicar metadatos
    document.title = finalTitle;

    // 🏷️ Crear metadatos sin duplicados
    const metaConfigs = [
      { selector: 'meta[name="description"]', content: finalDescription },
      { selector: 'meta[name="keywords"]', content: 'restaurante, bar, comida tradicional, menú casero, Bar El Perejil, kit digital' },
      { selector: 'meta[name="author"]', content: 'Bar El Perejil' },
      { selector: 'meta[name="robots"]', content: 'index, follow' },

      // Open Graph
      { selector: 'meta[property="og:title"]', content: finalOgTitle },
      { selector: 'meta[property="og:description"]', content: finalOgDescription },
      { selector: 'meta[property="og:type"]', content: yoastData?.og_type || pageType },
      { selector: 'meta[property="og:locale"]', content: yoastData?.og_locale || 'es_ES' },
      { selector: 'meta[property="og:url"]', content: finalCanonical },
      { selector: 'meta[property="og:site_name"]', content: 'Bar El Perejil' },
      { selector: 'meta[property="og:image"]', content: finalOgImage },
      { selector: 'meta[property="og:image:alt"]', content: finalOgTitle },

      // Twitter Cards
      { selector: 'meta[name="twitter:card"]', content: yoastData?.twitter_card || 'summary_large_image' },
      { selector: 'meta[name="twitter:title"]', content: yoastData?.twitter_title || finalOgTitle },
      { selector: 'meta[name="twitter:description"]', content: yoastData?.twitter_description || finalOgDescription },
      { selector: 'meta[name="twitter:image"]', content: yoastData?.twitter_image || finalOgImage },
    ];

    // Añadir dimensiones de imagen si están disponibles
    if (yoastData?.og_image?.[0]?.width) {
      metaConfigs.push({
        selector: 'meta[property="og:image:width"]',
        content: yoastData.og_image[0].width.toString()
      });
    }
    if (yoastData?.og_image?.[0]?.height) {
      metaConfigs.push({
        selector: 'meta[property="og:image:height"]',
        content: yoastData.og_image[0].height.toString()
      });
    }

    // Crear metadatos de forma segura
    metaConfigs.forEach(config => {
      if (config.content) {
        createOrUpdateMetaTag(config.selector, config.content);
      }
    });

    // 🔗 Canonical URL
    createOrUpdateCanonical(finalCanonical);

    // 📊 Schema.org JSON-LD
    const finalSchema = schema || yoastData?.schema;
    if (finalSchema) {
      createOrUpdateSchema(finalSchema);
    } else if (pageType === 'restaurant') {
      // Schema específico para restaurante
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
      createOrUpdateSchema(restaurantSchema);
    }

    // Actualizar referencias
    lastConfigRef.current = currentConfig;
    isInitialized.current = true;

  }, [title, description, ogTitle, ogDescription, ogImage, canonical, schema, yoastData, featuredImage, pageType]);

  // 🧹 Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      cleanupPreviousMetadata();
    };
  }, []);
}

// 🛠️ Funciones helper

function createOrUpdateMetaTag(selector: string, content: string) {
  let meta = document.querySelector(selector) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    const [attr, value] = selector.replace(/[[\]]/g, '').split('=');
    meta.setAttribute(attr, value.replace(/"/g, ''));
    document.head.appendChild(meta);
    createdMetaTags.add(meta);
  }

  meta.setAttribute('content', content);
}

function createOrUpdateCanonical(href: string) {
  // Limpiar canonical anterior si existe
  if (createdCanonicalLink) {
    createdCanonicalLink.remove();
  }

  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
    createdCanonicalLink = canonicalLink;
  }
  canonicalLink.href = href;
}

function createOrUpdateSchema(schemaData: unknown) {
  // Limpiar schema anterior si existe
  if (createdSchemaScript) {
    createdSchemaScript.remove();
  }

  let schemaScript = document.querySelector('#schema-ld') as HTMLScriptElement;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'schema-ld';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
    createdSchemaScript = schemaScript;
  }
  schemaScript.textContent = JSON.stringify(schemaData);
}

function cleanupPreviousMetadata() {
  // Limpiar meta tags creados
  createdMetaTags.forEach(meta => {
    if (meta.parentNode) {
      meta.parentNode.removeChild(meta);
    }
  });
  createdMetaTags.clear();

  // Limpiar canonical si fue creado por nosotros
  if (createdCanonicalLink && createdCanonicalLink.parentNode) {
    createdCanonicalLink.parentNode.removeChild(createdCanonicalLink);
    createdCanonicalLink = null;
  }

  // Limpiar schema si fue creado por nosotros
  if (createdSchemaScript && createdSchemaScript.parentNode) {
    createdSchemaScript.parentNode.removeChild(createdSchemaScript);
    createdSchemaScript = null;
  }
}