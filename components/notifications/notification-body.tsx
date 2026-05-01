"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader as Loader2 } from "lucide-react";
import {
  Notification,
  containerVariants,
} from "@/constans/notification-config";
import { NotificationCard } from "./notification-card";
import { NotificationsEmptyState } from "./notification-empty-state";

interface Props {
  loading: boolean;
  notifications: Notification[];
  markingRead: string | null;
  onMarkAsRead: (id: string) => void;
}

export function NotificationsBody({
  loading,
  notifications,
  markingRead,
  onMarkAsRead,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Memuat notifikasi...</p>
        </motion.div>
      ) : notifications.length > 0 ? (
        <motion.div
          key="notifications"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              markingRead={markingRead}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </motion.div>
      ) : (
        <NotificationsEmptyState />
      )}
    </AnimatePresence>
  );
}
