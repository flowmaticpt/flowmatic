import { NextRequest, NextResponse } from "next/server";

async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correctPassword = process.env.CRM_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (!password || password !== correctPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create HMAC token: hmac(secret, timestamp) for session validation
  const timestamp = Date.now().toString();
  const token = await hmacSha256(correctPassword, timestamp);
  const sessionValue = `${timestamp}.${token}`;

  const response = NextResponse.json({ ok: true });
  response.cookies.set("crm-session", sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
