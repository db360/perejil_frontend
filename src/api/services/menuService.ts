import { apiClient } from "../client";
import type { AxiosResponse } from "axios";

/**
 * Sección del menú en WordPress
 */
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

/**
 * Producto del menú en WordPress
 */
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
  alergenos?: number[];
  precio?: number | string;
  meta?: {
    precio?: string;
    ingredientes?: string;
    disponible?: boolean;
    [key: string]: unknown;
  };
  _links?: Record<string, unknown>;
}

/**
 * Sección con todos sus productos
 */
export interface SectionWithProducts {
  section: MenuSection;
  products: Product[];
}

/**
 * Menú completo con secciones y productos
 */
export interface MenuWithSections {
  menu: MenuSection;
  sections: SectionWithProducts[];
}

type WordPressApiResponse<T> = AxiosResponse<T>;

/**
 * Servicio simplificado para gestionar el menú del restaurante
 * Utiliza la API REST de WordPress para obtener secciones y productos
 */

async function getImageUrl(
  featuredMediaId?: number
): Promise<string | undefined> {
  if (!featuredMediaId) return undefined;
  try {
    const response = await apiClient.get(
      `/wp-json/wp/v2/media/${featuredMediaId}`
    );
    return response.data?.source_url;
  } catch {
    return undefined;
  }
}

let cachedMenu: MenuWithSections[] | null = null;
export const menuService = {
  /**
   * Obtiene las secciones principales del menú (parent=0)
   * @private - Método interno usado por getCompleteMenu
   */
  _getMainSections: async (): Promise<MenuSection[]> => {
    const response: WordPressApiResponse<MenuSection[]> = await apiClient.get(
      "/wp-json/wp/v2/secciones?parent=0"
    );
    return response.data;
  },

  /**
   * Obtiene todos los productos de una sección específica del menú
   * @private - Método interno usado por getCompleteMenu
   */
  _getSectionProducts: async (sectionId: number): Promise<Product[]> => {
    const response: WordPressApiResponse<Product[]> = await apiClient.get(
      `/wp-json/wp/v2/productos?secciones=${sectionId}`
    );
    return response.data;
  },

  /**
   * Obtiene el menú completo con todas sus secciones y productos organizados
   * Este es el método principal para mostrar el menú completo en la aplicación
   *
   * Características:
   * - Obtiene todas las secciones principales
   * - Ordena las secciones por el campo meta 'orden'
   * - Carga todos los productos de cada sección en paralelo
   * - Maneja errores de productos individuales sin fallar toda la operación
   *
   * @param {number} [menuId] - ID del menú específico (opcional, se usa el principal por defecto)
   * @returns {Promise<MenuWithSections[]>} Array con el menú completo organizado
   * @throws {ApiError} Error si no se pueden obtener las secciones principales
   *
   * @example
   * ```typescript
   * // Obtener el menú completo
   * const completeMenu = await menuService.getCompleteMenu();
   * console.log('Menú completo:', completeMenu);
   *
   * // Iterar sobre las secciones y productos
   * completeMenu[0].sections.forEach(sectionData => {
   *   console.log(`Sección: ${sectionData.section.name}`);
   *   sectionData.products.forEach(product => {
   *     console.log(`- ${product.title.rendered}: ${product.meta?.precio || 'Sin precio'}`);
   *   });
   * });
   * ```
   */
  getCompleteMenu: async (menuId?: number): Promise<MenuWithSections[]> => {
    if (cachedMenu) {
      return cachedMenu;
    }
    try {
      console.log("Starting getCompleteMenu with menuId:", menuId);

      // Obtener todas las secciones principales (parent=0)
      const mainSections: MenuSection[] = await menuService._getMainSections();

      if (mainSections.length === 0) {
        throw new Error("No se encontraron secciones principales");
      }

      // Ordenar las secciones por el campo "orden" si existe
      const sortedSections: MenuSection[] = mainSections.sort((a, b) => {
        const ordenA: number = a.meta?.orden || 0;
        const ordenB: number = b.meta?.orden || 0;
        return ordenA - ordenB;
      });

      // Para cada sección, obtener sus productos en paralelo para mejor rendimiento
      const sectionsWithProducts: SectionWithProducts[] = await Promise.all(
        sortedSections.map(
          async (section: MenuSection): Promise<SectionWithProducts> => {
            try {
              const products: Product[] = await menuService._getSectionProducts(
                section.id
              );
              const productsWithImages = await Promise.all(
                products.map(async (product) => {
                  const imageUrl = await getImageUrl(product.featured_media);
                  return { ...product, imageUrl };
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
              // Devolver sección vacía en caso de error para no romper toda la operación
              return {
                section,
                products: [],
              };
            }
          }
        )
      );

      console.log("Sections with products:", sectionsWithProducts);

      // Crear un menú contenedor ya que estamos trabajando directamente con secciones
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

      cachedMenu = result; // <-- Guarda el resultado en caché

      return result;
    } catch (error) {
      console.error("Error al obtener el menú completo:", error);
      throw error;
    }
  },
} as const;
