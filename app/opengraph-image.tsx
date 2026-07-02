import { ImageResponse } from "next/og";

export const alt = "LRT Software · Software que transforma negócios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(160deg, #050505 55%, #0d0d18)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 34,
            fontWeight: 700,
            color: "#a0a0a8",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: "linear-gradient(135deg, #6f8dff, #9b7dff)",
            }}
          />
          LRT Software
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 88,
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: "-4px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Construindo software</span>
          <span>que transforma</span>
          <span
            style={{
              backgroundImage: "linear-gradient(100deg, #6f8dff, #9b7dff)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            negócios.
          </span>
        </div>
        <div style={{ marginTop: 44, fontSize: 28, color: "#a0a0a8" }}>
          +15 clientes ativos · +10 lojas · +12 petshops · Zeta em desenvolvimento
        </div>
      </div>
    ),
    size
  );
}
