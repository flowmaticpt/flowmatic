"use client";

import Image from "next/image";
import { useTranslation } from "@/i18n/use-translation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="py-8 bg-bg-dark border-t border-flow-border-light">
      <div className="max-w-[1200px] mx-auto px-10 max-md:px-5 flex items-center justify-between max-md:flex-col max-md:gap-3 max-md:text-center">
        <a href="#" className="flex items-center no-underline">
          <Image
            src="/assets/logo.png"
            alt="Flowmatica"
            width={100}
            height={26}
            className="opacity-50"
          />
        </a>
        <p className="text-xs text-flow-white40">{t("footer") as string}</p>
      </div>
    </footer>
  );
}
