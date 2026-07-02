import type { CSSProperties } from "react";
import ZetaPlayground from "../ZetaPlayground";

function ExtIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Device({ domain, shot, alt, wide = false }: { domain: string; shot: string; alt: string; wide?: boolean }) {
  return (
    <figure className="device">
      <div className="device-bar" aria-hidden="true">
        <i></i><i></i><i></i><span>{domain}</span>
      </div>
      {/* mshots troca o src via JS de retry: img nativa de propósito */}
      <img
        src={shot}
        alt={alt}
        loading="lazy"
        width={wide ? 1600 : 1280}
        height={wide ? 900 : 800}
      />
    </figure>
  );
}

const acc = (v: string) => ({ "--acc": v }) as CSSProperties;

export default function Products() {
  return (
    <section className="ascent" id="products">
      <aside className="ascent-rail" id="ascentRail" aria-label="Navegação dos produtos">
        <a href="#" data-rail="0">Indica Pra Mim</a>
        <a href="#" data-rail="1">Caixa Local</a>
        <a href="#" data-rail="2">Pet Sistem</a>
        <a href="#" data-rail="3">Zeta</a>
      </aside>

      {/* ETAPA 1: INDICA PRA MIM */}
      <div className="stack-card" data-stack>
        <article className="panel" style={acc("#6f8dff")}>
          <div className="panel-glow" aria-hidden="true"></div>
          <svg className="panel-ambient ambient-radar" viewBox="0 0 420 420" aria-hidden="true">
            <circle cx="210" cy="210" r="70" />
            <circle cx="210" cy="210" r="130" />
            <circle cx="210" cy="210" r="190" />
            <circle className="radar-pin" cx="150" cy="140" r="4" />
            <circle className="radar-pin d2" cx="290" cy="180" r="4" />
            <circle className="radar-pin d3" cx="230" cy="300" r="4" />
          </svg>
          <div className="panel-body panel-split">
            <div className="panel-copy">
              <h3 className="panel-name">Indica Pra Mim</h3>
              <p className="panel-desc">
                Plataforma de descoberta de negócios locais que ajuda pessoas a encontrar empresas
                de confiança na sua cidade, com avaliações, mapas e busca feita para crescer.
              </p>
              <ul className="panel-tags" role="list">
                <li>Busca local</li><li>Mapas</li><li>Avaliações</li><li>SEO</li>
              </ul>
              <ul className="panel-stats" role="list">
                <li><b data-count="15">+15</b><span>clientes ativos</span></li>
                <li><b data-count="500">+500</b><span>acessos recorrentes</span></li>
              </ul>
              <a className="panel-link magnetic" href="https://indicapramim.com" target="_blank" rel="noopener">
                Visitar indicapramim.com
                <ExtIcon />
              </a>
            </div>
            <div className="panel-media" data-tilt>
              <Device
                domain="indicapramim.com"
                shot="https://s0.wp.com/mshots/v1/https%3A%2F%2Findicapramim.com?w=1280&h=800"
                alt="Captura de tela do produto Indica Pra Mim"
              />
            </div>
          </div>
        </article>
      </div>

      {/* ETAPA 2: CAIXA LOCAL */}
      <div className="stack-card" data-stack>
        <article className="panel" style={acc("#7f86ff")}>
          <div className="panel-glow" aria-hidden="true"></div>
          <svg className="panel-ambient ambient-chart" viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true">
            <path
              className="chart-line"
              d="M0 210 C 90 205, 130 185, 190 175 C 260 163, 300 130, 370 110 C 440 90, 480 60, 600 28"
              fill="none"
              strokeWidth="2.5"
            />
          </svg>
          <div className="panel-body panel-split panel-split-flip">
            <div className="panel-copy">
              <h3 className="panel-name">Caixa Local</h3>
              <p className="panel-desc">
                Plataforma de gestão financeira para pequenas empresas. Receita, fluxo de caixa,
                pagamentos e análises em um painel claro.
              </p>
              <ul className="panel-tags" role="list">
                <li>Painel</li><li>Receita</li><li>Fluxo de caixa</li><li>Pagamentos</li><li>Análises</li>
              </ul>
              <ul className="panel-stats" role="list">
                <li><b data-count="10">+10</b><span>lojas gerenciando o financeiro</span></li>
              </ul>
              <a className="panel-link magnetic" href="https://caixalocal.vercel.app" target="_blank" rel="noopener">
                Visitar caixalocal.vercel.app
                <ExtIcon />
              </a>
            </div>
            <div className="panel-media" data-tilt>
              <Device
                domain="caixalocal.vercel.app"
                shot="https://s0.wp.com/mshots/v1/https%3A%2F%2Fcaixalocal.vercel.app?w=1280&h=800"
                alt="Captura de tela do produto Caixa Local"
              />
            </div>
          </div>
        </article>
      </div>

      {/* ETAPA 3: PET SISTEM */}
      <div className="stack-card" data-stack>
        <article className="panel" style={acc("#8d81ff")}>
          <div className="panel-glow" aria-hidden="true"></div>
          <svg className="panel-ambient ambient-grid" viewBox="0 0 360 240" aria-hidden="true">
            <g className="grid-cells"></g>
          </svg>
          <div className="panel-body panel-stackedwide">
            <div className="panel-toprow">
              <div className="panel-copy">
                <h3 className="panel-name">Pet Sistem</h3>
                <p className="panel-desc">
                  Plataforma SaaS completa para pet shops e clínicas veterinárias, do primeiro
                  agendamento ao prontuário.
                </p>
                <ul className="panel-stats" role="list">
                  <li><b data-count="12">+12</b><span>petshops utilizando no dia a dia</span></li>
                </ul>
                <a className="panel-link magnetic" href="https://petsistem.com.br" target="_blank" rel="noopener">
                  Visitar petsistem.com.br
                  <ExtIcon />
                </a>
              </div>
              <ul className="panel-caps" role="list">
                <li>Agendamentos e calendário</li>
                <li>Clientes e pets</li>
                <li>Prontuários</li>
                <li>Assinaturas e cobrança</li>
              </ul>
            </div>
            <div className="panel-media panel-media-wide" data-tilt>
              <Device
                domain="petsistem.com.br"
                shot="https://s0.wp.com/mshots/v1/https%3A%2F%2Fpetsistem.com.br?w=1600&h=900"
                alt="Captura de tela do produto Pet Sistem"
                wide
              />
            </div>
          </div>
        </article>
      </div>

      {/* ETAPA 4: ZETA */}
      <div className="stack-card" data-stack>
        <article className="panel panel-zeta" style={acc("#9b7dff")}>
          <canvas className="zeta-canvas" id="zetaCanvas" aria-hidden="true"></canvas>
          <div className="panel-glow" aria-hidden="true"></div>
          <div className="panel-body panel-zeta-body">
            <div className="panel-copy panel-copy-center">
              <h3 className="panel-name panel-name-xl">Zeta</h3>
              <p className="panel-desc">
                Plataforma com Inteligência Artificial capaz de criar sites, CRMs e softwares
                instantaneamente. O ponto em que nosso ecossistema começou a construir a si mesmo.
              </p>
              <ul className="panel-stats" role="list" style={{ justifyContent: "center" }}>
                <li className="stat-dev"><b>em desenvolvimento</b></li>
              </ul>
              <a className="panel-link magnetic" href="https://appzeta.vercel.app" target="_blank" rel="noopener">
                Visitar appzeta.vercel.app
                <ExtIcon />
              </a>
            </div>
            <div className="zeta-stage">
              <ZetaPlayground />
              <div className="panel-media zeta-shot" data-tilt>
                <Device
                  domain="appzeta.vercel.app"
                  shot="https://s0.wp.com/mshots/v1/https%3A%2F%2Fappzeta.vercel.app?w=1280&h=800"
                  alt="Captura de tela do produto Zeta"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
