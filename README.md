# LRT Software

Site institucional da LRT Software — **Next.js 15 + TypeScript + GSAP + Lenis**.

## Stack

- Next.js 15 (App Router, 100% estático no build)
- GSAP + ScrollTrigger (coreografia de scroll)
- Lenis (smooth scroll)
- Metadata API, OG image dinâmica (`next/og`), `sitemap.xml` e `robots.txt` gerados

## Rodar local

```bash
npm install
npm run dev
```

## Deploy

Pronto pra Vercel: importa o repo e deploya — zero config.

## Estrutura

- `app/` — layout, página, metadata routes (OG image, sitemap, robots)
- `components/sections/` — seções da página (server components)
- `lib/motion.ts` — sistema de motion completo (GSAP/Lenis/canvas) com cleanup
- `legacy/` — versão estática original (referência)
