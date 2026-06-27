import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ReSell Hub",
  description:
    "A trusted second-hand marketplace to buy and sell pre-owned products safely — reduce waste, save money, and find quality items near you.",
  icons: "/logo.png",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-[#09090b]">
        <Providers>
          <Navbar />
          {children}
          <Toaster position="top-left" richColors />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}