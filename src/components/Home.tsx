import { usePagesByslug } from "../hooks/usePages";
import {motion, scroll}  from 'framer-motion';
import { useEffect, useRef } from "react";
import LoadingAnim from "./layout/LoadingAnim";

export default function Home() {
  const { data, loading, error } = usePagesByslug("index");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Suscribirse al progreso del scroll
    const unsubscribe = scroll((progress: number) => {
      const video = videoRef.current;
      if (video && video.duration) {
        video.currentTime = progress * 0.5 * video.duration;
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <LoadingAnim loading={loading} />
      {error && <p>Error: {error}</p>}

      <div className="h-[calc(500vh-4rem)] flex-col items-center justify-center bg-perejil-200 text-8xl text-center">
        <h1 className="font-bold">{data?.title?.rendered}</h1>
        <div
          className="text-3xl"
          dangerouslySetInnerHTML={{ __html: data?.content?.rendered || "" }}
        ></div>
        {data?.mediaUrl && (
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1, animationDelay: 1}}
            transition={{ duration: 1 }}
            ref={videoRef}
            src={data.mediaUrl}
            controls={false}
            autoPlay={false}
            loop={false}
            preload="auto"
            muted
            className={`fixed top-0 left-0 w-full h-full object-cover z-10`}
          />
        )}
      </div>
    </>
  );
}
