import { prisma } from "./prisma";

export type NotificationType = "like" | "comment" | "follow" | "bookmark";

interface CreateNotificationParams {
  userId: string; // The person receiving the notification
  actorId: string; // The person who performed the action
  type: NotificationType;
  storyId?: string;
  message?: string;
}

export async function createNotification({
  userId,
  actorId,
  type,
  storyId,
  message,
}: CreateNotificationParams) {
  // Don't notify if the actor is the same as the user (self-action)
  if (userId === actorId) return null;

  try {
    const notification = await prisma.notifications.create({
      data: {
        user_id: userId,
        actor_id: actorId,
        type,
        story_id: storyId,
        message: message || getDefaultMessage(type),
      },
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

function getDefaultMessage(type: NotificationType): string {
  switch (type) {
    case "like":
      return "menyukai cerita Anda";
    case "comment":
      return "mengomentari cerita Anda";
    case "follow":
      return "mulai mengikuti Anda";
    case "bookmark":
      return "menyimpan cerita Anda";
    default:
      return "melakukan aktivitas";
  }
}
