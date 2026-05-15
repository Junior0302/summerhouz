"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PENDING_LOADER_KEY = "summerhouz_pending_loader";
const MIN_BOOT_MS = 8000;
const MAX_SHOW_MS = 15000;

type PendingLoader = {
  start: number;
  minMs: number;
};

function clampNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export default function RouteLoader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setOpen(true);
    timeoutRef.current = window.setTimeout(() => setOpen(false), MIN_BOOT_MS);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    let parsed: PendingLoader | null = null;
    try {
      const raw = window.sessionStorage.getItem(PENDING_LOADER_KEY);
      parsed = raw ? (JSON.parse(raw) as PendingLoader) : null;
    } catch {
      parsed = null;
    }

    const start = clampNumber(parsed?.start);
    const minMs = clampNumber(parsed?.minMs);
    if (start === null || minMs === null) return;

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setOpen(true);

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minMs - elapsed);
    const waitMs = Math.min(MAX_SHOW_MS, remaining || minMs);

    timeoutRef.current = window.setTimeout(() => {
      setOpen(false);
      try {
        window.sessionStorage.removeItem(PENDING_LOADER_KEY);
      } catch {}
    }, waitMs);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open ? (
          <m.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <m.div
              className="relative w-[min(640px,92vw)] overflow-hidden rounded-[calc(var(--radius-lg)+12px)] border border-white/14 bg-white/10 p-7 shadow-[0_60px_180px_rgba(18,13,9,0.60)] backdrop-blur-2xl sm:p-9"
              initial={{ y: 12, scale: 0.985, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 8, scale: 0.99, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              role="status"
              aria-live="polite"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_18%,rgba(255,176,98,0.26),transparent_60%),radial-gradient(900px_circle_at_86%_22%,rgba(214,179,106,0.22),transparent_60%)]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-black/20" />

              <div className="relative flex items-center justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
                    <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--gold)] shadow-[0_0_0_10px_rgba(214,179,106,0.20)]" />
                    SummerHouz
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    Chargement / Loading…
                  </div>
                </div>

                <div className="relative h-11 w-11">
                  <div className="absolute inset-0 rounded-full border border-white/20 bg-white/5" />
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/35 border-t-transparent" />
                </div>
              </div>

              <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                <m.div
                  className="absolute inset-y-0 left-0 w-[44%] rounded-full bg-[linear-gradient(90deg,rgba(255,176,98,0.00),rgba(255,176,98,0.42),rgba(214,179,106,0.35),rgba(255,255,255,0.06))]"
                  initial={{ x: "-120%" }}
                  animate={{ x: "260%" }}
                  transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
                />
              </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
