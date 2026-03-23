"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CrmLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/crm/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/crm/dashboard");
      } else {
        setError("Password incorreta.");
      }
    } catch {
      setError("Erro de ligação. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/logo.png"
            alt="Flowmatica"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <h1 className="text-xl font-semibold text-white">CRM Flowmatica</h1>
          <p className="text-sm text-flow-white40">
            Introduz a password para aceder.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="h-10 bg-white/5 border-flow-border-light text-white placeholder:text-flow-white40"
          />

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full h-10 bg-flow-accent hover:bg-flow-accent/80 text-white font-medium"
          >
            {loading ? "A verificar..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
