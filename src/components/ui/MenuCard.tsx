import { motion } from "framer-motion";
import type { Product } from "../../api/services/menuService";
import { useState } from "react";
import { decodeHtmlEntities } from "../../lib/utils";
import MenuModal from "./MenuModal";

export default function MenuCard({ product }: { product: Product }) {

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);


  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
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
    <>
      <motion.div
        onClick={() => handleProductClick(product)}
        whileTap={productVariants.tap}
        key={product.id}
        className="rounded-2xl p-6 hover:cursor-pointer transform-gpu bg-perejil-500 dark:bg-perejil-700" // 🚀 transform-gpu para hardware acceleration
        // 🎯 Optimizaciones específicas para Firefox
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <h3 className="text-lg font-semibold text-white">
          {decodeHtmlEntities(product.title.rendered)}
        </h3>
        <img
          className="w-56 h-36 object-cover rounded-2xl mt-2"
          src={product.imageUrl}
          alt={product.title.rendered}
          // 🖼️ Optimizar carga de imágenes
          loading="lazy"
          decoding="async"
        />
      </motion.div>
        <MenuModal
        showModal={showModal}
        selectedProduct={selectedProduct}
        onClose={handleCloseModal}
      />
    </>
  );
}
