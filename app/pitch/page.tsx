import type { Metadata } from "next";
import PitchDeck from "@/components/PitchDeck";

export const metadata: Metadata = {
  title: "LRT Software · Pitch",
  description: "Apresentação da LRT Software e do ecossistema de produtos.",
  robots: { index: false, follow: false },
};

export default function PitchPage() {
  return <PitchDeck />;
}
