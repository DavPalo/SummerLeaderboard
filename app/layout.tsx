import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Summer Leaderboard 🏆",
  description: "La classifica definitiva dell'estate — Schiaccia 7, Ping Pong Singoli & Doppio",
  keywords: ["leaderboard", "classifica", "ping pong", "schiaccia 7", "estate"],
  openGraph: {
    title: "Summer Leaderboard 🏆",
    description: "La classifica definitiva dell'estate",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#1C1C1C",
              border: "1px solid #2A2A2A",
              color: "#FAFAFA",
            },
          }}
        />
      </body>
    </html>
  );
}
