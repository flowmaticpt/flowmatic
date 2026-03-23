"use client";

import { useTranslation } from "@/i18n/use-translation";
import { motion } from "framer-motion";

export function Services() {
  const { t } = useTranslation();

  const services = [
    {
      tag: t("svcEscolaTag") as string,
      title: t("svcEscolaTitle") as string,
      items: t("svcEscolaItems") as unknown as string[],
    },
    {
      tag: t("svcClinicTag") as string,
      title: t("svcClinicTitle") as string,
      items: t("svcClinicItems") as unknown as string[],
    },
    {
      tag: t("svcGymTag") as string,
      title: t("svcGymTitle") as string,
      items: t("svcGymItems") as unknown as string[],
    },
  ];

  return (
    <section className="py-[120px] bg-zinc-50 max-md:py-20" id="servicos">
      <div className="max-w-[1200px] mx-auto px-10 max-md:px-5">
        <div className="flex items-start gap-6 mb-16 max-md:flex-col max-md:gap-0">
          <span
            className="font-heading text-[5rem] leading-[0.8] text-black/[0.04] font-normal shrink-0 -mt-2 max-md:text-[3rem]"
            aria-hidden="true"
          >
            01
          </span>
          <div>
            <span className="inline-block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-flow-accent mb-2">
              {t("svcLabel") as string}
            </span>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal text-flow-text tracking-[-0.02em] text-balance">
              {t("svcTitle") as string}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="grid grid-cols-2 gap-10 p-10 bg-white border border-flow-border rounded-2xl transition-all duration-300 hover:translate-x-2 hover:shadow-[-8px_0_0_#2563eb,0_4px_20px_rgba(0,0,0,0.04)] max-md:grid-cols-1 max-md:gap-5 max-md:p-7"
            >
              <div className="flex flex-col">
                <span className="inline-block w-fit text-[0.68rem] font-bold uppercase tracking-[0.12em] text-flow-accent bg-blue-600/[0.06] py-1 px-3 rounded-full mb-3">
                  {svc.tag}
                </span>
                <h3 className="text-[1.15rem] font-semibold text-flow-text leading-[1.4]">
                  {svc.title}
                </h3>
              </div>
              <ul className="list-none self-center">
                {svc.items.map((item, j) => (
                  <li
                    key={j}
                    className={`text-[0.88rem] text-flow-text2 py-2 pl-5 relative ${j < svc.items.length - 1 ? "border-b border-flow-border" : ""} before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:bg-flow-accent before:rounded-full`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ delay: 0.24, duration: 0.7 }}
            className="flex flex-col gap-2 bg-gradient-to-br from-blue-600/[0.04] to-indigo-500/[0.03] border border-dashed border-blue-600/15 rounded-2xl items-start p-10 transition-all duration-300 hover:shadow-[-8px_0_0_#2563eb] hover:border-flow-accent"
          >
            <h3 className="text-[1.1rem] font-semibold text-flow-text">
              {t("svcOutroTitle") as string}
            </h3>
            <p className="text-[0.9rem] text-flow-text2 leading-relaxed">
              {t("svcOutroDesc") as string}
            </p>
            <a
              href="#contacto"
              className="text-[0.85rem] font-semibold text-flow-accent no-underline hover:underline"
            >
              {t("svcOutroLink") as string}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
