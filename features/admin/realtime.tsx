"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import { webSocketUrl } from "@/lib/api/config";
import type { RealtimeEvent } from "./types";

type ConnectionState =
  "connecting" | "connected" | "reconnecting" | "disconnected";

const CHANNEL = "admin.dashboard";
const MAX_RECONNECTS = 6;
const LAST_SEQ_KEY = "fabstitch:admin-realtime:last-seq";
const LAST_EVENT_KEY = "fabstitch:admin-realtime:last-event-id";

function isRealtimeEvent(value: unknown): value is RealtimeEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<RealtimeEvent>;
  return (
    typeof event.event_id === "string" &&
    typeof event.type === "string" &&
    event.channel === CHANNEL &&
    typeof event.timestamp === "string"
  );
}

export function AdminRealtime() {
  const router = useRouter();
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [attempt, setAttempt] = useState(0);
  const [lastEventType, setLastEventType] = useState<string | null>(null);
  const [inquiryNotice, setInquiryNotice] = useState<{
    title: string;
    href?: string;
  } | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let pingTimer: ReturnType<typeof setInterval> | null = null;
    let staleTimer: ReturnType<typeof setInterval> | null = null;
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempts = 0;
    let connectedOnce = false;
    let lastServerActivity = Date.now();
    let catchupRunning = false;
    let lastSeq = Number(sessionStorage.getItem(LAST_SEQ_KEY)) || 0;
    let lastEventId = sessionStorage.getItem(LAST_EVENT_KEY);
    const seen = new Set<string>();

    const scheduleAuthoritativeRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        if (active) router.refresh();
      }, 300);
    };

    const remember = (event: RealtimeEvent) => {
      if (seen.has(event.event_id)) return false;
      seen.add(event.event_id);
      if (seen.size > 500) {
        const oldest = seen.values().next().value;
        if (oldest) seen.delete(oldest);
      }
      if (typeof event.seq === "number" && event.seq > lastSeq) {
        lastSeq = event.seq;
        sessionStorage.setItem(LAST_SEQ_KEY, String(event.seq));
      }
      lastEventId = event.event_id;
      sessionStorage.setItem(LAST_EVENT_KEY, event.event_id);
      setLastEventType(event.type);
      if (
        event.type === "inquiry.created" ||
        event.type === "inquiry.status_changed"
      ) {
        const payload = event.payload ?? {};
        const inquiryId =
          typeof payload.inquiry_id === "string"
            ? payload.inquiry_id
            : typeof payload.id === "string"
              ? payload.id
              : null;
        const inquiryNumber =
          typeof payload.inquiry_number === "string"
            ? payload.inquiry_number
            : null;
        setInquiryNotice({
          title:
            event.type === "inquiry.created"
              ? inquiryNumber
                ? `New inquiry ${inquiryNumber}`
                : "New inquiry received"
              : inquiryNumber
                ? `Inquiry ${inquiryNumber} updated`
                : "Inquiry status updated",
          href: inquiryId
            ? `/admin/inquiries/${inquiryId}`
            : "/admin/inquiries",
        });
      }
      scheduleAuthoritativeRefresh();
      return true;
    };

    const catchUp = async () => {
      if (catchupRunning || (!lastSeq && !lastEventId)) return;
      catchupRunning = true;
      try {
        const events = await api.get<RealtimeEvent[]>(
          "/admin/realtime/events",
          {
            query: lastSeq
              ? { after_seq: lastSeq, limit: 200 }
              : { after_event_id: lastEventId, limit: 200 },
          },
        );
        events
          .slice()
          .sort((left, right) => (left.seq ?? 0) - (right.seq ?? 0))
          .forEach(remember);
        scheduleAuthoritativeRefresh();
      } catch {
        // The API snapshot remains authoritative; refresh even if optional
        // catch-up history is unavailable.
        scheduleAuthoritativeRefresh();
      } finally {
        catchupRunning = false;
      }
    };

    const consume = (event: RealtimeEvent) => {
      if (
        typeof event.seq === "number" &&
        lastSeq > 0 &&
        event.seq > lastSeq + 1
      ) {
        void catchUp();
      }
      remember(event);
    };

    const clearSocketTimers = () => {
      if (pingTimer) clearInterval(pingTimer);
      if (staleTimer) clearInterval(staleTimer);
      pingTimer = null;
      staleTimer = null;
    };

    const connect = () => {
      if (!active) return;
      setConnection(connectedOnce ? "reconnecting" : "connecting");
      const url = webSocketUrl("/realtime/ws/admin");
      if (connectedOnce) url.searchParams.set("reconnect", "1");
      socket = new WebSocket(url);

      socket.addEventListener("open", () => {
        if (!active || !socket) return;
        connectedOnce = true;
        lastServerActivity = Date.now();
        setConnection("connected");
        socket.send(JSON.stringify({ type: "subscribe", channel: CHANNEL }));
        void catchUp();
        scheduleAuthoritativeRefresh();

        pingTimer = setInterval(() => {
          if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
          }
        }, 20_000);

        staleTimer = setInterval(() => {
          if (
            socket?.readyState === WebSocket.OPEN &&
            Date.now() - lastServerActivity > 60_000
          ) {
            socket.close(4000, "heartbeat timeout");
          }
        }, 5_000);
      });

      socket.addEventListener("message", (message) => {
        if (!active || typeof message.data !== "string") return;
        lastServerActivity = Date.now();
        try {
          const parsed: unknown = JSON.parse(message.data);
          if (
            parsed &&
            typeof parsed === "object" &&
            (parsed as { type?: unknown }).type === "heartbeat"
          ) {
            reconnectAttempts = 0;
            setAttempt(0);
            setConnection("connected");
            return;
          }
          if (isRealtimeEvent(parsed)) consume(parsed);
        } catch {
          // Ignore malformed frames. The next heartbeat or API refresh
          // determines connection health without trusting this payload.
        }
      });

      socket.addEventListener("close", () => {
        if (!active) return;
        clearSocketTimers();
        reconnectAttempts += 1;
        setAttempt(reconnectAttempts);
        if (reconnectAttempts > MAX_RECONNECTS) {
          setConnection("disconnected");
          return;
        }
        setConnection("reconnecting");
        const delay = Math.min(30_000, 1_000 * 2 ** (reconnectAttempts - 1));
        reconnectTimer = setTimeout(connect, delay);
      });

      socket.addEventListener("error", () => {
        socket?.close();
      });
    };

    connect();

    return () => {
      active = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (refreshTimer) clearTimeout(refreshTimer);
      clearSocketTimers();
      socket?.close();
    };
  }, [retryToken, router]);

  const connected = connection === "connected";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-2 text-xs sm:px-6 ${
        connected
          ? "border-verified/20 bg-verified-soft text-verified"
          : "border-caution/25 bg-caution-soft text-caution"
      }`}
    >
      <span className="font-mono font-medium uppercase">
        Realtime {connection}
      </span>
      {connection === "reconnecting" ? (
        <span>
          Retry {attempt} of {MAX_RECONNECTS}
        </span>
      ) : null}
      {lastEventType ? (
        <span className="text-ink-3">
          Last event: {lastEventType.replaceAll("_", " ")}
        </span>
      ) : null}
      {inquiryNotice ? (
        <span>
          {inquiryNotice.title}
          {inquiryNotice.href ? (
            <a
              href={inquiryNotice.href}
              className="ml-2 font-semibold underline underline-offset-4"
            >
              Open
            </a>
          ) : null}
        </span>
      ) : null}
      {connection === "disconnected" ? (
        <>
          <span>
            Live updates stopped. Page data remains available through the API.
          </span>
          <Button
            size="sm"
            className="ml-auto h-7 border-current bg-transparent"
            onClick={() => setRetryToken((value) => value + 1)}
          >
            Reconnect
          </Button>
        </>
      ) : null}
    </div>
  );
}
