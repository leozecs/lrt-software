import type { Metadata } from "next";
import Landing from "@/components/Landing";

/* Variante B do teste A/B do hero. O middleware reescreve "/" pra cá
   em 50% das primeiras visitas; a URL canônica continua sendo a raiz. */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function HomeB() {
  return <Landing heroVariant="b" />;
}
