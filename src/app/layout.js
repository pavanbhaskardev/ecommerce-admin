import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "myAngadi",
  description:
    "myAngadi is an E-Commerce Admin Dashboard for managing your online store built as a part of after the school academy course",
  openGraph: {
    title: "myAngadi",
    description:
      "myAngadi is an E-Commerce Admin Dashboard for managing your online store built as a part of after the school academy course",
    url: "https://ecommerce-admin-zeta-one.vercel.app/", // Replace with your actual URL
    siteName: "myAngadi",
    images: [
      {
        url: "https://ecommerce-admin-zeta-one.vercel.app/og.png", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "myAngadi Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased",
          geist.variable,
          geistMono.variable
        )}
      >
        <ClerkProvider afterSignOutUrl="/">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="py-20 grid w-full max-w-7xl mx-auto min-h-screen overflow-x-hidden px-4">
              {children}
            </main>
            {/* <Footer /> */}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
