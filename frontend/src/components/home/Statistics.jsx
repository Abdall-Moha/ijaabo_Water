import { useEffect, useRef, useState } from "react";

function CountUp({ value, suffix = "" }) {
  const [count, setCount] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (
      media.matches ||
      !ref.current ||
      !("IntersectionObserver" in window)
    ) {
      setCount(value);
      return undefined;
    }

    let frame = 0;
    let done = false;

    setCount(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (done || !entry.isIntersecting) return;

        observer.disconnect();

        const start = performance.now();

        const animate = (now) => {
          if (done) return;

          const progress = Math.min(1, Math.max(0, (now - start) / 1800));

          setCount(Math.round(value * (1 - (1 - progress) ** 3)));

          if (progress < 1) {
            frame = requestAnimationFrame(animate);
          } else {
            done = true;
          }
        };

        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.25 },
    );

    observer.observe(ref.current);

    const showImmediately = () => {
      if (media.matches) {
        done = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        setCount(value);
      }
    };

    media.addEventListener("change", showImmediately);

    return () => {
      done = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", showImmediately);
    };
  }, [value, suffix]);

  return (
    <strong
      ref={ref}
      className="block text-[clamp(2rem,4vw,3.7rem)] font-semibold leading-[1.25] tracking-[-0.05em] text-[#ffdf65]"
      aria-label={`${value.toLocaleString("en-US")}${suffix}`}
    >
      <span aria-hidden="true">
        {count.toLocaleString("en-US")}
        {suffix === "%" ? (
          <small className="ml-[3px] text-[1.7rem]">%</small>
        ) : (
          suffix
        )}
      </span>
    </strong>
  );
}

const stats = [
  [12, "+", "Years of service"],
  [5000, "+", "Households reached"],
  [114, "", "Jobs created"],
  [15, "%", "Free / subsidized water"],
];

export default function Statistics() {
  return (
    <section
      aria-label="Ijaabo Water at a glance"
      className="my-7 rounded-[2rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center py-10 sm:py-12"
    >
      <div className="mx-auto grid w-[calc(100%-32px)] max-w-[1180px] grid-cols-2 gap-6 rounded-[26px] border-4 border-[#f8fcff] bg-[linear-gradient(rgba(0,72,150,0.92),rgba(0,88,188,0.88)),url('/home-water-splash.png')] bg-cover bg-center p-6 shadow-[0_12px_30px_#003d6230] sm:gap-8 sm:p-8 md:grid-cols-4 md:px-10 md:py-[34px]">
        {stats.map(([value, suffix, label], index) => (
          <div
            key={label}
            className={`min-w-0 ${
              index % 2 === 1
                ? "border-l border-white/25 pl-4 sm:pl-6 md:pl-7"
                : "md:border-l md:border-white/25 md:pl-7"
            } ${index === 0 ? "md:border-l-0 md:pl-0" : ""} ${
              index === 2 ? "md:border-l md:border-white/25 md:pl-7" : ""
            }`}
          >
            <CountUp value={value} suffix={suffix} />

            <span className="mt-3 block max-w-[195px] text-sm font-semibold leading-[1.65] text-white/95 sm:text-[0.94rem]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
