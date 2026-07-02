/* LRT Software · motion system
   GSAP ScrollTrigger + Lenis. Everything degrades to static under prefers-reduced-motion. */

(() => {
  "use strict";

  /* ?static renders the page without any animation (QA + debugging aid) */
  const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    new URLSearchParams(location.search).has("static");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- nav: glass after scroll (sentinel, no scroll listener) ---------- */
  const nav = document.getElementById("nav");
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:60px;pointer-events:none;";
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => {
    nav.classList.toggle("scrolled", !e.isIntersecting);
  }).observe(sentinel);

  /* ---------- preloader: fora do caminho imediatamente quando não há animação;
     caso contrário o GSAP assume mais abaixo ---------- */
  const preloader = document.getElementById("preloader");
  if (preloader && (reduceMotion || typeof gsap === "undefined")) preloader.remove();
  /* failsafe: nunca deixar o preloader travar a página */
  setTimeout(() => {
    const p = document.getElementById("preloader");
    if (p) p.remove();
  }, 5000);

  /* ---------- grade de agenda do Pet Sistem (células geradas) ---------- */
  (function petGrid() {
    const g = document.querySelector(".ambient-grid .grid-cells");
    if (!g) return;
    const NS = "http://www.w3.org/2000/svg";
    const lit = new Set([5, 9, 14, 22, 27]);
    let n = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        const r = document.createElementNS(NS, "rect");
        r.setAttribute("x", 8 + col * 44);
        r.setAttribute("y", 8 + row * 58);
        r.setAttribute("width", 34);
        r.setAttribute("height", 46);
        r.setAttribute("rx", 8);
        if (lit.has(n)) {
          r.setAttribute("fill", "rgba(141,129,255,0.22)");
          r.setAttribute("stroke", "rgba(141,129,255,0.5)");
        } else {
          r.setAttribute("fill", "none");
          r.setAttribute("stroke", "rgba(255,255,255,0.07)");
        }
        g.appendChild(r);
        n++;
      }
    }
  })();

  /* ---------- live screenshots: mshots returns a placeholder while it renders
     the target site, so re-request each image a few times until it's ready ---------- */
  document.querySelectorAll('img[src*="mshots"]').forEach((img) => {
    let tries = 0;
    const base = img.src;
    const timer = setInterval(() => {
      tries++;
      if (tries > 6) { clearInterval(timer); return; }
      const probe = new Image();
      probe.onload = () => {
        /* the "generating" placeholder is a small fixed-size image */
        if (probe.naturalWidth > 400) { img.src = probe.src; clearInterval(timer); }
      };
      probe.src = base + "&refresh=" + tries;
    }, 7000);
  });

  /* ---------- particle fields (hero + finale) ---------- */
  function particleField(canvas, opts = {}) {
    if (reduceMotion || !canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, parts = [], running = false, raf = 0;
    let mx = 0, my = 0;

    function resize() {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.floor((w * h) / 14000));
      parts = Array.from({ length: count }, () => spawn(true));
    }

    function spawn(anywhere) {
      const violet = Math.random() < 0.4;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 6,
        r: 0.4 + Math.random() * 1.5,
        vy: 0.08 + Math.random() * 0.35,
        vx: (Math.random() - 0.5) * 0.08,
        a: 0.12 + Math.random() * 0.5,
        depth: 0.3 + Math.random() * 0.7,
        c: violet ? "155,125,255" : "140,160,255",
        tw: Math.random() * Math.PI * 2,
      };
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy; p.x += p.vx; p.tw += 0.02;
        if (p.y < -8) Object.assign(p, spawn(false));
        const px = p.x + mx * 22 * p.depth;
        const py = p.y + my * 14 * p.depth;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},${alpha.toFixed(3)})`;
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
    }).observe(canvas);

    if (opts.mouse && finePointer) {
      canvas.parentElement.addEventListener("pointermove", (e) => {
        const r = canvas.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
      }, { passive: true });
    }

    resize();
    window.addEventListener("resize", resize);
  }

  particleField(document.getElementById("heroCanvas"), { mouse: true });
  particleField(document.getElementById("finaleCanvas"));

  /* ---------- zeta: neural network canvas ---------- */
  (function neural() {
    const canvas = document.getElementById("zetaCanvas");
    if (reduceMotion || !canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, nodes = [], running = false, raf = 0;

    function resize() {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(60, Math.floor((w * h) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1 + Math.random() * 1.6,
      }));
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const linkDist = 130;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(150,135,255,${(0.14 * (1 - d / linkDist)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(170,155,255,0.5)";
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
    }).observe(canvas);

    resize();
    window.addEventListener("resize", resize);
  })();

  /* ---------- zeta: streaming code ---------- */
  (function stream() {
    const target = document.querySelector("#zetaStream code");
    if (!target) return;
    const lines = [
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
    if (reduceMotion) { target.textContent = lines.join("\n"); return; }

    let li = 0, ci = 0, buf = [], running = false, timer = 0;

    function step() {
      if (!running) return;
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

    new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      clearTimeout(timer);
      if (running) step();
    }).observe(target);
  })();

  /* ---------- everything below needs GSAP ---------- */
  if (reduceMotion || typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  /* Lenis smooth scroll, driven by the GSAP ticker */
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const el = document.querySelector(a.getAttribute("href"));
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: 0, duration: 1.4 });
      });
    });
  }

  const EASE = "power4.out";

  /* ---------- preloader: o monograma se desenha, o brilho acende,
     a cortina abre e só então o hero entra ---------- */
  const master = gsap.timeline({ defaults: { ease: EASE } });

  if (document.getElementById("preloader")) {
    if (lenis) lenis.stop();
    const preL = document.querySelector(".pre-logo .mark-l");
    const preT = document.querySelector(".pre-logo .mark-t");
    [preL, preT].forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    master
      .to(preL, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.1)
      .to(preT, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0.35)
      .to(".pre-logo .mark-r", { opacity: 1, duration: 0.5 }, 0.75)
      .fromTo(".pre-logo .mark-spark",
        { opacity: 0, scale: 0, transformOrigin: "center" },
        { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.5)" }, 0.95)
      .to(".pre-logo", { scale: 0.9, opacity: 0, duration: 0.55, ease: "power2.in" }, "+=0.35")
      .to("#preloader", {
        opacity: 0, duration: 0.6,
        onComplete: () => {
          const p = document.getElementById("preloader");
          if (p) p.remove();
          if (lenis) lenis.start();
        },
      }, "<0.2");
  }

  /* ---------- hero intro ---------- */
  master
    .from(".hero-title .line > span", { yPercent: 115, duration: 1.3, stagger: 0.12 }, "-=0.35")
    .from("[data-hero-fade]", { y: 30, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.7")
    .from(".nav-inner", { y: -20, opacity: 0, duration: 0.9 }, "-=0.9");

  /* hero collapse on scroll (scrub) */
  gsap.to("#heroInner", {
    yPercent: -12, scale: 0.94, opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "85% top", scrub: true },
  });

  /* ---------- generic reveals ---------- */
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 44, opacity: 0, duration: 1.1, ease: EASE,
      scrollTrigger: { trigger: el, start: "top 86%", once: true },
    });
  });

  /* ---------- ecosystem: line draw + node glow ---------- */
  const path = document.getElementById("ecoPath");
  if (path) {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: ".eco-timeline", start: "top 75%", end: "bottom 55%", scrub: 0.6 },
    });
  }
  document.querySelectorAll("[data-node]").forEach((node) => {
    ScrollTrigger.create({
      trigger: node, start: "top 62%",
      onEnter: () => node.classList.add("lit"),
      onLeaveBack: () => node.classList.remove("lit"),
    });
    gsap.from(node.querySelector(".eco-card"), {
      y: 36, opacity: 0, duration: 1, ease: EASE,
      scrollTrigger: { trigger: node, start: "top 78%", once: true },
    });
  });

  /* ---------- the ascent: sticky stack choreography (desktop only) ---------- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    const cards = gsap.utils.toArray(".stack-card");
    cards.forEach((card, i) => {
      const panel = card.querySelector(".panel");

      /* climbing entrance: each panel rises into place */
      gsap.from(panel, {
        scale: 0.96, yPercent: 3, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
      });

      /* previous panel recedes as the next one arrives */
      if (i < cards.length - 1) {
        gsap.to(panel, {
          scale: 0.92, opacity: 0.35, ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true },
        });
      }
    });

    /* curva de receita do Caixa Local desenhada conforme o painel entra */
    const chart = document.querySelector(".ambient-chart .chart-line");
    if (chart) {
      const len = chart.getTotalLength();
      gsap.set(chart, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(chart, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: cards[1], start: "top 80%", end: "top top", scrub: 0.5 },
      });
    }
  });

  /* trilho lateral: acende o degrau ativo e permite pular entre produtos */
  const rail = document.getElementById("ascentRail");
  if (rail) {
    const railLinks = rail.querySelectorAll("[data-rail]");
    const cards = gsap.utils.toArray(".stack-card");

    ScrollTrigger.create({
      trigger: ".ascent", start: "top 60%", end: "bottom 40%",
      onToggle: (self) => rail.classList.toggle("visible", self.isActive),
    });

    cards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card, start: "top center", end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            railLinks.forEach((l, j) => l.classList.toggle("active", j === i));
          }
        },
      });
    });

    railLinks.forEach((link, i) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (lenis) lenis.scrollTo(cards[i], { duration: 1.2 });
        else cards[i].scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /* ---------- luz ambiente que segue o cursor ---------- */
  if (finePointer) {
    const light = document.getElementById("cursorLight");
    if (light) {
      document.body.classList.add("has-cursor-light");
      const lx = gsap.quickTo(light, "x", { duration: 1.1, ease: "power3.out" });
      const ly = gsap.quickTo(light, "y", { duration: 1.1, ease: "power3.out" });
      window.addEventListener("pointermove", (e) => { lx(e.clientX); ly(e.clientY); }, { passive: true });
    }

    /* spotlight dos cards da filosofia */
    document.querySelectorAll(".phi-cell").forEach((cell) => {
      cell.addEventListener("pointermove", (e) => {
        const r = cell.getBoundingClientRect();
        cell.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        cell.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      }, { passive: true });
    });
  }

  /* ---------- manifesto: cada palavra acende conforme o scroll ---------- */
  const manifesto = document.getElementById("manifesto");
  if (manifesto) {
    const splitWords = (el) => {
      [...el.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
            const s = document.createElement("span");
            s.className = "w";
            s.textContent = tok;
            frag.appendChild(s);
          });
          el.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          splitWords(node);
        }
      });
    };
    splitWords(manifesto);
    gsap.fromTo(manifesto.querySelectorAll(".w"),
      { opacity: 0.12 },
      {
        opacity: 1, stagger: 0.05, ease: "none",
        scrollTrigger: { trigger: manifesto, start: "top 80%", end: "bottom 48%", scrub: 0.4 },
      });
  }

  /* ---------- princípios: acendem ao cruzar o centro da tela ---------- */
  document.querySelectorAll(".principle").forEach((row, i) => {
    gsap.from(row, {
      y: 34, opacity: 0, duration: 0.9, ease: EASE, delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: row, start: "top 90%", once: true },
    });
    ScrollTrigger.create({
      trigger: row, start: "top 68%", end: "bottom 24%",
      onToggle: (self) => row.classList.toggle("lit", self.isActive),
    });
  });

  /* ---------- pointer physics: magnetic + tilt (fine pointers only) ---------- */
  if (finePointer) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.22);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });

    document.querySelectorAll("[data-tilt]").forEach((wrap) => {
      const card = wrap.querySelector(".device");
      if (!card) return;
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.7, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.7, ease: "power3.out" });
      wrap.addEventListener("pointermove", (e) => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 7); rx(-py * 6);
      });
      wrap.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  }
})();
