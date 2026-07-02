export default function LogoMark({ id, size = 34 }: { id: string; size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="16" y1="20" x2="44" y2="56">
          <stop stopColor="#6f8dff" />
          <stop offset="1" stopColor="#9b7dff" />
        </linearGradient>
      </defs>
      <path className="mark-l" d="M16 20 V48 Q16 56 24 56 H44" stroke={`url(#${id})`} strokeWidth="5" strokeLinecap="round" />
      <path className="mark-t" d="M34 16 H48 Q56 16 56 24 V38" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path className="mark-spark" d="M56 40 l1.8 3.4 3.4 1.8 -3.4 1.8 -1.8 3.4 -1.8 -3.4 -3.4 -1.8 3.4 -1.8 Z" fill="#9b7dff" />
      <text className="mark-r" x="33" y="45" textAnchor="middle" fontFamily="Satoshi, sans-serif" fontWeight="900" fontSize="28" fill="#fff">R</text>
    </svg>
  );
}
