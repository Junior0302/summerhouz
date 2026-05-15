import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import RouteLoader from "./RouteLoader";
import "./globals.css";

const summerSans = Manrope({
  variable: "--font-summer-sans",
  subsets: ["latin"],
  display: "swap",
});

const summerDisplay = Fraunces({
  variable: "--font-summer-display",
  subsets: ["latin"],
  display: "swap",
});

const summerMono = JetBrains_Mono({
  variable: "--font-summer-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://summerhouz.com"),
  title: {
    default: "SummerHouz — Modern stays. Elevated experiences.",
    template: "%s — SummerHouz",
  },
  description:
    "Premium short-term rental management and guest experiences. Airbnb management, concierge services, business stays, and modern hospitality.",
  applicationName: "SummerHouz",
  keywords: [
    "Airbnb management",
    "Conciergerie",
    "Short-term rentals",
    "Premium apartments",
    "Guest experience",
    "Business stays",
    "Hospitality",
    "Property management",
    "SummerHouz",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    siteName: "SummerHouz",
    title: "SummerHouz — Modern stays. Elevated experiences.",
    description:
      "Premium short-term rental management and guest experiences. Airbnb management, concierge services, business stays, and modern hospitality.",
    url: "https://summerhouz.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "SummerHouz — Modern stays. Elevated experiences.",
    description:
      "Premium short-term rental management and guest experiences. Airbnb management, concierge services, business stays, and modern hospitality.",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbf5ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${summerSans.variable} ${summerDisplay.variable} ${summerMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RouteLoader />
        {children}
      </body>
    </html>
  );
}
