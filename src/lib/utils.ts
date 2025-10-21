export function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export function stripHtmlTags(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  srcset?: string;
  sizes?: string;
}

export function extractGalleryImages(htmlContent: string): GalleryImage[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Buscar la galería de WordPress
  const galleryBlock = doc.querySelector('.wp-block-gallery');

  if (!galleryBlock) {
    return [];
  }

  // Extraer todas las imágenes dentro de la galería
  const images = galleryBlock.querySelectorAll('img');

  return Array.from(images).map(img => ({
    id: parseInt(img.getAttribute('data-id') || '0'),
    src: img.getAttribute('src') || '',
    alt: img.getAttribute('alt') || '',
    width: parseInt(img.getAttribute('width') || '0'),
    height: parseInt(img.getAttribute('height') || '0'),
    srcset: img.getAttribute('srcset') || undefined,
    sizes: img.getAttribute('sizes') || undefined,
  }));
}

export function extractTextContent(htmlContent: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Eliminar la galería del contenido
  const gallery = doc.querySelector('.wp-block-gallery');
  if (gallery) {
    gallery.remove();
  }

  // Retornar solo el texto restante
  return doc.body.textContent?.trim() || '';
}