import { usePagesByslug } from "../hooks/usePages";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LoadingAnim from "./ui/LoadingAnim";
import { useSEO } from "../hooks/useSeo";
// import Gallery from "./ui/Gallery";
import { stripHtmlTags } from "../lib/utils";

export default function Home() {
  // 1️⃣ Obtener datos de la página desde WordPress
  const { data, loading, error } = usePagesByslug("index");

  console.log(data)
  // 2️⃣ Referencias para manipular el DOM
  const containerRef = useRef<HTMLDivElement>(null);

  // 3️⃣ Configurar metadatos SEO dinámicamente
  useSEO({
    title: data?.seoTitle,
    description: data?.seoDescription,
    ogTitle: data?.seoTitle,
    ogDescription: data?.seoDescription,
    ogImage: data?.ogImage,
  });
  // // 4️⃣ Usar useScroll de Framer Motion para trackear el progreso del scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  // Panel izquierdo: de -50% a 0% (entra desde la izquierda)
  const leftPanel = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
  // Panel derecho: de 100% a 0% (entra desde la derecha)
  const rightPanel = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);


  // // 5️⃣ Detectar el tipo MIME del video (webm, mp4, etc.)
  // const videoType = data?.video_destacado?.mime_type || "video/webm";

  return (
    <>
      <LoadingAnim loading={loading} />

      {error && <p className="text-red-500 p-4">Error: {error}</p>}


      <div ref={containerRef} className="relative z-0">


    {/* Panel izquierdo */}
        <motion.div
          style={{ x: leftPanel }}
          className="fixed top-0 left-0 w-1/2 h-screen bg-[url('/img/background.png')] bg-cover bg-center bg-repeat z-0 opacity-30"
        />

        {/* Panel derecho */}
        <motion.div
          style={{ x: rightPanel }}
          className="fixed top-0 right-0 w-1/2 h-screen  bg-[url('/img/background.png')] bg-cover bg-center bg-repeat z-0 opacity-30"
        />

        {/* Contenido */}
        <div className="relative h-[250vh] flex flex-col items-center justify-start pt-32 text-center z-10">
          <div className="top-20">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 50 : 0 }}
              transition={{ duration: 1 }}
              className="font-bold text-8xl text-white drop-shadow-2xl"
            >
              {stripHtmlTags(data?.title?.rendered || "")}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 50 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-3xl text-white drop-shadow-lg mt-8 px-4"
            >
              {data?.textContent}
            </motion.div>
          </div>
        </div>
        {/* <VideoHero
          mediaUrl={data?.mediaUrl}
          videoType={videoType}
          scrollYProgress={scrollYProgress}
          loading={loading}
          title={stripHtmlTags(data?.title?.rendered || "")}
          textContent={data?.textContent}
        /> */}

        {/* <Gallery images={data?.galleryImages} /> */}
      </div>
    </>
  );
}
