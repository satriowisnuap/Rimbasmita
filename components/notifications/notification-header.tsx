'use client';

import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

interface Props {
  unreadCount: number;
  onMarkAllRead: () => void;
  onDeleteAll: () => void;
  hasNotifications: boolean;
}

export function NotificationsHeader({ 
  unreadCount, 
  onMarkAllRead, 
  onDeleteAll,
  hasNotifications 
}: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <Bell className="h-7 w-7 text-primary" />
          Notifikasi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {unreadCount > 0
            ? `${unreadCount} notifikasi belum dibaca`
            : hasNotifications ? 'Semua notifikasi sudah dibaca' : 'Belum ada notifikasi'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={onMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs sm:text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
          >
            <CheckCheck className="h-4 w-4 text-primary" />
            Tandai dibaca
          </motion.button>
        )}

        {hasNotifications && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={onDeleteAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs sm:text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-300"
          >
            <Trash2 className="h-4 w-4" />
            Hapus semua
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}