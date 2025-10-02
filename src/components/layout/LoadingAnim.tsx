import { BounceLoader } from "react-spinners";

export default function LoadingAnim({ loading = false }: { loading: boolean }) {
  return (
    <>
    {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center h-full ">
          <p className="uppercase font-bold text-2xl">Cargando...</p>
          <BounceLoader color="#4ade80" />
        </div>
      )}
      </>
  )
}