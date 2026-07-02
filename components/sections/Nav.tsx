import LogoMark from "../LogoMark";

export default function Nav() {
  return (
    <header className="nav" id="nav">
      <div className="nav-inner">
        <a className="nav-logo" href="#hero" aria-label="LRT Software, voltar ao topo">
          <LogoMark id="lgNav" />
          <span>LRT<em>Software</em></span>
        </a>
        <nav className="nav-links" aria-label="Principal">
          <a href="#ecosystem">Ecossistema</a>
          <a href="#products">Produtos</a>
          <a href="#philosophy">Filosofia</a>
        </nav>
        <a className="btn btn-primary btn-sm magnetic" href="mailto:leocodes.dev@gmail.com?subject=Novo%20projeto%20com%20LRT%20Software">
          Iniciar Projeto
        </a>
      </div>
    </header>
  );
}
