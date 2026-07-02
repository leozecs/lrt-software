import LogoMark from "../LogoMark";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <a className="nav-logo" href="#hero" aria-label="LRT Software, voltar ao topo">
            <LogoMark id="lgFoot" size={30} />
            <span>LRT<em>Software</em></span>
          </a>
          <p>Produtos digitais escaláveis, engenharia moderna e Inteligência Artificial.</p>
        </div>
        <nav className="footer-col" aria-label="Produtos">
          <h4>Produtos</h4>
          <a href="https://indicapramim.com" target="_blank" rel="noopener">Indica Pra Mim</a>
          <a href="https://caixalocal.vercel.app" target="_blank" rel="noopener">Caixa Local</a>
          <a href="https://petsistem.com.br" target="_blank" rel="noopener">Pet Sistem</a>
          <a href="https://appzeta.vercel.app" target="_blank" rel="noopener">Zeta</a>
        </nav>
        <div className="footer-col">
          <h4>Contato</h4>
          <a href="mailto:leocodes.dev@gmail.com">leocodes.dev@gmail.com</a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <p>© 2026 LRT Software. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
