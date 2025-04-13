import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
    <html>
      <body
        className={cn(
          "font-sans antialiased",
          geistSans.variable,
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
            <main className="mt-16">{children}</main>
            {/* <Footer /> */}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
