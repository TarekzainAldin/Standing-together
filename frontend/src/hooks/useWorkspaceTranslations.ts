// hooks/useWorkspaceTranslations.ts
import { useState, useEffect } from "react";
import { WorkspaceType } from "@/types/api.type";

const LIBRETRANSLATE_URL = "https://libretranslate.com/translate";

// نوع workspace مع translations
export type TranslatedWorkspace = WorkspaceType & {
  translations?: Record<string, string>;
};

export function useWorkspaceTranslations(workspaces: WorkspaceType[], lang: string) {
  const [translatedWorkspaces, setTranslatedWorkspaces] = useState<Record<string, TranslatedWorkspace>>({});
  const [loading, setLoading] = useState(false);

  const cacheKey = "workspaceTranslations";

  // تحميل cache من localStorage
  const loadCache = (): Record<string, Record<string, string>> => {
    try {
      const cache = localStorage.getItem(cacheKey);
      return cache ? JSON.parse(cache) : {};
    } catch {
      return {};
    }
  };

  // حفظ cache في localStorage
  const saveCache = (cache: Record<string, Record<string, string>>) => {
    localStorage.setItem(cacheKey, JSON.stringify(cache));
  };

  useEffect(() => {
    if (!workspaces.length) return;

    setLoading(true);

    // تعريف translateName داخل useEffect لتجنب ESLint warning
    const translateName = async (name: string, targetLang: string) => {
      if (targetLang === "en") return name;

      const cache = loadCache();
      if (cache[name]?.[targetLang]) return cache[name][targetLang];

      try {
        const res = await fetch(LIBRETRANSLATE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: name, source: "en", target: targetLang, format: "text" }),
        });
        const data = await res.json();
        const translation = data.translatedText;

        // تحديث cache
        cache[name] = { ...(cache[name] || {}), [targetLang]: translation };
        saveCache(cache);

        return translation;
      } catch {
        return name; // fallback
      }
    };

    const loadTranslations = async () => {
      const newTranslated: Record<string, TranslatedWorkspace> = {};
      for (const ws of workspaces) {
        const translation = await translateName(ws.name, lang);
        newTranslated[ws._id] = { ...ws, translations: { [lang]: translation, en: ws.name } };
      }
      setTranslatedWorkspaces(newTranslated);
      setLoading(false);
    };

    loadTranslations();
  }, [workspaces, lang]); // ESLint لا يعطي تحذير لأن translateName داخل useEffect

  return { translatedWorkspaces, loading };
}
