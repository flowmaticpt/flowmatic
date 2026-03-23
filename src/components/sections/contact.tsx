"use client";

import { useTranslation } from "@/i18n/use-translation";
import { motion } from "framer-motion";

export function Contact() {
  const { t } = useTranslation();

  return (
    <section className="bg-bg-dark text-white py-[120px] max-md:py-20" id="contacto">
      <div className="max-w-[1200px] mx-auto px-10 max-md:px-5">
        <div className="grid grid-cols-2 gap-20 items-start max-md:grid-cols-1 max-md:gap-10">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-flow-accent2 mb-2">
              {t("contactLabel") as string}
            </span>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] text-white mb-4">
              {t("contactTitle") as string}
            </h2>
            <p className="text-[0.95rem] text-flow-white70 leading-[1.8] mb-9">
              {t("contactDesc") as string}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="mailto:flowmaticpt@gmail.com"
                className="inline-flex py-2.5 px-5 bg-bg-dark2 border border-flow-border-light rounded-full text-[0.85rem] text-flow-white70 no-underline transition-colors hover:border-flow-accent hover:text-white"
              >
                flowmaticpt@gmail.com
              </a>
              <a
                href="tel:+351935447498"
                className="inline-flex py-2.5 px-5 bg-bg-dark2 border border-flow-border-light rounded-full text-[0.85rem] text-flow-white70 no-underline transition-colors hover:border-flow-accent hover:text-white"
              >
                +351&nbsp;935&nbsp;447&nbsp;498
              </a>
              <span className="inline-flex py-2.5 px-5 bg-bg-dark2 border border-flow-border-light rounded-full text-[0.85rem] text-flow-white70 cursor-default">
                Portugal
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="bg-bg-dark2 border border-flow-border-light rounded-2xl p-9"
            action="https://formspree.io/f/mlgpakwp"
            method="POST"
          >
            <div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
              <div className="mb-4">
                <label
                  htmlFor="nome"
                  className="block text-[0.78rem] font-semibold text-flow-white70 mb-2 uppercase tracking-[0.06em]"
                >
                  {t("formNome") as string}
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  autoComplete="name"
                  required
                  className="w-full py-3 px-4 font-sans text-[0.9rem] bg-white/[0.04] border border-flow-border-light rounded-[10px] text-white transition-all placeholder:text-flow-white40 focus:outline-none focus:border-flow-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-[0.78rem] font-semibold text-flow-white70 mb-2 uppercase tracking-[0.06em]"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  required
                  className="w-full py-3 px-4 font-sans text-[0.9rem] bg-white/[0.04] border border-flow-border-light rounded-[10px] text-white transition-all placeholder:text-flow-white40 focus:outline-none focus:border-flow-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="empresa"
                className="block text-[0.78rem] font-semibold text-flow-white70 mb-2 uppercase tracking-[0.06em]"
              >
                {t("formEmpresa") as string}
              </label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                autoComplete="organization"
                className="w-full py-3 px-4 font-sans text-[0.9rem] bg-white/[0.04] border border-flow-border-light rounded-[10px] text-white transition-all placeholder:text-flow-white40 focus:outline-none focus:border-flow-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="mensagem"
                className="block text-[0.78rem] font-semibold text-flow-white70 mb-2 uppercase tracking-[0.06em]"
              >
                {t("formMensagem") as string}
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={3}
                className="w-full py-3 px-4 font-sans text-[0.9rem] bg-white/[0.04] border border-flow-border-light rounded-[10px] text-white transition-all resize-y placeholder:text-flow-white40 focus:outline-none focus:border-flow-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
              />
            </div>
            <button
              type="submit"
              className="w-full text-center inline-block font-sans text-[0.9rem] font-semibold text-white bg-flow-accent py-3.5 px-8 border-none rounded-full cursor-pointer no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(37,99,235,0.3)] active:translate-y-0"
            >
              {t("formBtn") as string}
            </button>
            <p className="text-center text-[0.75rem] text-flow-white40 mt-3">
              {t("formNote") as string}
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
