import { AnimatePresence, motion } from "framer-motion";
import HamburguerMenu from "../ui/HamburguerMenu";
import NavBar from "../ui/NavBar";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Link } from "react-router-dom";

export default function Header() {
  const isMdUp = useMediaQuery("(min-width: 768px)");

  return (
    <div className="sticky top-0 bg-perejil-400 p-2 text-white font-bold flex flex-row justify-between items-center z-50">
      <div>
        <Link to="/">
          <img
            className="w-50"
            src="/img/logoPerejil.png"
            alt="Logo Bar El Perejil"
          />
        </Link>
      </div>

      <div className="flex items-center gap-4">
      <AnimatePresence mode="wait">
        {isMdUp ? (
          <motion.div
            key="navbar"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col align-middle justify-center"
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

    </div>

  );

}
