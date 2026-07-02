const ICONS = [
  "react", "nextdotjs", "typescript", "nodedotjs", "postgresql", "supabase",
  "vercel", "stripe", "openai", "tailwindcss", "prisma", "docker",
];

function IconGroup() {
  return (
    <div className="marquee-group">
      {ICONS.map((name) => (
        <img
          key={name}
          src={`https://cdn.simpleicons.org/${name}/8f93a8`}
          alt=""
          width={30}
          height={30}
          loading="lazy"
        />
      ))}
    </div>
  );
}

export default function TechStrip() {
  return (
    <section className="stack-strip" aria-label="Tecnologias que usamos">
      <p className="strip-title" data-reveal>A base de engenharia por trás de cada produto.</p>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <IconGroup />
          <IconGroup />
        </div>
      </div>
    </section>
  );
}
