import { useState } from "react";
import { useCompleteMenu } from "../hooks/useMenu";
import { decodeHtmlEntities } from "../lib/utils";
import LoadingAnim from "./ui/LoadingAnim";
import { motion } from 'framer-motion';
import MenuModal from "./ui/MenuModal";
import type { Product } from "../api/services/menuService";

export default function Menu() {
  const { completeMenu, loading, error } = useCompleteMenu();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

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

  const productVariants = {
    tap: {
      scale: 0.95,
      transition: {
        type: "spring" as const, // Cambiar de spring a tween para mejor performance
        duration: 0.1
      }
    }
  };

  return (
    <div className="p-4 max-w-10/12 mx-auto">
      <LoadingAnim loading={loading} />
      {error && <p>Error: {error}</p>}

      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate={loading ? "hidden" : "visible"}
        className="text-3xl bold text-center font-bold"
      >
        Nuestro Menú
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={loading ? "hidden" : "visible"}
        className="relative flex flex-col bg-clip-border rounded-xl text-gray-700 shadow-md border border-blue-gray-100 mt-4 p-6 h-full w-full bg-perejil-500 backdrop-filter backdrop-blur-sm bg-opacity-20 border-gray-100"
        // 🎯 Añadir will-change para optimizar rendering
        style={{ willChange: 'opacity' }}
      >
        {completeMenu[0]?.sections.map((sectionData) => (
          <div className="mt-4 p-6" key={sectionData.section.id}>
            <h2 className="font-bold text-perejil-100 text-center text-2xl">
              {sectionData.section.name}
            </h2>
            <div className="flex flex-row content-between align-middle justify-around mt-4 p-6 border border-perejil-100">
              {sectionData.products.map((product) => (
                <motion.div
                  onClick={() => handleProductClick(product)}
                  whileTap={productVariants.tap}
                  key={product.id}
                  className="border p-6 hover:cursor-pointer transform-gpu" // 🚀 transform-gpu para hardware acceleration
                  // 🎯 Optimizaciones específicas para Firefox
                  style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <h3 className="text-perejil-100 text-lg font-semibold">
                    {decodeHtmlEntities(product.title.rendered)}
                  </h3>
                  <img
                    className="w-42 h-32 object-cover rounded-2xl mt-2"
                    src={product.imageUrl}
                    alt={product.title.rendered}
                    // 🖼️ Optimizar carga de imágenes
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      <MenuModal
        showModal={showModal}
        selectedProduct={selectedProduct}
        onClose={handleCloseModal}
      />
    </div>
  );
}
