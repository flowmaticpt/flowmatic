import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.startsWith("https://script.google.com/")) {
    return NextResponse.json({ error: "URL inválido" }, { status: 400 });
  }

  try {
    // 1º redirect manual — verificar se Google pede login
    const firstResponse = await fetch(url, { redirect: "manual" });

    if (firstResponse.status >= 300 && firstResponse.status < 400) {
      const location = firstResponse.headers.get("location") || "";

      // Se redireciona para accounts.google.com → deploy exige autenticação
      if (location.includes("accounts.google.com")) {
        return NextResponse.json(
          {
            error:
              'O Google Apps Script exige login. Vai a Deploy > Manage deployments e muda "Who has access" para "Anyone" (sem conta Google).',
          },
          { status: 403 }
        );
      }

      // Redirect legítimo (ex: script.googleusercontent.com) — seguir
      const finalResponse = await fetch(location, { redirect: "follow" });
      const text = await finalResponse.text();

      return parseAndReturn(text);
    }

    // Sem redirect — resposta direta
    const text = await firstResponse.text();
    return parseAndReturn(text);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Falha ao contactar Google Apps Script: " + message },
      { status: 502 }
    );
  }
}

function parseAndReturn(text: string) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    // Se contém <!doctype ou <html>, é página do Google (login, erro, etc.)
    if (text.toLowerCase().includes("<!doctype") || text.toLowerCase().includes("<html")) {
      return NextResponse.json(
        {
          error:
            'Google retornou uma página HTML em vez de JSON. Verifica que o deploy do Apps Script tem "Who has access: Anyone".',
        },
        { status: 502 }
      );
    }
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
}
