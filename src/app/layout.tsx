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
  title: "Webbly | Find a Website Style and Hire Its Creator",
  description:
    "Browse ready-made website templates for small businesses, compare styles, and request custom websites from real creators.",
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
      <body className="flex min-h-full flex-col bg-[#f6f7fb] text-slate-950">
        <RequestModalProvider>
          <Navbar />
          <main className="flex-1 pt-[68px]">
            <div className="border-b border-blue-100 bg-[#edf3ff] px-4 py-2.5 text-center text-xs font-medium text-blue-950 sm:text-sm">
              <span className="mr-2 inline-flex items-center gap-2 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Early preview
              </span>
              <span className="hidden text-blue-900/75 sm:inline">
                Payments and creator accounts are not active yet.
              </span>
            </div>
            {children}
          </main>
          <Footer />
        </RequestModalProvider>
      </body>
    </html>
  );
}
