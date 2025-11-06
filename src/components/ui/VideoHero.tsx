import { MotionValue } from "framer-motion";
import { useRef, useEffect } from "react";

interface VideoHeroProps {
  mediaUrl?: string;
  videoType?: string;
  scrollYProgress: MotionValue<number>; // MotionValue del scroll
  loading: boolean;
  title?: string;
  textContent?: string;
}

export default function VideoHero({
  mediaUrl,
  videoType = "video/webm",
  scrollYProgress,
  // @ts-expect-error - Variable será usada más adelante
  loading,
  // @ts-expect-error - Variable será usada más adelante
  title,
  // @ts-expect-error - Variable será usada más adelante
  textContent
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 🎬 Sincronizar el video con el scroll usando scrollYProgress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress: number) => {
      const video = videoRef.current;

      // Verificar que el video existe y está listo
      if (!video || !video.duration || isNaN(video.duration)) return;

      // 🚀 Multiplicar por 0.75 para controlar la velocidad del video
      const videoProgress = Math.min(progress * 0.75, 1);

      // Actualizar el tiempo del video según el progreso
      video.currentTime = videoProgress * video.duration;
    });

    // Limpiar la suscripción al desmontar
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <>
      {/* 🎬 Video de fondo sincronizado con scroll */}
      {mediaUrl && (
        <video
          ref={videoRef}
          controls={false}
          autoPlay={false}
          loop={false}
          preload="auto"
          muted
          playsInline
          className="fixed top-0 left-0 w-full h-full object-cover z-40"
        >
          <source src={mediaUrl} type={videoType} />
          <p>Tu navegador no soporta la reproducción de video.</p>
        </video>
      )}

      {/* 📝 Contenido principal sobre el video */}

    </>
  );
}
