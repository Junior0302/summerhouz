export default function Loading() {
  return (
    <div className="min-h-[100svh] bg-[color:var(--bg)]">
      <div className="fixed inset-0 flex items-center justify-center bg-black/45 backdrop-blur-md">
        <div
          className="relative w-[min(520px,92vw)] overflow-hidden rounded-[calc(var(--radius-lg)+10px)] border border-white/14 bg-white/10 p-7 shadow-[0_50px_160px_rgba(18,13,9,0.55)] backdrop-blur-2xl"
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_15%_20%,rgba(255,176,98,0.25),transparent_60%),radial-gradient(700px_circle_at_85%_18%,rgba(214,179,106,0.20),transparent_60%)]" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--gold)] shadow-[0_0_0_10px_rgba(214,179,106,0.20)]" />
                SummerHouz
              </div>
              <div className="mt-2 text-sm text-white/70">
                Chargement / Loading…
              </div>
            </div>
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border border-white/20 bg-white/5" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/35 border-t-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
