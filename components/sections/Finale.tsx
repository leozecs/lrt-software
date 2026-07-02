export default function Finale() {
  return (
    <section className="finale" id="contact">
      <canvas className="hero-canvas" id="finaleCanvas" aria-hidden="true"></canvas>
      <div className="finale-glow" aria-hidden="true"></div>
      <span className="finale-watermark" aria-hidden="true">LRT</span>
      <svg className="finale-signature" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="lgSig" x1="16" y1="20" x2="44" y2="56">
            <stop stopColor="#6f8dff" />
            <stop offset="1" stopColor="#9b7dff" />
          </linearGradient>
        </defs>
        <path data-draw d="M16 20 V48 Q16 56 24 56 H44" stroke="url(#lgSig)" strokeWidth="5" strokeLinecap="round" />
        <path data-draw d="M34 16 H48 Q56 16 56 24 V38" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <path className="mark-spark" d="M56 40 l1.8 3.4 3.4 1.8 -3.4 1.8 -1.8 3.4 -1.8 -3.4 -3.4 -1.8 3.4 -1.8 Z" fill="#9b7dff" />
        <text className="mark-r" x="33" y="45" textAnchor="middle" fontFamily="Satoshi, sans-serif" fontWeight="900" fontSize="28" fill="#fff">R</text>
      </svg>
      <div className="wrap finale-inner">
        <h2 data-reveal>
          Pronto para construir seu<br /><span className="hero-accent">próximo produto digital?</span>
        </h2>
        <a
          className="btn btn-primary btn-xl magnetic"
          data-reveal
          href="mailto:leocodes.dev@gmail.com?subject=Novo%20projeto%20com%20LRT%20Software"
        >
          Iniciar Projeto
        </a>
      </div>
    </section>
  );
}
