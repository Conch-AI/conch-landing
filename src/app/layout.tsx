import type { Metadata } from "next";
import "../app/styles/globals.css";
import { ClientProviders } from "./providers";
import { SessionProvider } from "@/context/SessionContext";


export const metadata: Metadata = {
  title: "Conch AI - Your Undetectable AI Essay Writing and Research Assistant",
  description: "Access every AI school tool in one to enhance your writing and research, without the busywork. Write, cite, and edit research papers, generate mind maps, notes, and flashcards from anything, or check for and bypass AI detection by humanizing your text.",
  icons: {
    icon: "/images/logos/logo_w_background.png",
    shortcut: "/images/logos/logo_w_background.png",
    apple: "/images/logos/logo_w_background.png",
  },
  openGraph: {
    title: "Conch AI - Your Undetectable AI Essay Writing and Research Assistant",
    description: "Access every AI school tool in one to enhance your writing and research, without the busywork. Write, cite, and edit research papers, generate mind maps, notes, and flashcards from anything, or check for and bypass AI detection by humanizing your text.",
    images: [
      {
        url: "/images/og.jpeg",
        width: 1200,
        height: 630,
        alt: "Conch AI Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conch AI - Your Undetectable AI Essay Writing and Research Assistant",
    description: "Access every AI school tool in one to enhance your writing and research, without the busywork. Write, cite, and edit research papers, generate mind maps, notes, and flashcards from anything, or check for and bypass AI detection by humanizing your text.",
    images: ["/images/logos/logo_w_background.png"],
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
