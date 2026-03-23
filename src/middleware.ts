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

async function isValidSession(
  cookie: string,
  secret: string
): Promise<boolean> {
  const parts = cookie.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, token] = parts;
  const expectedToken = await hmacSha256(secret, timestamp);

  if (token !== expectedToken) return false;

  // Check if token is less than 7 days old
  const age = Date.now() - parseInt(timestamp, 10);
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return age >= 0 && age < sevenDays;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page, API routes, and static CRM assets
  if (
    pathname.startsWith("/crm/login") ||
    pathname.startsWith("/api/crm/") ||
    pathname.endsWith(".html") ||
    pathname.endsWith(".gs")
  ) {
    return NextResponse.next();
  }

  const session = req.cookies.get("crm-session")?.value;
  const secret = process.env.CRM_PASSWORD;

  if (!secret || !session || !(await isValidSession(session, secret))) {
    const loginUrl = new URL("/crm/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/crm", "/crm/:path*"],
};
