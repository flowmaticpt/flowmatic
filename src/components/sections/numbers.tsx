"use client";

import { useTranslation } from "@/i18n/use-translation";
import { motion } from "framer-motion";

const clients = ["Oficina do Condutor", "EC Vit\u00f3ria", "Grancoop", "Let\u2019s Go"];

export function Numbers() {
  const { t } = useTranslation();

  const stats = [
    { value: "4", label: t("proofStat1") as string },
    { value: "500+", label: t("proofStat2") as string },
    { value: "528", label: t("proofStat3") as string },
  ];

  return (
    <section className="bg-bg-dark py-[100px] pb-20 overflow-hidden" id="prova-social">
      <div className="flex justify-center gap-0 max-w-[1000px] mx-auto mb-14 px-10 max-md:flex-col max-md:gap-8 max-md:px-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ delay: i * 0.08, duration: 0.7 }}
            className={`flex-1 text-center px-8 ${i < stats.length - 1 ? "border-r border-flow-border-light max-md:border-r-0 max-md:border-b max-md:pb-8" : ""}`}
          >
            <span className="block font-heading text-[clamp(3rem,8vw,6rem)] font-normal text-white leading-none mb-3 tabular-nums">
              {stat.value}
            </span>
            <span className="text-[0.82rem] text-flow-white40 uppercase tracking-[0.08em] font-medium">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="overflow-hidden" aria-label="Clientes">
        <div className="inline-flex gap-4 animate-marquee-clients">
          {[...clients, ...clients].map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center py-2.5 px-6 bg-bg-dark2 border border-flow-border-light rounded-full text-[0.85rem] font-semibold text-flow-white70 whitespace-nowrap transition-colors hover:border-flow-accent hover:text-white"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
