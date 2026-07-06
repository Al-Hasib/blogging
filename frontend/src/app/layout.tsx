import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-sans-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "বাংলা টেক ব্লগ | বাংলায় প্রোগ্রামিং ও প্রযুক্তি",
    template: "%s | বাংলা টেক ব্লগ",
  },
  description: "বাংলায় প্রোগ্রামিং, প্রযুক্তি, ও ডেভেলপমেন্ট বিষয়ক ব্লগ",
  openGraph: {
    title: "বাংলা টেক ব্লগ",
    description: "বাংলায় প্রোগ্রামিং, প্রযুক্তি, ও ডেভেলপমেন্ট বিষয়ক ব্লগ",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={notoSansBengali.variable}>
      <body className="font-bengali">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
