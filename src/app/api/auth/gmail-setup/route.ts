import { NextResponse } from "next/server";

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || "";

// Generates the OAuth consent URL with Gmail + Calendar scopes
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

  // Use OOB redirect for manual token copy
  const redirectUri = "urn:ietf:wg:oauth:2.0:oob";

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
    message:
      "Abre o URL abaixo no browser, autoriza com a conta Google, e copia o código de autorização. Depois troca-o por um refresh token usando: curl -s -X POST https://oauth2.googleapis.com/token -d client_id=CLIENT_ID -d client_secret=CLIENT_SECRET -d code=AUTH_CODE -d redirect_uri=urn:ietf:wg:oauth:2.0:oob -d grant_type=authorization_code",
    authUrl,
    scopes,
  });
}
