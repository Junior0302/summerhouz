export default function Loading() {
  return (
    <div className="fixed left-0 top-0 z-[2147483647] h-[100svh] w-screen overflow-hidden bg-black overscroll-none touch-none">
      <video
        className="absolute inset-0 h-[100svh] w-screen object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/thumbnail?width=1920"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/720p.mp4"
          type="video/mp4"
        />
        <source
          src="https://cdn.coverr.co/videos/coverr-a-cup-of-coffee-1386/360p.mp4"
          type="video/mp4"
        />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_18%,rgba(255,176,98,0.24),transparent_58%),radial-gradient(900px_circle_at_82%_20%,rgba(214,179,106,0.20),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/28 to-black/65" />

      <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/90 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)] shadow-[0_0_0_8px_rgba(214,179,106,0.20)]" />
          SUMMERHOUZ
        </div>
        <div className="hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-white/75 backdrop-blur-md sm:inline-flex">
          LOGEMENT · LIFESTYLE · SERVICE
        </div>
      </div>

      <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
        <div
          className="relative overflow-hidden rounded-[calc(var(--radius-lg)+10px)] border border-white/14 bg-white/10 p-6 shadow-[0_60px_180px_rgba(18,13,9,0.55)] backdrop-blur-2xl sm:p-8"
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25" />
          <div className="relative">
            <div className="text-balance text-2xl font-semibold leading-[1.08] text-white sm:text-3xl">
              Préparation de votre logement
            </div>
            <div className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
              Chargement / Loading…
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold tracking-wide text-white/85 backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--gold)]" />
                Patientez…
              </div>
              <div className="relative h-11 w-11">
                <div className="absolute inset-0 rounded-full border border-white/20 bg-white/5" />
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/35 border-t-transparent" />
              </div>
            </div>

            <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="absolute inset-y-0 left-0 w-[46%] animate-[reelBar_1.55s_linear_infinite] rounded-full bg-[linear-gradient(90deg,rgba(255,176,98,0.00),rgba(255,176,98,0.44),rgba(214,179,106,0.36),rgba(255,255,255,0.08))]" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes reelBar {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </div>
  );
}
