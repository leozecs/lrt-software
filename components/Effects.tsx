"use client";

import { useEffect } from "react";
import { initMotion } from "@/lib/motion";

/* Camada de motion: roda todo o sistema GSAP/Lenis no mount e desmonta limpo. */
export default function Effects() {
  useEffect(() => initMotion(), []);
  return null;
}
