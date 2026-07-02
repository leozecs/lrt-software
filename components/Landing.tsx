import Effects from "@/components/Effects";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Ecosystem from "@/components/sections/Ecosystem";
import Products from "@/components/sections/Products";
import TechStrip from "@/components/sections/TechStrip";
import Philosophy from "@/components/sections/Philosophy";
import Finale from "@/components/sections/Finale";
import Footer from "@/components/sections/Footer";

export default function Landing({ heroVariant = "a" }: { heroVariant?: "a" | "b" }) {
  return (
    <>
      {/* preloader: o monograma se desenha e libera a página */}
      <div className="preloader" id="preloader" aria-hidden="true">
        <svg className="pre-logo" width="132" height="132" viewBox="0 0 72 72" fill="none">
          <defs>
            <linearGradient id="lgPre" x1="16" y1="20" x2="44" y2="56">
              <stop stopColor="#6f8dff" />
              <stop offset="1" stopColor="#9b7dff" />
            </linearGradient>
          </defs>
          <path className="mark-l" d="M16 20 V48 Q16 56 24 56 H44" stroke="url(#lgPre)" strokeWidth="5" strokeLinecap="round" />
          <path className="mark-t" d="M34 16 H48 Q56 16 56 24 V38" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <path className="mark-spark" d="M56 40 l1.8 3.4 3.4 1.8 -3.4 1.8 -1.8 3.4 -1.8 -3.4 -3.4 -1.8 3.4 -1.8 Z" fill="#9b7dff" />
          <text className="mark-r" x="33" y="45" textAnchor="middle" fontFamily="Satoshi, sans-serif" fontWeight="900" fontSize="28" fill="#fff">R</text>
        </svg>
      </div>
      <noscript>
        <style>{`.preloader{display:none}`}</style>
      </noscript>

      {/* luz ambiente que segue o cursor (desktop) */}
      <div className="cursor-light" id="cursorLight" aria-hidden="true"></div>

      {/* film grain fixo */}
      <div className="grain" aria-hidden="true"></div>

      <Nav />
      <main>
        <Hero variant={heroVariant} />
        <Ecosystem />
        <Products />
        <TechStrip />
        <Philosophy />
        <Finale />
      </main>
      <Footer />

      <Effects />
    </>
  );
}
