import type { Metadata } from "next";
import "../app/styles/globals.css";
import { ClientProviders } from "./providers";
import { SessionProvider } from "@/context/SessionContext";

export const metadata: Metadata = {
  title: "Conch AI - Free AI Tools",
  description: "Free AI tools to help you write, study, and learn. Simplify complex topics, humanize AI text, create flashcards, and more.",
  icons: {
    icon: "/images/logos/logo_w_background.png",
    shortcut: "/images/logos/logo_w_background.png",
    apple: "/images/logos/logo_w_background.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <SessionProvider>{children}</SessionProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
