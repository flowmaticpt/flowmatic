import { NextRequest, NextResponse } from "next/server";

// TEMPORÁRIO — usar uma vez para trocar o código por tokens
// Apagar depois de obter o refresh token

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código não fornecido" }, { status: 400 });
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GMAIL_CLIENT_ID || "",
      client_secret: process.env.GMAIL_CLIENT_SECRET || "",
      redirect_uri: "http://localhost:3000/api/auth/callback",
      grant_type: "authorization_code",
    }),
  });

  const tokens = await response.json();

  if (tokens.error) {
    return NextResponse.json(
      { error: tokens.error, description: tokens.error_description },
      { status: 400 }
    );
  }

  // Mostrar os tokens — copiar o refresh_token para as env vars da Vercel
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head><title>Gmail OAuth — Tokens</title></head>
<body style="font-family: monospace; padding: 2rem; max-width: 800px; margin: 0 auto;">
  <h2>Tokens obtidos com sucesso!</h2>
  <p><strong>Copia o refresh_token e adiciona como GMAIL_REFRESH_TOKEN nas env vars da Vercel.</strong></p>
  <pre style="background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow-x: auto;">${JSON.stringify(tokens, null, 2)}</pre>
  <p style="color: #666; margin-top: 1rem;">Depois de copiar, apaga os ficheiros:<br>
  <code>src/app/api/auth/gmail-setup/route.ts</code><br>
  <code>src/app/api/auth/callback/route.ts</code></p>
</body>
</html>`,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}
