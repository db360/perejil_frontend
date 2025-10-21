import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { decodeHtmlEntities } from "../../lib/utils";
import type { Product } from "../../api/services/menuService";

interface MenuModalProps {
  showModal: boolean;
  selectedProduct?: Product | null;
  onClose: () => void;
}

export default function MenuModal({
  showModal,
  selectedProduct,
  onClose,
}: MenuModalProps) {
  console.log(selectedProduct?.precio);

  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const variants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal, onClose]);

  // 🎯 Prevenir scroll y compensar el ancho de la scrollbar
  useEffect(() => {
    if (showModal) {
      // 📏 Obtener el ancho actual de la scrollbar
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // 🔒 Prevenir scroll del body
      document.body.style.overflow = "hidden";

      // 🔧 Compensar el ancho de la scrollbar para evitar el shift
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // 🔄 Restaurar estado original
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    // 🧹 Cleanup al desmontar
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [showModal]);

  return (
    <AnimatePresence mode="wait">
      {showModal && selectedProduct && (
        <motion.div
          variants={backdrop}
          animate="visible"
          initial="hidden"
          exit="hidden"
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={variants}
            animate="visible"
            initial="hidden"
            exit="hidden"
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="relative">
              {/* Imagen del producto */}
              {selectedProduct.imageUrl && (
                <img
                  className="w-full h-48 object-cover"
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title?.rendered || "Producto"}
                />
              )}

              {/* Botón de cerrar */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg cursor-pointer"
                aria-label="Cerrar modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
               <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
    {/* Título a la izquierda */}
    <h2 className="text-2xl font-bold text-gray-800">
      {selectedProduct.title?.rendered
        ? decodeHtmlEntities(selectedProduct.title.rendered)
        : "Producto"}
    </h2>

    {/* Precio a la derecha */}
    {selectedProduct.precio && selectedProduct.precio > 0 && (
      <span className="text-2xl font-bold text-perejil-600">
        {selectedProduct.precio}€
      </span>
    )}
  </div>

              {/* Descripción del producto */}
              {selectedProduct.content?.rendered && (
                <div
                  className="text-gray-600 mb-4 prose prose-sm"
                  dangerouslySetInnerHTML={{
                    __html: selectedProduct.content.rendered,
                  }}
                />
              )}

              {/* Precio
              {selectedProduct.precio && (
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg font-semibold text-gray-800">
                    Precio:
                  </span>
                  <span className="text-2xl font-bold text-perejil-600">
                    {selectedProduct.precio}€
                  </span>
                </div>
              )} */}

              {/* Ingredientes o información adicional */}
              {selectedProduct.meta?.ingredientes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Ingredientes:
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {selectedProduct.meta.ingredientes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
