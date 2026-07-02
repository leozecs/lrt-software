const PRINCIPLES = [
  { icon: "ph-code", title: "Engenharia de software moderna", desc: "Código tipado, pipelines automatizados e arquitetura limpa em tudo o que sai daqui." },
  { icon: "ph-stack", title: "Arquitetura escalável", desc: "Sistemas prontos para crescer do primeiro usuário aos primeiros cem mil." },
  { icon: "ph-gear-six", title: "Automação", desc: "Trabalho repetitivo vira software. Seu time foca no negócio." },
  { icon: "ph-sparkle", title: "Inteligência Artificial", desc: "IA aplicada onde gera alavancagem: produtos, operações e decisões." },
  { icon: "ph-trend-up", title: "Crescimento do negócio", desc: "Software medido por receita e retenção, não por quantidade de funcionalidades." },
  { icon: "ph-handshake", title: "Parceria de longo prazo", desc: "Monitoramento, iteração e suporte contínuos depois do lançamento." },
];

export default function Philosophy() {
  return (
    <section className="philosophy" id="philosophy">
      <div className="wrap">
        <h2 className="manifesto" id="manifesto">
          Nós não criamos sites. Nós construímos <span className="hero-accent">empresas digitais</span>.
          Engenharia, produto e crescimento entram juntos em cada projeto.
        </h2>

        <div className="principles">
          {PRINCIPLES.map((p) => (
            <article className="principle" key={p.title}>
              <i className={`ph ${p.icon}`} aria-hidden="true"></i>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
