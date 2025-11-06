import { usePagesByslug } from "../hooks/usePages";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LoadingAnim from "./ui/LoadingAnim";
import { useSEO } from "../hooks/useSeo";
import { stripHtmlTags } from "../lib/utils";
import Gallery from "./ui/Gallery";

export default function Home() {
  const { data, loading, error } = usePagesByslug("index");
  const containerRef = useRef<HTMLDivElement>(null);

  const videoHero = data?.mediaUrl;

  // 🚀 SEO COMPLETO CON DATOS DE YOAST
  useSEO({
    title: data?.seoTitle,
    description: data?.seoDescription,
    yoastData: data?.yoast_head_json,
    featuredImage: data?.mediaUrl,
    pageType: 'website'
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 🎬 Transformar el progreso - el video DESAPARECE hacia el final
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  const leftPanel = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
  const rightPanel = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  return (
    <>
      <LoadingAnim loading={loading} />
      {error && <p className="text-red-500 p-4">Error: {error}</p>}

      <div ref={containerRef} className="relative z-0">
        <motion.div
          style={{ x: leftPanel }}
          className="fixed top-0 left-0 w-1/2 h-screen bg-[url('/img/background.png')] bg-cover bg-center bg-repeat z-0 opacity-40"
        />
        <motion.div
          style={{ x: rightPanel }}
          className="fixed top-0 right-0 w-1/2 h-screen bg-[url('/img/background.png')] bg-cover bg-center bg-repeat z-0 opacity-40"
        />

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

        {videoHero && (
          <motion.video
            style={{ opacity: videoOpacity }} // Usar style inline para valores dinámicos
            className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
            src={videoHero}
            autoPlay
            loop
            muted
          />
        )}
      </div>
      <section>
        <Gallery images={data?.galleryImages}/>
      </section>
    </>
  );
}
