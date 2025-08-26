import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AS Metadata Generator",
  description: "Generate Adobe Stock metadata (title, keywords, category) and export CSV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
           <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
             AS Metadata Generator
           </Link>
          <nav className="flex gap-6">
              <Link href="/review" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Review
              </Link>
              <Link href="/export" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Export
              </Link>
            </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
