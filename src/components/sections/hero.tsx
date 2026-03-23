"use client";

import { useTranslation } from "@/i18n/use-translation";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { MapVisual } from "./map-visual";

export function Hero() {
  const { t } = useTranslation();

  return (
    <header className="min-h-screen flex flex-col justify-center relative overflow-hidden py-[120px] pb-20 max-md:min-h-auto max-md:py-[120px] max-md:pb-[60px]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-bg-dark z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(37,99,235,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 70%, rgba(99,102,241,0.06) 0%, transparent 70%), #0a0f1c",
        }}
      />

      {/* Shooting stars — 5 layers */}
      <ShootingStars
        starColor="#60a5fa"
        trailColor="#2563eb"
        minSpeed={15}
        maxSpeed={35}
        minDelay={800}
        maxDelay={2500}
        starWidth={12}
        className="z-[1]"
      />
      <ShootingStars
        starColor="#a78bfa"
        trailColor="#6366f1"
        minSpeed={10}
        maxSpeed={25}
        minDelay={1500}
        maxDelay={3500}
        className="z-[1]"
      />
      <ShootingStars
        starColor="#38bdf8"
        trailColor="#0ea5e9"
        minSpeed={20}
        maxSpeed={40}
        minDelay={1000}
        maxDelay={3000}
        starWidth={14}
        className="z-[1]"
      />
      <ShootingStars
        starColor="#818cf8"
        trailColor="#4f46e5"
        minSpeed={8}
        maxSpeed={20}
        minDelay={2000}
        maxDelay={5000}
        starWidth={8}
        className="z-[1]"
      />
      <ShootingStars
        starColor="#c084fc"
        trailColor="#7c3aed"
        minSpeed={25}
        maxSpeed={45}
        minDelay={1200}
        maxDelay={4000}
        starWidth={16}
        starHeight={2}
        className="z-[1]"
      />

      {/* Content */}
      <div className="relative z-[2] max-w-[700px] mx-auto px-10 text-center max-md:px-5">
        <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-flow-accent2 border border-blue-400/20 py-1.5 px-4 rounded-full mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:bg-flow-accent2 before:rounded-full before:animate-pulse-dot">
          {t("heroBadge") as string}
        </span>
        <h1 className="font-heading text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[1.05] text-white tracking-[-0.03em] mb-8 max-md:text-[clamp(2rem,8vw,2.8rem)]">
          {t("heroTitle") as string}{" "}
          <em className="italic bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t("heroTitleEm") as string}
          </em>
          ?
        </h1>
        <p className="text-[1.05rem] text-flow-white70 leading-[1.7] max-w-[540px] mx-auto">
          {t("heroDesc") as string}
        </p>
      </div>

      {/* Map visual */}
      <MapVisual />

      {/* Bottom CTA */}
      <div className="relative z-[2] flex items-center justify-center gap-6 flex-wrap px-10 max-md:px-5 max-md:flex-col">
        <a
          href="#contacto"
          className="inline-block font-sans text-base font-semibold text-white bg-flow-accent py-4 px-9 border-none rounded-full no-underline transition-all shadow-[0_4px_24px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(37,99,235,0.3)]"
        >
          {t("heroCardBtn") as string}
        </a>
        <span className="text-[0.82rem] text-flow-white40">
          {t("heroCardDesc") as string}
        </span>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 max-md:hidden"
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-scroll-hint" />
      </div>
    </header>
  );
}
