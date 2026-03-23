"use client";

import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useTranslation } from "@/i18n/use-translation";

export function ScrollToTop() {
  const { scrollY } = useScrollPosition();
  const { t } = useTranslation();
  const visible = scrollY > 600;

  return (
    <button
      className={`fixed bottom-8 right-8 w-12 h-12 bg-white text-bg-dark border-none rounded-full cursor-pointer flex items-center justify-center z-[90] shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-[3px] max-md:bottom-5 max-md:right-5 max-md:w-11 max-md:h-11 ${visible ? "opacity-100 visible" : "opacity-0 invisible"}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("scrollTopLabel") as string}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 16V4M10 4L4 10M10 4L16 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
