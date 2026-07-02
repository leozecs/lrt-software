"use client";

import { useCallback, useEffect, useState } from "react";

type Slide = {
  kicker: string;
  title: React.ReactNode;
  body?: string;
  stats?: { n: string; l: string }[];
};

const SLIDES: Slide[] = [
  {
    kicker: "LRT Software",
    title: <>Construindo software que <span className="hero-accent">transforma negócios.</span></>,
    body: "Produtos digitais escaláveis com engenharia moderna e Inteligência Artificial.",
  },
  {
    kicker: "Ecossistema",
    title: <>Quatro produtos. <span className="hero-accent">Uma evolução.</span></>,
    body: "Cada plataforma nasceu da anterior — de conectar negócios locais até uma IA que constrói software sozinha.",
  },
  {
    kicker: "Produto 01",
    title: <>Indica Pra Mim</>,
    body: "Descoberta de negócios locais de confiança: avaliações, mapas e busca feita para crescer.",
    stats: [
      { n: "+15", l: "clientes ativos" },
      { n: "+500", l: "acessos recorrentes" },
    ],
  },
  {
    kicker: "Produto 02",
    title: <>Caixa Local</>,
    body: "Gestão financeira para pequenas empresas: receita, fluxo de caixa e análises num painel claro.",
    stats: [{ n: "+10", l: "lojas gerenciando o financeiro" }],
  },
  {
    kicker: "Produto 03",
    title: <>Pet Sistem</>,
    body: "SaaS vertical completo para pet shops e clínicas veterinárias, do agendamento ao prontuário.",
    stats: [{ n: "+12", l: "petshops no dia a dia" }],
  },
  {
    kicker: "Produto 04",
    title: <>Zeta</>,
    body: "IA que cria sites, CRMs e softwares instantaneamente. O ecossistema construindo a si mesmo.",
    stats: [{ n: "beta", l: "em desenvolvimento" }],
  },
  {
    kicker: "Filosofia",
    title: <>Nós não criamos sites. Construímos <span className="hero-accent">empresas digitais.</span></>,
    body: "Engenharia, produto e crescimento entram juntos em cada projeto.",
  },
  {
    kicker: "Próximo passo",
    title: <>Pronto para construir o <span className="hero-accent">seu produto?</span></>,
    body: "leocodes.dev@gmail.com",
  },
];

export default function PitchDeck() {
  const [i, setI] = useState(0);
  const total = SLIDES.length;

  const go = useCallback((d: number) => {
    setI((cur) => Math.min(total - 1, Math.max(0, cur + d)));
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
      if (e.key === "Home") setI(0);
      if (e.key === "End") setI(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total]);

  const s = SLIDES[i];

  return (
    <div className="pitch" onClick={() => go(1)}>
      <a className="pitch-exit" href="/" onClick={(e) => e.stopPropagation()}>✕ sair</a>

      <div className="pitch-slide" key={i}>
        <div className="pitch-kicker">{s.kicker}</div>
        <h2>{s.title}</h2>
        {s.body && <p>{s.body}</p>}
        {s.stats && (
          <ul className="pitch-stats" role="list">
            {s.stats.map((st) => (
              <li key={st.l}><b>{st.n}</b><span>{st.l}</span></li>
            ))}
          </ul>
        )}
      </div>

      <div className="pitch-hint">← → navegar · clique avança</div>
      <div className="pitch-hud">
        <span>{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <div className="pitch-dots">
          {SLIDES.map((_, k) => <i key={k} className={k === i ? "on" : ""} />)}
        </div>
      </div>
    </div>
  );
}
