import { usePagesByslug } from "../hooks/usePages";
import { motion, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import LoadingAnim from "./ui/LoadingAnim";
import { stripHtmlTags } from "../lib/utils";
import { useSEO } from "../hooks/useSeo";
import Gallery from "./ui/Gallery";

export default function Home() {
  // 1️⃣ Obtener datos de la página desde WordPress
  const { data, loading, error } = usePagesByslug("index");

  // 2️⃣ Referencias para manipular el DOM
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3️⃣ Configurar metadatos SEO dinámicamente
  useSEO({
    title: data?.seoTitle,
    description: data?.seoDescription,
    ogTitle: data?.seoTitle,
    ogDescription: data?.seoDescription,
    ogImage: data?.ogImage,
  });

  // 4️⃣ Usar useScroll de Framer Motion para trackear el progreso del scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 5️⃣ Sincronizar el video con el scroll usando scrollYProgress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const video = videoRef.current;

      // Verificar que el video existe y está listo
      if (!video || !video.duration || isNaN(video.duration)) return;

      // 🚀 Multiplicar por 0.50 para que el video vaya al doble de velocidad
      const videoProgress = Math.min(progress * 0.75, 1);

      // Actualizar el tiempo del video según el progreso
      video.currentTime = videoProgress * video.duration;
    });

    // Limpiar la suscripción al desmontar
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 6️⃣ Detectar el tipo MIME del video (webm, mp4, etc.)
  const videoType = data?.video_destacado?.mime_type || "video/webm";

  return (
    <>
      {/* 7️⃣ Componente de loading mientras se carga la página */}
      <LoadingAnim loading={loading} />

      {/* Mostrar errores si existen */}
      {error && <p className="text-red-500 p-4">Error: {error}</p>}

      {/* 8️⃣ Contenedor principal con referencia para useScroll */}
      <div ref={containerRef} className="relative">

        {/* 9️⃣ Video de fondo sincronizado con scroll */}
        {data?.mediaUrl && (
          <video
            ref={videoRef}
            controls={false}
            autoPlay={false}
            loop={false}
            preload="auto"
            muted
            playsInline
            className="fixed top-0 left-0 w-[100%] h-full object-cover z-40"

          >
            <source src={data.mediaUrl} type={videoType} />
            <p>Tu navegador no soporta la reproducción de video.</p>
          </video>
        )}

        {/* 🔟 Contenido principal - Reducido a 250vh */}
        <div className="relative h-[250vh] flex flex-col items-center justify-start pt-32 text-center z-10">

          {/* Contenedor sticky para mantener el texto visible */}
          <div className="sticky top-32">

            {/* Título principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
              transition={{ duration: 1 }}
              className="font-bold text-8xl text-white drop-shadow-2xl"
            >
              {stripHtmlTags(data?.title?.rendered || "")}
            </motion.h1>

            {/* Descripción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-3xl text-white drop-shadow-lg mt-8 px-4"
            >
              {data?.textContent}
            </motion.div>

          </div>
        </div>

        {/* 1️⃣1️⃣ Galería de imágenes al final del scroll */}
        <Gallery images={data?.galleryImages} />
      </div>
    </>
  );
}
