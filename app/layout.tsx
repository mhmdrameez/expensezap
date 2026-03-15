import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "ExpenseZap";
const APP_TITLE = "ExpenseZap – Free Private Offline Expense Tracker for Freelancers";
const APP_DESCRIPTION =
  "Track expenses privately and offline with ExpenseZap. No login, no cloud, no analytics. Built for freelancers & small businesses worldwide. Supports GST, VAT, Sales Tax with 35+ currencies. Free, fast, and secure — your financial data never leaves your device.";
const APP_URL = "https://expensezap.app";

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  // ─── Core ───
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "expense tracker",
    "offline expense tracker",
    "private expense tracker",
    "freelancer expense tracker",
    "GST calculator",
    "VAT calculator",
    "sales tax tracker",
    "small business expenses",
    "expense manager",
    "no login expense app",
    "PWA expense tracker",
    "Indian freelancer tools",
    "budget tracker",
    "receipt manager",
    "tax calculator",
    "free expense app",
    "offline finance app",
    "privacy first app",
    "ExpenseZap",
  ],
  authors: [{ name: "ExpenseZap Team" }],
  creator: "ExpenseZap",
  publisher: "ExpenseZap",
  category: "Finance",

  // ─── Manifest & PWA ───
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  // ─── Open Graph (Facebook, LinkedIn, WhatsApp, etc.) ───
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ExpenseZap – Free Private Offline Expense Tracker",
        type: "image/png",
      },
    ],
  },

  // ─── Twitter Card ───
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
    creator: "@expensezap",
  },

  // ─── Robots ───
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Icons ───
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },

  // ─── Verification (fill in when you have accounts) ───
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  //   yahoo: "your-yahoo-verification-code",
  //   other: { "msvalidate.01": "your-bing-verification-code" },
  // },

  // ─── Alternates ───
  alternates: {
    canonical: APP_URL,
  },

  // ─── Other Meta ───
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#10b981",
    "msapplication-tap-highlight": "no",
  },
};

// ─── JSON-LD Structured Data ───
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: APP_NAME,
  url: APP_URL,
  description: APP_DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Offline-first expense tracking",
    "No login or registration required",
    "GST, VAT, Sales Tax support",
    "35+ currencies supported",
    "Receipt image upload & viewing",
    "PDF & CSV export",
    "Custom categories",
    "Dark mode by default",
    "Progressive Web App (PWA)",
    "100% private — data stays on your device",
  ],
  screenshot: `${APP_URL}/og-image.png`,
  softwareVersion: "1.0.0",
  author: {
    "@type": "Organization",
    name: "ExpenseZap",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
