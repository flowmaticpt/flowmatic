import { NextResponse } from "next/server";

// TEMPORÁRIO — usar uma vez para iniciar o fluxo OAuth
// Apagar depois de obter o refresh token

export async function GET() {
  const clientId = process.env.GMAIL_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "GMAIL_CLIENT_ID não está definido nas env vars" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: "http://localhost:3000/api/auth/callback",
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
