/* LRT Software · motion system (port Next.js)
   Junta o main.js + unique.js do site estático num único init com cleanup.
   GSAP ScrollTrigger + Lenis via npm. Degrada para estático com
   prefers-reduced-motion ou ?static. */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function initMotion(): () => void {
  const reduceMotion =
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    new URLSearchParams(location.search).has("static");
  const finePointer = matchMedia("(pointer: fine)").matches;

  const ac = new AbortController();
  const { signal } = ac;
  const observers: IntersectionObserver[] = [];
  const createdNodes: Element[] = [];
  const timers: ReturnType<typeof setTimeout>[] = [];
  const intervals: ReturnType<typeof setInterval>[] = [];
  const rafFlags: { run: boolean }[] = [];

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- nav: glass depois do scroll ---------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:60px;pointer-events:none;";
    document.body.prepend(sentinel);
    createdNodes.push(sentinel);
    const io = new IntersectionObserver(([e]) => {
      nav.classList.toggle("scrolled", !e.isIntersecting);
    });
    io.observe(sentinel);
    observers.push(io);
  }

  /* ---------- preloader failsafe ---------- */
  if (reduceMotion) document.getElementById("preloader")?.remove();
  timers.push(setTimeout(() => document.getElementById("preloader")?.remove(), 5000));

  /* ---------- seed procedural por sessão ---------- */
  (function proceduralSeed() {
    let raw = sessionStorage.getItem("lrt-seed");
    if (raw === null) {
      raw = Math.random().toFixed(4);
      sessionStorage.setItem("lrt-seed", raw);
    }
    const seed = parseFloat(raw);
    const shift = Math.round((seed - 0.5) * 28);
    const root = document.documentElement;
    root.style.setProperty("--acc-a", `hsl(${227 + shift} 100% 72%)`);
    root.style.setProperty("--acc-b", `hsl(${258 + shift} 100% 74%)`);
    console.log(
      `%cLRT · sessão única #${Math.round(seed * 9999)} · hue ${shift > 0 ? "+" : ""}${shift}°`,
      "color:#9b7dff;font-weight:bold"
    );
  })();

  /* ---------- grade de agenda do Pet Sistem ---------- */
  (function petGrid() {
    const g = document.querySelector(".ambient-grid .grid-cells");
    if (!g) return;
    g.innerHTML = "";
    const NS = "http://www.w3.org/2000/svg";
    const lit = new Set([5, 9, 14, 22, 27]);
    let n = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        const r = document.createElementNS(NS, "rect");
        r.setAttribute("x", String(8 + col * 44));
        r.setAttribute("y", String(8 + row * 58));
        r.setAttribute("width", "34");
        r.setAttribute("height", "46");
        r.setAttribute("rx", "8");
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

  /* ---------- mshots: retry até a screenshot real ficar pronta ---------- */
  document.querySelectorAll<HTMLImageElement>('img[src*="mshots"]').forEach((img) => {
    let tries = 0;
    const base = img.src;
    const timer = setInterval(() => {
      tries++;
      if (tries > 6) { clearInterval(timer); return; }
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalWidth > 400) { img.src = probe.src; clearInterval(timer); }
      };
      probe.src = base + "&refresh=" + tries;
    }, 7000);
    intervals.push(timer);
  });

  /* ---------- particle fields (hero + finale) ---------- */
  function particleField(canvas: HTMLCanvasElement | null, opts: { mouse?: boolean } = {}) {
    if (reduceMotion || !canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;
    let mx = 0, my = 0;
    const flag = { run: false };
    rafFlags.push(flag);

    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; depth: number; c: string; tw: number };
    let parts: P[] = [];

    function spawn(anywhere: boolean): P {
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

    function resize() {
      const r = canvas!.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas!.width = w * dpr; canvas!.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.floor((w * h) / 14000));
      parts = Array.from({ length: count }, () => spawn(true));
    }

    function tick() {
      if (!flag.run) return;
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

    const io = new IntersectionObserver(([e]) => {
      flag.run = e.isIntersecting;
      if (flag.run) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
    });
    io.observe(canvas);
    observers.push(io);

    if (opts.mouse && finePointer && canvas.parentElement) {
      canvas.parentElement.addEventListener("pointermove", (e) => {
        const r = canvas!.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
      }, { passive: true, signal });
    }

    resize();
    window.addEventListener("resize", resize, { signal });
  }

  particleField(document.getElementById("heroCanvas") as HTMLCanvasElement, { mouse: true });
  particleField(document.getElementById("finaleCanvas") as HTMLCanvasElement);

  /* ---------- zeta: rede neural ---------- */
  (function neural() {
    const canvas = document.getElementById("zetaCanvas") as HTMLCanvasElement | null;
    if (reduceMotion || !canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;
    const flag = { run: false };
    rafFlags.push(flag);
    type N = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: N[] = [];

    function resize() {
      const r = canvas!.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas!.width = w * dpr; canvas!.height = h * dpr;
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
      if (!flag.run) return;
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

    const io = new IntersectionObserver(([e]) => {
      flag.run = e.isIntersecting;
      if (flag.run) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
    });
    io.observe(canvas);
    observers.push(io);

    resize();
    window.addEventListener("resize", resize, { signal });
  })();

  /* ---------- A/B: registra cliques no CTA principal ---------- */
  document.addEventListener("click", (e) => {
    const cta = (e.target as Element).closest(".btn-primary");
    if (!cta) return;
    const v = document.cookie.match(/lrt-ab=(a|b)/)?.[1] || "a";
    try {
      navigator.sendBeacon?.("/api/ab", JSON.stringify({ v, event: "cta_click", t: Date.now() }));
    } catch { /* beacon opcional */ }
  }, { signal });

  /* ---------- daqui pra baixo: coreografia GSAP ---------- */
  let lenis: Lenis | null = null;
  const ctx = gsap.context(() => {
    if (reduceMotion) return;

    /* Lenis smooth scroll no ticker do GSAP */
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tickerFn = (t: number) => lenis!.raf(t * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");

    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const el = document.querySelector(a.getAttribute("href")!);
        if (!el) return;
        e.preventDefault();
        lenis!.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
      }, { signal });
    });

    const EASE = "power4.out";
    const master = gsap.timeline({ defaults: { ease: EASE } });

    /* preloader: monograma se desenha, cortina abre */
    if (document.getElementById("preloader")) {
      lenis.stop();
      const preL = document.querySelector<SVGPathElement>(".pre-logo .mark-l");
      const preT = document.querySelector<SVGPathElement>(".pre-logo .mark-t");
      [preL, preT].forEach((p) => {
        if (!p) return;
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
            document.getElementById("preloader")?.remove();
            lenis?.start();
          },
        }, "<0.2");
    }

    /* hero intro */
    master
      .from(".hero-title .line > span", { yPercent: 115, duration: 1.3, stagger: 0.12 }, "-=0.35")
      .from("[data-hero-fade]", { y: 30, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.7")
      .from(".nav-inner", { y: -20, opacity: 0, duration: 0.9 }, "-=0.9");

    /* hero collapse no scroll */
    gsap.to("#heroInner", {
      yPercent: -12, scale: 0.94, opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "85% top", scrub: true },
    });

    /* reveals genéricos */
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 44, opacity: 0, duration: 1.1, ease: EASE,
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });
    });

    /* ecosystem: linha desenhada + nós acendem */
    const path = document.getElementById("ecoPath") as unknown as SVGPathElement | null;
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

    /* ascent: sticky stack (desktop) */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        const panel = card.querySelector(".panel");
        gsap.from(panel, {
          scale: 0.96, yPercent: 3, ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
        });
        if (i < cards.length - 1) {
          gsap.to(panel, {
            scale: 0.92, opacity: 0.35, ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true },
          });
        }
      });

      const chart = document.querySelector<SVGPathElement>(".ambient-chart .chart-line");
      if (chart && cards[1]) {
        const len = chart.getTotalLength();
        gsap.set(chart, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(chart, {
          strokeDashoffset: 0, ease: "none",
          scrollTrigger: { trigger: cards[1], start: "top 80%", end: "top top", scrub: 0.5 },
        });
      }
    });

    /* trilho lateral dos produtos */
    const rail = document.getElementById("ascentRail");
    if (rail) {
      const railLinks = rail.querySelectorAll("[data-rail]");
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

      ScrollTrigger.create({
        trigger: ".ascent", start: "top 60%", end: "bottom 40%",
        onToggle: (self) => rail.classList.toggle("visible", self.isActive),
      });

      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card, start: "top center", end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) railLinks.forEach((l, j) => l.classList.toggle("active", j === i));
          },
        });
      });

      railLinks.forEach((link, i) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          if (lenis) lenis.scrollTo(cards[i], { duration: 1.2 });
          else cards[i].scrollIntoView({ behavior: "smooth" });
        }, { signal });
      });
    }

    /* luz ambiente que segue o cursor */
    if (finePointer) {
      const light = document.getElementById("cursorLight");
      if (light) {
        document.body.classList.add("has-cursor-light");
        const lx = gsap.quickTo(light, "x", { duration: 1.1, ease: "power3.out" });
        const ly = gsap.quickTo(light, "y", { duration: 1.1, ease: "power3.out" });
        window.addEventListener("pointermove", (e) => { lx(e.clientX); ly(e.clientY); }, { passive: true, signal });
      }
    }

    /* manifesto: palavras acendem no scroll */
    const manifesto = document.getElementById("manifesto");
    if (manifesto && !manifesto.querySelector(".w")) {
      const splitWords = (el: Element) => {
        [...el.childNodes].forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            (node.textContent || "").split(/(\s+)/).forEach((tok) => {
              if (!tok) return;
              if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
              const s = document.createElement("span");
              s.className = "w";
              s.textContent = tok;
              frag.appendChild(s);
            });
            el.replaceChild(frag, node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            splitWords(node as Element);
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

    /* stats dos produtos: números contam ao entrar na tela */
    document.querySelectorAll<HTMLElement>(".panel-stats b[data-count]").forEach((el) => {
      const target = parseInt(el.dataset.count!, 10);
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target, duration: 1.6, ease: "power2.out", snap: { n: 1 },
        onUpdate: () => { el.textContent = "+" + obj.n; },
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });

    /* princípios acendem no centro da tela */
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

    /* magnetic + tilt */
    if (finePointer) {
      document.querySelectorAll(".magnetic").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        el.addEventListener("pointermove", (e) => {
          const ev = e as PointerEvent;
          const r = el.getBoundingClientRect();
          xTo((ev.clientX - (r.left + r.width / 2)) * 0.18);
          yTo((ev.clientY - (r.top + r.height / 2)) * 0.22);
        }, { signal });
        el.addEventListener("pointerleave", () => { xTo(0); yTo(0); }, { signal });
      });

      document.querySelectorAll("[data-tilt]").forEach((wrap) => {
        const card = wrap.querySelector(".device");
        if (!card) return;
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.7, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.7, ease: "power3.out" });
        wrap.addEventListener("pointermove", (e) => {
          const ev = e as PointerEvent;
          const r = wrap.getBoundingClientRect();
          const px = (ev.clientX - r.left) / r.width - 0.5;
          const py = (ev.clientY - r.top) / r.height - 0.5;
          ry(px * 7); rx(-py * 6);
        }, { signal });
        wrap.addEventListener("pointerleave", () => { rx(0); ry(0); }, { signal });
      });
    }

    /* ---------- unique layer ---------- */

    /* cursor customizado com trail físico */
    if (finePointer && !document.querySelector(".cur-dot")) {
      const dot = document.createElement("div");
      dot.className = "cur-dot";
      const ring = document.createElement("div");
      ring.className = "cur-ring";
      ring.innerHTML = "<span></span>";
      document.body.append(dot, ring);
      createdNodes.push(dot, ring);
      document.body.classList.add("custom-cursor");

      const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
      const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
      const rxc = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
      const ryc = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

      let seen = false;
      window.addEventListener("pointermove", (e) => {
        if (!seen) { gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); seen = true; }
        dx(e.clientX); dy(e.clientY); rxc(e.clientX); ryc(e.clientY);
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25, overwrite: "auto" });
      }, { passive: true, signal });

      document.documentElement.addEventListener("mouseleave", () => {
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
      }, { signal });

      const label = ring.querySelector("span")!;
      document.addEventListener("pointerover", (e) => {
        const t = (e.target as Element).closest("a,button,[data-tilt]");
        if (!t) { ring.classList.remove("is-active"); label.textContent = ""; return; }
        ring.classList.add("is-active");
        label.textContent = t.matches('[target="_blank"]') ? "↗" : t.matches("[data-tilt]") ? "VER" : "";
      }, { signal });
    }

    /* headlines skew por velocidade de scroll */
    const skewTargets = document.querySelectorAll(
      ".hero-title, .eco-head h2, .manifesto, .finale h2, .panel-name"
    );
    if (skewTargets.length) {
      gsap.set(skewTargets, { transformOrigin: "left center", force3D: true });
      const setter = gsap.quickSetter(skewTargets, "skewY", "deg");
      const clampV = gsap.utils.clamp(-6, 6);
      const proxy = { s: 0 };
      ScrollTrigger.create({
        onUpdate(self) {
          const v = clampV(self.getVelocity() / -400);
          if (Math.abs(v) > Math.abs(proxy.s)) {
            proxy.s = v;
            gsap.to(proxy, {
              s: 0, duration: 0.8, ease: "power3.out", overwrite: true,
              onUpdate: () => setter(proxy.s),
            });
          }
        },
      });
    }

    /* assinatura desenhada no finale */
    const sig = document.querySelector(".finale-signature");
    if (sig) {
      const sigPaths = sig.querySelectorAll<SVGPathElement>("path[data-draw]");
      sigPaths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(sig.querySelector(".mark-spark"), { scale: 0, transformOrigin: "center" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".finale", start: "top 75%", end: "center center", scrub: 0.5 },
      });
      sigPaths.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, ease: "none" }, i * 0.3));
      tl.to(sig.querySelector(".mark-r"), { opacity: 1, ease: "none" }, 0.55)
        .to(sig.querySelector(".mark-spark"), { opacity: 1, scale: 1, ease: "none" }, 0.65);
    }

    /* HUD: barra de progresso + contador de seção */
    if (!document.querySelector(".scroll-progress")) {
      const bar = document.createElement("div");
      bar.className = "scroll-progress";
      document.body.appendChild(bar);
      createdNodes.push(bar);
      gsap.to(bar, {
        scaleX: 1, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      const secs = ["hero", "ecosystem", "products", "philosophy", "contact"];
      const hud = document.createElement("div");
      hud.className = "section-hud";
      hud.innerHTML = "<b>01</b><span>/ 05</span>";
      document.body.appendChild(hud);
      createdNodes.push(hud);
      const counter = hud.querySelector("b")!;
      secs.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el, start: "top 50%", end: "bottom 50%",
          onToggle(self) {
            if (self.isActive) counter.textContent = String(i + 1).padStart(2, "0");
          },
        });
      });
    }

    /* título do ecossistema letra a letra */
    const ecoH = document.querySelector(".eco-head h2");
    if (ecoH && !ecoH.querySelector(".ch")) {
      const split = (el: Element) => {
        [...el.childNodes].forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            [...(n.textContent || "")].forEach((chr) => {
              if (/\s/.test(chr)) { frag.append(chr); return; }
              const s = document.createElement("span");
              s.className = "ch";
              s.textContent = chr;
              frag.append(s);
            });
            el.replaceChild(frag, n);
          } else if (n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName !== "BR") {
            split(n as Element);
          }
        });
      };
      split(ecoH);
      gsap.from(ecoH.querySelectorAll(".ch"), {
        yPercent: 60, opacity: 0, stagger: 0.03, ease: "power3.out",
        scrollTrigger: { trigger: ecoH, start: "top 85%", end: "top 45%", scrub: 0.4 },
      });
    }

    /* glitch-wipe na navegação entre seções */
    if (!document.querySelector(".glitch-wipe")) {
      const wipe = document.createElement("div");
      wipe.className = "glitch-wipe";
      wipe.innerHTML = "<i></i>";
      document.body.appendChild(wipe);
      createdNodes.push(wipe);
      document.querySelectorAll('.nav-links a[href^="#"], .hero-cta a[href^="#"]').forEach((a) => {
        a.addEventListener("click", () => {
          gsap.timeline()
            .set(wipe, { autoAlpha: 1 })
            .fromTo(wipe.firstChild, { yPercent: -120 }, { yPercent: 400, duration: 0.55, ease: "power2.inOut" })
            .to(wipe, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
        }, { signal });
      });
    }
  });

  /* ---------- refração de vidro segue o mouse ---------- */
  if (finePointer) {
    document.querySelectorAll<HTMLElement>(".eco-card, .panel-caps li, .principle").forEach((el) => {
      el.classList.add("refract");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      }, { passive: true, signal });
    });
  }

  /* ---------- konami → matrix rain ---------- */
  (function konami() {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
                 "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let i = 0;
    window.addEventListener("keydown", (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === seq[i] ? i + 1 : k === seq[0] ? 1 : 0;
      if (i === seq.length) { i = 0; rain(); }
    }, { signal });

    function rain() {
      if (document.querySelector(".matrix")) return;
      const c = document.createElement("canvas");
      c.className = "matrix";
      document.body.appendChild(c);
      createdNodes.push(c);
      const x = c.getContext("2d")!;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      const fs = 16;
      const cols = Math.ceil(innerWidth / fs);
      const drops = Array.from({ length: cols }, () => Math.random() * -40);
      const glyphs = "LRTZETA01{}</>=+*#";
      const flag = { run: true };
      rafFlags.push(flag);
      (function draw() {
        if (!flag.run) return;
        x.fillStyle = "rgba(5,5,5,0.12)";
        x.fillRect(0, 0, innerWidth, innerHeight);
        x.font = fs + "px 'JetBrains Mono', monospace";
        drops.forEach((d, k) => {
          const chr = glyphs[(Math.random() * glyphs.length) | 0];
          x.fillStyle = Math.random() < 0.12 ? "#c9c2ff" : "rgba(139,131,255,0.85)";
          x.fillText(chr, k * fs, d * fs);
          drops[k] = d * fs > innerHeight && Math.random() > 0.975 ? 0 : d + 1;
        });
        requestAnimationFrame(draw);
      })();
      timers.push(setTimeout(() => {
        flag.run = false;
        c.style.transition = "opacity .8s";
        c.style.opacity = "0";
        timers.push(setTimeout(() => c.remove(), 850));
      }, 6000));
    }
  })();

  /* ---------- mini-demos nos cards do ecossistema ---------- */
  (function miniDemos() {
    const cards = document.querySelectorAll(".eco-card");
    const kinds = ["radar", "bars", "calendar", "code"] as const;
    const W = 240, H = 90;

    function rr(x: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, r: number) {
      if (x.roundRect) { x.beginPath(); x.roundRect(px, py, w, h, r); x.fill(); }
      else x.fillRect(px, py, w, h);
    }

    const draw: Record<(typeof kinds)[number], (x: CanvasRenderingContext2D, t: number, a: string) => void> = {
      radar(x, t, a) {
        const cx = 45, cy = 45;
        for (let r = 10; r <= 40; r += 15) {
          x.beginPath();
          x.strokeStyle = `rgba(${a},0.25)`;
          x.arc(cx, cy, r, 0, 7);
          x.stroke();
        }
        const ring = (t * 22) % 40;
        x.beginPath();
        x.strokeStyle = `rgba(${a},${(1 - ring / 40).toFixed(2)})`;
        x.arc(cx, cy, ring, 0, 7);
        x.stroke();
        ([[70, 30], [30, 62], [58, 58]] as const).forEach(([px, py], k) => {
          const o = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + k));
          x.fillStyle = `rgba(${a},${o.toFixed(2)})`;
          x.beginPath(); x.arc(px, py, 3, 0, 7); x.fill();
        });
        x.fillStyle = "rgba(255,255,255,.4)";
        x.font = "10px 'JetBrains Mono', monospace";
        x.fillText("descoberta local", 95, 50);
      },
      bars(x, t, a) {
        [0.3, 0.55, 0.42, 0.7, 0.62, 0.88].forEach((v, k) => {
          const h = v * 58 * Math.min(1, 0.6 + 0.4 * (t * 0.8 + k * 0.1));
          x.fillStyle = `rgba(${a},${(0.35 + 0.55 * (k / 5)).toFixed(2)})`;
          x.fillRect(14 + k * 24, 76 - h, 14, h);
        });
        x.strokeStyle = "rgba(255,255,255,.15)";
        x.beginPath(); x.moveTo(8, 76); x.lineTo(160, 76); x.stroke();
        x.fillStyle = "rgba(255,255,255,.4)";
        x.font = "10px 'JetBrains Mono', monospace";
        x.fillText("receita ↗", 170, 50);
      },
      calendar(x, t, a) {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
          const k = r * 7 + c;
          const lit = (((t * 3) | 0) + k) % 21 < 4;
          x.fillStyle = lit ? `rgba(${a},.6)` : "rgba(255,255,255,.06)";
          rr(x, 12 + c * 22, 14 + r * 22, 16, 16, 4);
        }
        x.fillStyle = "rgba(255,255,255,.4)";
        x.font = "10px 'JetBrains Mono', monospace";
        x.fillText("agenda cheia", 172, 50);
      },
      code(x, t, a) {
        const lines = 7;
        for (let k = 0; k < lines; k++) {
          const w = 40 + ((k * 53 + ((t * 40) | 0)) % 140);
          x.fillStyle = k === (((t * 4) | 0) % lines) ? `rgba(${a},.9)` : "rgba(255,255,255,.12)";
          rr(x, 12, 10 + k * 11, w, 5, 2.5);
        }
        x.fillStyle = `rgba(${a},.9)`;
        x.font = "10px 'JetBrains Mono', monospace";
        x.fillText("zeta build ▊", 176, 50);
      },
    };

    cards.forEach((card, i) => {
      const kind = kinds[i];
      if (!kind || card.querySelector(".eco-demo")) return;
      const c = document.createElement("canvas");
      c.className = "eco-demo";
      c.width = W; c.height = H;
      c.setAttribute("aria-hidden", "true");
      card.appendChild(c);
      createdNodes.push(c);
      const x = c.getContext("2d")!;
      const accCol = i < 2 ? "111,141,255" : "155,125,255";
      let t = 0, raf = 0;
      const flag = { run: false };
      rafFlags.push(flag);

      function frame() {
        if (!flag.run) return;
        t += 1 / 60;
        x.clearRect(0, 0, W, H);
        draw[kind](x, t, accCol);
        raf = requestAnimationFrame(frame);
      }

      const io = new IntersectionObserver(([e]) => {
        flag.run = e.isIntersecting && !reduceMotion;
        cancelAnimationFrame(raf);
        if (flag.run) raf = requestAnimationFrame(frame);
        else { x.clearRect(0, 0, W, H); draw[kind](x, 0.4, accCol); }
      });
      io.observe(c);
      observers.push(io);
    });
  })();

  /* ---------- cleanup ---------- */
  return () => {
    ac.abort();
    rafFlags.forEach((f) => { f.run = false; });
    observers.forEach((o) => o.disconnect());
    timers.forEach(clearTimeout);
    intervals.forEach(clearInterval);
    ctx.revert();
    lenis?.destroy();
    document.documentElement.classList.remove("lenis");
    document.body.classList.remove("custom-cursor", "has-cursor-light");
    createdNodes.forEach((n) => n.remove());
  };
}
