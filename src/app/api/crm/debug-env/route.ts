import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GMAIL_CLIENT_ID || "";
  const secret = process.env.GMAIL_CLIENT_SECRET || "";
  const token = process.env.GMAIL_REFRESH_TOKEN || "";

  return NextResponse.json({
    GMAIL_CLIENT_ID: clientId ? clientId.substring(0, 8) + "..." : "(empty)",
    GMAIL_CLIENT_SECRET: secret ? secret.substring(0, 6) + "..." : "(empty)",
    GMAIL_REFRESH_TOKEN: token ? token.substring(0, 6) + "..." : "(empty)",
    allEnvKeys: Object.keys(process.env).filter(k => k.includes("GMAIL") || k.includes("CRM")).sort(),
  });
}
