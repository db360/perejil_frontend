import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccessibilityButton from "../ui/AccessibilityButton";

export default function Footer() {
  // @ts-expect-error - Variable será usada más adelante
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAtBottom, setIsAtBottom] = useState(false);

  // 🎯 Detectar scroll global de la ventana
  const { scrollY, scrollYProgress } = useScroll();

  // 🎬 Transformar el progreso a opacidad y translateY
  const opacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const translateY = useTransform(scrollYProgress, [0.85, 1], [100, 0]);

  // 🔍 Detectar cuando se llega al final del documento
  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      // 🎯 Mostrar footer cuando esté a 85% del final
      const threshold = scrollHeight - clientHeight * 1.15;
      setIsAtBottom(scrollTop >= threshold);
    };

    const unsubscribe = scrollY.on("change", checkScrollPosition);

    // Verificar posición inicial
    checkScrollPosition();

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.footer
      style={{
        opacity,
        y: translateY,
      }}
      initial={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg m-4 z-50"
    >
      <div className="w-full mx-auto max-w-screen-2xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-perejil-700 sm:text-center">
          © 2024{" "}
          <a href="#" className="hover:underline">
            Perejil Restaurant
          </a>
          . Todos los derechos reservados.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-perejil-700 sm:mt-0">
          <li>
            <Link to="#" className="hover:underline me-4 md:me-6">
              Sobre Nosotros
            </Link>
          </li>
          <li>
            <Link to="/aviso-legal" className="hover:underline me-4 md:me-6">
              Aviso Legal
            </Link>
          </li>
          <li>
            <Link to="/contacto" className="hover:underline">
              Contacto
            </Link>
          </li>
          <li>
              <AccessibilityButton />
          </li>
        </ul>
      </div>
    </motion.footer>
  );
}
