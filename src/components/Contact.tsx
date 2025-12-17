import ContactForm from "./ui/ContactForm";
import Map from "./ui/Map";

export default function Contact() {
  return (
    <div className="mb-70">
      <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center p-10 w-[70%] mx-auto">
          ¡Contacta con nosotros!, responderemos con la mayor brevedad posible
      </h2>
      <div className="flex flex-col lg:flex-row gap-10 w-full place-items-center justify-center pb-28 px-5 lg:px-10 xl:px-20">
        <ContactForm />
        <Map />
      </div>
    </div>
  );
}
