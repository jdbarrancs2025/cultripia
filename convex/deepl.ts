import { action } from "./_generated/server"
import { v } from "convex/values"
import { api } from "./_generated/api"

// Type definitions for DeepL API response
interface DeepLTranslation {
  text: string
  detected_source_language?: string
}

interface DeepLResponse {
  translations: DeepLTranslation[]
}

export const translateText = action({
  args: {
    text: v.string(),
    targetLang: v.union(v.literal("EN"), v.literal("ES")),
    sourceLang: v.optional(v.union(v.literal("EN"), v.literal("ES"))),
  },
  handler: async (ctx, args): Promise<{ translatedText: string; detectedSourceLang?: string }> => {
    const apiKey = process.env.DEEPL_API_KEY
    
    if (!apiKey) {
      throw new Error("DeepL API key not configured")
    }

    // DeepL Free API endpoint
    const url = "https://api-free.deepl.com/v2/translate"
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `DeepL-Auth-Key ${apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text: args.text,
          target_lang: args.targetLang,
          ...(args.sourceLang && { source_lang: args.sourceLang }),
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        // Log only the status code to avoid exposing sensitive information
        console.error("DeepL API error - Status:", response.status)
        throw new Error(`Translation failed: ${response.status}`)
      }

      const data = await response.json() as DeepLResponse
      
      if (!data.translations || data.translations.length === 0) {
        throw new Error("No translation returned")
      }

      return {
        translatedText: data.translations[0].text,
        detectedSourceLang: data.translations[0].detected_source_language,
      }
    } catch (error) {
      // Log error type without details to avoid exposing sensitive information
      console.error("Translation error - Type:", error instanceof Error ? error.constructor.name : "Unknown")
      throw new Error("Failed to translate text. Please try again.")
    }
  },
})

export const translateExperienceContent = action({
  args: {
    title: v.string(),
    description: v.string(),
    sourceLang: v.union(v.literal("EN"), v.literal("ES")),
  },
  handler: async (ctx, args): Promise<{ translatedTitle: string; translatedDescription: string; targetLang: "EN" | "ES" }> => {
    const targetLang = args.sourceLang === "EN" ? "ES" : "EN"
    
    try {
      // Translate both title and description in parallel
      const [titleResult, descResult] = await Promise.all([
        ctx.runAction(api.deepl.translateText, {
          text: args.title,
          targetLang,
          sourceLang: args.sourceLang,
        }),
        ctx.runAction(api.deepl.translateText, {
          text: args.description,
          targetLang,
          sourceLang: args.sourceLang,
        }),
      ])

      return {
        translatedTitle: titleResult.translatedText,
        translatedDescription: descResult.translatedText,
        targetLang,
      }
    } catch (error) {
      // Log error type without details to avoid exposing sensitive information
      console.error("Experience translation error - Type:", error instanceof Error ? error.constructor.name : "Unknown")
      throw error
    }
  },
})