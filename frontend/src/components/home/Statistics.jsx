const stats = [
  ["12+", "Years of service"],
  ["5,000+", "Households reached"],
  ["114", "Jobs created"],
  ["15%", "Free / subsidized water"],
];

export default function Statistics() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto grid w-[calc(100%-2.25rem)] grid-cols-2 gap-y-5 py-6 sm:w-[calc(100%-3rem)] sm:max-w-[1200px] sm:grid-cols-4 sm:py-8">
        {stats.map(([value, label], index) => (
          <div className={`flex min-h-12 flex-col justify-center gap-1 border-slate-200 pl-3 sm:pl-6 ${index % 2 === 0 ? "border-l-0 pl-0" : "border-l"} ${index > 1 ? "sm:border-l" : "sm:border-l"} ${index === 0 ? "sm:border-l-0 sm:pl-0" : ""}`} key={label}>
            <b className="text-2xl leading-none font-bold tracking-tight text-navy sm:text-3xl">{value}</b>
            <span className="text-xs text-slate-600 sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
