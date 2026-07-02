import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lab · LRT Software",
  description: "Notas de engenharia do time LRT: decisões técnicas, migrações e bastidores dos produtos.",
};

const POSTS = [
  {
    slug: "migrando-para-next-15",
    title: "Migrando a landing pra Next.js 15 sem perder uma animação",
    desc: "Como portamos um sistema de motion GSAP + Lenis inteiro pra React Server Components — e o que ganhamos de graça no caminho.",
    date: "2026-07-02",
  },
];

export default function LabPage() {
  return (
    <>
      <Link className="lab-back" href="/">← voltar pro site</Link>
      <h1>Lab</h1>
      <p className="lab-intro">
        Notas de engenharia: decisões técnicas, migrações e bastidores dos produtos.
      </p>
      <div className="lab-list">
        {POSTS.map((p) => (
          <Link key={p.slug} className="lab-card" href={`/lab/${p.slug}`}>
            <time dateTime={p.date}>{p.date}</time>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
