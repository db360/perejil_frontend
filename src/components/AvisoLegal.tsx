import { usePagesByslug } from "../hooks/usePages";
import { useSEO } from "../hooks/useSeo";
import { stripHtmlTags } from "../lib/utils";
import LoadingAnim from "./ui/LoadingAnim";

export default function AvisoLegal() {
  const { data, loading, error } = usePagesByslug("aviso-legal");

  // 🚀 SEO para la página de Aviso Legal
  useSEO({
    title: data?.seoTitle || data?.title?.rendered || "Aviso Legal - Bar Perejil",
    description: data?.seoDescription || stripHtmlTags(data?.content || "").substring(0, 160) || "Consulta el aviso legal de Bar Perejil. Información sobre términos y condiciones de uso.",
    yoastData: data?.yoast_head_json,
    pageType: "website",
    canonical: `${window.location.origin}/aviso-legal`,
  });

  console.log(data?.content);

  return (
    <>
      {loading && <LoadingAnim loading={loading} />}
      {error && (
        <div className="text-red-500 text-center mt-10">
          Error loading page: {error}
        </div>
      )}
      {!loading && !error && data && (
        <div className="max-w-4xl mx-auto p-6 shadow-lg rounded-lg mt-10 mb-8 pb-28">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            {stripHtmlTags(data?.title?.rendered || "") || "Aviso Legal"}
          </h1>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: data?.content || "" }}
          />
        </div>
      )}
    </>
  );
}
