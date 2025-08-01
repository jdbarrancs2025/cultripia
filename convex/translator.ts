import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Type definitions for Microsoft Translator API response
interface TranslatorResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
  detectedLanguage?: {
    language: string;
    score: number;
  };
}

export const translateText = action({
  args: {
    text: v.string(),
    targetLang: v.union(v.literal("EN"), v.literal("ES")),
    sourceLang: v.optional(v.union(v.literal("EN"), v.literal("ES"))),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ translatedText: string; detectedSourceLang?: string }> => {
    const apiKey = process.env.AZURE_TRANSLATOR_KEY;
    const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT || "https://api.cognitive.microsofttranslator.com/";
    const region = process.env.AZURE_TRANSLATOR_REGION || "global";

    if (!apiKey) {
      throw new Error("Microsoft Translator API key not configured");
    }

    // Map language codes to Microsoft Translator format
    const langMap = {
      EN: "en",
      ES: "es",
    };

    const targetLangCode = langMap[args.targetLang];
    const sourceLangCode = args.sourceLang ? langMap[args.sourceLang] : undefined;

    // Microsoft Translator API endpoint
    const url = `${endpoint}translate?api-version=3.0&to=${targetLangCode}${
      sourceLangCode ? `&from=${sourceLangCode}` : ""
    }`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Ocp-Apim-Subscription-Region": region,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ text: args.text }]),
      });

      if (!response.ok) {
        const error = await response.text();
        // Log only the status code to avoid exposing sensitive information
        console.error("Microsoft Translator API error - Status:", response.status);
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = (await response.json()) as TranslatorResponse[];

      if (!data || data.length === 0 || !data[0].translations || data[0].translations.length === 0) {
        throw new Error("No translation returned");
      }

      const result = data[0];
      const detectedLang = result.detectedLanguage?.language;

      return {
        translatedText: result.translations[0].text,
        detectedSourceLang: detectedLang ? detectedLang.toUpperCase() : undefined,
      };
    } catch (error) {
      // Log error type without details to avoid exposing sensitive information
      console.error(
        "Translation error - Type:",
        error instanceof Error ? error.constructor.name : "Unknown",
      );
      throw new Error("Failed to translate text. Please try again.");
    }
  },
});

export const translateExperienceContent = action({
  args: {
    title: v.string(),
    description: v.string(),
    sourceLang: v.union(v.literal("EN"), v.literal("ES")),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    translatedTitle: string;
    translatedDescription: string;
    targetLang: "EN" | "ES";
  }> => {
    const targetLang = args.sourceLang === "EN" ? "ES" : "EN";

    try {
      // Translate both title and description in parallel
      const [titleResult, descResult] = await Promise.all([
        ctx.runAction(api.translator.translateText, {
          text: args.title,
          targetLang,
          sourceLang: args.sourceLang,
        }),
        ctx.runAction(api.translator.translateText, {
          text: args.description,
          targetLang,
          sourceLang: args.sourceLang,
        }),
      ]);

      return {
        translatedTitle: titleResult.translatedText,
        translatedDescription: descResult.translatedText,
        targetLang,
      };
    } catch (error) {
      // Log error type without details to avoid exposing sensitive information
      console.error(
        "Experience translation error - Type:",
        error instanceof Error ? error.constructor.name : "Unknown",
      );
      throw error;
    }
  },
});