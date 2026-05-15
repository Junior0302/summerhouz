import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "SummerHouz — Warm luxury. Modern stays.",
  description:
    "Premium short-term rental management and guest experiences. Airbnb management, concierge services, business stays, and modern hospitality.",
  alternates: {
    canonical: "/en",
    languages: {
      fr: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: "SummerHouz — Warm luxury. Modern stays.",
    description:
      "Premium short-term rental management and guest experiences. Airbnb management, concierge services, business stays, and modern hospitality.",
    url: "https://summerhouz.com/en",
  },
};

export default function EnPage() {
  return <Home initialLang="en" />;
}
