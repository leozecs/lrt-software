import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/* OG viva por produto: /api/og?p=indica|caixa|pet|zeta
   Sem parâmetro → arte padrão da LRT. */

const PRODUCTS: Record<
  string,
  { name: string; desc: string; stat: string; accent: string }
> = {
  indica: {
    name: "Indica Pra Mim",
    desc: "Descoberta de negócios locais de confiança",
    stat: "+15 clientes ativos · +500 acessos recorrentes",
    accent: "#6f8dff",
  },
  caixa: {
    name: "Caixa Local",
    desc: "Gestão financeira para pequenas empresas",
    stat: "+10 lojas gerenciando o financeiro",
    accent: "#7f86ff",
  },
  pet: {
    name: "Pet Sistem",
    desc: "SaaS completo para pet shops e clínicas veterinárias",
    stat: "+12 petshops utilizando no dia a dia",
    accent: "#8d81ff",
  },
  zeta: {
    name: "Zeta",
    desc: "IA que constrói sites, CRMs e softwares instantaneamente",
    stat: "em desenvolvimento",
    accent: "#9b7dff",
  },
};

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p") || "";
  const prod = PRODUCTS[p];

  if (!prod) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "80px",
            background: "linear-gradient(160deg, #050505 55%, #0d0d18)",
            color: "#f4f4f5", fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700, color: "#a0a0a8" }}>LRT Software</div>
          <div style={{ marginTop: 30, fontSize: 84, fontWeight: 900, letterSpacing: "-4px", display: "flex", flexDirection: "column" }}>
            <span>Software que</span>
            <span style={{ backgroundImage: "linear-gradient(100deg, #6f8dff, #9b7dff)", backgroundClip: "text", color: "transparent" }}>
              transforma negócios.
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(160deg, #050505 50%, #0b0b14)",
          color: "#f4f4f5", fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: "#a0a0a8" }}>
          LRT Software · Ecossistema
        </div>
        <div
          style={{
            marginTop: 34, fontSize: 100, fontWeight: 900,
            letterSpacing: "-5px", color: prod.accent,
          }}
        >
          {prod.name}
        </div>
        <div style={{ marginTop: 18, fontSize: 34, color: "#d4d4d8", maxWidth: 900 }}>
          {prod.desc}
        </div>
        <div
          style={{
            marginTop: 44, fontSize: 26, color: "#050505",
            background: prod.accent,
            padding: "12px 28px", borderRadius: 999,
            fontWeight: 700, alignSelf: "flex-start",
          }}
        >
          {prod.stat}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
