"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  type = "info",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const confirmButtonStyles = {
    danger: "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30",
    warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30",
    info: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-dark-300/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
        >
          <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
          <p className="text-gray-300 mb-6">{message}</p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all duration-200 font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`px-6 py-2.5 rounded-lg border transition-all duration-200 font-medium ${confirmButtonStyles[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
