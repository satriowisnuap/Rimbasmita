"use client";

import { motion } from "framer-motion";
import { Loader as Loader2 } from "lucide-react";
import {
  Notification,
  typeConfig,
  itemVariants,
  getRelativeTime,
} from "@/constans/notification-config";
import Image from "next/image";

interface Props {
  notification: Notification;
  markingRead: string | null;
  onMarkAsRead: (id: string) => void;
}

export function NotificationCard({
  notification,
  markingRead,
  onMarkAsRead,
}: Props) {
  const config = typeConfig[notification.type] || typeConfig.like;
  const Icon = config.icon;

  return (
    <motion.div variants={itemVariants} layout>
      <button
        onClick={() => {
          if (!notification.is_read) {
            onMarkAsRead(notification.id);
          }
        }}
        className={`w-full text-left glass rounded-2xl p-4 sm:p-5 transition-all duration-300 group hover:shadow-md hover:shadow-primary/5 ${
          !notification.is_read
            ? "border-primary/20 bg-primary/[0.03]"
            : "opacity-70 hover:opacity-100"
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Actor avatar */}
          <div className="relative flex-shrink-0">
            {notification.actor?.image ? (
              <Image
                src={notification.actor.image || "/avatar-fallback.png"}
                alt={notification.actor.name}
                width={44}
                height={44}
                className="rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-border">
                <span className="text-sm font-bold text-primary">
                  {notification.actor?.name?.[0] || "?"}
                </span>
              </div>
            )}

            {/* Type icon badge */}
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${config.bgColor} flex items-center justify-center ring-2 ring-background`}
            >
              <Icon className={`h-3 w-3 ${config.color}`} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground leading-relaxed">
              {notification.type === "achievement" ? (
                <span className="font-medium">{config.label}</span>
              ) : (
                <>
                  <span className="font-semibold text-foreground">
                    {notification.actor?.name || "Seseorang"}
                  </span>{" "}
                  <span className="text-muted-foreground">{config.label}</span>
                  {notification.stories && (
                    <span className="font-medium text-foreground">
                      {" "}
                      &ldquo;{notification.stories.title}&rdquo;
                    </span>
                  )}
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              {getRelativeTime(notification.created_at)}
            </p>
          </div>

          {/* Unread indicator */}
          <div className="flex-shrink-0 pt-1">
            {!notification.is_read && markingRead !== notification.id && (
              <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
            )}
            {markingRead === notification.id && (
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
