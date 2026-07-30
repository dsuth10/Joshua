import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fact Factory | Number Facts Practice",
  description: "A joyful timed multiplication and division factory game for primary students.",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
