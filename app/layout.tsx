
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://invitation-inky.vercel.app"),

  title: "Hassan Jamal & Misha Shehzadi",
  description:
    "You're invited to celebrate the wedding of Hassan Jamal and Misha Shehzadi.",

  openGraph: {
    title: "Hassan Jamal & Misha Shehzadi",
    description: "Wedding Invitation | January 2027",
    url: "/",
    siteName: "Wedding Invitation",
    type: "website",
    images: [
      {
        url: "/invitation.png",
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
    images: ["/invitation.png"],
  },

  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}