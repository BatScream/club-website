import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revelation Football Academy",
  description: "Official website of Revelation Football Academy, Urappakkam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
