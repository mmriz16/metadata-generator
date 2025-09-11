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
  title: "Metadata Generator",
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
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-bold">AS</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Metadata Generator</h1>
                  <p className="text-xs text-gray-500">AI-powered metadata generation</p>
                </div>
              </Link>
              <nav className="flex items-center gap-1">
                <Link href="/review" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                  📝 Review
                </Link>
                <Link href="/export" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                  📥 Export
                </Link>
              </nav>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
