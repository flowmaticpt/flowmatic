import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 15;

function getGmailCreds() {
  return {
    clientId: process.env.GMAIL_CLIENT_ID || "",
    clientSecret: process.env.GMAIL_CLIENT_SECRET || "",
    refreshToken: process.env.GMAIL_REFRESH_TOKEN || "",
  };
}

async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret, refreshToken } = getGmailCreds();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Falha ao renovar token: " + JSON.stringify(data));
  }
  return data.access_token;
}

interface GmailHeader {
  name: string;
  value: string;
}

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  payload?: {
    headers?: GmailHeader[];
  };
}

export async function GET(request: NextRequest) {
  const { clientId, clientSecret, refreshToken } = getGmailCreds();
  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json(
      { error: "Gmail API não configurada. Adiciona GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET e GMAIL_REFRESH_TOKEN nas env vars." },
      { status: 500 }
    );
  }

  try {
    const accessToken = await getAccessToken();
    const max = request.nextUrl.searchParams.get("max") || "30";

    // Listar mensagens recentes
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${max}&labelIds=INBOX`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const listData = await listRes.json();

    if (!listData.messages || listData.messages.length === 0) {
      return NextResponse.json({
        emails: [],
        lastSync: new Date().toISOString(),
      });
    }

    // Buscar detalhes de cada mensagem em paralelo (metadata only = rápido)
    const emails = await Promise.all(
      listData.messages.map(async (msg: { id: string }) => {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const msgData: GmailMessage = await msgRes.json();

        const headers = msgData.payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

        const isUnread = msgData.labelIds?.includes("UNREAD") || false;

        return {
          id: msgData.id,
          threadId: msgData.threadId,
          from: getHeader("From"),
          subject: getHeader("Subject") || "(sem assunto)",
          snippet: msgData.snippet || "",
          date: getHeader("Date"),
          unread: isUnread,
          gmailUrl: "https://mail.google.com/mail/u/0/#inbox/" + msgData.threadId,
        };
      })
    );

    return NextResponse.json(
      {
        emails,
        lastSync: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Falha Gmail API: " + message },
      { status: 500 }
    );
  }
}
