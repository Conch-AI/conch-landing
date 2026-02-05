import type { Metadata } from "next";
import "../app/styles/globals.css";

export const metadata: Metadata = {
  title: "Conch AI - Free AI Tools",
  description: "Free AI tools to help you write, study, and learn. Simplify complex topics, humanize AI text, create flashcards, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
