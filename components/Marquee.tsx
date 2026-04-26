export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/5 py-8">
      <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={i}
            className="font-display text-3xl tracking-tightest text-accent-muted md:text-5xl"
          >
            {item}
            <span className="px-8 text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
