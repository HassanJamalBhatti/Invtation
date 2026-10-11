
"use client";

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
  backgroundAttachment: "fixed" as const,
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
    <div className="mt-6 flex flex-wrap gap-3">
      <a
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#344b3d] px-5 py-3 text-xs font-medium tracking-wide text-white transition hover:bg-[#506b56]"
      >
        <span>＋</span> Google Calendar
      </a>

      <button
        type="button"
        onClick={() => downloadCalendar(event)}
        className="rounded-full border border-[#c8b783] px-5 py-3 text-xs font-medium tracking-wide transition hover:bg-[#f0ead9]"
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
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[#a28c58]">
        {eyebrow}
        <span lang="ur" dir="rtl" className="mt-1 block text-sm tracking-normal"> {({
          "Join the celebration": "تقریب میں شریک ہوں",
          "Two families, one beautiful celebration": "دو خاندان، ایک خوبصورت جشن",
          "A place in our hearts": "ہمارے دلوں میں ایک خاص جگہ",
          "We would love to hear from you": "ہم آپ کے جواب کے منتظر ہیں",
        } as Record<string, string>)[eyebrow] || "خوشی کے اس موقع پر آپ کو دعوت ہے"} </span>
      </p>

      <h2 className="mt-4 font-serif text-4xl font-normal sm:text-5xl">
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
    <span className={`inline-flex flex-col gap-1 ${className}`}>
      <span>{en}</span>
      <span lang="ur" dir="rtl" className="font-sans text-[0.95em] tracking-normal leading-relaxed">
        {ur}
      </span>
    </span>
  );
}

const urduNames: Record<string, string> = {
  "Misha Shehzadi": "میشہ شہزادی",
  "Hassan Jamal": "حسن جمال",
  "Muhammad Nasir": "محمد ناصر",
  "Zohra Yasmin": "زہرہ یاسمین",
  "Muhammad Jamal": "محمد جمال",
  "Ghulam Fatima": "غلام فاطمہ",
  "Sardar Palace Marriage Hall": "سردار پیلس میرج ہال",
  "Crown Palace Marriage Hall": "کراؤن پیلس میرج ہال",
  "M.B Palace Marriage Hall": "ایم بی پیلس میرج ہال",
  "Sardar Palace, Hafiz Abad Road, Near Ghory Shah Chowk, Gujranwala": "سردار پیلس، حافظ آباد روڈ، غوری شاہ چوک کے قریب، گوجرانوالہ",
  "Crown Palace, Crown Cinema Chowk, Gujranwala": "کراؤن پیلس، کراؤن سنیما چوک، گوجرانوالہ",
  "M.B Palace, Hafiz Abad Road, Near Ghory Shah Chowk, Gujranwala": "ایم بی پیلس، حافظ آباد روڈ، غوری شاہ چوک کے قریب، گوجرانوالہ",
  "Hafiz Abad Road, Gujranwala": "حافظ آباد روڈ، گوجرانوالہ",
  "Crown Cinema Chowk, Gujranwala": "کراؤن سنیما چوک، گوجرانوالہ",
  "Gujranwala, Pakistan": "گوجرانوالہ، پاکستان",
};

function NameText({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={`inline-flex flex-col ${className}`}>
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
    <main className="overflow-hidden bg-[#faf8f1] text-[#344b3d]">
      <audio
        ref={musicRef}
        src="/music/wedding-romantic.mp3"
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />

      {/* Floating music control */}
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={musicPlaying ? "Pause background music" : "Play background music"}
        className="fixed bottom-5 right-4 z-50 rounded-full border border-[#d6c18b] bg-[#344b3d]/95 px-4 py-3 text-xs uppercase tracking-widest text-white shadow-lg backdrop-blur transition hover:bg-[#506b56] sm:right-5 sm:px-5"
      >
        {musicPlaying ? "Ⅱ" : "♫ "}
      </button>

      {/* 1. Hero */}
      <section
        id="home"
        className="relative flex min-h-[100svh] items-center justify-center bg-cover bg-center px-5 py-16 text-center sm:py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(23,36,28,.38),rgba(23,36,28,.55)),url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85')",
        }}
      >
        <div className="w-full max-w-3xl text-white">
          <p className="text-[10px] uppercase tracking-[0.3em] sm:text-sm sm:tracking-[0.4em]">
            <Bi en="A celebration of love" ur="محبت کا جشن" />
          </p>

          <p className="mt-6 font-serif text-xl italic sm:mt-10 sm:text-3xl">
            <Bi en="Together with our families" ur="اپنے خاندانوں کے ساتھ" />
          </p>

          <h1 className="mt-4 font-serif text-5xl font-normal leading-tight sm:mt-5 sm:text-8xl">
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
            className="mt-7 inline-block border border-white/70 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition hover:bg-white hover:text-[#344b3d] sm:mt-10 sm:px-8 sm:py-4 sm:text-xs sm:tracking-[0.25em]"
          >
            <Bi en="Explore Our Wedding ↓" ur="شادی کی تقریبات دیکھیں ↓" />
          </a>
        </div>

        <a
          href="#story"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.25em] text-white/80 sm:bottom-8 sm:text-xs sm:tracking-[0.3em]"
        >
          Scroll to discover
        </a>
      </section>

      {/* 2. Invitation */}
      <section
        id="story"
        className="px-5 py-24 sm:py-32"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <div className="mx-auto max-w-3xl border border-[#d9cba9] bg-[#fffdf8]/90 px-6 py-14 text-center backdrop-blur-sm sm:px-16 sm:py-20">
          <p className="text-4xl text-[#a28c58]">❦</p>

          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#a28c58]">
            <Bi en="The pleasure of your company" ur="آپ کی آمد ہمارے لیے باعثِ مسرت ہوگی" />
          </p>

          <h2 className="mt-7 font-serif text-4xl italic sm:text-6xl">
            <Bi en="With hearts full of joy" ur="خوشیوں سے بھرے دلوں کے ساتھ" />
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#77786e]">
            We are beginning a beautiful new chapter and would be honored
            to have you by our side. Your love, blessings and presence
            will make our celebration truly unforgettable. Please join
            our families as we celebrate the beginning of our forever.
            <span lang="ur" dir="rtl" className="mt-4 block">ہم اپنی زندگی کے اس خوبصورت نئے باب کا آغاز کر رہے ہیں۔ ہماری خوشیوں میں شریک ہو کر اپنی محبت، دعاؤں اور موجودگی سے اس دن کو یادگار بنائیں۔</span>
          </p>

          <p className="mt-8 font-serif text-xl italic">
            <span className="block">With love, {couple.bride} & {couple.groom}</span>
            <span lang="ur" dir="rtl" className="mt-2 block text-lg">محبت کے ساتھ، {urduNames[couple.bride]} اور {urduNames[couple.groom]}</span>
          </p>
        </div>
      </section>

      {/* 3. Countdown */}
      <section
        className="px-5 py-24 text-center sm:py-28"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1519225421980-88d3e6e6b8a5?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[#a28c58]">
          <Bi en="Save the date" ur="تاریخ محفوظ کر لیں" />
        </p>

        <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
          <Bi en="Until We Say I Do" ur="ہماری شادی تک باقی وقت" />
        </h2>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-2 sm:gap-6">
          {[
            ["Days", remaining.days],
            ["Hours", remaining.hours],
            ["Minutes", remaining.minutes],
            ["Seconds", remaining.seconds],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="border border-[#ded4bd] bg-[#fffdf8]/90 px-1 py-6 backdrop-blur-sm sm:py-8"
            >
              <p className="font-serif text-2xl sm:text-5xl">
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
        className="px-5 py-20 sm:py-28"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <SectionHeading
          eyebrow="Join the celebration"
          title="Wedding Events" description="Three special celebrations, countless beautiful memories. Choose an event and add it to your calendar so you never miss a moment."
        />

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => {
            const eventImages = [
              "rasam-e-hina.jpg",
              "barat.jpg",
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85",
            ];

            return (
              <article
                key={event.title}
                className="group flex flex-col overflow-hidden border border-[#d8d0bb] bg-[#fffdf8]/95 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Event Image */}
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <img
                    src={eventImages[index % eventImages.length]}
                    alt={`${event.title} wedding celebration`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                  
                </div>

                {/* Event Details */}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#a28c58]">
                    {new Date(`${event.date}T12:00:00`).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "Asia/Karachi",
                      }
                    )}
                  </p>

                  <h3 className="mt-2 font-serif text-2xl text-[#26382d] sm:text-3xl">
                    <Bi en={event.title} ur={event.title === "Mehndi" ? "مہندی" : event.title === "Nikah & Baraat" ? "نکاح اور بارات" : "ولیمہ"} />
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#77786e]">
                    {event.description}
                    <span lang="ur" dir="rtl" className="mt-2 block">{event.title === "Mehndi" ? "موسیقی، ہنسی، رنگوں اور خوشیوں سے بھری ایک شام۔" : event.title === "Nikah & Baraat" ? "اپنوں کی محبت اور دعاؤں کے سائے میں ہماری نئی زندگی کا خوبصورت آغاز۔" : "ہماری نئی زندگی کی خوشی میں اس یادگار شام کو ہمارے ساتھ منائیں۔"}</span>
                  </p>

                  <div className="mt-6 space-y-4 border-t border-[#e8e0cd] pt-5 text-sm leading-6 text-[#4e5148]">
                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-xs text-[#a28c58]">◷</span>
                      <p>{event.time}<span lang="ur" dir="rtl" className="mt-1 block">وقت: {event.time.replace("06:00 PM", "شام ۰۶:۰۰").replace("10:00 PM", "رات ۱۰:۰۰").replace("01:00 PM", "دوپہر ۰۱:۰۰").replace("04:00 PM", "شام ۰۴:۰۰")}</span></p>
                    </div>

                    {/* Venue */}
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-xs text-[#a28c58]">⌖</span>
                      <p>{event.venue}<span lang="ur" dir="rtl" className="mt-1 block">مقام: {urduNames[event.venue] || event.venue}</span></p>
                    </div>

                    {/* Dress Code */}
                    <div className="flex items-start gap-3">
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
        className="px-5 py-24 sm:py-32"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <SectionHeading
          eyebrow="Two families, one beautiful celebration"
          title="Our Families"
          description="With the love, prayers and blessings of our families, we invite you to share in the joy of our new beginning."
        />

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="border border-[#d9cba9] bg-[#fffdf8]/90 px-7 py-10 text-center backdrop-blur-sm sm:px-10">
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

          <article className="border border-[#d9cba9] bg-[#fffdf8]/90 px-7 py-10 text-center backdrop-blur-sm sm:px-10">
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
        className="relative overflow-hidden px-5 py-24 sm:py-32"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1519225421980-88d3e6e6b8a5?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[#faf8f0]/90" />

        <div className="relative z-10">
          <SectionHeading
            eyebrow="A place in our hearts"
            title="The Wedding Venues"
            description="Three beautiful celebrations, three special places. Select Get Directions to open the exact location."
          />

          <div className="mx-auto mt-14 grid max-w-6xl gap-7 md:grid-cols-2 lg:grid-cols-3">
            {venueCards.map((venue) => {
              const event = events.find(
                (item) => item.title === venue.eventTitle
              );

              return (
                <article
                  key={venue.eventTitle}
                  className="group flex flex-col overflow-hidden border border-[#d8c69b] bg-[#fffdf8] shadow-[0_12px_35px_rgba(73,58,34,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(73,58,34,0.13)]"
                >
                  <div className="relative h-56 overflow-hidden bg-[#e9e4d7]">
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

                  <div className="flex flex-1 flex-col px-6 py-7 text-center sm:px-7">
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

                    <p className="mt-2 text-sm text-[#858276]">
                      {venue.address}
                      <span lang="ur" dir="rtl" className="mt-1 block">{urduNames[venue.address] || venue.address}</span>
                    </p>

                    {event && (
                      <div className="mt-5 border-t border-[#eee5d3] pt-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#a28c58]">
                          <Bi en="Event details" ur="تقریب کی تفصیلات" />
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#6e7065]">
                          {event.time}
                        </p>

                        <p className="mt-2 text-sm text-[#6e7065]">
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
        className="px-5 py-24 sm:py-32"
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
          className="mx-auto max-w-2xl border border-[#d9cba9] bg-[#fffdf8]/95 p-6 backdrop-blur-sm sm:p-10"
        >
          <label
            htmlFor="guest-name"
            className="mb-2 block text-xs uppercase tracking-widest text-[#8b897d]"
          >
            <Bi en="Your name" ur="آپ کا نام" />
          </label>

          <input
            id="guest-name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            maxLength={100}
            placeholder="Enter your full name / اپنا پورا نام لکھیں"
            className="mb-6 w-full border border-[#ded4bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#a28c58]"
          />

          <p className="mb-3 text-xs uppercase tracking-widest text-[#8b897d]">
            <Bi en="Will you attend?" ur="کیا آپ تقریب میں شرکت کریں گے؟" />
          </p>

          <div className="mb-6 flex flex-wrap gap-5 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attendance"
                value="yes"
                checked={attendance === "yes"}
                onChange={() => setAttendance("yes")}
              />
              <Bi en="Joyfully accepts" ur="خوشی سے شرکت کروں گا/گی" />
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attendance"
                value="no"
                checked={attendance === "no"}
                onChange={() => setAttendance("no")}
              />
              <Bi en="Regretfully declines" ur="معذرت کے ساتھ شرکت نہیں کر سکوں گا/گی" />
            </label>
          </div>

          {attendance === "yes" && (
            <>
              <label
                htmlFor="guest-count"
                className="mb-2 block text-xs uppercase tracking-widest text-[#8b897d]"
              >
                <Bi en="Number of guests" ur="مہمانوں کی تعداد" />
              </label>

              <select
                id="guest-count"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="mb-6 w-full border border-[#ded4bd] bg-white px-4 py-3 text-sm"
              >
                {["1", "2", "3", "4", "5", "6"].map((count) => (
                  <option key={count} value={count}>
                    {count} {count === "1" ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </>
          )}

          <label
            htmlFor="guest-message"
            className="mb-2 block text-xs uppercase tracking-widest text-[#8b897d]"
          >
            <Bi en="Message (optional)" ur="پیغام (اختیاری)" />
          </label>

          <textarea
            id="guest-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Write a message for the couple... / جوڑے کے لیے پیغام لکھیں..."
            className="mb-6 w-full border border-[#ded4bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#a28c58]"
          />

          <button
            type="submit"
            className="w-full bg-[#344b3d] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#506b56]"
          >
            Send RSVP via WhatsApp ↗
            <span lang="ur" dir="rtl" className="mt-2 block text-sm tracking-normal">واٹس ایپ پر شرکت کی تصدیق بھیجیں</span>
          </button>

          <p className="mt-4 text-center text-xs leading-6 text-[#8b897d]">
            WhatsApp will open directly to the hosts&apos; number with your
            RSVP details prepared. Please review and press Send.
            <span lang="ur" dir="rtl" className="mt-2 block">واٹس ایپ پر میزبان کا چیٹ کھل جائے گا اور آپ کی تفصیلات تیار ہوں گی۔ براہِ کرم جائزہ لے کر بھیج دیں۔</span>
          </p>
        </form>
      </section>

      {/* 8. Closing */}
      <footer
        className="relative overflow-hidden bg-cover bg-center px-5 py-24 text-center text-white sm:py-32"
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

        <h2 className="mt-6 font-serif text-4xl italic sm:text-7xl">
          {couple.groom} & {couple.bride}
        </h2>

        <p className="mt-7 text-sm leading-7 text-white/75">
          One love. One promise. One beautiful forever.
          <span lang="ur" dir="rtl" className="mt-3 block">ایک محبت، ایک وعدہ، اور ہمیشہ کے لیے ایک خوبصورت ساتھ۔</span>
          <br />
          <Bi en="We cannot wait to celebrate with you." ur="ہم آپ کے ساتھ خوشیاں منانے کے منتظر ہیں۔" />
          <span lang="ur" dir="rtl" className="mt-2 block">ہم آپ کے ساتھ خوشیاں منانے کے منتظر ہیں۔</span>
        </p>

        <a
          href="#home"
          className="mt-9 inline-block border border-white/40 px-7 py-3 text-xs uppercase tracking-widest transition hover:bg-white hover:text-[#344b3d]"
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