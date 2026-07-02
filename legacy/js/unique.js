/* LRT Software · unique layer
   Cursor físico, skew por velocidade de scroll, assinatura scrubbed, seed
   procedural por sessão, HUD de progresso, refração, som, konami, glitch-wipe
   e mini-demos. Carrega depois de main.js; usa gsap/ScrollTrigger globais. */

(() => {
  "use strict";

  const reduceMotion =
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    new URLSearchParams(location.search).has("static");
  const finePointer = matchMedia("(pointer: fine)").matches;
  const hasGsap = typeof gsap !== "undefined";
  const hasST = hasGsap && typeof ScrollTrigger !== "undefined";

  /* ---------- 5. seed procedural: cada sessão nasce com um acento único ---------- */
  (function proceduralSeed() {
    let seed = sessionStorage.getItem("lrt-seed");
    if (seed === null) {
      seed = Math.random().toFixed(4);
      sessionStorage.setItem("lrt-seed", seed);
    }
    seed = parseFloat(seed);
    const shift = Math.round((seed - 0.5) * 28); /* -14° .. +14° dentro da família azul-violeta */
    const root = document.documentElement;
    root.style.setProperty("--acc-a", `hsl(${227 + shift} 100% 72%)`);
    root.style.setProperty("--acc-b", `hsl(${258 + shift} 100% 74%)`);
    console.log(
      `%cLRT · sessão única #${Math.round(seed * 9999)} · hue ${shift > 0 ? "+" : ""}${shift}°`,
      "color:#9b7dff;font-weight:bold"
    );
  })();

  /* ---------- 1. cursor customizado com trail físico ---------- */
  if (finePointer && !reduceMotion && hasGsap) (function cursor() {
    const dot = document.createElement("div");
    dot.className = "cur-dot";
    const ring = document.createElement("div");
    ring.className = "cur-ring";
    ring.innerHTML = "<span></span>";
    document.body.append(dot, ring);
    document.body.classList.add("custom-cursor");

    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let seen = false;
    window.addEventListener("pointermove", (e) => {
      if (!seen) { gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); seen = true; }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25, overwrite: "auto" });
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", () => {
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
    });

    const label = ring.querySelector("span");
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("a,button,[data-tilt]");
      if (!t) { ring.classList.remove("is-active"); label.textContent = ""; return; }
      ring.classList.add("is-active");
      label.textContent = t.matches('[target="_blank"]') ? "↗" : t.matches("[data-tilt]") ? "VER" : "";
    });
  })();

  /* ---------- 2. headlines reagem à velocidade do scroll ---------- */
  if (!reduceMotion && hasST) (function velocitySkew() {
    const targets = document.querySelectorAll(
      ".hero-title, .eco-head h2, .manifesto, .finale h2, .panel-name"
    );
    if (!targets.length) return;
    gsap.set(targets, { transformOrigin: "left center", force3D: true });
    const setter = gsap.quickSetter(targets, "skewY", "deg");
    const clamp = gsap.utils.clamp(-6, 6);
    const proxy = { s: 0 };
    ScrollTrigger.create({
      onUpdate(self) {
        const v = clamp(self.getVelocity() / -400);
        if (Math.abs(v) > Math.abs(proxy.s)) {
          proxy.s = v;
          gsap.to(proxy, {
            s: 0, duration: 0.8, ease: "power3.out", overwrite: true,
            onUpdate: () => setter(proxy.s),
          });
        }
      },
    });
  })();

  /* ---------- 3. assinatura: o monograma se desenha no scroll do finale ---------- */
  (function signature() {
    const sig = document.querySelector(".finale-signature");
    if (!sig || reduceMotion || !hasST) return;
    const paths = sig.querySelectorAll("path[data-draw]");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.set(sig.querySelector(".mark-spark"), { scale: 0, transformOrigin: "center" });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".finale", start: "top 75%", end: "center center", scrub: 0.5 },
    });
    paths.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, ease: "none" }, i * 0.3));
    tl.to(sig.querySelector(".mark-r"), { opacity: 1, ease: "none" }, 0.55)
      .to(sig.querySelector(".mark-spark"), { opacity: 1, scale: 1, ease: "none" }, 0.65);
  })();

  /* ---------- 6. scrollytelling: HUD de progresso + título por letra ---------- */
  if (!reduceMotion && hasST) (function scrolly() {
    /* barra de progresso global */
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    gsap.to(bar, {
      scaleX: 1, ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });

    /* contador de seção (01 / 05) */
    const secs = ["hero", "ecosystem", "products", "philosophy", "contact"];
    const hud = document.createElement("div");
    hud.className = "section-hud";
    hud.innerHTML = "<b>01</b><span>/ 05</span>";
    document.body.appendChild(hud);
    const counter = hud.querySelector("b");
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

    /* título do ecossistema entra letra a letra, scrubbed */
    const ecoH = document.querySelector(".eco-head h2");
    if (ecoH) {
      const split = (el) => {
        [...el.childNodes].forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            [...n.textContent].forEach((ch) => {
              if (/\s/.test(ch)) { frag.append(ch); return; }
              const s = document.createElement("span");
              s.className = "ch";
              s.textContent = ch;
              frag.append(s);
            });
            el.replaceChild(frag, n);
          } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName !== "BR") {
            split(n);
          }
        });
      };
      split(ecoH);
      gsap.from(ecoH.querySelectorAll(".ch"), {
        yPercent: 60, opacity: 0, stagger: 0.03, ease: "power3.out",
        scrollTrigger: { trigger: ecoH, start: "top 85%", end: "top 45%", scrub: 0.4 },
      });
    }
  })();

  /* ---------- 4. refração de vidro segue o mouse ---------- */
  if (finePointer) {
    document.querySelectorAll(".eco-card, .panel-caps li, .principle").forEach((el) => {
      el.classList.add("refract");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      }, { passive: true });
    });
  }

  /* ---------- 7. sound design opcional (WebAudio, sem libs) ---------- */
  (function sound() {
    const btn = document.getElementById("soundToggle");
    if (!btn) return;
    let ctx = null;
    let on = localStorage.getItem("lrt-sound") === "1";
    const icon = btn.querySelector("i");

    function paint() {
      icon.className = on ? "ph ph-speaker-simple-high" : "ph ph-speaker-simple-slash";
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Desativar sons da interface" : "Ativar sons da interface");
    }
    paint();

    function beep(freq, dur, gain, type) {
      if (!on) return;
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type || "sine";
        o.frequency.value = freq;
        g.gain.setValueAtTime(gain, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + dur);
      } catch (_) { /* áudio bloqueado: silêncio */ }
    }

    btn.addEventListener("click", () => {
      on = !on;
      localStorage.setItem("lrt-sound", on ? "1" : "0");
      paint();
      if (on) beep(880, 0.12, 0.05, "sine");
    });

    let last = null;
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("a,button");
      if (!t || t === last) { if (!t) last = null; return; }
      last = t;
      beep(2200, 0.04, 0.012, "sine");
    });
    document.addEventListener("click", (e) => {
      if (e.target.closest("a,button")) beep(520, 0.09, 0.03, "triangle");
    });
  })();

  /* ---------- 8. konami: ↑↑↓↓←→←→BA → chuva digital LRT ---------- */
  (function konami() {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
                 "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let i = 0;
    window.addEventListener("keydown", (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === seq[i] ? i + 1 : k === seq[0] ? 1 : 0;
      if (i === seq.length) { i = 0; rain(); }
    });

    function rain() {
      if (document.querySelector(".matrix")) return;
      const c = document.createElement("canvas");
      c.className = "matrix";
      document.body.appendChild(c);
      const x = c.getContext("2d");
      const dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      const fs = 16;
      const cols = Math.ceil(innerWidth / fs);
      const drops = Array.from({ length: cols }, () => Math.random() * -40);
      const glyphs = "LRTZETA01{}</>=+*#";
      let run = true;
      (function draw() {
        if (!run) return;
        x.fillStyle = "rgba(5,5,5,0.12)";
        x.fillRect(0, 0, innerWidth, innerHeight);
        x.font = fs + "px 'JetBrains Mono', monospace";
        drops.forEach((d, k) => {
          const ch = glyphs[(Math.random() * glyphs.length) | 0];
          x.fillStyle = Math.random() < 0.12 ? "#c9c2ff" : "rgba(139,131,255,0.85)";
          x.fillText(ch, k * fs, d * fs);
          drops[k] = d * fs > innerHeight && Math.random() > 0.975 ? 0 : d + 1;
        });
        requestAnimationFrame(draw);
      })();
      setTimeout(() => {
        run = false;
        c.style.transition = "opacity .8s";
        c.style.opacity = "0";
        setTimeout(() => c.remove(), 850);
      }, 6000);
    }
  })();

  /* ---------- 9. glitch-wipe ao navegar entre seções ---------- */
  if (!reduceMotion && hasGsap) (function glitchWipe() {
    const wipe = document.createElement("div");
    wipe.className = "glitch-wipe";
    wipe.innerHTML = "<i></i>";
    document.body.appendChild(wipe);
    document.querySelectorAll('.nav-links a[href^="#"], .hero-cta a[href^="#"]').forEach((a) => {
      a.addEventListener("click", () => {
        gsap.timeline()
          .set(wipe, { autoAlpha: 1 })
          .fromTo(wipe.firstChild, { yPercent: -120 }, { yPercent: 400, duration: 0.55, ease: "power2.inOut" })
          .to(wipe, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
      });
    });
  })();

  /* ---------- 10. mini-demos ao vivo nos cards do ecossistema ---------- */
  (function miniDemos() {
    const cards = document.querySelectorAll(".eco-card");
    const kinds = ["radar", "bars", "calendar", "code"];
    const W = 240, H = 90;

    function rr(x, px, py, w, h, r) {
      if (x.roundRect) { x.beginPath(); x.roundRect(px, py, w, h, r); x.fill(); }
      else x.fillRect(px, py, w, h);
    }

    const draw = {
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
        [[70, 30], [30, 62], [58, 58]].forEach(([px, py], k) => {
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
      if (!kind) return;
      const c = document.createElement("canvas");
      c.className = "eco-demo";
      c.width = W; c.height = H;
      c.setAttribute("aria-hidden", "true");
      card.appendChild(c);
      const x = c.getContext("2d");
      const acc = i < 2 ? "111,141,255" : "155,125,255";
      let t = 0, run = false, raf = 0;

      function frame() {
        if (!run) return;
        t += 1 / 60;
        x.clearRect(0, 0, W, H);
        draw[kind](x, t, acc);
        raf = requestAnimationFrame(frame);
      }

      new IntersectionObserver(([e]) => {
        run = e.isIntersecting && !reduceMotion;
        cancelAnimationFrame(raf);
        if (run) raf = requestAnimationFrame(frame);
        else { x.clearRect(0, 0, W, H); draw[kind](x, 0.4, acc); }
      }).observe(c);
    });
  })();
})();
