import { BounceLoader } from "react-spinners";
import { motion } from "framer-motion";

export default function LoadingAnim({ loading = false }: { loading: boolean }) {
  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center h-full align-middle z-30">
          <div className="flex flex-col gap-4 justify-center items-center p-2 ml-2">
            <motion.p
              initial={{ filter: "blur(0px)" }}
              animate={{ filter: "blur(5px)" }}
              transition={{ ease: "easeIn", duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="uppercase font-bold text-2xl text-center"
            >
              Cargando...
            </motion.p>
            <BounceLoader color="#4ade80" />
          </div>
        </div>
      )}
    </>
  );
}
