export function Chips({ items, label, strong = false }: { items: string[]; label: string; strong?: boolean }) {
  return (
    <div>
      <p className="label mb-3">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`rounded-full px-3 py-1 font-mono text-[0.74rem] ${
              strong ? "bg-accent text-bg" : "border border-line text-muted"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
