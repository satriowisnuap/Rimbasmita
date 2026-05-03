import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/constans/notification-config";

export function useNotifications() {
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      
      // Parse data to match Notification interface
      const parsed = data.map((n: any) => ({
        ...n,
        actor: n.profiles_notifications_actor_idToprofiles,
      }));
      
      setNotifications(parsed);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const deleteAll = async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      if (res.ok) {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && userId) {
      fetchNotifications();
    }
  }, [status, userId, fetchNotifications]);

  return { notifications, setNotifications, loading, fetchNotifications, deleteAll };
}
