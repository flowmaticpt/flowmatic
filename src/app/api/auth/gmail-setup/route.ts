import { NextResponse } from "next/server";

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || "";

// TEMPORÁRIO — gera URL de consentimento OAuth com scopes Gmail + Calendar
export async function GET() {
  if (!GMAIL_CLIENT_ID) {
    return NextResponse.json(
      { error: "GMAIL_CLIENT_ID não configurado nas env vars." },
      { status: 500 }
    );
  }

  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  const redirectUri = "http://localhost:3000/api/auth/callback";

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
    }).toString();

  return NextResponse.json({
    message: "Abre o URL abaixo no browser e autoriza com a conta Google. O callback vai mostrar o refresh_token.",
    authUrl,
    scopes,
  });
}
