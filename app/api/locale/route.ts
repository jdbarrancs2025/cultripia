import { NextResponse } from "next/server";
import { LOCALE_COOKIE, SUPPORTED_LOCALES } from "@/lib/locale";

export async function POST(request: Request) {
  const { locale } = await request.json();

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return NextResponse.json(
      { error: "Invalid locale" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  return response;
}