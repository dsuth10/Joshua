import type { Metadata } from "next";
import { headers } from "next/headers";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const display = Fredoka({ variable: "--display", subsets: ["latin"] });
const body = Nunito({ variable: "--body", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Treasure Trail — Number Facts Expedition",
    description: "Choose branching multiplication and division trails, master varied number facts, earn gear, and restore the final treasure vault.",
    openGraph: {
      title: "Treasure Trail",
      description: "Choose your path. Master every trail.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "Treasure Trail branching number-facts adventure map" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Treasure Trail",
      description: "Choose your path. Master every trail.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>;
}
