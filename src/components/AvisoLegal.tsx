import { usePagesByslug } from "../hooks/usePages";
import LoadingAnim from "./ui/LoadingAnim";

export default function AvisoLegal() {
  const { data, loading, error } = usePagesByslug("aviso-legal");
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
        <div
          className="max-w-4xl mx-auto p-6 shadow-lg rounded-lg mt-10 mb-8 pb-28"
          dangerouslySetInnerHTML={{ __html: data?.content || "" }}
        ></div>
      )}
    </>
  );
}
