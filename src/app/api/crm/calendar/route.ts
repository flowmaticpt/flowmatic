import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 15;

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || "";
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || "";
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN || "";

async function getAccessToken(): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Falha ao renovar token: " + JSON.stringify(data));
  }
  return data.access_token;
}

// GET — list upcoming calendar events (next 30 days)
export async function GET() {
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    return NextResponse.json(
      { error: "Google API não configurada." },
      { status: 500 }
    );
  }

  try {
    const accessToken = await getAccessToken();

    const now = new Date().toISOString();
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&timeMax=${encodeURIComponent(future)}&singleEvents=true&orderBy=startTime&maxResults=20`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const data = await res.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || "Erro Calendar API" },
        { status: data.error.code || 500 }
      );
    }

    const events = (data.items || []).map(
      (e: {
        id: string;
        summary?: string;
        description?: string;
        htmlLink?: string;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
      }) => ({
        id: e.id,
        summary: e.summary || "(sem título)",
        description: e.description || "",
        start: e.start?.dateTime || e.start?.date || "",
        end: e.end?.dateTime || e.end?.date || "",
        link: e.htmlLink || "",
      })
    );

    return NextResponse.json({ events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — create a new calendar event
export async function POST(request: NextRequest) {
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    return NextResponse.json(
      { error: "Google API não configurada." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { summary, description, dateTime, durationMinutes } = body;

    if (!summary || !dateTime) {
      return NextResponse.json(
        { error: "Campos obrigatórios: summary, dateTime" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const startDate = new Date(dateTime);
    const endDate = new Date(
      startDate.getTime() + (durationMinutes || 60) * 60 * 1000
    );

    const event = {
      summary,
      description: description || "",
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Europe/Lisbon",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Europe/Lisbon",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 30 },
          { method: "email", minutes: 60 },
        ],
      },
    };

    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    const data = await res.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || "Erro ao criar evento" },
        { status: data.error.code || 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      summary: data.summary,
      start: data.start?.dateTime || data.start?.date,
      link: data.htmlLink,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
