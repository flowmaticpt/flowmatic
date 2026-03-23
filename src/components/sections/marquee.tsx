const items = [
  "Escolas de Condu\u00e7\u00e3o",
  "Cl\u00ednicas",
  "Gin\u00e1sios",
  "Cooperativas",
  "Restaurantes",
  "Oficinas",
  "Imobili\u00e1rias",
];

export function Marquee() {
  const repeated = [...items, ...items];

  return (
    <div className="bg-flow-accent py-3.5 overflow-hidden whitespace-nowrap" aria-hidden="true">
      <div className="inline-flex gap-8 animate-marquee text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white">
        {repeated.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-4">&bull;</span>}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
