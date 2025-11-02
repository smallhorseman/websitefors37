"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Activity,
} from "lucide-react";

interface GAHealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getMeasurementId(): string | null {
  // Prefer explicit env var used by Analytics component
  const envId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  if (envId) return envId;
  // Try to sniff from script tag
  const script = Array.from(
    document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id="]')
  )[0] as HTMLScriptElement | undefined;
  const fromScript = script?.src?.match(/id=([A-Z0-9\-]+)/)?.[1];
  return fromScript || null;
}

export default function GAHealthCheckModal({
  isOpen,
  onClose,
}: GAHealthCheckModalProps) {
  const [gtagLoaded, setGtagLoaded] = useState(false);
  const [dataLayerPresent, setDataLayerPresent] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const measurementId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getMeasurementId();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const check = () => {
      // @ts-ignore
      const gtagFn =
        typeof window !== "undefined" ? (window as any).gtag : undefined;
      setGtagLoaded(typeof gtagFn === "function");
      setDataLayerPresent(typeof (window as any).dataLayer !== "undefined");
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [isOpen]);

  const sendTestEvent = async () => {
    setSending(true);
    try {
      // @ts-ignore
      if (
        typeof window !== "undefined" &&
        typeof (window as any).gtag === "function"
      ) {
        // @ts-ignore
        (window as any).gtag("event", "test_event", {
          debug_mode: true,
          event_category: "diagnostics",
          event_label: "admin_health_check",
          value: Date.now(),
        });
        setLastEvent(`Sent test_event at ${new Date().toLocaleTimeString()}`);
      } else {
        setLastEvent("gtag not available on window");
      }
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Analytics Health Check</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500/40 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-gray-500">Measurement ID</div>
              <div className="text-sm font-medium">
                {measurementId || "Not detected"}
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-gray-500">gtag</div>
              <div className="flex items-center gap-2 text-sm font-medium">
                {gtagLoaded ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" /> Loaded
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" /> Not
                    found
                  </>
                )}
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-gray-500">dataLayer</div>
              <div className="flex items-center gap-2 text-sm font-medium">
                {dataLayerPresent ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" /> Present
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />{" "}
                    Missing
                  </>
                )}
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-xs text-gray-500">Status</div>
              <div className="text-sm text-gray-700">
                {lastEvent || "No test event sent yet"}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={sendTestEvent}
              disabled={sending}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              {sending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Activity className="h-4 w-4" />
              )}
              Send Test Event
            </button>
            <a
              href="https://analytics.google.com/analytics/web/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              Open Google Analytics <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <p className="text-xs text-gray-500">
            Tip: Realtime report should show your test event (can take up to
            ~60s). If GA is configured in Settings but not detected here, ensure
            NEXT_PUBLIC_GA_MEASUREMENT_ID is set at build time.
          </p>
        </div>
      </div>
    </div>
  );
}
