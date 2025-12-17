import { useCompleteMenu } from "../hooks/useMenu";
import LoadingAnim from "./ui/LoadingAnim";
import { motion } from 'framer-motion';
import { useSEO } from "../hooks/useSeo";
import MenuCard from "./ui/MenuCard";

export default function Menu() {
  const { completeMenu, loading, error } = useCompleteMenu();
  console.log(completeMenu[0])


  // 🚀 Optimizaciones para animaciones más fluidas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3, // Reducir duración
        ease: "easeOut" as const// Ease más suave
      }
    }
  };

    useSEO({
      title: 'BAR EL PEREJIL - Menú',
      description: 'Explora el delicioso menú de Bar El Perejil, con platos tradicionales y sabores auténticos.',
      ogTitle: 'Bar El Perejil - Menú',
      ogDescription: 'Explora el delicioso menú de Bar El Perejil, con platos tradicionales y sabores auténticos.',
      ogImage: completeMenu[0]?.sections[0]?.products[0]?.imageUrl || '',
    });

  return (
    <div className="p-4 max-w-10/12 mx-auto pb-72">
      <LoadingAnim loading={loading} />
      {error && <p>Error: {error}</p>}

      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate={loading ? "hidden" : "visible"}
        className="text-3xl bold text-center font-bold dark:text-white mt-10 mb-16"
      >
        Nuestro Menú
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={loading ? "hidden" : "visible"}
        className="relative flex flex-col bg-clip-border rounded-xl text-gray-700 shadow-md  mt-4 p-6 h-full w-full bg-perejil-400 backdrop-filter backdrop-blur-sm bg-opacity-20 border-gray-100"
        // 🎯 Añadir will-change para optimizar rendering
        style={{ willChange: 'opacity' }}
      >
        {completeMenu[0]?.sections.map((sectionData) => (
          <div className="mt-4 p-6" key={sectionData.section.id}>
            <h2 className="font-bold text-white text-center text-2xl">
              {sectionData.section.name}
            </h2>
            <div className="flex flex-row content-between align-middle justify-around mt-4 p-6 ">
              {sectionData.products.map((product) => (
                <MenuCard product={product} />
              ))}
            </div>
          </div>
        ))}
      </motion.div>


    </div>
  );
}
