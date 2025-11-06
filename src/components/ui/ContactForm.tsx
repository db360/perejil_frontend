import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const domain = import.meta.env.VITE_WORDPRESS_API_URL;
  // Cambiar a la URL correcta del formulario de Contact Form 7
  const apiUrl = `${domain}/wp-json/contact-form-7/v1/contact-forms/91/feedback`;

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(formRef.current!);

    // Campos necesarios para Contact Form 7
    formData.append("_wpcf7", "91"); // ID del formulario
    formData.append("_wpcf7_version", "5.8");
    formData.append("_wpcf7_locale", "es_ES");
    formData.append("_wpcf7_unit_tag", "wpcf7-f91-o1");

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Response completa:", result);

      if (response.ok && result.status === "mail_sent") {
        setNotification({
          message: "✅ Mensaje enviado con éxito. Te contactaremos pronto.",
          type: "success",
        });
        formRef.current?.reset();
      } else {
        console.error("Error details:", result);
        setNotification({
          message:
            "❌ Error: " +
            (result?.message ||
              result?.invalid_fields?.[0]?.message ||
              "Error desconocido"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setNotification({
        message: "❌ Error de conexión. Intenta nuevamente.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (

    <section className="w-[40%] mt-12 bg-perejil-400 rounded-xl shadow-lg overflow-hidden">
      <div className="px-8 py-10">

        <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="nombre"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="w-full px-4 py-2 border border-perejil-100 rounded-lg focus:ring-1 focus:ring-perejil-200 focus:border-perejil-200 bg-perejil-200 text-white"
              placeholder="Tu nombre completo"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-white dark:text-gray-200"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 bg-perejil-200 border border-perejil-100 rounded-lg focus:ring-2 focus:ring-perejil-200 focus:border-perejil-200 dark:text-white"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-semibold text-white"
            >
              Asunto
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full px-4 py-2 bg-perejil-200 border border-gray-300 rounded-lg focus:ring-1 focus:ring-perejil-200 focus:border-perejil-200 dark:border-gray-600 dark:text-white"
              placeholder="Asunto del mensaje"
              required
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-perejil-200 focus:border-perejil-200  bg-perejil-200 text-white"
              placeholder="Escribe tu mensaje aquí..."
              required
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              id="privacy"
              type="checkbox"
              required
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-bluemaria-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="privacy"
              className="ml-2 text-sm text-white"
            >
              Acepto la política de privacidad
            </label>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, border: "none" }}
            type="submit"
            disabled={loading}
            className={`w-1/2 flex m-auto justify-center items-center py-2 px-4 bg-perejil-100 hover:bg-bluemaria-500 text-white font-semibold rounded-lg focus:outline-none focus:ring-bluemaria-500 focus:ring-offset-2 hover:cursor-pointer dark:bg-bluemaria-600  ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Enviando..." : "Enviar"}
          </motion.button>
        </form>
        {notification && (
          <div
            className={`mt-4 z-50 p-3 rounded shadow-lg ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </section>


  );
}
