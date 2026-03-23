"use client";

import { useState } from "react";
import Image from "next/image";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useTranslation } from "@/i18n/use-translation";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrolled } = useScrollPosition(50);
  const { t, lang, toggleLanguage } = useTranslation();

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-48px)] max-w-[900px] bg-[rgba(10,15,28,0.85)] backdrop-blur-[24px] border border-flow-border-light rounded-full transition-shadow duration-300 md:max-md:top-[10px] md:max-md:w-[calc(100%-24px)] md:max-md:rounded-2xl max-md:top-[10px] max-md:w-[calc(100%-24px)] max-md:rounded-2xl ${scrolled ? "shadow-[0_8px_40px_rgba(0,0,0,0.3)]" : ""}`}
    >
      <div className="flex items-center justify-between h-14 pl-6 pr-2 max-md:h-[52px] max-md:pl-4 max-md:pr-1.5">
        <a href="#" className="flex items-center no-underline">
          <Image
            src="/assets/logo.png"
            alt="Flowmatica"
            width={140}
            height={36}
            className="h-7 w-auto"
            priority
          />
        </a>

        {/* Desktop nav */}
        <div
          className={`hidden md:flex items-center gap-6 ${mobileOpen ? "!flex flex-col absolute top-[60px] left-2 right-2 bg-[rgba(10,15,28,0.98)] backdrop-blur-[24px] p-5 gap-4 rounded-2xl border border-flow-border-light animate-fade-up" : ""}`}
        >
          <ul className="flex list-none gap-6">
            <li>
              <a
                href="#servicos"
                onClick={handleLinkClick}
                className="text-flow-white70 no-underline text-[0.82rem] font-medium transition-colors hover:text-white"
              >
                {t("navServicos") as string}
              </a>
            </li>
            <li>
              <a
                href="#processo"
                onClick={handleLinkClick}
                className="text-flow-white70 no-underline text-[0.82rem] font-medium transition-colors hover:text-white"
              >
                {t("navProcesso") as string}
              </a>
            </li>
            <li>
              <a
                href="#equipa"
                onClick={handleLinkClick}
                className="text-flow-white70 no-underline text-[0.82rem] font-medium transition-colors hover:text-white"
              >
                {t("navEquipa") as string}
              </a>
            </li>
          </ul>
          <a
            href="#contacto"
            onClick={handleLinkClick}
            className="text-[0.82rem] font-semibold text-bg-dark no-underline bg-white py-2 px-5 rounded-full transition-opacity hover:opacity-85"
          >
            {t("navCta") as string}
          </a>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="md:hidden flex flex-col absolute top-[60px] left-2 right-2 bg-[rgba(10,15,28,0.98)] backdrop-blur-[24px] p-5 gap-4 rounded-2xl border border-flow-border-light animate-fade-up">
            <ul className="flex flex-col list-none gap-2">
              <li>
                <a
                  href="#servicos"
                  onClick={handleLinkClick}
                  className="text-flow-white70 no-underline text-[0.82rem] font-medium transition-colors hover:text-white"
                >
                  {t("navServicos") as string}
                </a>
              </li>
              <li>
                <a
                  href="#processo"
                  onClick={handleLinkClick}
                  className="text-flow-white70 no-underline text-[0.82rem] font-medium transition-colors hover:text-white"
                >
                  {t("navProcesso") as string}
                </a>
              </li>
              <li>
                <a
                  href="#equipa"
                  onClick={handleLinkClick}
                  className="text-flow-white70 no-underline text-[0.82rem] font-medium transition-colors hover:text-white"
                >
                  {t("navEquipa") as string}
                </a>
              </li>
            </ul>
            <a
              href="#contacto"
              onClick={handleLinkClick}
              className="text-[0.82rem] font-semibold text-bg-dark no-underline bg-white py-2 px-5 rounded-xl text-center transition-opacity hover:opacity-85"
            >
              {t("navCta") as string}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="font-sans text-[0.72rem] font-bold tracking-[0.08em] text-flow-white40 bg-transparent border border-flow-border-light py-[5px] px-3 rounded-full cursor-pointer transition-colors hover:text-white max-md:mr-2"
          >
            {lang === "pt" ? "EN" : "PT"}
          </button>
          <button
            className="md:hidden flex flex-col gap-1 bg-none border-none cursor-pointer p-2.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <span className="block w-[18px] h-[1.5px] bg-white" />
            <span className="block w-[18px] h-[1.5px] bg-white" />
            <span className="block w-[18px] h-[1.5px] bg-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
