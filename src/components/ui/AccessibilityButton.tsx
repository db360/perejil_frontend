import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessibilityButton() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isOpen, setIsOpen] = useState(false);

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedContrast = localStorage.getItem('accessibility-contrast') === 'true';
    const savedFontSize = localStorage.getItem('accessibility-font-size') as 'normal' | 'large' | 'xlarge' || 'normal';

    setHighContrast(savedContrast);
    setFontSize(savedFontSize);

    // Aplicar configuraciones guardadas
    if (savedContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    document.documentElement.classList.add(`font-size-${savedFontSize}`);
  }, []);

  const toggleContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);

    // Usar documentElement en lugar de body para mayor alcance
    document.documentElement.classList.toggle('high-contrast', newContrast);

    // Guardar preferencia
    localStorage.setItem('accessibility-contrast', newContrast.toString());

    // Anunciar cambio a lectores de pantalla
    const announcement = newContrast ? 'Alto contraste activado' : 'Alto contraste desactivado';
    announceToScreenReader(announcement);
  };

  const cycleFontSize = () => {
    const sizes: ('normal' | 'large' | 'xlarge')[] = ['normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(fontSize);
    const newSize = sizes[(currentIndex + 1) % sizes.length];

    // Remover clase actual
    document.documentElement.classList.remove(`font-size-${fontSize}`);

    // Añadir nueva clase
    setFontSize(newSize);
    document.documentElement.classList.add(`font-size-${newSize}`);

    // Guardar preferencia
    localStorage.setItem('accessibility-font-size', newSize);

    // Anunciar cambio
    const sizeLabels = {
      normal: 'Tamaño normal',
      large: 'Tamaño grande',
      xlarge: 'Tamaño extra grande'
    };
    announceToScreenReader(`Fuente cambiada a ${sizeLabels[newSize]}`);
  };

  const resetAccessibility = () => {
    // Resetear alto contraste
    setHighContrast(false);
    document.documentElement.classList.remove('high-contrast');

    // Resetear tamaño de fuente
    document.documentElement.classList.remove(`font-size-${fontSize}`);
    setFontSize('normal');
    document.documentElement.classList.add('font-size-normal');

    // Limpiar localStorage
    localStorage.removeItem('accessibility-contrast');
    localStorage.removeItem('accessibility-font-size');

    announceToScreenReader('Configuración de accesibilidad restablecida');
  };

  // Función para anunciar cambios a lectores de pantalla
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const getFontSizeIcon = () => {
    switch (fontSize) {
      case 'large': return 'A+';
      case 'xlarge': return 'A++';
      default: return 'A';
    }
  };

  return (
    <>
      {/* Botón principal de accesibilidad */}
      <div className="right-4 top-1/2 transform z-50 ml-4">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-perejil-500 text-white rounded-full shadow-lg hover:bg-perejil-700 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors hover:cursor-pointer"
          aria-label="Opciones de accesibilidad"
          aria-expanded={isOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </motion.button>

        {/* Panel de opciones */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Opciones de Accesibilidad
              </h3>

              <div className="space-y-3">
                {/* Alto contraste */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Alto Contraste
                  </label>
                  
                  <button
                    type="button"
                    onClick={toggleContrast}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      highContrast ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    aria-pressed={highContrast ? 'true' : 'false'}
                    aria-label="Alternar alto contraste"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        highContrast ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Tamaño de fuente */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Tamaño de Fuente
                  </label>
                  <button
                    onClick={cycleFontSize}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-w-[40px]"
                    aria-label={`Cambiar tamaño de fuente. Actual: ${fontSize}`}
                  >
                    {getFontSizeIcon()}
                  </button>
                </div>

                {/* Indicador del estado actual */}
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <div>Contraste: {highContrast ? 'Alto' : 'Normal'}</div>
                  <div>Fuente: {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Grande' : 'Extra Grande'}</div>
                </div>

                {/* Botón de reset */}
                <button
                  onClick={resetAccessibility}
                  className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Restablecer
                </button>
              </div>

              {/* Cerrar panel */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Cerrar panel de accesibilidad"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Región para anuncios de accesibilidad (invisible) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" />
    </>
  );
}