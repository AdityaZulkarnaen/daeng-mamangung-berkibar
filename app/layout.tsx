import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const description =
  "Berpayung Rahmat Tuhan, Selamat Datang di Tanah Pelaut Berdoa";

export const metadata: Metadata = {
  title: "Daeng Mamangung | KKN Selayar Berkibar",
  description,
  openGraph: {
    title: "Daeng Mamangung | KKN Selayar Berkibar",
    description,
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#10222e] font-sans text-white">
        {children}
      </body>
    </html>
  );
}
