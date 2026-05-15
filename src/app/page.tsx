"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const CONTACT_EMAIL = "contact@summerhouz.com";

type Lang = "fr" | "en";
const DEFAULT_LANG: Lang = "fr";
const LANG_STORAGE_KEY = "summerhouz_lang";
const PENDING_LOADER_KEY = "summerhouz_pending_loader";

type MediaSlide = {
  id: string;
  kicker: string;
  headline: string;
  subline: string;
  videoSrc: string;
  posterSrc: string;
};

const heroSlidesByLang: Record<Lang, MediaSlide[]> = {
  fr: [
    {
      id: "sunset",
      kicker: "ARRIVÉE SUNSET",
      headline: "Luxe chaleureux. Séjours modernes.",
      subline: "Une expérience premium, immersive — comme un boutique hotel.",
      videoSrc:
        "https://cdn.coverr.co/videos/coverr-sunset-in-costa-rica-5323/1080p.mp4",
      posterSrc:
        "https://cdn.coverr.co/videos/coverr-sunset-in-costa-rica-5323/thumbnail?width=1920",
    },
    {
      id: "resort",
      kicker: "POOL / RESORT",
      headline: "Rooftop moods. Lumière dorée.",
      subline: "Des lieux qui donnent envie d’y être — tout de suite.",
      videoSrc:
        "https://cdn.coverr.co/videos/coverr-hotel-in-the-philippines-2930/1080p.mp4",
      posterSrc:
        "https://cdn.coverr.co/videos/coverr-hotel-in-the-philippines-2930/thumbnail?width=1920",
    },
    {
      id: "rooftop",
      kicker: "ROOFTOP NIGHT",
      headline: "Calme urbain. Confort profond.",
      subline: "Luxe discret, ambiance lounge, détails impeccables.",
      videoSrc:
        "https://cdn.coverr.co/videos/coverr-steamy-rooftop-pool-8919/1080p.mp4",
      posterSrc:
        "https://cdn.coverr.co/videos/coverr-steamy-rooftop-pool-8919/thumbnail?width=1920",
    },
    {
      id: "coffee",
      kicker: "RITUEL DU MATIN",
      headline: "Café. Lumière. Silence.",
      subline: "Lifestyle premium — une chaleur simple, jamais corporate.",
      videoSrc:
        "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/1080p.mp4",
      posterSrc:
        "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/thumbnail?width=1920",
    },
  ],
  en: [
    {
      id: "sunset",
      kicker: "SUNSET ARRIVAL",
      headline: "Warm luxury. Modern stays.",
      subline: "Premium short stays designed like a boutique hotel experience.",
      videoSrc:
        "https://cdn.coverr.co/videos/coverr-sunset-in-costa-rica-5323/1080p.mp4",
      posterSrc:
        "https://cdn.coverr.co/videos/coverr-sunset-in-costa-rica-5323/thumbnail?width=1920",
    },
    {
      id: "resort",
      kicker: "RESORT POOL",
      headline: "Rooftop moods. Golden light.",
      subline: "Places that make you think: I want to be there. Now.",
      videoSrc:
        "https://cdn.coverr.co/videos/coverr-hotel-in-the-philippines-2930/1080p.mp4",
      posterSrc:
        "https://cdn.coverr.co/videos/coverr-hotel-in-the-philippines-2930/thumbnail?width=1920",
    },
    {
      id: "rooftop",
      kicker: "NIGHT ROOFTOP",
      headline: "Calm city. Deep comfort.",
      subline: "Quiet luxury, lounge vibes, impeccable details.",
      videoSrc:
        "https://cdn.coverr.co/videos/coverr-steamy-rooftop-pool-8919/1080p.mp4",
      posterSrc:
        "https://cdn.coverr.co/videos/coverr-steamy-rooftop-pool-8919/thumbnail?width=1920",
    },
    {
      id: "coffee",
      kicker: "MORNING RITUAL",
      headline: "Coffee. Light. Silence.",
      subline: "Lifestyle-first premium stays — never corporate, always warm.",
      videoSrc:
        "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/1080p.mp4",
      posterSrc:
        "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/thumbnail?width=1920",
    },
  ],
} as const;

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2200&q=85",
    alt: "Appartement premium moderne, lumière naturelle",
  },
  {
    src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2200&q=85",
    alt: "Salon minimaliste, textures chaleureuses",
  },
  {
    src: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=2200&q=85",
    alt: "Chambre premium, ambiance calme",
  },
  {
    src: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=2200&q=85",
    alt: "Détails déco luxe et bois naturel",
  },
  {
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2200&q=85",
    alt: "Architecture intérieure moderne et épurée",
  },
  {
    src: "https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=2200&q=85",
    alt: "Cuisine design, finitions premium",
  },
] as const;

const services = [
  {
    title: "Airbnb Management",
    detail: {
      fr: "Pilotage complet, transparence, reporting clair.",
      en: "Full management with clear reporting and transparency.",
    },
    icon: "M7 7h10M7 12h10M7 17h7M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  },
  {
    title: "Guest Experience",
    detail: {
      fr: "Accueil fluide, messages premium, attentions lifestyle.",
      en: "Seamless welcome, premium messaging, lifestyle touches.",
    },
    icon: "M12 3l2.2 4.5L19 8l-3.5 3.4.8 4.8L12 14.8 7.7 16.2 8.5 11.4 5 8l4.8-.5L12 3Z",
  },
  {
    title: "Cleaning Coordination",
    detail: {
      fr: "Standards boutique-hotel, contrôles qualité, rythme parfait.",
      en: "Boutique-hotel standards with quality checks and perfect timing.",
    },
    icon: "M9 6h6M10 6l1-2h2l1 2M7 8h10l-1 12H8L7 8Z",
  },
  {
    title: "Listing Optimization",
    detail: {
      fr: "Storytelling, visuels, conversion, présence premium.",
      en: "Storytelling, visuals, conversion — premium presence.",
    },
    icon: "M6 19V5m0 0h12M6 5l12 14",
  },
  {
    title: "Smart Pricing",
    detail: {
      fr: "Stratégie dynamique orientée performance et saisonnalité.",
      en: "Dynamic pricing strategy tuned for seasons and performance.",
    },
    icon: "M4 16l4-4 3 3 6-6M20 7v6h-6",
  },
  {
    title: "Property Care",
    detail: {
      fr: "Maintenance, suivi proactif, soin des détails.",
      en: "Maintenance, proactive follow-up, detail-driven care.",
    },
    icon: "M12 7l7 4v9H5v-9l7-4Zm0 0V3",
  },
  {
    title: "Premium Hospitality",
    detail: {
      fr: "Process, ton, élégance : la sensation “hôtel” à domicile.",
      en: "Process, tone, elegance — hotel feeling at home.",
    },
    icon: "M7 10h10M9 14h6M6 20h12a2 2 0 0 0 2-2V9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v9a2 2 0 0 0 2 2Z",
  },
  {
    title: "Business Stays",
    detail: {
      fr: "Séjours business : rapide, fiable, haut de gamme.",
      en: "Business stays: fast, reliable, high-end.",
    },
    icon: "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 4h12v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9Z",
  },
] as const;

const statsByLang = {
  fr: [
    { kpi: "24/7", label: "Support voyageurs" },
    { kpi: "4.9★", label: "Expérience moyenne" },
    { kpi: "100%", label: "Gestion sans friction" },
  ],
  en: [
    { kpi: "24/7", label: "Guest support" },
    { kpi: "4.9★", label: "Average experience" },
    { kpi: "100%", label: "Frictionless management" },
  ],
} as const satisfies Record<Lang, Array<{ kpi: string; label: string }>>;

const whySteps = [
  {
    title: "Onboarding simple",
    detail: "Audit, recommandations design, mise en place des standards.",
  },
  {
    title: "Mise en scène & optimisation",
    detail: "Photos, listing, pricing et parcours voyageurs soignés.",
  },
  {
    title: "Opérations fluides",
    detail: "Ménage, maintenance, contrôle qualité et coordination.",
  },
  {
    title: "Rentabilité premium",
    detail: "Suivi, ajustements, amélioration continue et transparence.",
  },
] as const;

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6", className)}>
      {children}
    </div>
  );
}

function FallbackImg({
  src,
  fallbackSrc,
  alt,
  className,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}) {
  const [activeSrc, setActiveSrc] = useState(src);

  return (
    <img
      src={activeSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (activeSrc !== fallbackSrc) setActiveSrc(fallbackSrc);
      }}
    />
  );
}

function InViewVideo({
  observeKey,
  poster,
  fallbackPoster,
  alt,
  sources,
  videoClassName,
  imageClassName,
  wrapperClassName,
  failed,
  onFail,
}: {
  observeKey: string;
  poster: string;
  fallbackPoster: string;
  alt: string;
  sources: Array<{ src: string; type: string }>;
  videoClassName: string;
  imageClassName: string;
  wrapperClassName?: string;
  failed: boolean;
  onFail: () => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) setReady(false);
      },
      { root: null, rootMargin: "220px", threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observeKey]);

  return (
    <div ref={hostRef} className={cn("absolute inset-0", wrapperClassName)}>
      <FallbackImg
        src={poster}
        fallbackSrc={fallbackPoster}
        alt={alt}
        className={imageClassName}
      />
      {inView && !failed ? (
        <video
          className={cn(videoClassName, ready ? "opacity-100" : "opacity-0")}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={() => setReady(true)}
          onError={onFail}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      ) : null}
    </div>
  );
}

function VideoCard({
  id,
  kicker,
  title,
  sub,
  poster,
  fallbackPoster,
  video720,
  video360,
  shouldPlay,
  failed,
  onFail,
}: {
  id: string;
  kicker: string;
  title: string;
  sub: string;
  poster: string;
  fallbackPoster: string;
  video720: string;
  video360: string;
  shouldPlay: boolean;
  failed: boolean;
  onFail: () => void;
}) {
  const [ready, setReady] = useState(false);

  return (
    <m.div
      className="snap-start"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="group relative w-[84vw] overflow-hidden rounded-[calc(var(--radius-lg)+4px)] border border-white/18 bg-white/8 shadow-[0_28px_90px_rgba(18,13,9,0.18)] backdrop-blur-2xl sm:w-[440px]">
        <div className="relative aspect-[3/4] w-full">
          <FallbackImg
            src={poster}
            fallbackSrc={fallbackPoster}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-[1.02]"
          />

          {shouldPlay && !failed ? (
            <video
              className={cn(
                "absolute inset-0 h-full w-full object-cover saturate-125 contrast-110 transition-opacity duration-500",
                ready ? "opacity-80" : "opacity-0",
              )}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={poster}
              onCanPlay={() => setReady(true)}
              onError={onFail}
            >
              <source src={video720} type="video/mp4" />
              <source src={video360} type="video/mp4" />
            </video>
          ) : null}

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_18%_22%,rgba(255,176,98,0.30),transparent_58%),radial-gradient(700px_circle_at_82%_26%,rgba(214,179,106,0.22),transparent_58%)] opacity-75" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-black/10" />

          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-2 text-[10px] font-semibold tracking-[0.18em] text-white/90 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)] shadow-[0_0_0_6px_rgba(214,179,106,0.18)]" />
                {kicker}
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-semibold tracking-[0.14em] text-white/80 backdrop-blur-md">
                {id}
              </div>
            </div>
            <div className="mt-3 text-xl font-semibold text-white">{title}</div>
            <div className="mt-2 text-sm leading-6 text-white/75">{sub}</div>
          </div>
        </div>
      </div>
    </m.div>
  );
}

function Icon({ path, className }: { path: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 text-[color:var(--muted)]", className)}
      fill="none"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </m.div>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(241,230,210,0.92),rgba(255,255,255,0.72))] px-6 py-3 text-sm font-semibold tracking-wide text-[color:var(--fg)] shadow-[0_18px_60px_rgba(18,13,9,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_90px_rgba(18,13,9,0.16)]"
    >
      <span className="mr-2">{children}</span>
      <span className="text-[color:rgba(18,13,9,0.55)] transition-transform duration-300 group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}

function Navbar({
  onHero,
  lang,
  onLangChange,
}: {
  onHero: boolean;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const labels =
    lang === "fr"
      ? {
          about: "À propos",
          services: "Services",
          lifestyle: "Lifestyle",
          properties: "Biens",
          moments: "Moments",
          contact: "Contact",
          email: "Email",
          menu: "Menu",
          close: "Fermer",
        }
      : {
          about: "About",
          services: "Services",
          lifestyle: "Lifestyle",
          properties: "Properties",
          moments: "Moments",
          contact: "Contact",
          email: "Email",
          menu: "Menu",
          close: "Close",
        };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between rounded-full border border-transparent px-4 py-3",
            scrolled
              ? "border-[color:var(--border)] bg-[color:var(--surface)]/80 backdrop-blur-xl"
              : onHero
                ? "bg-transparent"
                : "border-[color:var(--border)] bg-[color:var(--surface)]/70 backdrop-blur-xl",
          )}
        >
          <a
            href="#top"
            className={cn(
              "flex items-center gap-2 text-sm font-semibold tracking-wide",
              onHero && !scrolled ? "text-white" : "text-[color:var(--fg)]",
            )}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--gold)] shadow-[0_0_0_8px_rgba(214,179,106,0.22)]" />
            SummerHouz
          </a>

          <nav
            className={cn(
              "hidden items-center gap-6 text-sm md:flex",
              onHero && !scrolled ? "text-white/75" : "text-[color:var(--muted)]",
            )}
          >
            <a
              className={cn(
                "transition-colors",
                onHero && !scrolled
                  ? "hover:text-[color:var(--champagne)]"
                  : "hover:text-[color:var(--fg)]",
              )}
              href="#about"
            >
              {labels.about}
            </a>
            <a
              className={cn(
                "transition-colors",
                onHero && !scrolled
                  ? "hover:text-[color:var(--champagne)]"
                  : "hover:text-[color:var(--fg)]",
              )}
              href="#services"
            >
              {labels.services}
            </a>
            <a
              className={cn(
                "transition-colors",
                onHero && !scrolled
                  ? "hover:text-[color:var(--champagne)]"
                  : "hover:text-[color:var(--fg)]",
              )}
              href="#lifestyle"
            >
              {labels.lifestyle}
            </a>
            <a
              className={cn(
                "transition-colors",
                onHero && !scrolled
                  ? "hover:text-[color:var(--champagne)]"
                  : "hover:text-[color:var(--fg)]",
              )}
              href="#showcase"
            >
              {labels.properties}
            </a>
            <a
              className={cn(
                "transition-colors",
                onHero && !scrolled
                  ? "hover:text-[color:var(--champagne)]"
                  : "hover:text-[color:var(--fg)]",
              )}
              href="#moments"
            >
              {labels.moments}
            </a>
            <a
              className={cn(
                "transition-colors",
                onHero && !scrolled
                  ? "hover:text-[color:var(--champagne)]"
                  : "hover:text-[color:var(--fg)]",
              )}
              href="#contact"
            >
              {labels.contact}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn(
                "md:hidden inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur-md transition-colors",
                onHero && !scrolled
                  ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
                  : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--fg)] hover:bg-[color:var(--surface-2)]",
              )}
              aria-label={labels.menu}
            >
              {labels.menu}
            </button>

            <div
              className={cn(
                "flex items-center rounded-full border px-1 py-1 text-xs font-semibold tracking-wide backdrop-blur-md",
                onHero && !scrolled
                  ? "border-white/15 bg-white/10 text-white"
                  : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--fg)]",
              )}
            >
              <button
                type="button"
                onClick={() => onLangChange("fr")}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  lang === "fr"
                    ? onHero && !scrolled
                      ? "bg-white/18 text-white"
                      : "bg-[color:var(--surface-2)] text-[color:var(--fg)]"
                    : onHero && !scrolled
                      ? "text-white/75 hover:text-white"
                      : "text-[color:var(--muted)] hover:text-[color:var(--fg)]",
                )}
                aria-label="Français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => onLangChange("en")}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  lang === "en"
                    ? onHero && !scrolled
                      ? "bg-white/18 text-white"
                      : "bg-[color:var(--surface-2)] text-[color:var(--fg)]"
                    : onHero && !scrolled
                      ? "text-white/75 hover:text-white"
                      : "text-[color:var(--muted)] hover:text-[color:var(--fg)]",
                )}
                aria-label="English"
              >
                EN
              </button>
            </div>

            <a
              href="#contact"
              className={cn(
                "inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors",
                onHero && !scrolled
                  ? "border border-white/15 bg-white/10 text-white backdrop-blur-md hover:bg-white/15"
                  : "border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--fg)] hover:bg-[color:var(--surface-2)]",
              )}
            >
              {labels.email}
            </a>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {mobileOpen ? (
          <m.div
            className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <m.div
              className="absolute left-4 right-4 top-4 overflow-hidden rounded-[calc(var(--radius-lg)+6px)] border border-white/12 bg-white/10 shadow-[0_40px_120px_rgba(18,13,9,0.35)] backdrop-blur-2xl"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <div className="text-sm font-semibold text-white">SummerHouz</div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90"
                >
                  {labels.close}
                </button>
              </div>
              <div className="border-t border-white/10 px-5 py-5">
                <div className="flex flex-col gap-3 text-sm font-semibold text-white/90">
                  {[
                    { href: "#about", label: labels.about },
                    { href: "#services", label: labels.services },
                    { href: "#lifestyle", label: labels.lifestyle },
                    { href: "#showcase", label: labels.properties },
                    { href: "#moments", label: labels.moments },
                    { href: "#contact", label: labels.contact },
                  ].map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-[var(--radius-md)] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function GalleryModal({
  openIndex,
  onClose,
  closeLabel,
}: {
  openIndex: number | null;
  onClose: () => void;
  closeLabel: string;
}) {
  const activeIndex = openIndex ?? 0;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, onClose]);

  return (
    <AnimatePresence>
      {openIndex !== null ? (
        <m.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          onClick={onClose}
        >
          <m.div
            className="relative w-full max-w-5xl overflow-hidden rounded-[calc(var(--radius-lg)+8px)] border border-white/10 bg-black/40 shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
            initial={reduceMotion ? false : { y: 18, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { y: 18, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={galleryImages[activeIndex].src}
                alt={galleryImages[activeIndex].alt}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm text-white/80">
              <div className="min-w-0">
                <div className="truncate text-white">{galleryImages[activeIndex].alt}</div>
                <div className="text-white/60">
                  {activeIndex + 1} / {galleryImages.length}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/90 transition-colors hover:bg-white/10"
              >
                {closeLabel}
              </button>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function Home({ initialLang }: { initialLang?: Lang }) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang ?? DEFAULT_LANG);
  const [galleryOpenIndex, setGalleryOpenIndex] = useState<number | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [navOnHero, setNavOnHero] = useState(true);
  const [activeMomentId, setActiveMomentId] = useState("01");
  const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({});
  const heroRef = useRef<HTMLDivElement | null>(null);
  const momentsTrackRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const heroSlides = heroSlidesByLang[lang];
  const stats = statsByLang[lang];
  const heroSlide = heroSlides[activeHeroSlide % heroSlides.length];
  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 700], [0, 90]);
  const ui =
    lang === "fr"
      ? {
          explore: "Explorer",
          contact: "Contact",
          premiumHospitality: "HOSPITALITÉ PREMIUM",
          gallery: "Galerie immersive",
          galleryHint: "Cliquez sur une photo pour une vue immersive.",
          close: "Fermer",
          aboutKicker: "À PROPOS",
          aboutTitle: "Une marque lifestyle premium, pas une simple conciergerie.",
          aboutBody:
            "SummerHouz crée des expériences premium de courte durée grâce à une hospitalité moderne, un design élégant et une gestion fluide.",
          simplicityTitle: "Simplicité premium",
          simplicityBody: "Tout est fluide, de l’onboarding au check-out.",
          trustTitle: "Confiance immédiate",
          trustBody: "Standards élevés, communication sobre et claire.",
          positioningKicker: "POSITIONNEMENT",
          positioningTitle: "Boutique-hotel vibes. Exécution startup.",
          positioningBody:
            "Pour les voyageurs : confort, design et sérénité. Pour les propriétaires : rentabilité, transparence et gestion sans friction.",
          servicesKicker: "SERVICES",
          servicesTitle: "Une offre complète, pensée comme un produit premium.",
          servicesBody:
            "Cartes minimalistes, exécution millimétrée, expérience haut de gamme.",
          talkToUs: "Écrivez-nous",
          showcaseKicker: "BIENS",
          showcaseTitle: "Appartements premium, lumière naturelle, détails soignés.",
          showcaseBody:
            "Une galerie immersive inspirée Pinterest — calme, minimal, luxe discret.",
          momentsKicker: "MOMENTS CAPTURÉS",
          momentsTitle:
            "Comme un trailer : lumière chaude, rythme lent, envie immédiate.",
          momentsBody:
            "Parallax subtil, glassmorphism premium, micro-interactions soignées.",
          sliderTitle: "Slider cinématique",
          sliderBody: "Swipe (mobile) ou utilisez les flèches (desktop).",
          experienceKicker: "EXPÉRIENCE",
          experienceTitle:
            "Confort, simplicité, automatisation — sans perdre la chaleur.",
          experienceBody:
            "Des détails qui ne se voient pas toujours, mais qui se ressentent dès les premières secondes.",
          testimonialsKicker: "TÉMOIGNAGES",
          testimonialsTitle: "Le premium se ressent.",
          testimonialsBody:
            "Confort, chaleur, simplicité. Pour les voyageurs et pour les propriétaires.",
          whyKicker: "POURQUOI SUMMERHOUZ",
          whyTitle: "Gestion simplifiée. Image premium. Rentabilité.",
          whyBody:
            "Une timeline moderne, pensée pour la performance et l’expérience.",
          inspirationKicker: "INSPIRATIONS VOYAGE",
          inspirationTitle:
            "Une direction visuelle digne d’une marque hospitality internationale.",
          inspirationBody:
            "Airbnb Luxe × boutique hotels × lifestyle premium. Le feed doit respirer et donner envie de voyager.",
          moodboardKicker: "HOME MOODBOARD",
          moodboardTitle:
            "L’expérience SummerHouz — luxe moderne, chaleur, immersion.",
          moodboardBody:
            "Vidéo fullscreen, transitions cinématiques, lumière sunset. Le visiteur doit ressentir : “je veux vivre cette expérience”.",
          lifestyleKicker: "LIFESTYLE",
          lifestyleTitle: "L’effet “wow” vient de la chaleur.",
          lifestyleBody:
            "Sunset light, textures bois, détails dorés, calme moderne. SummerHouz transforme la courte durée en expérience premium émotionnelle.",
          seeVibe: "Voir l’ambiance",
          trustMe: "Confier un bien →",
          contactKicker: "CONTACT",
          contactTitle: "Email uniquement. Simple. Premium.",
          contactBody:
            "Pour une demande propriétaire ou voyageur, écrivez-nous.",
          name: "NOM",
          email: "EMAIL",
          message: "MESSAGE",
          namePlaceholder: "Votre nom",
          emailPlaceholder: "vous@exemple.com",
          messagePlaceholder:
            "Propriétaire ou voyageur ? Décrivez votre besoin…",
          sendEmail: "Envoyer l’email →",
          mailHint:
            "En envoyant, votre client mail s’ouvrira avec le message pré-rempli.",
          powered: "Powered by Razorbill",
        }
      : {
          explore: "Explore",
          contact: "Contact",
          premiumHospitality: "PREMIUM HOSPITALITY",
          gallery: "Fullscreen gallery",
          galleryHint: "Click a photo for an immersive view.",
          close: "Close",
          aboutKicker: "ABOUT",
          aboutTitle: "A premium lifestyle brand — not just Airbnb concierge.",
          aboutBody:
            "SummerHouz creates premium short-term living experiences through modern hospitality, elegant design, and seamless management.",
          simplicityTitle: "Premium simplicity",
          simplicityBody: "Smooth from onboarding to checkout.",
          trustTitle: "Instant trust",
          trustBody: "High standards, calm and clear communication.",
          positioningKicker: "POSITIONING",
          positioningTitle: "Boutique-hotel vibes. Startup execution.",
          positioningBody:
            "For guests: comfort, design, serenity. For owners: profitability, transparency, frictionless management.",
          servicesKicker: "SERVICES",
          servicesTitle: "An end-to-end offer, designed like a premium product.",
          servicesBody:
            "Minimal cards, sharp execution, high-end experience.",
          talkToUs: "Email us",
          showcaseKicker: "PROPERTIES",
          showcaseTitle: "Premium apartments, natural light, curated details.",
          showcaseBody:
            "A Pinterest-inspired immersive gallery — calm, minimal, quiet luxury.",
          momentsKicker: "CAPTURED MOMENTS",
          momentsTitle:
            "Like a trailer: warm light, slow rhythm, instant desire.",
          momentsBody:
            "Subtle parallax, premium glass, refined micro-interactions.",
          sliderTitle: "Cinematic slider",
          sliderBody: "Swipe (mobile) or use arrows (desktop).",
          experienceKicker: "EXPERIENCE",
          experienceTitle: "Comfort, simplicity, automation — with warmth.",
          experienceBody:
            "Details you may not notice, but you feel from the first seconds.",
          testimonialsKicker: "TESTIMONIALS",
          testimonialsTitle: "Premium is a feeling.",
          testimonialsBody:
            "Comfort, warmth, simplicity — for guests and for owners.",
          whyKicker: "WHY SUMMERHOUZ",
          whyTitle: "Simplified management. Premium image. Profitability.",
          whyBody: "A modern timeline designed for performance and experience.",
          inspirationKicker: "TRAVEL INSPIRATION",
          inspirationTitle:
            "A visual direction worthy of an international hospitality brand.",
          inspirationBody:
            "Airbnb Luxe × boutique hotels × premium lifestyle — made to breathe and inspire travel.",
          moodboardKicker: "HOME MOODBOARD",
          moodboardTitle: "The SummerHouz experience — warm modern luxury.",
          moodboardBody:
            "Fullscreen video, cinematic transitions, sunset light. The feeling should be: “I want to live this.”",
          lifestyleKicker: "LIFESTYLE",
          lifestyleTitle: "The “wow” comes from warmth.",
          lifestyleBody:
            "Sunset light, wood textures, golden details, modern calm. SummerHouz turns short stays into an emotional premium experience.",
          seeVibe: "See the vibe",
          trustMe: "List my property →",
          contactKicker: "CONTACT",
          contactTitle: "Email only. Simple. Premium.",
          contactBody: "Guest or owner inquiry — write to us.",
          name: "NAME",
          email: "EMAIL",
          message: "MESSAGE",
          namePlaceholder: "Your name",
          emailPlaceholder: "you@example.com",
          messagePlaceholder: "Owner or guest? Tell us what you need…",
          sendEmail: "Send email →",
          mailHint: "Submitting opens your email client with a prefilled message.",
          powered: "Powered by Razorbill",
        };

  const scrollMoments = (dir: -1 | 1) => {
    const el = momentsTrackRef.current;
    if (!el) return;
    const delta = Math.round(Math.min(520, el.clientWidth * 0.85)) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const onLangChange = (next: Lang) => {
    if (next === lang) return;
    setLang(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {}
    const currentPath = window.location.pathname;
    const isEnPath = currentPath === "/en" || currentPath.startsWith("/en/");
    const targetPath = next === "en" ? "/en" : "/";
    if ((next === "en" && !isEnPath) || (next === "fr" && isEnPath)) {
      try {
        window.sessionStorage.setItem(
          PENDING_LOADER_KEY,
          JSON.stringify({ start: Date.now(), minMs: 8000 }),
        );
      } catch {}
      router.push(targetPath);
    }
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActiveHeroSlide((v) => (v + 1) % heroSlides.length);
    }, 7200);
    return () => window.clearInterval(id);
  }, [reduceMotion, heroSlides.length]);

  const onContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const subject = encodeURIComponent(
      `SummerHouz — ${name.length ? name : lang === "fr" ? "Contact" : "Inquiry"}`,
    );
    const body = encodeURIComponent(
      lang === "fr"
        ? `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        : `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    e.currentTarget.reset();
  };

  useEffect(() => {
    const root = momentsTrackRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-moment-id]"));
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.momentId;
          if (!id) continue;
          const ratio = entry.intersectionRatio;
          if (!best || ratio > best.ratio) best = { id, ratio };
        }
        if (best) setActiveMomentId(best.id);
      },
      { root, threshold: [0.3, 0.5, 0.7, 0.9] },
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [lang]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setNavOnHero(window.scrollY < window.innerHeight * 0.78);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const pageUrl = lang === "en" ? "https://summerhouz.com/en" : "https://summerhouz.com/";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://summerhouz.com/#organization",
        name: "SummerHouz",
        url: "https://summerhouz.com/",
        email: CONTACT_EMAIL,
        sameAs: ["https://instagram.com/summerhouz"],
      },
      {
        "@type": "WebSite",
        "@id": "https://summerhouz.com/#website",
        url: "https://summerhouz.com/",
        name: "SummerHouz",
        inLanguage: lang === "fr" ? "fr-FR" : "en-US",
        publisher: { "@id": "https://summerhouz.com/#organization" },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name:
          lang === "fr"
            ? "SummerHouz — Luxe chaleureux. Séjours modernes."
            : "SummerHouz — Warm luxury. Modern stays.",
        isPartOf: { "@id": "https://summerhouz.com/#website" },
        about: { "@id": "https://summerhouz.com/#organization" },
        inLanguage: lang === "fr" ? "fr-FR" : "en-US",
      },
    ],
  };

  return (
    <LazyMotion features={domAnimation}>
      <div id="top" className="min-h-screen bg-[color:var(--bg)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Navbar onHero={navOnHero} lang={lang} onLangChange={onLangChange} />

        <main className="flex-1">
          <section
            ref={heroRef}
            className="relative flex min-h-[100svh] items-end overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <m.div
              key={heroSlide.id}
              className="absolute inset-0"
              style={{ y: reduceMotion ? 0 : heroParallaxY }}
              initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.25, ease: [0.2, 0.8, 0.2, 1] }}
              >
              <FallbackImg
                key={heroSlide.posterSrc}
                src={heroSlide.posterSrc}
                fallbackSrc={galleryImages[0].src}
                alt="Ambiance SummerHouz — luxe moderne chaleureux"
                className="absolute inset-0 h-full w-full object-cover"
              />
                <m.video
                  key={`${heroSlide.id}-video`}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                    failedVideos[`hero:${heroSlide.id}`] ? "opacity-0" : "opacity-60",
                  )}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={heroSlide.posterSrc}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{
                    opacity: failedVideos[`hero:${heroSlide.id}`] ? 0 : 1,
                  }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  onError={() =>
                    setFailedVideos((prev) => ({
                      ...prev,
                      [`hero:${heroSlide.id}`]: true,
                    }))
                  }
                >
                  <source
                    src={heroSlide.videoSrc.replace("/1080p.mp4", "/720p.mp4")}
                    type="video/mp4"
                  />
                  <source
                    src={heroSlide.videoSrc.replace("/1080p.mp4", "/360p.mp4")}
                    type="video/mp4"
                  />
                </m.video>
              </m.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[color:var(--bg)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_18%,rgba(255,176,98,0.28),transparent_55%),radial-gradient(900px_circle_at_80%_22%,rgba(214,179,106,0.22),transparent_55%)]" />

          <Container className="relative pb-14 pt-28 sm:pb-16 sm:pt-40">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/90 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)] shadow-[0_0_0_6px_rgba(214,179,106,0.22)]" />
                {heroSlide.kicker}
              </div>
            </Reveal>

            <Reveal delay={0.08} className="mt-6">
              <AnimatePresence mode="wait">
                <m.h1
                  key={`${heroSlide.id}-headline`}
                  className="max-w-4xl text-balance text-4xl font-semibold leading-[1.02] text-white sm:text-6xl"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {heroSlide.headline}
                </m.h1>
              </AnimatePresence>
            </Reveal>

            <Reveal delay={0.16} className="mt-6">
              <AnimatePresence mode="wait">
                <m.p
                  key={`${heroSlide.id}-subline`}
                  className="max-w-2xl text-pretty text-base leading-7 text-white/82 sm:text-lg"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {heroSlide.subline}
                </m.p>
              </AnimatePresence>
            </Reveal>

            <Reveal delay={0.22} className="mt-10 flex flex-wrap gap-3">
              <PrimaryButton href="#showcase">{ui.explore}</PrimaryButton>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_1px_0_rgba(255,255,255,0.22)_inset] backdrop-blur-md transition-colors hover:bg-white/15"
              >
                {ui.contact}
              </a>
            </Reveal>

            <Reveal delay={0.32} className="mt-14">
              <div className="grid grid-cols-1 gap-4 rounded-[var(--radius-lg)] border border-white/12 bg-white/10 p-5 backdrop-blur-md sm:grid-cols-3">
                {stats.map((s) => (
                  <div key={s.label} className="min-w-0">
                    <div className="text-2xl font-semibold text-white">
                      {s.kpi}
                    </div>
                    <div className="mt-1 text-sm text-white/70">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.42} className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                {heroSlides.map((s, idx) => {
                  const active = idx === activeHeroSlide;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveHeroSlide(idx)}
                      className={cn(
                        "group inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold tracking-wide backdrop-blur-md transition-colors",
                        active
                          ? "border-white/18 bg-white/14 text-white"
                          : "border-white/10 bg-white/6 text-white/70 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          active ? "bg-[color:var(--gold)]" : "bg-white/40",
                        )}
                      />
                      <span className="whitespace-nowrap">{s.kicker}</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </Container>
        </section>

        <section id="about" className="relative py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
              <Reveal className="md:col-span-6">
                <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[var(--shadow)]">
                  <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                    {ui.aboutKicker}
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight text-[color:var(--fg)] sm:text-4xl">
                    {ui.aboutTitle}
                  </h2>
                  <p className="mt-5 text-base leading-7 text-[color:var(--muted)]">
                    {ui.aboutBody}
                  </p>

                  <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                      <Icon path="M12 3v18m9-9H3" />
                      <div>
                        <div className="text-sm font-medium text-[color:var(--fg)]">
                          {ui.simplicityTitle}
                        </div>
                        <div className="mt-1 text-sm text-[color:var(--muted)]">
                          {ui.simplicityBody}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                      <Icon path="M4 12l4 4L20 4" />
                      <div>
                        <div className="text-sm font-medium text-[color:var(--fg)]">
                          {ui.trustTitle}
                        </div>
                        <div className="mt-1 text-sm text-[color:var(--muted)]">
                          {ui.trustBody}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="md:col-span-6">
                <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_10%_0%,rgba(216,207,191,0.45),transparent_50%),radial-gradient(900px_circle_at_85%_30%,rgba(183,172,154,0.25),transparent_55%)]" />
                  <div className="relative">
                    <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                      {ui.positioningKicker}
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-[color:var(--fg)] sm:text-3xl">
                      {ui.positioningTitle}
                    </h3>
                    <p className="mt-5 text-base leading-7 text-[color:var(--muted)]">
                      {ui.positioningBody}
                    </p>

                    <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(lang === "fr"
                        ? [
                            "Confort & calme",
                            "Design minimal",
                            "Automation moderne",
                            "Accueil premium",
                          ]
                        : [
                            "Calm comfort",
                            "Minimal design",
                            "Modern automation",
                            "Premium welcome",
                          ]
                      ).map((t) => (
                        <div
                          key={t}
                          className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm text-[color:var(--fg)] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset]"
                        >
                          {t}
                        </div>
                      ))}
                    </div>

                    <div className="mt-9 grid grid-cols-3 gap-4">
                      {stats.map((s) => (
                        <div
                          key={s.label}
                          className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
                        >
                          <div className="text-lg font-semibold text-[color:var(--fg)]">
                            {s.kpi}
                          </div>
                          <div className="mt-1 text-xs text-[color:var(--muted)]">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section id="services" className="py-20 sm:py-28">
          <Container>
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <Reveal className="max-w-2xl">
                <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                  {ui.servicesKicker}
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--fg)] sm:text-4xl">
                  {ui.servicesTitle}
                </h2>
                <p className="mt-5 text-base leading-7 text-[color:var(--muted)]">
                  {ui.servicesBody}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-3 text-sm font-semibold text-[color:var(--fg)] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] transition-colors hover:bg-[color:var(--surface-2)]"
                >
                  <span>{ui.talkToUs}</span>
                  <span className="text-[color:var(--gold)]">→</span>
                </a>
              </Reveal>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s, i) => (
                <Reveal key={s.title} delay={0.04 * i}>
                  <div className="group relative h-full overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_1px_0_rgba(255,255,255,0.45)_inset] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(18,13,9,0.18)]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,176,98,0.22),transparent_55%),radial-gradient(800px_circle_at_90%_40%,rgba(214,179,106,0.18),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)]">
                            <Icon
                              path={s.icon}
                              className="h-5 w-5 text-[color:var(--gold)]"
                            />
                          </div>
                          <div className="text-sm font-semibold tracking-wide text-[color:var(--fg)]">
                            {s.title}
                          </div>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] transition-colors group-hover:bg-[color:var(--surface)]">
                          <span className="text-[color:var(--gold)]">↗</span>
                        </div>
                      </div>
                      <div className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                        {s.detail[lang]}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="lifestyle" className="py-20 sm:py-28">
          <Container>
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow)]">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_12%_10%,rgba(255,176,98,0.28),transparent_55%),radial-gradient(1000px_circle_at_88%_25%,rgba(214,179,106,0.18),transparent_55%)]" />
              <div className="relative grid grid-cols-1 gap-10 p-8 md:grid-cols-12 md:gap-12 md:p-12">
                <Reveal className="md:col-span-5">
                  <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                    {ui.lifestyleKicker}
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight text-[color:var(--fg)] sm:text-4xl">
                    {ui.lifestyleTitle}
                  </h2>
                  <p className="mt-5 text-base leading-7 text-[color:var(--muted)]">
                    {ui.lifestyleBody}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {(lang === "fr"
                      ? [
                          "Sunset / ambre",
                          "Bois chaud",
                          "Doré élégant",
                          "Rooftop",
                          "Coffee mornings",
                          "Immersion",
                        ]
                      : [
                          "Sunset / amber",
                          "Warm wood",
                          "Elegant gold",
                          "Rooftop",
                          "Coffee mornings",
                          "Immersion",
                        ]
                    ).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[color:var(--border)] bg-white/35 px-3 py-1 text-xs font-medium text-[color:var(--fg)] backdrop-blur"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <PrimaryButton href="#moments">{ui.seeVibe}</PrimaryButton>
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-3 text-sm font-semibold text-[color:var(--fg)] transition-colors hover:bg-[color:var(--surface-2)]"
                    >
                      {ui.trustMe}
                    </a>
                  </div>
                </Reveal>

                <Reveal delay={0.08} className="md:col-span-7">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-black/40 shadow-[0_30px_90px_rgba(18,13,9,0.28)]">
                      <div className="relative aspect-[4/5] w-full">
                        <FallbackImg
                          src="https://cdn.coverr.co/videos/coverr-infinity-pool-by-the-ocean-9788/thumbnail?width=1920"
                          fallbackSrc={galleryImages[1].src}
                          alt="Infinity pool, lumière chaude, ambiance resort"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-sm font-semibold text-white">
                            Infinity pool
                          </div>
                          <div className="mt-1 text-sm text-white/70">
                            Luxe calme, vibes vacances.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-black/40">
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2200&q=85"
                            alt="Intérieur premium, bois chaud, architecture moderne"
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        </div>
                      </div>

                      <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-black/40">
                        <div className="relative aspect-[16/10] w-full">
                          <InViewVideo
                            observeKey="coffee-card"
                            poster="https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/thumbnail?width=1920"
                            fallbackPoster={galleryImages[3].src}
                            alt="Coffee mornings, lumière douce"
                            imageClassName="absolute inset-0 h-full w-full object-cover opacity-90"
                            videoClassName="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                            failed={Boolean(failedVideos["video:coffee-card"])}
                            onFail={() =>
                              setFailedVideos((prev) => ({
                                ...prev,
                                "video:coffee-card": true,
                              }))
                            }
                            sources={[
                              {
                                src: "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/720p.mp4",
                                type: "video/mp4",
                              },
                              {
                                src: "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/360p.mp4",
                                type: "video/mp4",
                              },
                            ]}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="text-sm font-semibold text-white">
                              {lang === "fr" ? "Coffee mornings" : "Coffee mornings"}
                            </div>
                            <div className="mt-1 text-sm text-white/70">
                              {lang === "fr"
                                ? "Lumière douce. Silence. Confort."
                                : "Soft light. Silence. Comfort."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        <section id="showcase" className="py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
              <Reveal className="md:col-span-7">
                <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                  {ui.showcaseKicker}
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--fg)] sm:text-4xl">
                  {ui.showcaseTitle}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
                  {ui.showcaseBody}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="md:col-span-5">
                <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
                  <div className="text-sm font-medium text-[color:var(--fg)]">
                    {ui.gallery}
                  </div>
                  <div className="mt-2 text-sm text-[color:var(--muted)]">
                    {ui.galleryHint}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {galleryImages.map((img, idx) => (
                <Reveal key={img.src} className="mb-4 break-inside-avoid">
                  <button
                    type="button"
                    onClick={() => setGalleryOpenIndex(idx)}
                    className="group relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_10px_40px_rgba(10,12,16,0.12)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className={cn("relative w-full", idx % 3 === 0 ? "aspect-[4/5]" : idx % 3 === 1 ? "aspect-[16/10]" : "aspect-square")}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="min-w-0 truncate text-left text-xs font-medium tracking-wide text-white/90">
                          {img.alt}
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 backdrop-blur">
                          ⤢
                        </div>
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>

            <GalleryModal
              openIndex={galleryOpenIndex}
              onClose={() => setGalleryOpenIndex(null)}
              closeLabel={ui.close}
            />
          </Container>
        </section>

        <section id="moments" className="py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
              <Reveal className="md:col-span-7">
                <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                  {ui.momentsKicker}
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--fg)] sm:text-4xl">
                  {ui.momentsTitle}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
                  {ui.momentsBody}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="md:col-span-5">
                <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_18px_70px_rgba(18,13,9,0.10)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-[color:var(--fg)]">
                        {ui.sliderTitle}
                      </div>
                      <div className="mt-2 text-sm text-[color:var(--muted)]">
                        {ui.sliderBody}
                      </div>
                    </div>
                    <div className="hidden items-center gap-2 md:flex">
                      <button
                        type="button"
                        onClick={() => scrollMoments(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--fg)] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] transition-colors hover:bg-[color:var(--surface-2)]"
                        aria-label={lang === "fr" ? "Précédent" : "Previous"}
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollMoments(1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--fg)] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] transition-colors hover:bg-[color:var(--surface-2)]"
                        aria-label={lang === "fr" ? "Suivant" : "Next"}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div
              ref={momentsTrackRef}
              className="mt-10 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {(lang === "fr"
                ? [
                    {
                      id: "01",
                      kicker: "POOL / SUNSET",
                      title: "Infinity serenity",
                      sub: "Luxe calme, horizon, air chaud.",
                      poster:
                        "https://cdn.coverr.co/videos/coverr-infinity-pool-by-the-ocean-9788/thumbnail?width=1920",
                      video720:
                        "https://cdn.coverr.co/videos/coverr-infinity-pool-by-the-ocean-9788/720p.mp4",
                    },
                    {
                      id: "02",
                      kicker: "ROOFTOP NIGHT",
                      title: "City glow",
                      sub: "Ambiance lounge, détails dorés, silence.",
                      poster:
                        "https://cdn.coverr.co/videos/coverr-steamy-rooftop-pool-8919/thumbnail?width=1920",
                      video720:
                        "https://cdn.coverr.co/videos/coverr-steamy-rooftop-pool-8919/720p.mp4",
                    },
                    {
                      id: "03",
                      kicker: "COFFEE MORNING",
                      title: "Soft rituals",
                      sub: "Matin clair, textures, confort premium.",
                      poster:
                        "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/thumbnail?width=1920",
                      video720:
                        "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/720p.mp4",
                    },
                    {
                      id: "04",
                      kicker: "TRAVEL / VIBE",
                      title: "Golden hour",
                      sub: "Voyage, chaleur, envie de rester.",
                      poster:
                        "https://cdn.coverr.co/videos/coverr-sunset-in-costa-rica-5323/thumbnail?width=1920",
                      video720:
                        "https://cdn.coverr.co/videos/coverr-sunset-in-costa-rica-5323/720p.mp4",
                    },
                  ]
                : [
                    {
                      id: "01",
                      kicker: "POOL / SUNSET",
                      title: "Infinity serenity",
                      sub: "Quiet luxury, horizon, warm air.",
                      poster:
                        "https://cdn.coverr.co/videos/coverr-infinity-pool-by-the-ocean-9788/thumbnail?width=1920",
                      video720:
                        "https://cdn.coverr.co/videos/coverr-infinity-pool-by-the-ocean-9788/720p.mp4",
                    },
                    {
                      id: "02",
                      kicker: "ROOFTOP NIGHT",
                      title: "City glow",
                      sub: "Lounge mood, golden details, silence.",
                      poster:
                        "https://cdn.coverr.co/videos/coverr-steamy-rooftop-pool-8919/thumbnail?width=1920",
                      video720:
                        "https://cdn.coverr.co/videos/coverr-steamy-rooftop-pool-8919/720p.mp4",
                    },
                    {
                      id: "03",
                      kicker: "COFFEE MORNING",
                      title: "Soft rituals",
                      sub: "Bright morning, textures, premium comfort.",
                      poster:
                        "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/thumbnail?width=1920",
                      video720:
                        "https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/720p.mp4",
                    },
                    {
                      id: "04",
                      kicker: "TRAVEL / VIBE",
                      title: "Golden hour",
                      sub: "Travel warmth, the desire to stay longer.",
                      poster:
                        "https://cdn.coverr.co/videos/coverr-sunset-in-costa-rica-5323/thumbnail?width=1920",
                      video720:
                        "https://cdn.coverr.co/videos/coverr-sunset-in-costa-rica-5323/720p.mp4",
                    },
                  ]
              ).map((c, idx) => (
                <Reveal key={c.id}>
                  <div data-moment-id={c.id}>
                    <VideoCard
                      id={c.id}
                      kicker={c.kicker}
                      title={c.title}
                      sub={c.sub}
                      poster={c.poster}
                      fallbackPoster={galleryImages[idx % galleryImages.length].src}
                      video720={c.video720}
                      video360={c.video720.replace("/720p.mp4", "/360p.mp4")}
                      shouldPlay={activeMomentId === c.id}
                      failed={Boolean(failedVideos[`moments:${c.id}`])}
                      onFail={() =>
                        setFailedVideos((prev) => ({
                          ...prev,
                          [`moments:${c.id}`]: true,
                        }))
                      }
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="experience" className="py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
              <Reveal className="md:col-span-5">
                <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                  {ui.experienceKicker}
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--fg)] sm:text-4xl">
                  {ui.experienceTitle}
                </h2>
                <p className="mt-5 text-base leading-7 text-[color:var(--muted)]">
                  {ui.experienceBody}
                </p>
              </Reveal>

              <Reveal delay={0.08} className="md:col-span-7">
                <div className="grid grid-cols-1 gap-4">
                  {(lang === "fr"
                    ? [
                        {
                          quote:
                            "“Des lignes nettes, une lumière calme, et tout fonctionne.”",
                          meta: "Mindset voyageur",
                        },
                        {
                          quote:
                            "“Le premium ne crie pas. Il est fluide, constant, effortless.”",
                          meta: "Standard SummerHouz",
                        },
                        {
                          quote:
                            "“Clarté pour les propriétaires. Confort pour les voyageurs. Les deux, sans compromis.”",
                          meta: "Hospitality moderne",
                        },
                      ]
                    : [
                        {
                          quote:
                            "“Clean lines, calm light, and everything just works.”",
                          meta: "Guest mindset",
                        },
                        {
                          quote:
                            "“Premium is not loud. It’s smooth, consistent, and effortless.”",
                          meta: "SummerHouz standard",
                        },
                        {
                          quote:
                            "“Owners want clarity. Travelers want comfort. We deliver both.”",
                          meta: "Modern hospitality",
                        },
                      ]
                  ).map((q, i) => (
                    <div
                      key={q.meta}
                      className={cn(
                        "rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_1px_0_rgba(255,255,255,0.45)_inset]",
                        i === 1 ? "md:ml-10" : i === 2 ? "md:ml-4" : "",
                      )}
                    >
                      <div className="text-lg leading-7 text-[color:var(--fg)]">
                        {q.quote}
                      </div>
                      <div className="mt-3 text-sm text-[color:var(--muted)]">
                        {q.meta}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section id="testimonials" className="py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
              <Reveal className="md:col-span-5">
                <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                  {ui.testimonialsKicker}
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--fg)] sm:text-4xl">
                  {ui.testimonialsTitle}
                </h2>
                <p className="mt-5 text-base leading-7 text-[color:var(--muted)]">
                  {ui.testimonialsBody}
                </p>
                <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-black/30">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2200&q=85"
                      alt="Salon premium, lumière chaude"
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 520px"
                      className="object-cover opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-sm font-semibold text-white">
                        {lang === "fr"
                          ? "“wow, j’ai envie d’y être”"
                          : "“wow, I want to be there”"}
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        {lang === "fr"
                          ? "C’est exactement le brief."
                          : "That’s the exact brief."}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="md:col-span-7">
                <div className="grid grid-cols-1 gap-4">
                  {(lang === "fr"
                    ? [
                        {
                          quote:
                            "“L’arrivée était fluide, le lieu sentait le calme. Tout est pensé.”",
                          meta: "Voyageur — séjour lifestyle",
                        },
                        {
                          quote:
                            "“La sensation boutique hotel, sans rigidité. On a juste envie de rester.”",
                          meta: "Voyageur — week-end premium",
                        },
                        {
                          quote:
                            "“Visuels, pricing, opérations : c’est carré. Et l’image est magnifique.”",
                          meta: "Propriétaire — location business",
                        },
                      ]
                    : [
                        {
                          quote:
                            "“Arrival was seamless. The place felt calm. Everything is considered.”",
                          meta: "Guest — lifestyle stay",
                        },
                        {
                          quote:
                            "“Boutique-hotel feeling without the rigidity. You just want to stay.”",
                          meta: "Guest — premium weekend",
                        },
                        {
                          quote:
                            "“Visuals, pricing, operations — it’s tight. And the image is beautiful.”",
                          meta: "Owner — business rental",
                        },
                      ]
                  ).map((t, i) => (
                    <div
                      key={t.meta}
                      className={cn(
                        "relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset]",
                        i === 1 ? "md:ml-10" : i === 2 ? "md:ml-4" : "",
                      )}
                    >
                      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
                      <div className="relative">
                        <div className="flex items-center gap-1 text-[color:var(--gold)]">
                          {"★★★★★".split("").map((s, idx) => (
                            <span key={idx}>{s}</span>
                          ))}
                        </div>
                        <div className="mt-4 text-lg leading-7 text-[color:var(--fg)]">
                          {t.quote}
                        </div>
                        <div className="mt-3 text-sm text-[color:var(--muted)]">
                          {t.meta}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section id="why" className="py-20 sm:py-28">
          <Container>
            <Reveal>
              <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                {ui.whyKicker}
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-[color:var(--fg)] sm:text-4xl">
                {ui.whyTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
                {ui.whyBody}
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {(lang === "fr"
                ? whySteps
                : [
                    {
                      title: "Simple onboarding",
                      detail:
                        "Audit, design recommendations, and standards setup.",
                    },
                    {
                      title: "Staging & optimization",
                      detail: "Photos, listing, pricing, and guest journey.",
                    },
                    {
                      title: "Smooth operations",
                      detail:
                        "Cleaning, maintenance, quality control, coordination.",
                    },
                    {
                      title: "Premium profitability",
                      detail: "Tracking, adjustments, and clear transparency.",
                    },
                  ]
              ).map((s, i) => (
                <Reveal key={s.title} delay={0.06 * i}>
                  <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-7">
                    <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[color:var(--sand)]/15 blur-2xl" />
                    <div className="relative">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] text-sm font-semibold text-[color:var(--fg)]">
                          {i + 1}
                        </div>
                        <div className="text-base font-semibold text-[color:var(--fg)]">
                          {s.title}
                        </div>
                      </div>
                      <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                        {s.detail}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="inspiration" className="py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
              <Reveal className="md:col-span-5">
                <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                  {ui.inspirationKicker}
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--fg)] sm:text-4xl">
                  {ui.inspirationTitle}
                </h2>
                <p className="mt-5 text-base leading-7 text-[color:var(--muted)]">
                  {ui.inspirationBody}
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3">
                  {(lang === "fr"
                    ? [
                        {
                          title: "Sunset / ambre",
                          detail: "lumière chaude, peau, matières, reflets.",
                        },
                        {
                          title: "Dubaï lifestyle",
                          detail: "rooftops, pool, architecture, silhouettes.",
                        },
                        {
                          title: "Luxury interiors",
                          detail:
                            "bois chaud, pierre claire, lignes minimalistes.",
                        },
                        {
                          title: "Cinematic motion",
                          detail: "travellings lents, zoom subtil, silence.",
                        },
                      ]
                    : [
                        {
                          title: "Sunset / amber",
                          detail: "warm light, skin tones, materials, reflections.",
                        },
                        {
                          title: "Dubai lifestyle",
                          detail: "rooftops, pools, architecture, silhouettes.",
                        },
                        {
                          title: "Luxury interiors",
                          detail: "warm wood, light stone, minimal lines.",
                        },
                        {
                          title: "Cinematic motion",
                          detail: "slow moves, subtle zoom, quiet sound.",
                        },
                      ]
                  ).map((r) => (
                    <div
                      key={r.title}
                      className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--fg)]">
                        <span className="h-2 w-2 rounded-full bg-[color:var(--gold)]" />
                        {r.title}
                      </div>
                      <div className="mt-2 text-sm text-[color:var(--muted)]">
                        {r.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.08} className="md:col-span-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-black/30 shadow-[0_35px_110px_rgba(18,13,9,0.25)] sm:row-span-2">
                    <div className="relative aspect-[4/5] w-full sm:aspect-auto sm:h-full">
                      <InViewVideo
                        observeKey="inspiration-resort"
                        poster="https://cdn.coverr.co/videos/coverr-hotel-in-the-philippines-2930/thumbnail?width=1920"
                        fallbackPoster={galleryImages[2].src}
                        alt="Resort energy, pool et lumière dorée"
                        imageClassName="absolute inset-0 h-full w-full object-cover opacity-85"
                        videoClassName="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                        failed={Boolean(failedVideos["video:inspiration-resort"])}
                        onFail={() =>
                          setFailedVideos((prev) => ({
                            ...prev,
                            "video:inspiration-resort": true,
                          }))
                        }
                        sources={[
                          {
                            src: "https://cdn.coverr.co/videos/coverr-hotel-in-the-philippines-2930/720p.mp4",
                            type: "video/mp4",
                          },
                          {
                            src: "https://cdn.coverr.co/videos/coverr-hotel-in-the-philippines-2930/360p.mp4",
                            type: "video/mp4",
                          },
                        ]}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-semibold tracking-[0.18em] text-white/90 backdrop-blur-md">
                          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
                          VIDEO MOODBOARD
                        </div>
                        <div className="mt-3 text-lg font-semibold text-white">
                          Resort energy
                        </div>
                        <div className="mt-2 text-sm text-white/75">
                          Pool, palmiers, lumière dorée.
                        </div>
                      </div>
                    </div>
                  </div>

                  {[
                    {
                      src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2200&q=85",
                      alt: "Appartement premium, textures et lumière naturelle",
                      label: "Apartments",
                    },
                    {
                      src: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=2200&q=85",
                      alt: "Détails déco luxe, ambiance chaleureuse",
                      label: "Details",
                    },
                    {
                      src: "https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=2200&q=85",
                      alt: "Cuisine design, finitions premium",
                      label: "Design",
                    },
                  ].map((img) => (
                    <div
                      key={img.label}
                      className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-black/30"
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-sm font-semibold text-white">
                            {img.label}
                          </div>
                          <div className="mt-1 text-sm text-white/70">
                            {img.alt}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section id="moodboard" className="py-20 sm:py-28">
          <Container>
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-black/40 shadow-[0_50px_160px_rgba(18,13,9,0.35)]">
              <div className="relative aspect-[16/9] w-full">
                <InViewVideo
                  observeKey="moodboard"
                  poster="https://cdn.coverr.co/videos/coverr-infinity-pool-by-the-ocean-9788/thumbnail?width=1920"
                  fallbackPoster={galleryImages[0].src}
                  alt="Moodboard SummerHouz, infinity pool"
                  imageClassName="absolute inset-0 h-full w-full object-cover opacity-90"
                  videoClassName="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  failed={Boolean(failedVideos["video:moodboard"])}
                  onFail={() =>
                    setFailedVideos((prev) => ({ ...prev, "video:moodboard": true }))
                  }
                  sources={[
                    {
                      src: "https://cdn.coverr.co/videos/coverr-infinity-pool-by-the-ocean-9788/720p.mp4",
                      type: "video/mp4",
                    },
                    {
                      src: "https://cdn.coverr.co/videos/coverr-infinity-pool-by-the-ocean-9788/360p.mp4",
                      type: "video/mp4",
                    },
                  ]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
                <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_18%,rgba(255,176,98,0.25),transparent_55%),radial-gradient(900px_circle_at_80%_18%,rgba(214,179,106,0.18),transparent_55%)]" />

                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/90 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
                    {ui.moodboardKicker}
                  </div>
                  <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight text-white sm:text-5xl">
                    {ui.moodboardTitle}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
                    {ui.moodboardBody}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <PrimaryButton href="#contact">{ui.contact}</PrimaryButton>
                    <a
                      href="#showcase"
                      className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_1px_0_rgba(255,255,255,0.22)_inset] backdrop-blur-md transition-colors hover:bg-white/15"
                    >
                      {ui.explore}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="contact" className="py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
              <Reveal className="md:col-span-5">
                <div className="text-xs font-medium tracking-[0.18em] text-[color:var(--muted)]">
                  {ui.contactKicker}
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--fg)] sm:text-4xl">
                  {ui.contactTitle}
                </h2>
                <p className="mt-5 text-base leading-7 text-[color:var(--muted)]">
                  {ui.contactBody}
                </p>

                <a
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-3 text-sm font-semibold text-[color:var(--fg)] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] transition-colors hover:bg-[color:var(--surface-2)]"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                  <span className="text-[color:var(--gold)]">↗</span>
                </a>
              </Reveal>

              <Reveal delay={0.08} className="md:col-span-7">
                <form
                  onSubmit={onContactSubmit}
                  className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[var(--shadow)]"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <div className="text-xs font-medium tracking-[0.14em] text-[color:var(--muted)]">
                        {ui.name}
                      </div>
                      <input
                        name="name"
                        required
                        className="mt-2 w-full rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none transition-colors focus:bg-[color:var(--surface)]"
                        placeholder={ui.namePlaceholder}
                      />
                    </label>

                    <label className="block">
                      <div className="text-xs font-medium tracking-[0.14em] text-[color:var(--muted)]">
                        {ui.email}
                      </div>
                      <input
                        name="email"
                        type="email"
                        required
                        className="mt-2 w-full rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none transition-colors focus:bg-[color:var(--surface)]"
                        placeholder={ui.emailPlaceholder}
                      />
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <div className="text-xs font-medium tracking-[0.14em] text-[color:var(--muted)]">
                      {ui.message}
                    </div>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      className="mt-2 w-full resize-none rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none transition-colors focus:bg-[color:var(--surface)]"
                      placeholder={ui.messagePlaceholder}
                    />
                  </label>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-[color:var(--muted)]">
                      {ui.mailHint}
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,var(--gold),var(--champagne),var(--amber))] px-6 py-3 text-sm font-semibold tracking-wide text-[color:var(--fg)] shadow-[var(--glow)] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {ui.sendEmail}
                    </button>
                  </div>
                </form>
              </Reveal>
            </div>
          </Container>
        </section>
      </main>

      <footer className="relative overflow-hidden border-t border-[color:var(--border)] bg-[color:var(--bg)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,176,98,0.14),transparent_55%),radial-gradient(900px_circle_at_85%_20%,rgba(214,179,106,0.12),transparent_55%)]" />
        <Container className="relative py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-base font-semibold tracking-wide text-[color:var(--fg)]">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--gold)] shadow-[0_0_0_10px_rgba(214,179,106,0.18)]" />
                SummerHouz
              </div>
              <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {lang === "fr"
                  ? "Séjours modernes. Expériences élevées — luxe chaleureux, gestion fluide."
                  : "Modern stays. Elevated experiences — warm luxury, seamless management."}
              </div>
              <div className="mt-5">
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-3 text-sm font-semibold text-[color:var(--fg)] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] backdrop-blur-md transition-colors hover:bg-[color:var(--surface-2)]"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                  <span className="text-[color:var(--gold)]">↗</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm text-[color:var(--muted)] md:grid-cols-3">
              <div className="flex flex-col gap-3">
                <a className="hover:text-[color:var(--fg)]" href="#about">
                  {lang === "fr" ? "À propos" : "About"}
                </a>
                <a className="hover:text-[color:var(--fg)]" href="#services">
                  {lang === "fr" ? "Services" : "Services"}
                </a>
                <a className="hover:text-[color:var(--fg)]" href="#lifestyle">
                  {lang === "fr" ? "Lifestyle" : "Lifestyle"}
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <a className="hover:text-[color:var(--fg)]" href="#showcase">
                  {lang === "fr" ? "Biens" : "Properties"}
                </a>
                <a className="hover:text-[color:var(--fg)]" href="#moments">
                  {lang === "fr" ? "Moments" : "Moments"}
                </a>
                <a className="hover:text-[color:var(--fg)]" href="#moodboard">
                  {lang === "fr" ? "Moodboard" : "Moodboard"}
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <a className="hover:text-[color:var(--fg)]" href="#contact">
                  {lang === "fr" ? "Contact" : "Contact"}
                </a>
                <a
                  className="hover:text-[color:var(--fg)]"
                  href="https://instagram.com/summerhouz"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--muted-2)] md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} SummerHouz</div>
            <div>{ui.powered}</div>
          </div>
        </Container>
      </footer>
    </div>
    </LazyMotion>
  );
}
