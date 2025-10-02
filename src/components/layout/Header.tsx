import { AnimatePresence, motion } from "framer-motion";
import HamburguerMenu from "../ui/HamburguerMenu";
import NavBar from "../ui/NavBar";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function Header() {

      const isMdUp = useMediaQuery("(min-width: 768px)");

  return (
    <div className="sticky top-0 bg-perejil-400 p-4 text-white font-bold flex flex-row justify-between z-50">
      <div>PEREJIL</div>
      <AnimatePresence mode="wait">
        {isMdUp ? (
          <motion.div
            key="navbar"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}

          >
            <NavBar />
          </motion.div>
        ) : (
          <motion.div
            key="hamburguer"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
          >
            <HamburguerMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
