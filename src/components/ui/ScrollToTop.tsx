import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll suave al top en cada cambio de ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Cambiar a 'auto' si prefieres scroll instantáneo
    });
  }, [pathname]);

  return null; // Este componente no renderiza nada
}