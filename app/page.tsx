"use client";

import { useEffect, useRef, useState } from "react";

const events = [
  {
    title: "Mehndi",
    date: "2027-01-07",
    start: "2027-01-07T18:00:00+05:00",
    end: "2027-01-07T22:00:00+05:00",
    time: "6:00 PM – 10:00 PM",
    venue: "Sardar Palace, Gujranwala (Hafiz Abad Road Near Ghory shah Chowk)",
    dress: "Traditional & Colorful",
    description: "An evening of music, laughter, colors and celebration.",
    symbol: "✿",
  },
  {
    title: "Nikah & Baraat",
    date: "2027-01-08",
    start: "2027-01-08T17:00:00+05:00",
    end: "2027-01-08T23:00:00+05:00",
    time: "5:00 PM – 11:00 PM",
    venue: "Crown Palace, Gujranwala (Crown Cinema Chowk)",
    dress: "Formal & Elegant",
    description: "The beautiful beginning of our forever, surrounded by loved ones.",
    symbol: "♡",
  },
  {
    title: "Walima",
    date: "2027-01-09",
    start: "2027-01-09T19:00:00+05:00",
    end: "2027-01-09T23:00:00+05:00",
    time: "7:00 PM – 11:00 PM",
    venue: "M.B Palace, Gujranwala (Hafiz Abad Road Near Ghory shah Chowk)",
    dress: "Semi-Formal",
    description: "Join us for a joyful evening as we celebrate our new beginning.",
    symbol: "❀",
  },
];

const couple = {
  bride: "Misha Shehzadi",
  groom: "Hassan Jamal",
  date: "December 08, 2027",
  venue: "Gujranwala, Pakistan",
};

const sectionBackground = (imageUrl: string) => ({
  backgroundImage: `linear-gradient(rgba(250,248,241,0.84), rgba(250,248,241,0.88)), url("${imageUrl}")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed" as const,
});

function googleCalendarUrl(event: (typeof events)[number]) {
  const dates = [
    new Date(event.start).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""),
    new Date(event.end).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""),
  ].join("/");

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
  const formatDate = (value: string) =>
    new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const escapeICS = (value: string) =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\n/g, "\\n");

  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.title.toLowerCase().replace(/\s/g, "-")}-wedding@example.com`,
    `DTSTAMP:${formatDate(new Date().toISOString())}`,
    `DTSTART:${formatDate(event.start)}`,
    `DTEND:${formatDate(event.end)}`,
    `SUMMARY:${escapeICS(`${event.title} — ${couple.bride} & ${couple.groom}`)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
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
  link.download = `${event.title.toLowerCase().replace(/\s/g, "-")}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
        onClick={() => downloadCalendar(event)}
        className="rounded-full border border-[#c8b783] px-5 py-3 text-xs font-medium tracking-wide transition hover:bg-[#f0ead9]"
      >
        ↓ Download .ics
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicRef = useRef<HTMLAudioElement>(null);
  const [attendance, setAttendance] = useState("yes");
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const target = new Date("2027-01-07T17:00:00+05:00").getTime();

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

  async function toggleMusic() {
    const audio = musicRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      return;
    }
    try {
      await audio.play();
      setMusicPlaying(true);
    } catch (error) {
      console.error("Music could not be played:", error);
      setMusicPlaying(false);
    }
  }

  function submitRSVP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = [
      `Wedding RSVP — ${couple.bride} & ${couple.groom}`,
      `Name: ${guestName}`,
      `Attendance: ${attendance === "yes" ? "Attending" : "Unable to attend"}`,
      `Guests: ${attendance === "yes" ? guestCount : "0"}`,
      `Message: ${message || "No additional message"}`,
    ].join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="overflow-hidden bg-[#faf8f1] text-[#344b3d]">
      <audio ref={musicRef} src="/music/wedding-romantic.mp3" loop preload="none" />
      
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={musicPlaying ? "Pause background music" : "Play background music"}
        className="fixed bottom-5 right-5 z-50 rounded-full border border-[#d6c18b] bg-[#344b3d]/95 px-5 py-3 text-xs uppercase tracking-widest text-white shadow-lg backdrop-blur transition hover:bg-[#506b56]"
      >
        {musicPlaying ? "Ⅱ Pause Music" : "♫ Play Music"}
      </button>

      {/* 1. Hero */}
      <section
        id="home"
        className="relative flex min-h-screen min-h-[100svh] items-center justify-center bg-cover bg-center px-5 py-20 text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(23,36,28,.38),rgba(23,36,28,.55)),url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85')",
        }}
      >
        <div className="max-w-3xl text-white">
          <p className="text-xs uppercase tracking-[0.4em] sm:text-sm">
            A celebration of love
          </p>

          <p className="mt-10 font-serif text-2xl italic sm:text-3xl">
            Together with our families
          </p>

          <h1 className="mt-5 font-serif text-6xl font-normal leading-tight sm:text-8xl">
            {couple.bride}
            <span className="block text-[#e7d5a2]">&</span>
            {couple.groom}
          </h1>

          <div className="mx-auto my-8 h-px w-28 bg-[#e7d5a2]" />

          <p className="text-sm uppercase tracking-[0.25em] sm:text-base">
            Invite you to share our special day
          </p>

          <p className="mt-5 font-serif text-2xl italic">
            {couple.date}
          </p>

          <a
            href="#events"
            className="mt-10 inline-block border border-white/70 px-8 py-4 text-xs uppercase tracking-[0.25em] transition hover:bg-white hover:text-[#344b3d]"
          >
            Explore Our Wedding ↓
          </a>
        </div>

        <a
          href="#story"
          className="absolute bottom-8 text-xs uppercase tracking-[0.3em] text-white/80"
        >
          Scroll to discover
        </a>
      </section>

      {/* 2. Invitation */}
      <section
        className="px-5 py-24 sm:py-32"
        style={sectionBackground("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80")}
      >
        <div className="mx-auto max-w-3xl border border-[#d9cba9] bg-[#fffdf8]/90 backdrop-blur-sm px-6 py-14 text-center sm:px-16 sm:py-20">
          <p className="text-4xl text-[#a28c58]">❦</p>

          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#a28c58]">
            The pleasure of your company
          </p>

          <h2 className="mt-7 font-serif text-4xl italic sm:text-6xl">
            With hearts full of joy
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#77786e]">
            We are beginning a beautiful new chapter and would be
            honored to have you by our side. Your love, blessings and
            presence will make our celebration truly unforgettable.
            Please join our families as we celebrate the beginning
            of our forever.
          </p>

          <p className="mt-8 font-serif text-xl italic">
            With love, Misha Shehzadi & Hassan Jamal
          </p>
        </div>
      </section>


      {/* 4. Countdown */}
      <section
        className="px-5 py-24 text-center sm:py-28"
        style={sectionBackground("https://images.unsplash.com/photo-1519225421980-88d3e6e6b8a5?auto=format&fit=crop&w=1800&q=80")}
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
              key={label}
              className="border border-[#ded4bd] bg-[#fffdf8]/90 backdrop-blur-sm px-1 py-6 sm:py-8"
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

      {/* 5. Events + Calendar */}
      <section
        id="events"
        className="px-5 py-24 sm:py-32"
        style={sectionBackground("https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=80")}
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
              className="flex flex-col border border-[#d8d0bb] bg-[#fffdf8]/90 backdrop-blur-sm p-7 sm:p-9"
            >
              <p className="text-3xl text-[#a28c58]">{event.symbol}</p>

              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#a28c58]">
                {new Date(`${event.date}T12:00:00`).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </p>

              <h3 className="mt-3 font-serif text-3xl">{event.title}</h3>

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

      {/* 6. Families */}
      <section
        id="families"
        className="px-5 py-24 sm:py-32"
        style={sectionBackground("https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=80")}
      >
        <SectionHeading
          eyebrow="Two families, one beautiful celebration"
          title="Our Families"
          description="With the love, prayers and blessings of our families, we invite you to share in the joy of our new beginning."
        />

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="border border-[#d9cba9] bg-[#fffdf8]/90 backdrop-blur-sm px-7 py-10 text-center sm:px-10">
            <p className="text-3xl text-[#a28c58]">❦</p>
            <p className="mt-5 text-xs uppercase tracking-[0.3em] text-[#a28c58]">
              The Bride's Family
            </p>
            <h3 className="mt-4 font-serif text-3xl">Misha Shehzadi</h3>
            <div className="mx-auto my-6 h-px w-16 bg-[#d9cba9]" />
            <p className="font-serif text-xl">Daughter of</p>
            <p className="mt-3 text-sm text-[#77786e]">Muhammad Nasir </p>
            <p className="mt-1 text-sm text-[#77786e]">Zohra Yasmin</p>
            <p className="mt-6 text-sm italic leading-7 text-[#77786e]">
              With their love and blessings, she begins a beautiful new chapter.
            </p>
          </article>

          <article className="border border-[#d9cba9] bg-[#fffdf8]/90 backdrop-blur-sm px-7 py-10 text-center sm:px-10">
            <p className="text-3xl text-[#a28c58]">❦</p>
            <p className="mt-5 text-xs uppercase tracking-[0.3em] text-[#a28c58]">
              The Groom's Family
            </p>
            <h3 className="mt-4 font-serif text-3xl">Hassan Jamal</h3>
            <div className="mx-auto my-6 h-px w-16 bg-[#d9cba9]" />
            <p className="font-serif text-xl">Son of</p>
            <p className="mt-3 text-sm text-[#77786e]">Muhammad Jamal </p>
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

      {/* 7. Venue */}
      <section
        id="location"
        className="px-5 py-24 sm:py-32"
        style={sectionBackground("https://images.unsplash.com/photo-1519225421980-88d3e6e6b8a5?auto=format&fit=crop&w=1800&q=80")}
      >
        <SectionHeading
          eyebrow="We will meet here"
          title="The Wedding Venue"
          description="We look forward to welcoming you. Please check your selected event for its timing and location."
        />

        <div className="mx-auto grid max-w-5xl overflow-hidden bg-[#fffdf8] md:grid-cols-2">
          <div className="min-h-[320px] bg-[#d8ddcf]">
            <iframe
              title="Wedding venue map"
              src="https://maps.google.com/maps?q=Lahore%20Pakistan&t=&z=11&ie=UTF8&iwloc=&output=embed"
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-xs uppercase tracking-[0.25em] text-[#a28c58]">
              Main celebration
            </p>

            <h3 className="mt-4 font-serif text-3xl">
              The Grand Palace
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#77786e]">
              Lahore, Pakistan
              <br />
              Please confirm the final venue address with the hosts before
              travelling.
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=The+Grand+Palace+Lahore+Pakistan"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-block w-fit border border-[#344b3d] px-7 py-3 text-xs uppercase tracking-widest transition hover:bg-[#344b3d] hover:text-white"
            >
              Get Directions ↗
            </a>
          </div>
        </div>
      </section>


      {/* 8. Contact / RSVP */}
      <section
        id="contact"
        className="px-5 py-24 sm:py-32"
        style={sectionBackground("https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=80")}
      >
        <SectionHeading
          eyebrow="We would love to hear from you"
          title="Contact & RSVP"
          description="Please let us know if you can join our celebration. Your response will open WhatsApp with your details ready to send."
        />
        <form onSubmit={submitRSVP} className="mx-auto max-w-2xl border border-[#d9cba9] bg-[#fffdf8]/95 backdrop-blur-sm p-6 sm:p-10">
          <label htmlFor="guest-name" className="mb-2 block text-xs uppercase tracking-widest text-[#8b897d]">Your name</label>
          <input id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} required placeholder="Enter your full name" className="mb-6 w-full border border-[#ded4bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#a28c58]" />

          <p className="mb-3 text-xs uppercase tracking-widest text-[#8b897d]">Will you attend?</p>
          <div className="mb-6 flex flex-wrap gap-5 text-sm">
            <label className="flex items-center gap-2"><input type="radio" name="attendance" value="yes" checked={attendance === "yes"} onChange={() => setAttendance("yes")} /> Joyfully accepts</label>
            <label className="flex items-center gap-2"><input type="radio" name="attendance" value="no" checked={attendance === "no"} onChange={() => setAttendance("no")} /> Regretfully declines</label>
          </div>

          {attendance === "yes" && <>
            <label htmlFor="guest-count" className="mb-2 block text-xs uppercase tracking-widest text-[#8b897d]">Number of guests</label>
            <select id="guest-count" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="mb-6 w-full border border-[#ded4bd] bg-white px-4 py-3 text-sm">
              {["1", "2", "3", "4", "5", "6"].map((count) => <option key={count} value={count}>{count} {count === "1" ? "guest" : "guests"}</option>)}
            </select>
          </>}

          <label htmlFor="guest-message" className="mb-2 block text-xs uppercase tracking-widest text-[#8b897d]">Message (optional)</label>
          <textarea id="guest-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write a message for the couple..." className="mb-6 w-full border border-[#ded4bd] bg-white px-4 py-3 text-sm outline-none focus:border-[#a28c58]" />
          <button type="submit" className="w-full bg-[#344b3d] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#506b56]">Send RSVP via WhatsApp ↗</button>
          <p className="mt-4 text-center text-xs leading-6 text-[#8b897d]">Your WhatsApp app will open with your RSVP prepared. Review and send the message to the hosts.</p>
        </form>
      </section>


      {/* 9. Closing */}
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