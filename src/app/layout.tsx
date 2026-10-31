import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Oswald, Raleway } from "next/font/google";
import "./globals.css";
import CentralNavBar from "../components/navigation/CentralNavBar";
import { AuthProvider } from "../components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diesel Aponte",
  description: "U know?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${oswald.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CentralNavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
