import { useState } from "react";
import { MenuButton } from "./MenuButton";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function HamburguerMenu() {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="relative">
      <MenuButton
        isOpen={isOpen}
        onClick={() => setOpen((open) => !open)}
        strokeWidth={8}
        color="#0E3D13"
        lineProps={{ strokeLinecap: "round" }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        width={24}
        height={24}
        style={{ marginLeft: "2rem", zIndex: 50 }}
      />
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop para cerrar al hacer click fuera */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1}}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/40"
              onClick={() => setOpen(false)}
            />
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 mt-4 rounded-lg shadow-lg bg-perejil-100/70 z-40 flex flex-col p-6 text-right"
          >
            <NavLink
              to="/"
              className="py-2 text-perejil-900 text-lg font-bold hover:text-perejil-400"
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/menu"
              className="py-2 text-perejil-900 text-lg font-bold hover:text-perejil-400"
              onClick={() => setOpen(false)}
            >
              Menu
            </NavLink>
            <NavLink
              to="/about"
              className="py-2 text-perejil-900 text-lg font-bold hover:text-perejil-400"
              onClick={() => setOpen(false)}
            >
              About
            </NavLink>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
