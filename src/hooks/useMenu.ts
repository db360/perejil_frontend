import { useEffect, useRef, useState } from "react";
import { menuService } from "../api/services/menuService";
import type { MenuWithSections } from "../api/services/menuService";

/**
 * Hook para obtener el menú completo con secciones y productos organizados
 *
 * @param {number} [menuId] - ID del menú específico a cargar (opcional)
 * @returns Estado del hook con completeMenu, loading y error
 *
 * @example
 * ```typescript
 * function MenuComponent() {
 *   const { completeMenu, loading, error } = useCompleteMenu();
 *
 *   if (loading) return <div>Cargando menú...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {completeMenu[0]?.sections.map(sectionData => (
 *         <div key={sectionData.section.id}>
 *           <h2>{sectionData.section.name}</h2>
 *           {sectionData.products.map(product => (
 *             <div key={product.id}>
 *               <h3>{product.title.rendered}</h3>
 *               <p>{product.meta?.precio}</p>
 *             </div>
 *           ))}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCompleteMenu() {
  const [completeMenu, setCompleteMenu] = useState<MenuWithSections[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<MenuWithSections[] | null>(null);

  useEffect(() => {
    const fetchCompleteMenu = async () => {
       if (cacheRef.current) {
        setCompleteMenu(cacheRef.current);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const menu = await menuService.getCompleteMenu();
        setCompleteMenu(menu);
        cacheRef.current = menu;
        
      } catch (error) {
        console.error('Error fetching complete menu:', error);
        setError(error instanceof Error ? error.message : "Error al cargar el menú completo");
      } finally {
        setLoading(false);
      }
    };

    fetchCompleteMenu();
  }, []);

  return { completeMenu, loading, error };
}
