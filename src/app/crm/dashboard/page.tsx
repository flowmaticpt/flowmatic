"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CrmDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/crm/logout", { method: "POST" });
    router.push("/crm/login");
  }

  return (
    <div className="h-screen flex flex-col bg-bg-dark">
      <header className="flex items-center justify-between px-4 py-2 border-b border-flow-border-light">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="Flowmatica"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-sm font-medium text-white">CRM</span>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="text-flow-white40 hover:text-white"
        >
          Sair
        </Button>
      </header>
      <iframe
        src="/crm/index.html"
        className="flex-1 w-full border-none"
        title="Flowmatica CRM"
      />
    </div>
  );
}
