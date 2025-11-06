import { useState } from "react";
import type { GalleryImage } from "../../lib/utils";
import { AnimatePresence, motion, wrap } from "framer-motion";

export default function Gallery({
  images,
}: {
  images: GalleryImage[] | undefined;
}) {
  const [[page, direction], setPage] = useState([0, 0]);

  // Si no hay imágenes, no renderizar nada
  if (!images || images.length === 0) return null;

  // 🎯 Calcular el índice de la imagen actual usando wrap
  // Esto permite ciclar infinitamente: 0, 1, 2, 0, 1, 2...
  const imageIndex = wrap(0, images.length, page);

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden z-50 mb-35">
      {/* Contenedor de la imagen con AnimatePresence */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page} // Clave única para cada página
          src={images[imageIndex].src}
          alt={images[imageIndex].alt}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          // @ts-expect-error - Variable será usada más adelante
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full h-full object-cover rounded-2xl p-2"
        />
      </AnimatePresence>

      {/* Botón Anterior con SVG */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg cursor-pointer select-none"
        onClick={() => paginate(-1)}
        aria-label="Imagen anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </motion.button>

      {/* Botón Siguiente con SVG */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg cursor-pointer select-none"
        onClick={() => paginate(1)}
        aria-label="Imagen siguiente"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </motion.button>

      {/* Indicadores de página */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, index) => (
          <button
            title={`Indice de fotos ${index + 1}`}
            key={index}
            onClick={() => setPage([index, index > imageIndex ? 1 : -1])}
            className={`w-3 h-3 rounded-full transition-all ${
              index === imageIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
