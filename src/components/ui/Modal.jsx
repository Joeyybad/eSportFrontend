import React from "react";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";

function Modal({ title, children, onClose }) {
  return (
    <AnimatePresence>
      {/* Fond semi-transparent + flou */}
      <motion.div
        className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Contenu de la modale */}
        <motion.div
          onClick={(e) => e.stopPropagation()} // évite de fermer quand on clique dans la modale
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        >
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          {children}

          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
            onClick={onClose}
          >
            ✖
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Modal;
