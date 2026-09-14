export type ActionResult =
  | { status: "ok"; count?: number }
  | { status: "error"; message: string };

const unavailable = (): ActionResult => ({
  status: "error",
  message:
    "Frontend preview only. Notification state is not connected or changed.",
});

export async function markNotificationRead(
  _id: string,
): Promise<ActionResult> {
  return unavailable();
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  return unavailable();
}
