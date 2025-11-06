import ContactForm from "./ui/ContactForm";
import Map from "./ui/Map";

export default function Contact() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center pt-10">
          ¡Contacta con nosotros!, responderemos con la mayor brevedad posible
      </h2>
      <div className="flex flex-col lg:flex-row gap-10 w-full px-8 place-items-center justify-center pb-28">
        <ContactForm />
        <Map />
      </div>
    </div>
  );
}
