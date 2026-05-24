"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PENDING_LOADER_KEY = "summerhouz_pending_loader";
const MIN_BOOT_MS = 4500;
const MAX_SHOW_MS = 12000;
const LOADER_VIDEO = "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/1080p.mp4";
const LOADER_POSTER =
  "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/thumbnail?width=1920";

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
  const prevHtmlOverflowRef = useRef<string | null>(null);
  const prevBodyOverflowRef = useRef<string | null>(null);

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

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    prevHtmlOverflowRef.current = html.style.overflow || null;
    prevBodyOverflowRef.current = body.style.overflow || null;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtmlOverflowRef.current ?? "";
      body.style.overflow = prevBodyOverflowRef.current ?? "";
    };
  }, [open]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open ? (
          <m.div
            className="fixed left-0 top-0 z-[2147483647] h-[100svh] w-screen overflow-hidden bg-black overscroll-none touch-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          >
            <video
              className="absolute inset-0 h-[100svh] w-screen object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={LOADER_POSTER}
            >
              <source src={LOADER_VIDEO.replace("/1080p.mp4", "/720p.mp4")} type="video/mp4" />
              <source src={LOADER_VIDEO.replace("/1080p.mp4", "/360p.mp4")} type="video/mp4" />
            </video>

            <div className="pointer-events-none absolute inset-0 bg-black/35" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_18%,rgba(255,176,98,0.24),transparent_58%),radial-gradient(900px_circle_at_82%_20%,rgba(214,179,106,0.20),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/28 to-black/65" />

            <m.div
              className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8"
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/90 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)] shadow-[0_0_0_8px_rgba(214,179,106,0.20)]" />
                SUMMERHOUZ
              </div>
              <div className="hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-white/75 backdrop-blur-md sm:inline-flex">
                LOGEMENT · LIFESTYLE · SERVICE
              </div>
            </m.div>

            <m.div
              className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              role="status"
              aria-live="polite"
            >
              <div className="relative overflow-hidden rounded-[calc(var(--radius-lg)+10px)] border border-white/14 bg-white/10 p-6 shadow-[0_60px_180px_rgba(18,13,9,0.55)] backdrop-blur-2xl sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25" />
                <div className="relative">
                  <div className="text-balance text-2xl font-semibold leading-[1.08] text-white sm:text-3xl">
                    Préparation de votre logement
                  </div>
                  <div className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
                    Ambiance, détails, expérience — on charge la version la plus premium.
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold tracking-wide text-white/85 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--gold)]" />
                      Chargement…
                    </div>
                    <div className="relative h-11 w-11">
                      <div className="absolute inset-0 rounded-full border border-white/20 bg-white/5" />
                      <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/35 border-t-transparent" />
                    </div>
                  </div>

                  <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <m.div
                      className="absolute inset-y-0 left-0 w-[46%] rounded-full bg-[linear-gradient(90deg,rgba(255,176,98,0.00),rgba(255,176,98,0.44),rgba(214,179,106,0.36),rgba(255,255,255,0.08))]"
                      initial={{ x: "-120%" }}
                      animate={{ x: "260%" }}
                      transition={{ duration: 1.55, ease: "linear", repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
