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

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
    }

    setMarkingRead(null);
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  return { markingRead, markAsRead, markAllAsRead };
}
