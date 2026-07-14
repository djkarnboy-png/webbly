import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { RequestModalProvider } from "@/components/RequestModalProvider";
import { getViewer } from "@/lib/auth";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getViewer();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#05070b] text-slate-100">
        <RequestModalProvider
          authenticated={Boolean(viewer)}
          verified={Boolean(viewer?.emailVerified)}
        >
          <Navbar viewer={viewer} />
          <main className="flex-1 pt-[68px]">
            <div className="border-b border-white/10 bg-[#080d15] px-4 py-2.5 text-center text-xs font-medium text-slate-300 sm:text-sm">
              <span className="mr-2 inline-flex items-center gap-2 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                Early preview
              </span>
              <span className="hidden text-slate-500 sm:inline">
                Marketplace accounts are live. Payments are still coming soon.
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
