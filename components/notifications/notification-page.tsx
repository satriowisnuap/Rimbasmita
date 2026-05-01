"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useNotifications } from "@/hooks/notifications/use-notification";
import { useMarkNotification } from "@/hooks/notifications/use-mark-notification";
import { NotificationsHeader } from "@/components/notifications/notification-header";
import { NotificationsBody } from "@/components/notifications/notification-body";

export function NotificationsPage() {
  const { notifications, setNotifications, loading } = useNotifications();
  const { markingRead, markAsRead, markAllAsRead } = useMarkNotification({
    notifications,
    setNotifications,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <NotificationsHeader
            unreadCount={unreadCount}
            onMarkAllRead={markAllAsRead}
          />

          <NotificationsBody
            loading={loading}
            notifications={notifications}
            markingRead={markingRead}
            onMarkAsRead={markAsRead}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
