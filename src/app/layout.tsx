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
  icons: {
    icon: '/img/logo.png',
    shortcut: '/img/logo.png',
    apple: '/img/logo.png',
  },
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                   <img src="/img/logo.png" alt="Logo" className="w-full h-full object-contain" />
                 </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">Metadata Generator</h1>
                  <p className="text-xs text-gray-500">AI-powered metadata generation</p>
                </div>
                <div className="sm:hidden">
                   <h1 className="text-lg font-bold text-gray-900">Generator</h1>
                 </div>
              </Link>
              <nav className="flex items-center gap-1">
                 <Link href="/review" className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                   <span className="sm:hidden">📝</span>
                   <span className="hidden sm:inline">📝 Review</span>
                 </Link>
                 <Link href="/export" className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                   <span className="sm:hidden">📥</span>
                   <span className="hidden sm:inline">📥 Export</span>
                 </Link>
                 <Link href="/settings" className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                   <span className="sm:hidden">⚙️</span>
                   <span className="hidden sm:inline">⚙️ Settings</span>
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
