"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export function NotificationsEmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-12 text-center"
    >
      <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Belum ada notifikasi
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Saat orang lain menyukai, mengomentari, atau mengikutimu, notifikasi
        akan muncul di sini.
      </p>
    </motion.div>
  );
}
