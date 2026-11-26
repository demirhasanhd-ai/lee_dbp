"use client";

import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { dbpPath } from "../lib/dbpPath";

const languages = [
  ["tr", "Türkçe"],
  ["en", "English"],
  ["de", "Deutsch"],
  ["ru", "Русский"],
  ["it", "Italiano"],
  ["ar", "العربية"],
  ["fr", "Français"],
  ["es", "Español"],
] as const;

type Language = (typeof languages)[number][0];
type Translator = {
  libReady: boolean;
  error: boolean;
  readyCallback: () => void;
  resultCallback: () => void;
  translate: (source: string, target: string) => boolean;
  revert: () => void;
};
type TranslationWindow = Window & { __GT?: { translator?: Translator } };

const storageKey = "lee-dbp-language";
const scriptId = "dbp-gtranslate";
let translatorPromise: Promise<Translator> | undefined;
let translationResultListener: ((translator: Translator) => void) | undefined;

function rememberLanguage(language: Language) {
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    // Translation still works when browser storage is unavailable.
  }
}

function loadTranslator(): Promise<Translator> {
  const current = (window as TranslationWindow).__GT?.translator;
  if (current?.libReady) return Promise.resolve(current);
  if (translatorPromise) return translatorPromise;

  translatorPromise = new Promise<Translator>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdn.gtranslate.net/widgets/latest/lib.min.js";
    script.async = true;

    const fail = () => {
      window.clearTimeout(timeout);
      script.remove();
      translatorPromise = undefined;
      reject(new Error("Translation service unavailable"));
    };
    const timeout = window.setTimeout(fail, 15000);
    script.onerror = fail;
    script.onload = () => {
      const translator = (window as TranslationWindow).__GT?.translator;
      if (!translator) return fail();
      const ready = () => {
        window.clearTimeout(timeout);
        resolve(translator);
      };
      if (translator.libReady) ready();
      else translator.readyCallback = ready;
    };
    document.body.appendChild(script);
  });
  return translatorPromise;
}

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>("tr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const request = useRef(0);
  const resultListener = useRef<typeof translationResultListener>(undefined);

  const changeLanguage = useCallback(async (next: Language) => {
    const currentRequest = ++request.current;
    setError(false);
    const current = (window as TranslationWindow).__GT?.translator;
    if (next === "tr") {
      current?.revert();
      setLanguage("tr");
      rememberLanguage("tr");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const translator = await loadTranslator();
      if (request.current !== currentRequest) return;
      resultListener.current = () => {
        if (request.current !== currentRequest || !translator.error) return;
        translator.revert();
        setLanguage("tr");
        rememberLanguage("tr");
        setError(true);
      };
      translationResultListener = resultListener.current;
      // GTranslate keeps one callback until the current translation completes.
      // Forward it to the latest selection if the visitor switches languages quickly.
      translator.resultCallback = () => translationResultListener?.(translator);
      if (!translator.translate("tr", next)) throw new Error("Translation could not start");
      setLanguage(next);
      rememberLanguage(next);
    } catch {
      if (request.current === currentRequest) setError(true);
    } finally {
      if (request.current === currentRequest) setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && saved !== "tr" && languages.some(([code]) => code === saved)) {
        void changeLanguage(saved as Language);
      }
    } catch {
      // Start in Turkish if storage is blocked.
    }
    return () => {
      request.current++;
      if (translationResultListener === resultListener.current) translationResultListener = undefined;
      // Stop observing page text when leaving the public site for a staff panel.
      (window as TranslationWindow).__GT?.translator?.revert();
    };
  }, [changeLanguage]);

  useEffect(() => {
    if (!open) return;
    container.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div className="language-switcher notranslate" translate="no" aria-busy={loading} ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        className="language-trigger"
        type="button"
        ref={trigger}
        aria-label="Site dili / Website language"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        disabled={loading}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <img className="language-flag" src={dbpPath(`/flags/languages/${language}.svg`)} alt="" width={18} height={13} />
        <span>{language.toUpperCase()}</span>
        <ChevronDown size={12} className="language-chevron" aria-hidden="true" />
      </button>
      {open && <div className="language-menu" id={menuId} role="menu" aria-label="Site dili / Website language"
        onKeyDown={(event) => {
          const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
          const index = items.indexOf(document.activeElement as HTMLButtonElement);
          let next: number;
          if (event.key === "ArrowDown") next = (index + 1) % items.length;
          else if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = items.length - 1;
          else return;
          event.preventDefault();
          items[next]?.focus();
        }}
      >
        {languages.map(([code, name]) => <button
          key={code}
          type="button"
          role="menuitemradio"
          aria-checked={language === code}
          tabIndex={-1}
          lang={code}
          onClick={() => {
            setOpen(false);
            trigger.current?.focus();
            if (code !== language) void changeLanguage(code);
          }}
        >
          <img className="language-flag" src={dbpPath(`/flags/languages/${code}.svg`)} alt="" width={18} height={13} />
          <span>{name}</span>
          {language === code && <Check size={13} aria-hidden="true" />}
        </button>)}
      </div>}
      {loading && <span className="sr-only" role="status">Çeviri yükleniyor…</span>}
      {error && <span className="language-error" role="alert">Çeviri hizmetine ulaşılamadı. Lütfen yeniden deneyin.</span>}
    </div>
  );
}
