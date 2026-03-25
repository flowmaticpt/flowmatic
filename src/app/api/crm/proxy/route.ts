import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30; // Vercel timeout: 30s (Apps Script pode demorar)

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.startsWith("https://script.google.com/")) {
    return NextResponse.json({ error: "URL inválido" }, { status: 400 });
  }

  try {
    // Google Apps Script faz redirect 302 — seguir com redirect: "follow"
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "FlowmaticCRM/1.0",
      },
    });

    const text = await response.text();

    // Tentar parsear como JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Resposta não é JSON válido", raw: text.substring(0, 200) },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Falha ao contactar Google Apps Script: " + message },
      { status: 502 }
    );
  }
}
