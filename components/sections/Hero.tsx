const TITLES = {
  a: (
    <>
      <span className="line"><span>Construindo software</span></span>
      <span className="line"><span>que transforma</span></span>
      <span className="line"><span className="hero-accent">negócios.</span></span>
    </>
  ),
  b: (
    <>
      <span className="line"><span>Engenharia e IA</span></span>
      <span className="line"><span>que transformam ideias</span></span>
      <span className="line"><span className="hero-accent">em receita.</span></span>
    </>
  ),
};

export default function Hero({ variant = "a" }: { variant?: "a" | "b" }) {
  return (
    <section className="hero" id="hero">
      <canvas className="hero-canvas" id="heroCanvas" aria-hidden="true"></canvas>
      <div className="hero-glow hero-glow-a" aria-hidden="true"></div>
      <div className="hero-glow hero-glow-b" aria-hidden="true"></div>

      <div className="hero-inner" id="heroInner">
        <h1 className="hero-title">{TITLES[variant]}</h1>
        <p className="hero-sub" data-hero-fade>
          Criamos produtos digitais escaláveis com engenharia moderna e Inteligência Artificial.
        </p>
        <div className="hero-cta" data-hero-fade>
          <a className="btn btn-primary magnetic" href="#ecosystem">Explorar nosso ecossistema</a>
          <a className="btn btn-ghost magnetic" href="#products">Ver Projetos</a>
        </div>
      </div>

      <div className="hero-horizon" aria-hidden="true"></div>
    </section>
  );
}
