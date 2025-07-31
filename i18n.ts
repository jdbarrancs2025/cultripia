import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locale";

export default getRequestConfig(async () => {
  // Get locale from cookie
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = SUPPORTED_LOCALES.includes(cookieLocale || "") ? cookieLocale : DEFAULT_LOCALE;
  
  return {
    locale: locale!,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
