"use client";

import { useTranslation } from "@/i18n/use-translation";
import { motion } from "framer-motion";

export function Team() {
  const { t } = useTranslation();

  const members = [
    {
      initials: "RB",
      name: "Ricardo Braz",
      role: t("memberRBRole") as string,
      desc: t("memberRBDesc") as string,
      linkedin: "https://www.linkedin.com/in/ricardo-filipe-braz-0466b4290/",
    },
    {
      initials: "VT",
      name: "Vasco Torres",
      role: t("memberVTRole") as string,
      desc: t("memberVTDesc") as string,
      linkedin: "https://www.linkedin.com/in/vasco-torres-a83b45235/",
    },
  ];

  return (
    <section
      className="py-[120px] bg-zinc-50 border-t border-flow-border max-md:py-20"
      id="equipa"
    >
      <div className="max-w-[1200px] mx-auto px-10 max-md:px-5">
        <div className="flex items-start gap-6 mb-16 max-md:flex-col max-md:gap-0">
          <span
            className="font-heading text-[5rem] leading-[0.8] text-black/[0.04] font-normal shrink-0 -mt-2 max-md:text-[3rem]"
            aria-hidden="true"
          >
            03
          </span>
          <div>
            <span className="inline-block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-flow-accent mb-2">
              {t("teamLabel") as string}
            </span>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal text-flow-text tracking-[-0.02em] text-balance">
              {t("teamTitle") as string}
            </h2>
          </div>
        </div>

        <p className="text-[1.05rem] text-flow-text2 leading-[1.8] max-w-[640px] mb-12">
          {t("teamDesc") as string}
        </p>

        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-4">
          {members.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="p-9 bg-white border border-flow-border rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="w-14 h-14 bg-bg-dark text-flow-accent2 rounded-[14px] flex items-center justify-center font-extrabold text-base shrink-0">
                  {member.initials}
                </span>
                <div>
                  <h4 className="text-base font-bold text-flow-text">
                    {member.name}
                  </h4>
                  <span className="text-[0.82rem] text-flow-text3">
                    {member.role}
                  </span>
                </div>
              </div>
              <p className="text-[0.88rem] text-flow-text2 leading-relaxed mb-4">
                {member.desc}
              </p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener"
                className="text-[0.85rem] font-semibold text-flow-accent no-underline hover:underline"
              >
                LinkedIn &rarr;
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
