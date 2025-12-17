import { apiClient } from "../client";
import type { AxiosResponse } from "axios";

export interface MenuSection {
  id: number;
  count?: number;
  description?: string;
  link?: string;
  name: string;
  slug: string;
  taxonomy?: string;
  parent: number;
  meta?: { orden?: number; [key: string]: unknown };
  _links?: Record<string, unknown>;
}

export interface Product {
  id: number;
  date?: string;
  imageUrl?: string;
  date_gmt?: string;
  guid?: { rendered: string };
  modified?: string;
  modified_gmt?: string;
  slug: string;
  status?: string;
  type?: string;
  link?: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  featured_media?: number;
  template?: string;
  secciones: number[];
  ingredientes?: string;
  alergenos?: Array<{
    numero: number;
    nombre: string;
  }>;
  precio?: number;
  meta?: {
    precio?: string;
    ingredientes?: string;
    disponible?: boolean;
    [key: string]: unknown;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      media_details?: {
        sizes?: Record<string, { source_url: string }>;
      };
    }>;
  };
  _links?: Record<string, unknown>;
}

export interface SectionWithProducts {
  section: MenuSection;
  products: Product[];
}

export interface MenuWithSections {
  menu: MenuSection;
  sections: SectionWithProducts[];
}

type WordPressApiResponse<T> = AxiosResponse<T>;

let cachedMenu: MenuWithSections[] | null = null;

export const menuService = {
  _getMainSections: async (): Promise<MenuSection[]> => {
    const response: WordPressApiResponse<MenuSection[]> = await apiClient.get(
      "/wp-json/wp/v2/secciones?parent=0&_fields=id,name,slug,parent,meta,count"
    );
    return response.data;
  },

  _getSectionProducts: async (sectionId: number): Promise<Product[]> => {
    const response: WordPressApiResponse<Product[]> = await apiClient.get(
      `/wp-json/wp/v2/productos?secciones=${sectionId}&_embed`
    );
    return response.data;
  },

  _getMediaUrl: async (mediaId: number): Promise<string | undefined> => {
    try {
      const response = await apiClient.get(`/wp-json/wp/v2/media/${mediaId}`);
      return response.data?.source_url;
    } catch (error) {
      console.error(`Error fetching media ${mediaId}:`, error);
      return undefined;
    }
  },

  getCompleteMenu: async (): Promise<MenuWithSections[]> => {
    if (cachedMenu) {
      return cachedMenu;
    }

    try {
      const mainSections: MenuSection[] = await menuService._getMainSections();

      if (mainSections.length === 0) {
        throw new Error("No se encontraron secciones principales");
      }

      const sortedSections: MenuSection[] = mainSections.sort((a, b) => {
        const ordenA: number = a.meta?.orden || 0;
        const ordenB: number = b.meta?.orden || 0;
        return ordenA - ordenB;
      });

      const sectionsWithProducts: SectionWithProducts[] = await Promise.all(
        sortedSections.map(
          async (section: MenuSection): Promise<SectionWithProducts> => {
            try {
              const products: Product[] = await menuService._getSectionProducts(section.id);

              // Obtener imágenes: primero intenta con _embedded, si no, fetch individual
              const productsWithImages = await Promise.all(
                products.map(async (product) => {
                  let imageUrl: string | undefined;

                  // Intenta obtener la imagen de _embedded
                  if (product._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
                    imageUrl = product._embedded['wp:featuredmedia'][0].source_url;
                  }
                  // Si no está en _embedded pero tiene featured_media, haz fetch
                  else if (product.featured_media) {
                    imageUrl = await menuService._getMediaUrl(product.featured_media);
                  }

                  return {
                    ...product,
                    imageUrl,
                  };
                })
              );

              return {
                section,
                products: productsWithImages,
              };
            } catch (error) {
              console.error(
                `Error fetching products for section ${section.name}:`,
                error
              );
              return {
                section,
                products: [],
              };
            }
          }
        )
      );

      const menuContainer: MenuSection = {
        id: 0,
        name: "Menú Principal",
        slug: "menu-principal",
        parent: 0,
        description: "Menú completo del restaurante",
        count: sectionsWithProducts.reduce(
          (total, section) => total + section.products.length,
          0
        ),
      };

      const result: MenuWithSections[] = [
        {
          menu: menuContainer,
          sections: sectionsWithProducts,
        },
      ];

      cachedMenu = result;
      return result;
    } catch (error) {
      console.error("Error al obtener el menú completo:", error);
      throw error;
    }
  },
} as const;
