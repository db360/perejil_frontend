import { usePagesByslug } from "../hooks/usePages";
import { useSEO } from "../hooks/useSeo";
import { motion } from "framer-motion";

export default function About() {
  const { data, loading, error } = usePagesByslug("about");

  // 🛠️ Función simplificada para limpiar el HTML
  const cleanWordPressHTML = (content: string) => {
    if (!content) return "";

    return content
      .replace(/className="/g, 'class="')
      .replace(/<br\s*\/?>\s*/g, ' ')
      .replace(/\n\s*/g, ' ')
      .replace(/\s+/g, ' ');
  };

  // 🚀 SEO COMPLETO CON DATOS DE YOAST
  useSEO({
    title: data?.seoTitle,
    description: data?.seoDescription,
    yoastData: data?.yoast_head_json,
    featuredImage: data?.mediaUrl,
    pageType: "website",
  });

  if (error) {
    return (
      <div className="min-h-screen bg-perejil-100 dark:bg-perejil-800 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-perejil-100 dark:bg-perejil-800 py-8 transition-colors duration-300 pb-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="w-full xl:w-3/4 mx-auto px-4"
      >
        {/* 🎬 Título - aparece primero */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? -30 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-xl xl:text-5xl mt-5 font-bold text-gray-900 dark:text-white mb-2"
        >
          Historia de Bar Perejil
        </motion.h1>

        {/* 🖼️ Imagen - aparece segundo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{
            opacity: loading ? 0 : 1,
            scale: loading ? 0.8 : 1,
            y: loading ? 30 : 0
          }}
          transition={{
            duration: 0.8,
            delay: 0.6, // Aparece después del título
            ease: "easeOut"
          }}
        >
          <img
            className="w-2/3 mx-auto mt-5 rounded-lg shadow-lg"
            src={data?.mediaUrl}
            alt={data?.title?.rendered || "About Image"}
          />
        </motion.div>

        {/* 📝 Contenido HTML - aparece último */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? 50 : 0 }}
          transition={{
            duration: 1,
            delay: 1.2, // Aparece después de la imagen
            ease: "easeOut"
          }}
          className="mb-40"
          dangerouslySetInnerHTML={{
            __html: cleanWordPressHTML(data?.content || "")
          }}
        />
      </motion.div>
    </div>
  );
}
