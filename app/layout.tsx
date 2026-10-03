import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadataBase = new URL("https://blanijoystan.dev");

export const metadata: Metadata = {
  title: "Blani Joystan Dcunha — Software Engineer Portfolio",
  description:
    "Interactive 3D portfolio of Blani Joystan Dcunha, a Computer Science Engineering student focused on software engineering, full-stack development, AI and building real-world systems.",
  keywords: [
    "Blani Joystan Dcunha",
    "Software Engineer",
    "Full Stack Developer",
    "CSE Student",
    "React",
    "Next.js",
    "Node.js",
    "Kafka",
    "AI",
    "Cloud",
    "Distributed Systems",
    "Portfolio",
  ],
  authors: [{ name: "Blani Joystan Dcunha" }],
  creator: "Blani Joystan Dcunha",
  openGraph: {
    type: "website",
    url: "https://blanijoystan.dev",
    title: "Blani Joystan Dcunha — Software Engineer Portfolio",
    description:
      "Interactive 3D portfolio of Blani Joystan Dcunha, a Computer Science Engineering student focused on software engineering, full-stack development, AI and building real-world systems.",
    siteName: "Blani Joystan Dcunha Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blani Joystan Dcunha — Software Engineer Portfolio",
    description:
      "Interactive 3D portfolio. Full Stack Dev | AI Enthusiast | Builder.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
      style={{ backgroundColor: "#04060a" }}
    >
      <head>
        {/* Preconnect to Google Fonts CDN for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* Viewport / Theme Color */}
        <meta name="theme-color" content="#04060a" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className="min-h-screen bg-[#04060a] text-white antialiased cursor-none overflow-x-hidden"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
