"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TriangleAlert as AlertTriangle, X } from "lucide-react";

interface Props {
  confirmDeleteId: string | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteConfirmModal({
  confirmDeleteId,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <AnimatePresence>
      {confirmDeleteId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-foreground">
                  Hapus Cerita?
                </h3>
              </div>
              <button
                onClick={onCancel}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Cerita ini akan dihapus secara permanen dan tidak dapat
              dikembalikan. Yakin ingin menghapus?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl glass text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
              >
                Batal
              </button>
              <button
                onClick={() => onConfirm(confirmDeleteId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-all duration-300"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
