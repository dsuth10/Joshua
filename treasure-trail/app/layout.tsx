import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const display = Fredoka({ variable: "--display", subsets: ["latin"] });
const body = Nunito({ variable: "--body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Treasure Trail — Number Facts Expedition",
  description: "Race through multiplication and division facts, collect keys, and unlock the lost vault.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>;
}
