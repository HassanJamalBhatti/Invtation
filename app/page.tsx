"use client";
import WeddingSplashScreen from "@/components/WeddingSplashScreen";
import WeddingFireworks from "@/components/WeddingFireworks";

import { useEffect, useRef, useState } from "react";

import type { FormEvent } from "react";

const events = [
  {
    title: "Mehndi",
    date: "2027-01-07",
    start: "2027-01-07T18:00:00+05:00",
    end: "2027-01-07T22:00:00+05:00",
    time: "06:00 PM – 10:00 PM",
    venue:
      "Sardar Palace, Hafiz Abad Road, Near Ghory Shah Chowk, Gujranwala",
    dress: "Traditional & Colorful",
    description:
      "An evening of music, laughter, colors and celebration.",
    symbol: "✿",
  },
  {
    title: "Nikah & Baraat",
    date: "2027-01-08",
    start: "2027-01-08T17:00:00+05:00",
    end: "2027-01-08T23:00:00+05:00",
    time: "01:00 PM – 04:00 PM",
    venue: "Crown Palace, Crown Cinema Chowk, Gujranwala",
    dress: "Formal & Elegant",
    description:
      "The beautiful beginning of our forever, surrounded by loved ones.",
    symbol: "♡",
  },
  {
    title: "Walima",
    date: "2027-01-09",
    start: "2027-01-09T19:00:00+05:00",
    end: "2027-01-09T23:00:00+05:00",
    time: "01:00 PM – 04:00 PM",
    venue:
      "M.B Palace, Hafiz Abad Road, Near Ghory Shah Chowk, Gujranwala",
    dress: "Semi-Formal",
    description:
      "Join us for a joyful evening as we celebrate our new beginning.",
    symbol: "❀",
  },
];

const couple = {
  bride: "Misha Shehzadi",
  groom: "Hassan Jamal",
  date: "January 07–09, 2027",
  venue: "Gujranwala, Pakistan",
};

const whatsappNumber = "923118116115";

const venueCards = [
  {
    eventTitle: "Mehndi",
    venueName: "Sardar Palace Marriage Hall",
    address: "Hafiz Abad Road, Gujranwala",
    mapLink:
      "https://www.google.com/maps/place/Sardar+Palace+Marraige+hall/@32.1549679,74.1588124,17z/data=!3m1!4b1!4m6!3m5!1s0x391f2b366c2daad5:0x3b89f3d5f82c5340!8m2!3d32.1549634!4d74.1613873!16s%2Fg%2F11hz77rjgf?entry=ttu",
    mapQuery: "32.1549634,74.1613873",
    accent: "Mehndi Celebration",
    number: "01",
  },
  {
    eventTitle: "Nikah & Baraat",
    venueName: "Crown Palace Marriage Hall",
    address: "Crown Cinema Chowk, Gujranwala",
    mapLink:
      "https://www.google.com/maps/place/Crown+Palace+Marriage+Hall,+Gala+kulfiyan+Wala,+Gali+Depo+wali/@32.1668005,74.1688088,17z/data=!3m1!4b1!4m6!3m5!1s0x391f2978dd849cf3:0x3a4e5d11079be458!8m2!3d32.166796!4d74.1713837!16s%2Fg%2F11f7800qnv?entry=ttu",
    mapQuery: "32.166796,74.1713837",
    accent: "Nikah & Baraat",
    number: "02",
  },
  {
    eventTitle: "Walima",
    venueName: "M.B Palace Marriage Hall",
    address: "Hafiz Abad Road, Gujranwala",
    mapLink:
      "https://www.google.com/maps/place/MB+Palace+Marriage+Hall/@32.1553734,74.1604639,17z/data=!3m1!4b1!4m6!3m5!1s0x391f2bd1307a7547:0x7de7042ddfec309d!8m2!3d32.1553689!4d74.1630388!16s%2Fg%2F11f_3v3shw?entry=ttu",
    mapQuery: "32.1553689,74.1630388",
    accent: "Wedding Reception",
    number: "03",
  },
];

const sectionBackground = (imageUrl: string) => ({
  backgroundImage: `linear-gradient(rgba(250,248,241,0.84), rgba(250,248,241,0.88)), url("${imageUrl}")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "scroll" as const,
});

function formatCalendarDate(value: string) {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function googleCalendarUrl(event: (typeof events)[number]) {
  const dates = `${formatCalendarDate(event.start)}/${formatCalendarDate(
    event.end
  )}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — ${couple.bride} & ${couple.groom}`,
    dates,
    details: `${event.description}\nDress code: ${event.dress}\nWedding of ${couple.bride} & ${couple.groom}`,
    location: event.venue,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadCalendar(event: (typeof events)[number]) {
  const escapeICS = (value: string) =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");

  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.title.toLowerCase().replace(/\s+/g, "-")}-${event.date}@wedding-invitation.local`,
    `DTSTAMP:${formatCalendarDate(new Date().toISOString())}`,
    `DTSTART:${formatCalendarDate(event.start)}`,
    `DTEND:${formatCalendarDate(event.end)}`,
    `SUMMARY:${escapeICS(`${event.title} — ${couple.bride} & ${couple.groom}`)}`,
    `DESCRIPTION:${escapeICS(`${event.description}\nDress code: ${event.dress}`)}`,
    `LOCATION:${escapeICS(event.venue)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([content], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${event.title.toLowerCase().replace(/\s+/g, "-")}.ics`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CalendarButtons({
  event,
}: {
  event: (typeof events)[number];
}) {
  return (
    <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
      <a
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#344b3d] px-3 py-3 text-center text-xs font-medium tracking-wide text-white transition hover:bg-[#506b56] sm:w-auto sm:px-5"
      >
        <span>＋</span> Google Calendar
      </a>

      <button
        type="button"
        onClick={() => downloadCalendar(event)}
        className="w-full rounded-full border border-[#c8b783] px-3 py-3 text-center text-xs font-medium leading-relaxed transition hover:bg-[#f0ead9] sm:w-auto sm:px-5"
      >
        Download .ics <span lang="ur" dir="rtl">کیلنڈر فائل ڈاؤن لوڈ کریں</span>
      </button>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-10 w-full max-w-2xl break-words text-center sm:mb-14">
      <p className="text-xs uppercase tracking-[0.2em] text-[#a28c58]">
        {eyebrow}
        <span lang="ur" dir="rtl" className="mt-1 block text-sm tracking-normal"> {({
          "Join the celebration": "تقریب میں شریک ہوں",
          "Two families, one beautiful celebration": "دو خاندان، ایک خوبصورت جشن",
          "A place in our hearts": "ہمارے دلوں میں ایک خاص جگہ",
          "We would love to hear from you": "ہم آپ کے جواب کے منتظر ہیں",
        } as Record<string, string>)[eyebrow] || "خوشی کے اس موقع پر آپ کو دعوت ہے"} </span>
      </p>

      <h2 className="mt-4 break-words font-serif text-3xl font-normal sm:text-5xl">
        {title}
      </h2>
      <p lang="ur" dir="rtl" className="mt-2 text-2xl leading-relaxed text-[#344b3d]">
        {({
          "Wedding Events": "شادی کی تقریبات",
          "Our Families": "ہمارے خاندان",
          "The Wedding Venues": "تقریبات کے مقامات",
          "Contact & RSVP": "رابطہ اور شرکت کی تصدیق",
        } as Record<string, string>)[title] || ""}
      </p>

      <p className="mt-5 text-sm leading-7 text-[#77786e]">
        {description}
      </p>
      <p lang="ur" dir="rtl" className="mt-3 text-sm leading-8 text-[#77786e]">
        {({
          "Wedding Events": "تین خاص تقریبات اور بے شمار خوبصورت یادیں۔ ہر تقریب کو اپنے کیلنڈر میں شامل کریں تاکہ کوئی لمحہ رہ نہ جائے۔",
        } as Record<string, string>)[title] || "ہماری خوشیوں میں شامل ہوں اور اپنی موجودگی سے اس موقع کو یادگار بنائیں۔"}
      </p>
    </div>
  );
}


function Bi({ en, ur, className = "" }: { en: string; ur: string; className?: string }) {
  return (
    <span className={`inline-flex min-w-0 flex-col gap-1 break-words ${className}`}>
      <span>{en}</span>
      <span lang="ur" dir="rtl" className="font-sans text-[0.95em] tracking-normal leading-relaxed">
        {ur}
      </span>
    </span>
  );
}

const urduNames: Record<string, string> = {
  "Misha Shehzadi": "مشاء شہزادی",
  "Hassan Jamal": "حسن جمال",
  "Muhammad Nasir": "محمد ناصر",
  "Zohra Yasmin": "زہرہ یاسمین",
  "Muhammad Jamal": "محمد جمال",
  "Ghulam Fatima": "غلام فاطمہ",
  "Sardar Palace Marriage Hall": "سردار پیلس میرج ہال",
  "Crown Palace Marriage Hall": "کراؤن پیلس میرج ہال",
  "M.B Palace Marriage Hall": "ایم بی پیلس میرج ہال",
  "Sardar Palace, Hafiz Abad Road, Near Ghory Shah Chowk, Gujranwala": "سردار پیلس، حافظ آباد روڈ، گھوڑے شاہ چوک کے قریب، گوجرانوالہ",
  "Crown Palace, Crown Cinema Chowk, Gujranwala": "کراؤن پیلس، کراؤن سنیما چوک، گوجرانوالہ",
  "M.B Palace, Hafiz Abad Road, Near Ghory Shah Chowk, Gujranwala": "ایم بی پیلس، حافظ آباد روڈ، گھوڑے شاہ چوک کے قریب، گوجرانوالہ",
  "Hafiz Abad Road, Gujranwala": "حافظ آباد روڈ، گوجرانوالہ",
  "Crown Cinema Chowk, Gujranwala": "کراؤن سنیما چوک، گوجرانوالہ",
  "Gujranwala, Pakistan": "گوجرانوالہ، پاکستان",
};

function NameText({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={`inline-flex min-w-0 flex-col break-words ${className}`}>
      <span>{value}</span>
      <span lang="ur" dir="rtl" className="font-sans text-[0.9em] tracking-normal leading-relaxed">
        {urduNames[value] || value}
      </span>
    </span>
  );
}

export default function WeddingInvitation() {
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicRef = useRef<HTMLAudioElement>(null);

  const [attendance, setAttendance] = useState("yes");
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [message, setMessage] = useState("");
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [showFx, setShowFx] = useState(false);

  useEffect(() => {
    const target = new Date("2027-01-07T18:00:00+05:00").getTime();

    const updateCountdown = () => {
      const difference = Math.max(0, target - Date.now());

      setRemaining({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();

    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, []);

  // Attempt autoplay; browsers may require a user gesture.
  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;

    audio.volume = 0.9;

    audio.play().catch(() => {
      setMusicPlaying(false);
    });
  }, []);

  async function toggleMusic() {
    const audio = musicRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        audio.volume = 0.9;
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error("Music could not be played:", error);
      setMusicPlaying(false);
    }
  }

  function submitRSVP(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const rsvpText = [
      `Wedding RSVP — ${couple.bride} & ${couple.groom}`,
      "",
      `Name: ${guestName.trim()}`,
      `Attendance: ${
        attendance === "yes" ? "Joyfully accepts" : "Regretfully declines"
      }`,
      `Guests: ${attendance === "yes" ? guestCount : "0"}`,
      `Message: ${message.trim() || "No additional message"}`,
      "",
      `Wedding dates: ${couple.date}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      rsvpText
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-[#faf8f1] text-[#344b3d]">
      {!invitationOpened && (
        <WeddingSplashScreen
          bride={couple.bride}
          groom={couple.groom}
          onStart={() => {
            const audio = musicRef.current;
            if (audio) {
              audio.volume = 0.9;
              audio.play().catch(() => setMusicPlaying(false));
            }
          }}
          onOpen={() => {
            setInvitationOpened(true);
            setShowFx(true);
          }}
        />
      )}

      {showFx && (
        <WeddingFireworks duration={7000} onDone={() => setShowFx(false)} />
      )}

      <audio
        ref={musicRef}
        src="/music/wedding-romantic.mp3"
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />
      
      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          `Assalam-o-Alaikum! I would like to contact you regarding the wedding of ${couple.groom} & ${couple.bride}.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        title="Contact us on WhatsApp"
        className="fixed bottom-[4.5rem] right-3 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#25D366] text-white shadow-lg transition duration-300 hover:scale-110 hover:bg-[#1ebe5d] sm:bottom-[5.5rem] sm:right-5 sm:h-14 sm:w-14"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 sm:h-8 sm:w-8"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.6 5.94L.1 24l6.33-1.66a11.9 11.9 0 0 0 5.65 1.44h.01c6.55 0 11.88-5.33 11.88-11.88a11.8 11.8 0 0 0-3.45-8.42ZM12.09 21.76a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.76.99 1-3.67-.24-.38a9.84 9.84 0 0 1-1.51-5.23c0-5.46 4.45-9.91 9.92-9.91a9.85 9.85 0 0 1 7.01 2.91 9.85 9.85 0 0 1 2.9 7.02c0 5.46-4.45 9.91-9.92 9.91Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </a>

      {/* Floating music control */}
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={musicPlaying ? "Pause background music" : "Play background music"}
        className="fixed bottom-3 right-3 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#d6c18b] bg-[#344b3d]/95 text-sm text-white shadow-lg backdrop-blur transition hover:bg-[#506b56] sm:bottom-5 sm:right-5 sm:h-auto sm:w-auto sm:px-5 sm:py-3 sm:text-xs sm:uppercase sm:tracking-widest"
      >
        {musicPlaying ? "Ⅱ" : "♫ "}
      </button>

      {/* 1. Hero */}
      <section
        id="home"
        className="relative flex min-h-[100svh] w-full items-center justify-center bg-cover bg-center px-4 py-16 text-center sm:px-6 sm:py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(23,36,28,.38),rgba(23,36,28,.55)),url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85')",
        }}
      >
        <div className="mx-auto w-full max-w-3xl min-w-0 break-words text-white">
          <p className="text-[10px] uppercase tracking-[0.3em] sm:text-sm sm:tracking-[0.4em]">
            <Bi en="A celebration of love" ur="محبت کا جشن" />
          </p>

          <p className="mt-5 font-serif text-lg italic sm:mt-10 sm:text-3xl">
            <Bi en="Together with our families" ur="اپنے خاندانوں کے ساتھ" />
          </p>

          <h1 className="mt-4 break-words font-serif text-[clamp(2.25rem,10vw,3.25rem)] font-normal leading-tight sm:mt-5 sm:text-8xl">
            <NameText value={couple.groom} />
            <span className="block text-[#e7d5a2]">&</span>
            <NameText value={couple.bride} />
          </h1>

          <div className="mx-auto my-5 h-px w-20 bg-[#e7d5a2] sm:my-8 sm:w-28" />

          <p className="text-xs uppercase tracking-[0.15em] sm:text-base sm:tracking-[0.25em]">
            <Bi en="Invite you to share our special day" ur="ہماری خوشیوں میں شریک ہونے کی دعوت" />
          </p>

          <p className="mt-4 font-serif text-xl italic sm:mt-5 sm:text-2xl">
            {couple.date}
            <span lang="ur" dir="rtl" className="mt-2 block font-sans text-base">۷ تا ۹ جنوری ۲۰۲۷</span>
          </p>

          <a
            href="#events"
            className="mt-7 inline-flex max-w-full items-center justify-center border border-white/70 px-4 py-3 text-[10px] uppercase tracking-[0.12em] transition hover:bg-white hover:text-[#344b3d] sm:mt-10 sm:px-8 sm:py-4 sm:text-xs sm:tracking-[0.25em]"
          >
            <Bi en="Explore Our Wedding ↓" ur="شادی کی تقریبات دیکھیں ↓" />
          </a>
        </div>

        <a
          href="#story"
          className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 px-3 text-[9px] uppercase tracking-[0.12em] text-white/80 sm:bottom-8 sm:text-xs sm:tracking-[0.3em]"
        >
          Scroll to discover
        </a>
      </section>

      {/* 2. Invitation */}

      <section
        id="story"
        className="w-full min-w-0 px-4 py-14 sm:px-5 sm:py-32"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <div className="mx-auto w-full max-w-3xl border border-[#d9cba9] bg-[#fffdf8]/95 px-4 py-10 text-center backdrop-blur-sm sm:px-10 sm:py-16 md:px-16 md:py-20">

          <p className="text-4xl text-[#a28c58]">❦</p>

          {/* Invitation from Parents */}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.2em] text-[#a28c58] sm:tracking-[0.3em]">
            <span>The pleasure of your company</span>
            <span lang="ur" dir="rtl" className="text-sm tracking-normal">
              آپ کی آمد ہمارے لیے باعثِ مسرت ہوگی
            </span>
          </p>

          <h2 className="mt-7 font-serif text-3xl italic leading-relaxed sm:text-5xl">
            <span className="block">With Great Joy & Happiness</span>
            <span
              lang="ur"
              dir="rtl"
              className="mt-3 block font-serif text-2xl not-italic leading-relaxed sm:text-3xl"
            >
              نہایت خوشی اور مسرت کے ساتھ
            </span>
          </h2>

          {/* Parents' Invitation Message */}
          <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#77786e] sm:text-base sm:leading-9">
            With immense joy and gratitude to Almighty Allah, we cordially invite
            you to join us in celebrating the wedding of our beloved children,
            <span className="font-semibold text-[#344b3d]">
              {" "}{couple.bride} & {couple.groom}
            </span>.
            <br />
            Your gracious presence, heartfelt prayers, and blessings will make
            this special occasion even more memorable for our families.

            <span
              lang="ur"
              dir="rtl"
              className="mt-5 block text-sm leading-8 sm:text-base sm:leading-9"
            >
              اللہ تعالیٰ کے فضل و کرم سے ہم اپنے پیارے بچوں
              {" "}{urduNames[couple.bride]} اور {urduNames[couple.groom]}
              {" "}کی شادی کی پُرمسرت تقریب میں آپ کو دلی طور پر مدعو کرتے ہیں۔
              آپ کی تشریف آوری، دعائیں اور نیک تمنائیں ہمارے لیے باعثِ مسرت
              ہوں گی اور ہماری خوشیوں کو دوبالا کریں گی۔
            </span>
          </p>

          {/* Parents' Names */}
          <div className="mx-auto mt-9 max-w-lg border-y border-[#e4d9c2] py-6">

            <p className="text-xs uppercase tracking-[0.2em] text-[#a28c58]">
              With Warm Regards & Best Wishes
            </p>

            <p
              lang="ur"
              dir="rtl"
              className="mt-2 text-sm text-[#a28c58]"
            >
              نیک تمناؤں اور محبت کے ساتھ
            </p>

            <p className="mt-5 font-serif text-lg leading-8 text-[#344b3d] sm:text-xl">
              The Bride's Family & The Groom's Family
            </p>

            <p
              lang="ur"
              dir="rtl"
              className="mt-2 text-base leading-8 text-[#344b3d]"
            >
              اہلِ خانہ کی جانب سے
            </p>

          </div>

          <p className="mt-8 font-serif text-xl italic text-[#a28c58]">
            We look forward to celebrating with you
          </p>

          <p
            lang="ur"
            dir="rtl"
            className="mt-3 text-base leading-8 text-[#77786e]"
          >
            ہمیں آپ کی آمد کا بے حد انتظار رہے گا
          </p>

          <p className="mt-7 text-3xl text-[#a28c58]">❦</p>

        </div>
      </section>



      {/* 3. Countdown */}
      <section
        className="w-full min-w-0 px-4 py-14 text-center sm:px-5 sm:py-28"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1519225421980-88d3e6e6b8a5?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[#a28c58]">
          <Bi en="Save the date" ur="تاریخ محفوظ کر لیں" />
        </p>

        <h2 className="mt-5 font-serif text-3xl sm:text-5xl">
          <Bi en="Until We Say I Do" ur="ہماری شادی تک باقی وقت" />
        </h2>

        <div className="mx-auto mt-8 grid w-full max-w-2xl grid-cols-4 gap-2 sm:mt-12 sm:gap-6">
          {[
            ["Days", remaining.days],
            ["Hours", remaining.hours],
            ["Minutes", remaining.minutes],
            ["Seconds", remaining.seconds],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="min-w-0 border border-[#ded4bd] bg-[#fffdf8]/90 px-1 py-4 backdrop-blur-sm sm:py-8"
            >
              <p className="font-serif text-2xl tabular-nums sm:text-5xl">
                {String(value).padStart(2, "0")}
              </p>

              <p className="mt-3 text-[9px] uppercase tracking-wider text-[#8b897d] sm:text-xs sm:tracking-widest">
                {label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 font-serif text-lg italic text-[#8b897d]">
          <Bi en="We cannot wait to celebrate with you." ur="ہم آپ کے ساتھ خوشیاں منانے کے منتظر ہیں۔" />
        </p>
      </section>

      {/* 4. Events and Calendar */}
      <section
        id="events"
        className="w-full min-w-0 px-4 py-14 sm:px-5 sm:py-28"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <SectionHeading
          eyebrow="Join the celebration"
          title="Wedding Events" description="Three special celebrations, countless beautiful memories. Choose an event and add it to your calendar so you never miss a moment."
        />

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {events.map((event, index) => {
            const eventImages = [
              "rasam-e-hina.jpg",
              "barat.jpg",
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85",
            ];

            return (
              <article
                key={event.title}
                className="group flex min-w-0 flex-col overflow-hidden break-words border border-[#d8d0bb] bg-[#fffdf8]/95 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Event Image */}
                <div className="relative h-48 w-full overflow-hidden sm:h-64">
                  <img
                    src={eventImages[index % eventImages.length]}
                    alt={`${event.title} wedding celebration`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                  
                </div>

                {/* Event Details */}
                <div className="flex min-w-0  flex-1 flex-col p-4 sm:p-7">
                  <p className="text-[11px] text-center uppercase tracking-[0.18em] text-[#a28c58]">
                    —  {new Date(`${event.date}T12:00:00`).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "Asia/Karachi",
                      }
                    )}  —
                  </p>

                  <h3 className="mt-2 break-words text-center font-serif text-2xl text-[#26382d] sm:text-3xl">
                    <Bi en={event.title} ur={event.title === "Mehndi" ? "مہندی" : event.title === "Nikah & Baraat" ? "نکاح اور بارات" : "ولیمہ"} />
                  </h3>

                  <p className="mt-3 break-words text-sm leading-6 text-[#77786e]">
                    {event.description}
                    <span lang="ur" dir="rtl" className="mt-2 block">{event.title === "Mehndi" ? "موسیقی، ہنسی، رنگوں اور خوشیوں سے بھری ایک شام۔" : event.title === "Nikah & Baraat" ? "اپنوں کی محبت اور دعاؤں کے سائے میں ہماری نئی زندگی کا خوبصورت آغاز۔" : "ہماری نئی زندگی کی خوشی میں اس یادگار شام کو ہمارے ساتھ منائیں۔"}</span>
                  </p>

                  <div className="mt-6 space-y-4 border-t border-[#e8e0cd] pt-5 text-sm leading-6 text-[#4e5148]">
                    {/* Time */}
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 text-xs text-[#a28c58]">◷</span>
                      <p className="min-w-0 break-words">{event.time}<span lang="ur" dir="rtl" className="mt-1 block">وقت: {event.time.replace("06:00 PM", "شام ۰۶:۰۰").replace("10:00 PM", "رات ۱۰:۰۰").replace("01:00 PM", "دوپہر ۰۱:۰۰").replace("04:00 PM", "شام ۰۴:۰۰")}</span></p>
                    </div>

                    {/* Venue */}
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 text-xs text-[#a28c58]">⌖</span>
                      <p className="min-w-0 break-words">{event.venue}<span lang="ur" dir="rtl" className="mt-1 block">مقام: {urduNames[event.venue] || event.venue}</span></p>
                    </div>

                    {/* Dress Code */}
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 text-xs text-[#a28c58]">✧</span>
                      <p>{event.dress}<span lang="ur" dir="rtl" className="mt-1 block">{event.dress === "Traditional & Colorful" ? "روایتی اور رنگین لباس" : event.dress === "Formal & Elegant" ? "رسمی اور خوبصورت لباس" : "نیم رسمی لباس"}</span></p>
                    </div>
                  </div>

                  {/* Calendar Buttons */}
                  <div className="mt-auto pt-7">
                    <CalendarButtons event={event} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-6 text-[#77786e]">
          گوگل کیلنڈر میں تقریب پہلے سے درج ہوگی۔ .ics فائل کو ایپل کیلنڈر، آؤٹ لک اور دیگر کیلنڈر ایپس میں شامل کیا جا سکتا ہے۔
        </p>
      </section>

      {/* 5. Families */}
      <section
        id="families"
        className="w-full min-w-0 px-4 py-14 sm:px-5 sm:py-32"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <SectionHeading
          eyebrow="Two families, one beautiful celebration"
          title="Our Families"
          description="With the love, prayers and blessings of our families, we invite you to share in the joy of our new beginning."
        />

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <article className="min-w-0 border border-[#d9cba9] bg-[#fffdf8]/90 px-4 py-8 text-center backdrop-blur-sm sm:px-10 sm:py-10">
            <p className="text-3xl text-[#a28c58]">❦</p>

            <p className="mt-5 text-xs uppercase tracking-[0.3em] text-[#a28c58]">
              The Bride&apos;s Family
            </p>

            <h3 className="mt-4 font-serif text-3xl">
              <NameText value={couple.bride} />
            </h3>

            <div className="mx-auto my-6 h-px w-16 bg-[#d9cba9]" />

            <p className="font-serif text-xl">Daughter of <span lang="ur" dir="rtl" className="block">دخترِ</span></p>
            <p className="mt-3 text-sm text-[#77786e]">Muhammad Nasir <span lang="ur" dir="rtl" className="mt-1 block">محمد ناصر</span></p>
            <p className="mt-1 text-sm text-[#77786e]">Zohra Yasmin <span lang="ur" dir="rtl" className="mt-1 block">زہرہ یاسمین</span></p>

            <p className="mt-6 text-sm italic leading-7 text-[#77786e]">
              With their love and blessings, she begins a beautiful new chapter.
            </p>
          </article>

          <article className="min-w-0 border border-[#d9cba9] bg-[#fffdf8]/90 px-4 py-8 text-center backdrop-blur-sm sm:px-10 sm:py-10">
            <p className="text-3xl text-[#a28c58]">❦</p>

            <p className="mt-5 text-xs uppercase tracking-[0.3em] text-[#a28c58]">
              The Groom&apos;s Family
            </p>

            <h3 className="mt-4 font-serif text-3xl">
              <NameText value={couple.groom} />
            </h3>

            <div className="mx-auto my-6 h-px w-16 bg-[#d9cba9]" />

            <p className="font-serif text-xl">Son of <span lang="ur" dir="rtl" className="block">فرزندِ</span></p>
            <p className="mt-3 text-sm text-[#77786e]">Muhammad Jamal <span lang="ur" dir="rtl" className="mt-1 block">محمد جمال</span></p>
            <p className="mt-1 text-sm text-[#77786e]">Ghulam Fatima <span lang="ur" dir="rtl" className="mt-1 block">غلام فاطمہ</span></p>

            <p className="mt-6 text-sm italic leading-7 text-[#77786e]">
              With their love and blessings, he begins a beautiful new chapter.
            </p>
          </article>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center font-serif text-xl italic text-[#8b897d]">
          Two families united by love, surrounded by blessings.
        </p>
      </section>

      {/* 6. Venue */}
      <section
        id="location"
        className="relative w-full min-w-0 overflow-hidden px-4 py-14 sm:px-5 sm:py-32"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1519225421980-88d3e6e6b8a5?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[#faf8f0]/90" />

        <div className="relative z-10 w-full min-w-0">
          <SectionHeading
            eyebrow="A place in our hearts"
            title="The Wedding Venues"
            description="Three beautiful celebrations, three special places. Select Get Directions to open the exact location."
          />

          <div className="mx-auto mt-10 grid w-full max-w-6xl grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
            {venueCards.map((venue) => {
              const event = events.find(
                (item) => item.title === venue.eventTitle
              );

              return (
                <article
                  key={venue.eventTitle}
                  className="group flex min-w-0 flex-col overflow-hidden break-words border border-[#d8c69b] bg-[#fffdf8] shadow-[0_12px_35px_rgba(73,58,34,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(73,58,34,0.13)]"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-[#e9e4d7] sm:h-56">
                    <iframe
                      title={`${venue.venueName} Google Maps`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        venue.mapQuery
                      )}&z=17&output=embed`}
                      className="h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />

                    <div className="absolute left-4 top-4 border border-[#d8c69b] bg-[#fffdf8]/95 px-4 py-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#9b8046]">
                        {venue.accent}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col px-4 py-6 text-center sm:px-7 sm:py-7">
                    <p className="font-serif text-sm italic tracking-[0.2em] text-[#a28c58]">
                      — {venue.number} —
                    </p>

                    <h3 className="mt-3 font-serif text-2xl leading-snug text-[#344b3d]">
                      <Bi en={venue.eventTitle} ur={venue.eventTitle === "Mehndi" ? "مہندی" : venue.eventTitle === "Nikah & Baraat" ? "نکاح اور بارات" : "ولیمہ"} />
                    </h3>

                    <div className="mx-auto my-5 flex items-center gap-3">
                      <span className="h-px w-8 bg-[#d8c69b]" />
                      <span className="text-sm text-[#a28c58]">✦</span>
                      <span className="h-px w-8 bg-[#d8c69b]" />
                    </div>

                    <h4 className="text-base font-medium leading-relaxed text-[#4b5144]">
                      <NameText value={venue.venueName} />
                    </h4>

                    <p className="mt-2 break-words text-sm text-[#858276]">
                      {venue.address}
                      <span lang="ur" dir="rtl" className="mt-1 block">{urduNames[venue.address] || venue.address}</span>
                    </p>

                    {event && (
                      <div className="mt-5 border-t border-[#eee5d3] pt-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#a28c58]">
                          <Bi en="Event details" ur="تقریب کی تفصیلات" />
                        </p>

                        <p className="mt-2 break-words text-sm leading-6 text-[#6e7065]">
                          {event.time}
                        </p>

                        <p className="mt-2 break-words text-sm text-[#6e7065]">
                          {event.dress}
                        </p>
                      </div>
                    )}

                    <a
                      href={venue.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-7 inline-flex w-full items-center justify-center gap-2 border border-[#344b3d] px-5 py-3.5 text-xs uppercase tracking-[0.18em] text-[#344b3d] transition duration-300 hover:bg-[#344b3d] hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>

                      Get Directions <span lang="ur" dir="rtl">راستہ دیکھیں</span> <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-10 text-center font-serif text-lg italic text-[#8c805f]">
            Your presence will make our celebrations even more special.
          </p>
        </div>
      </section>

      {/* 7. Contact and RSVP */}

      <section
        id="contact"
        className="w-full min-w-0 px-4 py-14 sm:px-5 sm:py-32"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <SectionHeading
          eyebrow="We would love to hear from you"
          title="Contact & RSVP"
          description="Please let us know if you can join our celebration. Your RSVP will open a WhatsApp chat directly with the hosts."
        />

        <form
          onSubmit={submitRSVP}
          className="mx-auto w-full max-w-2xl min-w-0 border border-[#d9cba9] bg-[#fffdf8]/95 p-4 backdrop-blur-sm sm:p-10"
        >
          {/* Guest Name */}
          <label
            htmlFor="guest-name"
            className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#8b897d]"
          >
            <span>Your name</span>
            <span lang="ur" dir="rtl" className="text-sm tracking-normal">
              آپ کا نام
            </span>
          </label>

          <input
            id="guest-name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            maxLength={100}
            placeholder="Enter your full name / اپنا پورا نام لکھیں"
            className="mb-6 block w-full min-w-0 max-w-full rounded-sm border border-[#ded4bd] bg-white px-3 py-3 text-sm outline-none focus:border-[#a28c58] sm:px-4"
          />

          {/* Attendance Question */}
          <p className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#8b897d]">
            <span>Will you attend?</span>
            <span lang="ur" dir="rtl" className="text-sm tracking-normal">
              کیا آپ تقریب میں شرکت کریں گے؟
            </span>
          </p>

          {/* Attendance Options */}
          <div className="mb-6 flex flex-col gap-4 text-sm sm:flex-row sm:flex-wrap sm:gap-5">
            <label className="flex flex-wrap items-center gap-2">
              <input
                type="radio"
                name="attendance"
                value="yes"
                checked={attendance === "yes"}
                onChange={() => setAttendance("yes")}
              />

              <span>Joyfully accepts</span>
              <span lang="ur" dir="rtl" className="text-sm">
                خوشی سے شرکت کروں گا/گی
              </span>
            </label>

            <label className="flex flex-wrap items-center gap-2">
              <input
                type="radio"
                name="attendance"
                value="no"
                checked={attendance === "no"}
                onChange={() => setAttendance("no")}
              />

              <span>Regretfully declines</span>
              <span lang="ur" dir="rtl" className="text-sm">
                معذرت کے ساتھ شرکت نہیں کر سکوں گا/گی
              </span>
            </label>
          </div>

          {/* Number of Guests */}
          {attendance === "yes" && (
            <>
              <label
                htmlFor="guest-count"
                className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#8b897d]"
              >
                <span>Number of guests</span>
                <span lang="ur" dir="rtl" className="text-sm tracking-normal">
                  مہمانوں کی تعداد
                </span>
              </label>

              <select
                id="guest-count"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="mb-6 block w-full min-w-0 max-w-full rounded-sm border border-[#ded4bd] bg-white px-3 py-3 text-sm sm:px-4"
              >
                {["1", "2", "3", "4", "5", "6"].map((count) => (
                  <option key={count} value={count}>
                    {count} {count === "1" ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Optional Message */}
          <label
            htmlFor="guest-message"
            className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#8b897d]"
          >
            <span>Message (optional)</span>
            <span lang="ur" dir="rtl" className="text-sm tracking-normal">
              پیغام (اختیاری)
            </span>
          </label>

          <textarea
            id="guest-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Write a message for the couple... / جوڑے کے لیے پیغام لکھیں..."
            className="mb-6 block w-full min-w-0 max-w-full rounded-sm border border-[#ded4bd] bg-white px-3 py-3 text-sm outline-none focus:border-[#a28c58] sm:px-4"
          />

          {/* WhatsApp Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#344b3d] px-4 py-4 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-[#506b56] sm:px-6 sm:tracking-[0.2em]"
          >
            <span>Send RSVP via WhatsApp </span>
            <span
              lang="ur"
              dir="rtl"
              className="mt-2 block text-sm tracking-normal"
            >
              واٹس ایپ پر شرکت کی تصدیق بھیجیں
            </span>
          </button>

          {/* Confirmation Instructions */}
          <p className="mt-4 text-center text-xs leading-6 text-[#8b897d]">
            WhatsApp will open directly to the hosts&apos; number with your RSVP
            details prepared. Please review and press Send.

            <span
              lang="ur"
              dir="rtl"
              className="mt-2 block text-sm leading-7"
            >
              واٹس ایپ پر میزبان کا چیٹ کھل جائے گا اور آپ کی تفصیلات تیار ہوں گی۔
              براہِ کرم جائزہ لے کر بھیج دیں۔
            </span>
          </p>
        </form>
      </section>



      {/* 8. Closing */}
      <footer
        className="relative w-full min-w-0 overflow-hidden bg-cover bg-center px-4 py-14 text-center text-white sm:px-5 sm:py-32"
        style={{
          backgroundImage:
            "linear-gradient(rgba(23,36,28,.76),rgba(23,36,28,.88)),url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="text-4xl text-[#d6c18b]">❦</p>

        <p className="mt-7 text-xs uppercase tracking-[0.35em] text-[#d6c18b]">
          The beginning of forever
        </p>

        <h2 className="mt-6 break-words font-serif text-3xl italic sm:text-7xl">
          {couple.groom} & {couple.bride}
        </h2>

        <p className="mt-7 text-sm leading-7 text-white/75">
          One love. One promise. One beautiful forever.
          <span lang="ur" dir="rtl" className="mt-3 block">ایک محبت، ایک وعدہ، اور ہمیشہ کے لیے ایک خوبصورت ساتھ۔</span>
          <br />
          <Bi en="We cannot wait to celebrate with you." ur="ہم آپ کے ساتھ خوشیاں منانے کے منتظر ہیں۔" />
          {/* <span lang="ur" dir="rtl" className="mt-2 block">ہم آپ کے ساتھ خوشیاں منانے کے منتظر ہیں۔</span> */}
        </p>

        <a
          href="#home"
          className="mt-9 inline-flex max-w-full items-center justify-center border border-white/40 px-5 py-3 text-xs uppercase tracking-wide transition hover:bg-white hover:text-[#344b3d] sm:px-7 sm:tracking-widest"
        >
          <Bi en="Back to top ↑" ur="اوپر جائیں ↑" />
        </a>

        <p className="mt-16 text-[10px] uppercase tracking-[0.25em] text-white/50">
          Made with love for our special day · 2026
        </p>
      </footer>
    </main>
  );
}