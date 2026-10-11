"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Cormorant_Garamond, Noto_Nastaliq_Urdu } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500"],
  display: "swap",
});

type WeddingSplashScreenProps = {
  bride: string;
  groom: string;
  onOpen: () => void;
  /** Called synchronously from the tap (user gesture), e.g. to start music. */
  onStart?: () => void;
  /** Optional overrides – defaults match the original invitation. */
  urduNames?: string;
  dateEn?: string;
  dateUr?: string;
  location?: string;
};

const DRAW_MS = 600; // center line draws first
const GATE_MS = 1200; // then gates open
const REDUCED_MS = 350;

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M0 8h56M104 8h56" strokeLinecap="round" opacity="0.7" />
      <path d="M80 1.5 86.5 8 80 14.5 73.5 8Z" fill="currentColor" fillOpacity="0.9" />
      <circle cx="64" cy="8" r="1.6" fill="currentColor" />
      <circle cx="96" cy="8" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function WeddingSplashScreen({
  bride,
  groom,
  onOpen,
  onStart,
  urduNames = "حسن جمال ♥ میشہ شہزادی",
  dateEn = "January 07–09, 2027",
  dateUr = "۷ تا ۹ جنوری ۲۰۲۷",
  location = "Gujranwala, Pakistan",
}: WeddingSplashScreenProps) {
  const [opening, setOpening] = useState(false);
  const [gatesOpen, setGatesOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Latest onOpen without making it an effect dependency (parent re-renders
  // such as a countdown must not reset the timer).
  const onOpenRef = useRef(onOpen);
  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  // Respect reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  // After the button press: draw the line first, then open the gates
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(
      () => setGatesOpen(true),
      reduced ? 0 : DRAW_MS
    );
    return () => window.clearTimeout(timer);
  }, [opening, reduced]);

  // Hand off to the page once the gates have finished opening
  useEffect(() => {
    if (!gatesOpen) return;
    const timer = window.setTimeout(
      () => onOpenRef.current(),
      reduced ? REDUCED_MS : GATE_MS + 50
    );
    return () => window.clearTimeout(timer);
  }, [gatesOpen, reduced]);

  // Lock page scroll while the cover is visible
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const prevBody = body.style.overflow;
    const prevHtml = html.style.overflow;
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
    };
  }, []);

  // Focus the button on mount so Enter / Space opens the invitation
  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const handleTap = useCallback(() => {
    if (opening) return;
    onStart?.();
    setOpening(true);
  }, [opening, onStart]);

  const groomInitial = groom.trim().charAt(0).toUpperCase();
  const brideInitial = bride.trim().charAt(0).toUpperCase();

  const gateMotion = reduced
    ? "transition-opacity duration-300"
    : "transition-transform ease-[cubic-bezier(0.77,0,0.175,1)]";

  return (
    <div
      className={`${serif.className} fixed inset-0 z-[100] overflow-hidden bg-[#10201a] text-[#fff9e9]`}
      style={{ height: "100dvh" }}
      role="dialog"
      aria-modal="true"
      aria-label={`Wedding invitation of ${groom} and ${bride}`}
    >
      <style>{`
        @keyframes ws-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ws-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(214,193,139,0.45); }
          50%      { box-shadow: 0 0 0 10px rgba(214,193,139,0); }
        }
        @keyframes ws-draw {
          from { transform: translateX(-50%) scaleY(0); }
          to   { transform: translateX(-50%) scaleY(1); }
        }
        .ws-rise  { opacity: 0; animation: ws-rise 900ms cubic-bezier(0.22,1,0.36,1) forwards; }
        .ws-pulse { animation: ws-pulse 2.6s ease-in-out infinite; }
        .ws-draw  {
          transform-origin: top;
          animation: ws-draw ${DRAW_MS}ms cubic-bezier(0.77,0,0.175,1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .ws-rise  { opacity: 1; animation: none; }
          .ws-pulse { animation: none; }
          .ws-draw  { animation: none; }
        }
      `}</style>

      {/* Background photo + overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80')",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0f1d16]/85 via-[#1e3427]/60 to-[#0b150f]/95"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(214,193,139,0.14), transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Double gold frame */}
      <div
        className="pointer-events-none absolute inset-3 z-30 border border-[#d6c18b]/60 sm:inset-6"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[18px] z-30 border border-[#d6c18b]/25 sm:inset-9"
        aria-hidden="true"
      />

      {/* Scrollable, safely-centred content (m-auto avoids top clipping on short screens) */}
      <div
        className="absolute inset-0 z-20 flex overflow-y-auto overscroll-contain"
        style={{
          paddingTop: "max(2.25rem, env(safe-area-inset-top))",
          paddingBottom: "max(2.25rem, env(safe-area-inset-bottom))",
        }}
      >
        <div
          className={`m-auto flex w-full max-w-md flex-col items-center px-8 text-center transition-all ${
            reduced ? "duration-300" : "duration-700"
          } ${opening ? (reduced ? "opacity-0" : "scale-95 opacity-0") : "scale-100 opacity-100"}`}
        >
          <p
            lang="ur"
            dir="rtl"
            className={`${nastaliq.className} ws-rise text-lg leading-[2.2] text-[#f0e5cb] sm:text-xl`}
            style={{ animationDelay: "100ms" }}
          >
            بسم اللہ الرحمٰن الرحیم
          </p>

          <Ornament className="ws-rise mt-2 h-4 w-40 text-[#d6c18b]" />

          <p
            className="ws-rise mt-5 text-sm italic tracking-[0.18em] text-[#e4d2a5] sm:text-base"
            style={{ animationDelay: "250ms" }}
          >
            Together with our families,
            <br />
            we invite you to the wedding of
          </p>

          <h1
            className="ws-rise mt-6 text-[2.6rem] font-medium leading-[1.05] sm:text-6xl"
            style={{ animationDelay: "400ms" }}
          >
            {groom}
            <span className="my-1 block text-3xl font-normal italic text-[#e6d19a] sm:text-4xl">
              &amp;
            </span>
            {bride}
          </h1>

          <p
            lang="ur"
            dir="rtl"
            className={`${nastaliq.className} ws-rise mt-5 text-lg leading-[2.2] text-[#f0e5cb] sm:text-xl`}
            style={{ animationDelay: "550ms" }}
          >
            {urduNames}
          </p>

          <div
            className="ws-rise mt-5 flex flex-col items-center"
            style={{ animationDelay: "700ms" }}
          >
            <p className="text-xl italic sm:text-2xl">{dateEn}</p>
            <p
              lang="ur"
              dir="rtl"
              className={`${nastaliq.className} mt-1 text-sm leading-[2.2] text-[#e7ddc8]`}
            >
              {dateUr}
            </p>
            <p className="mt-1 text-sm tracking-[0.22em] text-[#e7ddc8]/85">
              {location}
            </p>
          </div>

          <div
            className="ws-rise mt-8 flex flex-col items-center"
            style={{ animationDelay: "900ms" }}
          >
            <button
              ref={buttonRef}
              type="button"
              onClick={handleTap}
              disabled={opening}
              className="ws-pulse inline-flex min-h-12 items-center justify-center gap-3 border border-[#d6c18b] bg-[#d6c18b]/15 px-8 py-3.5 text-base tracking-[0.12em] text-[#fff9e9] transition duration-300 hover:bg-[#d6c18b] hover:text-[#1e3427] focus-visible:bg-[#d6c18b] focus-visible:text-[#1e3427] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff9e9] disabled:cursor-wait disabled:animate-none"
            >
              <span aria-hidden="true">✧</span>
              <span>{opening ? "Opening…" : "Open invitation"}</span>
              <span aria-hidden="true">✧</span>
            </button>

            <p
              lang="ur"
              dir="rtl"
              className={`${nastaliq.className} mt-3 text-sm leading-[2.2] text-[#e7ddc8]`}
            >
              دعوت نامہ کھولنے کے لیے ٹیپ کریں
            </p>
          </div>
        </div>
      </div>

      {/* Left gate (no border-r, so no line is visible before the tap) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 bg-gradient-to-br from-[#365240] via-[#233a2b] to-[#12221a] ${gateMotion} ${
          gatesOpen ? (reduced ? "opacity-0" : "-translate-x-full") : "translate-x-0"
        }`}
        style={{ transitionDuration: reduced ? undefined : `${GATE_MS}ms` }}
      >
        <div className={gatesOpen ? "invisible" : ""}>
          <div className="absolute inset-3 border border-[#d6c18b]/50 sm:inset-6" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-[#d6c18b] sm:right-6 sm:text-4xl">
            {groomInitial}
          </div>
        </div>
      </div>

      {/* Right gate (no border-l) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2 bg-gradient-to-bl from-[#365240] via-[#233a2b] to-[#12221a] ${gateMotion} ${
          gatesOpen ? (reduced ? "opacity-0" : "translate-x-full") : "translate-x-0"
        }`}
        style={{ transitionDuration: reduced ? undefined : `${GATE_MS}ms` }}
      >
        <div className={gatesOpen ? "invisible" : ""}>
          <div className="absolute inset-3 border border-[#d6c18b]/50 sm:inset-6" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-[#d6c18b] sm:left-6 sm:text-4xl">
            {brideInitial}
          </div>
        </div>
      </div>

      {/* Center line: appears only after the button press, draws top to bottom, then gates open */}
      {opening && !gatesOpen && !reduced && (
        <div
          aria-hidden="true"
          className="ws-draw pointer-events-none absolute inset-y-0 left-1/2 z-[15] w-px bg-[#d6c18b]/70"
        />
      )}
    </div>
  );
}
