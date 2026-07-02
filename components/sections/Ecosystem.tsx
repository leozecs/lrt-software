import type { CSSProperties } from "react";

const NODES = [
  {
    title: "Indica Pra Mim",
    desc: "Conecta pessoas a negócios locais de confiança na sua cidade.",
    hues: { "--hue-a": "#6f8dff", "--hue-b": "#7c88ff" },
    right: false,
  },
  {
    title: "Caixa Local",
    desc: "Gerencia as finanças por trás desses mesmos negócios.",
    hues: { "--hue-a": "#7c88ff", "--hue-b": "#8a83ff" },
    right: true,
  },
  {
    title: "Pet Sistem",
    desc: "Um SaaS vertical completo, do agendamento ao faturamento.",
    hues: { "--hue-a": "#8a83ff", "--hue-b": "#937fff" },
    right: false,
  },
  {
    title: "Zeta",
    desc: "A evolução: uma plataforma de IA que constrói software sozinha.",
    hues: { "--hue-a": "#937fff", "--hue-b": "#9b7dff" },
    right: true,
  },
];

export default function Ecosystem() {
  return (
    <section className="ecosystem" id="ecosystem">
      <div className="wrap">
        <div className="eco-head" data-reveal>
          <h2>Quatro produtos.<br />Uma evolução.</h2>
          <p>
            Cada plataforma que lançamos nasceu da anterior. O que começou como uma forma de
            conectar negócios locais se tornou um ecossistema que agora constrói software sozinho.
          </p>
        </div>

        <div className="eco-timeline">
          <svg className="eco-line" viewBox="0 0 60 900" preserveAspectRatio="none" aria-hidden="true">
            <path
              id="ecoPath"
              d="M30 0 C 30 140, 30 160, 30 225 C 30 360, 30 385, 30 450 C 30 585, 30 610, 30 675 C 30 810, 30 835, 30 900"
              fill="none"
              stroke="url(#ecoGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="ecoGrad" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6f8dff" />
                <stop offset="1" stopColor="#9b7dff" />
              </linearGradient>
            </defs>
          </svg>

          <ol className="eco-nodes">
            {NODES.map((n) => (
              <li
                key={n.title}
                className={`eco-node${n.right ? " eco-node-right" : ""}`}
                data-node
                style={n.hues as CSSProperties}
              >
                <span className="eco-dot" aria-hidden="true"></span>
                <div className="eco-card">
                  <h3>{n.title}</h3>
                  <p>{n.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
