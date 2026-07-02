"use client";

import { useState } from "react";

/* Form de projeto: monta o e-mail e abre o Gmail do visitante com tudo
   preenchido — ele só revisa e clica enviar. Zero backend, zero API key. */

const TO = "leocodes.dev@gmail.com";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    /* honeypot anti-bot */
    if (String(data.get("site") || "").trim() !== "") return;

    const nome = String(data.get("nome") || "").trim();
    const email = String(data.get("email") || "").trim();
    const empresa = String(data.get("empresa") || "").trim();
    const mensagem = String(data.get("mensagem") || "").trim();

    const subject = `Novo projeto — ${nome}${empresa ? ` (${empresa})` : ""}`;
    const body = [
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Empresa: ${empresa || "—"}`,
      "",
      "Projeto:",
      mensagem,
    ].join("\n");

    const gmail =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(TO)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    const win = window.open(gmail, "_blank", "noopener");
    /* popup bloqueado ou sem Gmail → fallback mailto no mesmo contexto */
    if (!win) {
      location.href =
        `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="form-feedback ok" role="status">
        Abrimos seu e-mail com a mensagem pronta — só revisar e enviar. 🚀
      </p>
    );
  }

  return (
    <>
      <p className="contact-form-title">ou descreva seu projeto agora:</p>
      <form className="contact-form" onSubmit={submit}>
        {/* honeypot anti-bot */}
        <input className="hp-field" type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <div className="form-row">
          <input type="text" name="nome" placeholder="Seu nome *" required maxLength={120} />
          <input type="email" name="email" placeholder="Seu e-mail *" required maxLength={200} />
        </div>
        <input type="text" name="empresa" placeholder="Empresa (opcional)" maxLength={200} />
        <textarea
          name="mensagem"
          placeholder="O que você quer construir? Conta o problema, o público e o prazo se tiver. *"
          required
          minLength={10}
          maxLength={4000}
        />
        <button type="submit" className="btn btn-primary">
          Montar e-mail do projeto
        </button>
      </form>
    </>
  );
}
