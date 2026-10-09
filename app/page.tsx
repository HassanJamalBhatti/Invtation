
"use client";

import { useEffect, useRef, useState } from "react";

const events = [
  {
    title: "Mehndi",
    date: "2027-01-07",
    start: "2027-01-07T18:00:00+05:00",
    end: "2027-01-07T22:00:00+05:00",
    time: "6:00 PM – 10:00 PM",
    venue:
      "Sardar Palace, Gujranwala (Hafiz Abad Road Near Ghory Shah Chowk)",
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
    venue: "Crown Palace, Gujranwala (Crown Cinema Chowk)",
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
      "M.B Palace, Gujranwala (Hafiz Abad Road Near Ghory Shah Chowk)",
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
  const dates = `${formatCalendarDate(event.start)}/${formatCalendarDate(event.end)}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — ${couple.bride} & ${couple.groom}`,
    dates,
    details: `${event.description}\nDress code: ${event.dress}`,
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
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#344b3d] px-5 py-3 text-xs font-medium tracking-wide text-white transition hover:bg-[#506b56]"
      >
        <span>＋</span> Google Calendar
      </a>

      <button
        type="button"
        onClick={() => downloadCalendar(event)}
        className="rounded-full border border-[#c8b783] px-5 py-3 text-xs font-medium tracking-wide transition hover:bg-[#f0ead9]"
      >
         Download 
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
      <p className="text-xs uppercase tracking-[0.35em] text-[#a28c58]">
        {eyebrow}
      </p>

      <h2 className="mt-4 font-serif text-4xl font-normal sm:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-sm leading-7 text-[#77786e]">
        {description}
      </p>
    </div>
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

  // Automatically attempt to play music when the page loads.
  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;

    audio.volume = 0.9;

    const playMusic = async () => {
      try {
        await audio.play();
        setMusicPlaying(true);
      } catch {
        // Autoplay may be blocked until the visitor interacts.
        setMusicPlaying(false);
      }
    };

    void playMusic();
  }, []);

  // Play/Pause button handler.
  async function toggleMusic() {
    const audio = musicRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        audio.volume = 0.9;
        await audio.play();
        setMusicPlaying(true);
      } else {
        audio.pause();
        setMusicPlaying(false);
      }
    } catch (error) {
      console.error("Music could not be played:", error);
      setMusicPlaying(false);
    }
  }

  function submitRSVP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const rsvpText = [
      `Wedding RSVP — ${couple.bride} & ${couple.groom}`,
      `Name: ${guestName}`,
      `Attendance: ${attendance === "yes" ? "Attending" : "Unable to attend"}`,
      `Guests: ${attendance === "yes" ? guestCount : "0"}`,
      `Message: ${message || "No additional message"}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(rsvpText)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="overflow-hidden bg-[#faf8f1] text-[#344b3d]">
      <audio
        ref={musicRef}
        src="/music/wedding-romantic.mp3"
        loop
        preload="auto"
        autoPlay
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />

      <button
        type="button"
        onClick={toggleMusic}
        aria-label={
          musicPlaying ? "Pause background music" : "Play background music"
        }
        className="fixed bottom-5 right-5 z-50 rounded-full border border-[#d6c18b] bg-[#344b3d]/95 px-5 py-3 text-xs uppercase tracking-widest text-white shadow-lg backdrop-blur transition hover:bg-[#506b56]"
      >
        {musicPlaying ? "Ⅱ Pause Music" : "♫ Play Music"}
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
            A celebration of love
          </p>

          <p className="mt-6 font-serif text-xl italic sm:mt-10 sm:text-3xl">
            Together with our families
          </p>

          <h1 className="mt-4 font-serif text-5xl font-normal leading-tight sm:mt-5 sm:text-8xl">
            {couple.bride}
            <span className="block text-[#e7d5a2]">&</span>
            {couple.groom}
          </h1>

          <div className="mx-auto my-5 h-px w-20 bg-[#e7d5a2] sm:my-8 sm:w-28" />

          <p className="text-xs uppercase tracking-[0.15em] sm:text-base sm:tracking-[0.25em]">
            Invite you to share our special day
          </p>

          <p className="mt-4 font-serif text-xl italic sm:mt-5 sm:text-2xl">
            {couple.date}
          </p>

          <a
            href="#events"
            className="mt-7 inline-block border border-white/70 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition hover:bg-white hover:text-[#344b3d] sm:mt-10 sm:px-8 sm:py-4 sm:text-xs sm:tracking-[0.25em]"
          >
            Explore Our Wedding ↓
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
            The pleasure of your company
          </p>

          <h2 className="mt-7 font-serif text-4xl italic sm:text-6xl">
            With hearts full of joy
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#77786e]">
            We are beginning a beautiful new chapter and would be honored
            to have you by our side. Your love, blessings and presence
            will make our celebration truly unforgettable. Please join
            our families as we celebrate the beginning of our forever.
          </p>

          <p className="mt-8 font-serif text-xl italic">
            With love, {couple.bride} & {couple.groom}
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
          Save the date
        </p>

        <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
          Until We Say I Do
        </h2>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-3 sm:gap-6">
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
              <p className="font-serif text-3xl sm:text-5xl">
                {String(value).padStart(2, "0")}
              </p>

              <p className="mt-3 text-[10px] uppercase tracking-widest text-[#8b897d] sm:text-xs">
                {label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 font-serif text-lg italic text-[#8b897d]">
          We cannot wait to celebrate with you.
        </p>
      </section>

      {/* 4. Events and Calendar */}
      <section
        id="events"
        className="px-5 py-24 sm:py-32"
        style={sectionBackground(
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=80"
        )}
      >
        <SectionHeading
          eyebrow="Join the celebration"
          title="Wedding Events"
          description="Three special celebrations, countless beautiful memories. Choose an event and add it to your calendar so you never miss a moment."
        />

        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.title}
              className="flex flex-col border border-[#d8d0bb] bg-[#fffdf8]/90 p-7 backdrop-blur-sm sm:p-9"
            >
              <p className="text-3xl text-[#a28c58]">{event.symbol}</p>

              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#a28c58]">
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

              <h3 className="mt-3 font-serif text-3xl">
                {event.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#77786e]">
                {event.description}
              </p>

              <div className="mt-7 space-y-4 border-t border-[#e8e0cd] pt-6 text-sm">
                <p>
                  <span className="mr-2 text-[#a28c58]">◷</span>
                  {event.time}
                </p>

                <p>
                  <span className="mr-2 text-[#a28c58]">⌖</span>
                  {event.venue}
                </p>

                <p>
                  <span className="mr-2 text-[#a28c58]">✧</span>
                  {event.dress}
                </p>
              </div>

              <div className="mt-auto">
                <CalendarButtons event={event} />
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-6 text-[#77786e]">
          Google Calendar opens a pre-filled event. The .ics file can
          be imported into Apple Calendar, Outlook and other compatible
          calendar applications.
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
              Misha Shehzadi
            </h3>

            <div className="mx-auto my-6 h-px w-16 bg-[#d9cba9]" />

            <p className="font-serif text-xl">Daughter of</p>
            <p className="mt-3 text-sm text-[#77786e]">Muhammad Nasir</p>
            <p className="mt-1 text-sm text-[#77786e]">Zohra Yasmin</p>

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
              Hassan Jamal
            </h3>

            <div className="mx-auto my-6 h-px w-16 bg-[#d9cba9]" />

            <p className="font-serif text-xl">Son of</p>
            <p className="mt-3 text-sm text-[#77786e]">Muhammad Jamal</p>
            <p className="mt-1 text-sm text-[#77786e]">Ghulam Fatima</p>

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
        {/* Soft luxury overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[#faf8f0]/90" />

        <div className="relative z-10">
          <SectionHeading
            eyebrow="A place in our hearts"
            title="The Wedding Venues"
            description="Three beautiful celebrations, three special places. We cannot wait to celebrate these memorable moments with you."
          />

          {(() => {
            const venueCards = [
              {
                eventTitle: "Mehndi",
                venueName: "Sardar Palace Marriage Hall",
                address: "Gujranwala, Pakistan",
                mapLink:
                  "https://www.google.com/maps/place/Sardar+Palace+Marraige+hall/@32.1549679,74.1588124,17z/data=!3m1!4b1!4m6!3m5!1s0x391f2b366c2daad5:0x3b89f3d5f82c5340!8m2!3d32.1549634!4d74.1613873!16s%2Fg%2F11hz77rjgf?entry=ttu",
                accent: "Mehndi Celebration",
                number: "01",
              },
              {
                eventTitle: "Nikah & Baraat",
                venueName: "Crown Palace Marriage Hall",
                address: "Gujranwala, Pakistan",
                mapLink:
                  "https://www.google.com/maps/place/Crown+Palace+Marriage+Hall,+Gala+kulfiyan+Wala,+Gali+Depo+wali/@32.1668005,74.1688088,17z/data=!3m1!4b1!4m6!3m5!1s0x391f2978dd849cf3:0x3a4e5d11079be458!8m2!3d32.166796!4d74.1713837!16s%2Fg%2F11f7800qnv?entry=ttu",
                accent: "Nikah & Baraat",
                number: "02",
              },
              {
                eventTitle: "Walima",
                venueName: "M.B Palace Marriage Hall",
                address: "Gujranwala, Pakistan",
                mapLink:
                  "https://www.google.com/maps/place/MB+Palace+Marriage+Hall/@32.1553734,74.1604639,17z/data=!3m1!4b1!4m6!3m5!1s0x391f2bd1307a7547:0x7de7042ddfec309d!8m2!3d32.1553689!4d74.1630388!16s%2Fg%2F11f_3v3shw?entry=ttu",
                accent: "Wedding Reception",
                number: "03",
              },
            ];

            return (
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
                      {/* Map preview */}
                      <div className="relative h-56 overflow-hidden bg-[#e9e4d7]">
                        <iframe
                          title={`${venue.venueName} Google Maps`}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            venue.venueName + ", Gujranwala, Pakistan"
                          )}&z=16&output=embed`}
                          className="h-full w-full border-0 transition duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />

                        <div className="absolute left-4 top-4 border border-[#d8c69b] bg-[#fffdf8]/95 px-4 py-2">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9b8046]">
                            {venue.accent}
                          </span>
                        </div>
                      </div>

                      {/* Venue details */}
                      <div className="flex flex-1 flex-col px-6 py-7 text-center sm:px-7">
                        <p className="font-serif text-sm italic tracking-[0.2em] text-[#a28c58]">
                          — {venue.number} —
                        </p>

                        <h3 className="mt-3 font-serif text-2xl leading-snug text-[#344b3d]">
                          {venue.eventTitle}
                        </h3>

                        <div className="mx-auto my-5 flex items-center gap-3">
                          <span className="h-px w-8 bg-[#d8c69b]" />
                          <span className="text-sm text-[#a28c58]">✦</span>
                          <span className="h-px w-8 bg-[#d8c69b]" />
                        </div>

                        <h4 className="text-base font-medium leading-relaxed text-[#4b5144]">
                          {venue.venueName}
                        </h4>

                        <p className="mt-2 text-sm text-[#858276]">
                          {venue.address}
                        </p>

                        {event && (
                          <div className="mt-5 border-t border-[#eee5d3] pt-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#a28c58]">
                              Event details
                            </p>
                            <p className="mt-2 text-sm leading-6 text-[#6e7065]">
                              {event.venue}
                            </p>
                            <p className="mt-1 text-sm text-[#6e7065]">
                              {event.time}
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
                          >
                            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          Get Directions
                          <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            );
          })()}

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
          description="Please let us know if you can join our celebration. Your response will open WhatsApp with your details ready to send."
        />

        <form
          onSubmit={submitRSVP}
          className="mx-auto max-w-2xl border border-[#d9cba9] bg-[#fffdf8]/95 p-6 backdrop-blur-sm sm:p-10"
        >
          <label
            htmlFor="guest-name"
            className="mb-2 block text-xs uppercase tracking-widest text-[#8b897d]"
          >
            Your name
          </label>

          <input
            id="guest-name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            placeholder="Enter your full name"
            className="mb-6 w-full border border-[#ded4bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#a28c58]"
          />

          <p className="mb-3 text-xs uppercase tracking-widest text-[#8b897d]">
            Will you attend?
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
              Joyfully accepts
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attendance"
                value="no"
                checked={attendance === "no"}
                onChange={() => setAttendance("no")}
              />
              Regretfully declines
            </label>
          </div>

          {attendance === "yes" && (
            <>
              <label
                htmlFor="guest-count"
                className="mb-2 block text-xs uppercase tracking-widest text-[#8b897d]"
              >
                Number of guests
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
            Message (optional)
          </label>

          <textarea
            id="guest-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Write a message for the couple..."
            className="mb-6 w-full border border-[#ded4bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#a28c58]"
          />

          <button
            type="submit"
            className="w-full bg-[#344b3d] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#506b56]"
          >
            Send RSVP via WhatsApp ↗
          </button>

          <p className="mt-4 text-center text-xs leading-6 text-[#8b897d]">
            Your WhatsApp app will open with your RSVP prepared. Review
            and send the message to the hosts.
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

        <h2 className="mt-6 font-serif text-5xl italic sm:text-7xl">
          {couple.bride} & {couple.groom}
        </h2>

        <p className="mt-7 text-sm leading-7 text-white/75">
          One love. One promise. One beautiful forever.
          <br />
          We cannot wait to celebrate with you.
        </p>

        <a
          href="#home"
          className="mt-9 inline-block border border-white/40 px-7 py-3 text-xs uppercase tracking-widest transition hover:bg-white hover:text-[#344b3d]"
        >
          Back to top ↑
        </a>

        <p className="mt-16 text-[10px] uppercase tracking-[0.25em] text-white/50">
          Made with love for our special day · 2026
        </p>
      </footer>
    </main>
  );
}