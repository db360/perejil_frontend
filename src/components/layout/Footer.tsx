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
      className="fixed bottom-0 left-0 right-0 backdrop-blur-lg rounded-lg shadow-lg z-50 min-w-screen"
    >
      {/* Gastronomia arabigo-andaluza */}
      <div className="flex flex-col p-2 text-sm lg:text-xl xl:text-2xl">
        <div className="w-full m-4">
          <p className="text-white text-center mb-4 w-3/4 mx-auto">
            Financiado por la Unión Europea con el programa Kit Digital por los
            fondos Next Generation (EU) del mecanismo de recuperación y
            resiliencia
          </p>
          {/* ✅ Solo cambio: hacer la imagen responsive */}
          <div className="w-full flex justify-center">
            <img
              className="w-full max-w-8/12 h-auto object-contain px-4"
              src="/img/Kit-Digital-Banner.webp"
              alt="Kit Digital - Financiado por la Unión Europea"
            />
          </div>
        </div>
        <div className="w-full mx-auto max-w-screen-2xl p-4 flex items-center justify-between">
          <span className="text-sm text-white sm:text-center">
            © 2025{" "}
            <a href="http://www.dabmartinez.com" className="hover:underline">
              Da.B Dev
            </a>
            . Todos los derechos reservados.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-white sm:mt-0">
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
      </div>
    </motion.footer>
  );
}
