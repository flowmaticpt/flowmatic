"use client";

import { useTranslation } from "@/i18n/use-translation";
import { motion } from "framer-motion";

export function Process() {
  const { t } = useTranslation();

  const steps = [
    {
      num: "01",
      title: t("proc1Title") as string,
      desc: t("proc1Desc") as string,
      tag: t("proc1Detail") as string,
    },
    {
      num: "02",
      title: t("proc2Title") as string,
      desc: t("proc2Desc") as string,
      tag: t("proc2Detail") as string,
    },
    {
      num: "03",
      title: t("proc3Title") as string,
      desc: t("proc3Desc") as string,
      tag: t("proc3Detail") as string,
    },
  ];

  return (
    <section className="py-[120px] bg-zinc-50 max-md:py-20" id="processo">
      <div className="max-w-[1200px] mx-auto px-10 max-md:px-5">
        <div className="flex items-start gap-6 mb-16 max-md:flex-col max-md:gap-0">
          <span
            className="font-heading text-[5rem] leading-[0.8] text-black/[0.04] font-normal shrink-0 -mt-2 max-md:text-[3rem]"
            aria-hidden="true"
          >
            02
          </span>
          <div>
            <span className="inline-block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-flow-accent mb-2">
              {t("procLabel") as string}
            </span>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal text-flow-text tracking-[-0.02em] text-balance">
              {t("procTitle") as string}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-md:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="relative p-10 px-8 bg-white border border-flow-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
            >
              <span
                className="absolute -top-[10px] -right-[5px] font-heading text-[7rem] leading-none text-black/[0.03] font-normal pointer-events-none"
                aria-hidden="true"
              >
                {step.num}
              </span>
              <div className="relative z-[1]">
                <h3 className="text-[1.15rem] font-bold text-flow-text mb-3">
                  {step.title}
                </h3>
                <p className="text-[0.88rem] text-flow-text2 leading-[1.7] mb-4">
                  {step.desc}
                </p>
                <span className="inline-block text-[0.72rem] font-bold uppercase tracking-[0.08em] text-flow-accent bg-blue-600/[0.06] py-[5px] px-3.5 rounded-full">
                  {step.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
