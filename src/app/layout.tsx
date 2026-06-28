import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { RequestModalProvider } from "@/components/RequestModalProvider";
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
  title: "Webbly | Business Website Template Marketplace",
  description:
    "Browse ready-made business website templates from real creators, then buy one or hire the creator to customize it for your brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-950">
        <RequestModalProvider>
          <Navbar />
          <main className="flex-1 pt-[72px]">
            <div className="border-b border-blue-100 bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-950">
              Early preview: browse templates, filter the marketplace, and send
              demo requests. Payments and creator accounts are coming soon.
            </div>
            {children}
          </main>
          <Footer />
        </RequestModalProvider>
      </body>
    </html>
  );
}
