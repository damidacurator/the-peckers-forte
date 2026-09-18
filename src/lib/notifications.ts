// User Notification Utility
export interface UserNotification {
  id: string;
  userEmail: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "payment";
  isRead: boolean;
  createdAt: string;
}

const NOTIFICATIONS_STORAGE_KEY = "tpf_user_notifications";

function getAllStoredNotifications(): UserNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredNotifications(notifs: UserNotification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  } catch {}
}

export function getUserNotifications(userEmail: string): UserNotification[] {
  if (!userEmail) return [];
  const all = getAllStoredNotifications();
  const cleanEmail = userEmail.trim().toLowerCase();
  return all.filter((n) => n.userEmail.toLowerCase() === cleanEmail);
}

export function getUnreadNotificationCount(userEmail: string): number {
  if (!userEmail) return 0;
  const list = getUserNotifications(userEmail);
  return list.filter((n) => !n.isRead).length;
}

export function addUserNotification(
  userEmail: string,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "payment" = "info"
): UserNotification {
  const newNotif: UserNotification = {
    id: "notif_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    userEmail: userEmail.trim().toLowerCase(),
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const all = getAllStoredNotifications();
  saveStoredNotifications([newNotif, ...all]);
  return newNotif;
}

export function markAllUserNotificationsAsRead(userEmail: string): void {
  if (!userEmail) return;
  const cleanEmail = userEmail.trim().toLowerCase();
  const all = getAllStoredNotifications();
  const updated = all.map((n) => {
    if (n.userEmail.toLowerCase() === cleanEmail) {
      return { ...n, isRead: true };
    }
    return n;
  });
  saveStoredNotifications(updated);
}
