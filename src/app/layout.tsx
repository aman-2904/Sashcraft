import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sashcraft | Bespoke Sashes, Stoles & Academic Regalia",
  description: "Curating the finest bespoke graduation sashes, ceremonial stoles, and premium academic regalia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col relative pt-28 bg-[#fcfafa]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
