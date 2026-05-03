import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/constans/notification-config";

interface UseMarkNotificationProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export function useMarkNotification({
  notifications,
  setNotifications,
}: UseMarkNotificationProps) {
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  const markAsRead = async (notificationId: string) => {
    setMarkingRead(notificationId);

    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setMarkingRead(null);
    }
  };

  const markAllAsRead = async () => {
    const hasUnread = notifications.some((n) => !n.is_read);
    if (!hasUnread) return;

    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return { markingRead, markAsRead, markAllAsRead };
}
