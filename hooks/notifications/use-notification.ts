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

    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select(
        "*, actor:profiles!notifications_actor_id_fkey(name, username, image), stories(title, slug)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching notifications:", error);
    } else {
      setNotifications(data || []);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (status === "authenticated" && userId) {
      fetchNotifications();
    }
  }, [status, userId, fetchNotifications]);

  return { notifications, setNotifications, loading };
}
