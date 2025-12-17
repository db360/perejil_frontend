import { useEffect, useRef } from 'react';

declare module '@jgarber/bandcamp-player';

interface BandcampPlayerProps {
  track?: string;
  album?: string;
  fallbackTitle?: string;
  fallbackArtist?: string;
  fallbackUrl?: string;
  className?: string;
}

export default function BandcampPlayer({
  track,
  album,
  fallbackTitle = "Escucha nuestra música",
  fallbackArtist = "Bar El Perejil",
  fallbackUrl = "#",
  className = ""
}: BandcampPlayerProps) {
  const playerRef = useRef<HTMLElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Solo cargar el script una vez
    if (!scriptLoaded.current) {
      const loadBandcampPlayer = async () => {
        try {
          // Importar el módulo
          await import('@jgarber/bandcamp-player');
          scriptLoaded.current = true;
        } catch (error) {
          console.error('Error loading Bandcamp player:', error);
        }
      };

      loadBandcampPlayer();
    }
  }, []);

  // Validación: al menos track o album debe estar presente
  if (!track && !album) {
    console.error('BandcampPlayer: Se requiere al menos un ID de track o album');
    return null;
  }

  return (
    <div className={`bandcamp-player-container ${className}`}>
      <bandcamp-player
        ref={playerRef}
        {...(track && { track })}
        {...(album && { album })}
        className="w-full"
      >
        {/* Contenido de fallback para progressive enhancement */}
        <div className="bg-perejil-100 dark:bg-gray-800 p-4 rounded-lg border border-perejil-200 dark:border-gray-700 text-center transition-colors duration-300">
          <p className="text-perejil-800 dark:text-perejil-200 mb-2">
            Escucha: <cite className="font-semibold">{fallbackTitle}</cite>
            {fallbackArtist && (
              <> por <span className="font-semibold">{fallbackArtist}</span></>
            )}
          </p>
          <a
            href={fallbackUrl}
            className="text-perejil-600 dark:text-perejil-300 hover:text-perejil-500 dark:hover:text-perejil-200 underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Escuchar en Bandcamp →
          </a>
        </div>
      </bandcamp-player>
    </div>
  );
}