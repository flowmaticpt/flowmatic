import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.startsWith("https://script.google.com/")) {
    return NextResponse.json(
      { error: "URL inválido" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url, { redirect: "follow" });
    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Falha ao contactar Google Apps Script" },
      { status: 502 }
    );
  }
}
