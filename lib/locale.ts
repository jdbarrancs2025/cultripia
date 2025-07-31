import { cookies } from "next/headers";

export const LOCALE_COOKIE = "cultripia-locale";
export const DEFAULT_LOCALE = "es";
export const SUPPORTED_LOCALES = ["en", "es"];

export async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;
  return SUPPORTED_LOCALES.includes(locale || "") ? locale || DEFAULT_LOCALE : DEFAULT_LOCALE;
}

export async function setLocale(locale: string) {
  const cookieStore = await cookies();
  if (SUPPORTED_LOCALES.includes(locale)) {
    cookieStore.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  }
}