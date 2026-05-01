'use client';

import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';

interface Props {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export function NotificationsHeader({ unreadCount, onMarkAllRead }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <Bell className="h-7 w-7 text-primary" />
          Notifikasi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {unreadCount > 0
            ? `${unreadCount} notifikasi belum dibaca`
            : 'Semua notifikasi sudah dibaca'}
        </p>
      </div>

      {unreadCount > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={onMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
        >
          <CheckCheck className="h-4 w-4 text-primary" />
          Tandai semua dibaca
        </motion.button>
      )}
    </motion.div>
  );
}