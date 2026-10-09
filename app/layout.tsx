
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://invitation-inky.vercel.app"),

  title: "Hassan Jamal & Misha Shehzadi | Wedding Invitation",

  description:
    "Join us to celebrate the wedding of Hassan Jamal and Misha Shehzadi on 7, 8 and 9 January 2027.",

  openGraph: {
    title: "Hassan Jamal & Misha Shehzadi",
    description:
      "Mehndi • 7 January | Barat • 8 January | Walima • 9 January 2027",
    url: "/",
    siteName: "Hassan & Misha Wedding",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-invitation.jpg",
        width: 1200,
        height: 630,
        alt: "Hassan Jamal and Misha Shehzadi Wedding Invitation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Hassan Jamal & Misha Shehzadi",
    description: "Wedding Invitation | January 2027",
    images: ["/og-invitation.jpg"],
  },
};