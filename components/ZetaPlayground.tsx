"use client";

import { useEffect, useRef, useState } from "react";

/* Simulação do build da Zeta: o visitante descreve um app e o terminal
   "constrói" na hora. Puro client-side — demo, não chama IA real. */

const STOPWORDS = new Set([
  "para", "com", "uma", "que", "meu", "minha", "site", "app", "aplicativo",
  "sistema", "quero", "fazer", "criar", "gestão", "gerenciar", "controle",
]);

function deriveLines(prompt: string): string[] {
  const clean = prompt.trim().toLowerCase();
  const words = clean.match(/[a-zà-ú]{4,}/g) || [];
  const entities = [...new Set(words.filter((w) => !STOPWORDS.has(w)))].slice(0, 3);
  const tables = entities.length ? entities : ["clientes", "pedidos", "faturas"];
  const slug = (entities[0] || "seu-app").replace(/[^a-z0-9]/g, "");
  const nome = prompt.trim().slice(0, 44) || "seu app";

  return [
    "zeta build --from prompt",
    `› analisando requisitos: "${nome}"`,
    `› gerando schema: ${tables.join(", ")}`,
    `create table ${tables[0]} ( id uuid primary key … )`,
    "› montando telas",
    "export function Dashboard({ dados }) {",
    "  return <Painel data={dados} />;",
    "}",
    "› conectando auth + pagamentos",
    "› publicando na edge…",
    `✓ no ar em 42s · zeta.app/${slug}`,
  ];
}

const DEFAULT_LINES = [
  "zeta build --from prompt",
  "› analisando requisitos…",
  "› gerando schema: clientes, faturas, pipelines",
  "create table clientes ( id uuid primary key … )",
  "› montando telas do CRM",
  "export function Dashboard({ metricas }) {",
  "  return <GraficoReceita data={metricas} />;",
  "}",
  "› conectando auth + pagamentos",
  "› publicando na edge…",
  "✓ no ar em 42s · zeta.app/seu-crm",
];

export default function ZetaPlayground() {
  const [prompt, setPrompt] = useState("");
  const [lines, setLines] = useState(DEFAULT_LINES);
  const [runId, setRunId] = useState(0);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = codeRef.current;
    if (!target) return;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) { target.textContent = lines.join("\n"); return; }

    let li = 0, ci = 0, buf: string[] = [], running = false;
    let timer: ReturnType<typeof setTimeout>;

    function step() {
      if (!running || !target) return;
      const line = lines[li];
      ci++;
      if (ci > line.length) {
        buf.push(line); ci = 0; li = (li + 1) % lines.length;
        if (buf.length > 9) buf.shift();
        if (li === 0) buf = [];
        timer = setTimeout(step, 420);
      } else {
        target.textContent = buf.join("\n") + (buf.length ? "\n" : "") + line.slice(0, ci);
        timer = setTimeout(step, 18 + Math.random() * 40);
      }
    }

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      clearTimeout(timer);
      if (running) step();
    });
    io.observe(target);

    return () => { running = false; clearTimeout(timer); io.disconnect(); };
  }, [lines, runId]);

  function build(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLines(deriveLines(prompt));
    setRunId((n) => n + 1);
  }

  return (
    <div className="zeta-code glass">
      <form className="zeta-form" onSubmit={build}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="descreva um app: CRM para clínicas, delivery de marmitas…"
          maxLength={80}
          aria-label="Descreva o app que a Zeta deve construir"
        />
        <button type="submit">build</button>
      </form>
      <pre id="zetaStream"><code ref={codeRef}></code></pre>
    </div>
  );
}
