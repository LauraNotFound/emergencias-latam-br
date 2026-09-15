import { ExternalLink, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PhraseActionsProps = {
  phrase: string;
  language: "es" | "en";
  compact?: boolean;
};

const actionCopy = {
  es: {
    listen: "Escuchar en portugués",
    speaking: "Reproduciendo",
    translate: "Traducir en Google Translate",
  },
  en: {
    listen: "Listen in Portuguese",
    speaking: "Playing",
    translate: "Translate in Google Translate",
  },
};

export function PhraseActions({ phrase, language, compact = false }: PhraseActionsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const copy = actionCopy[language];
  const normalizedPhrase = phrase.trim();
  const enabled = normalizedPhrase.length >= 2;
  const translateUrl = `https://translate.google.com/?sl=pt&tl=${language}&text=${encodeURIComponent(normalizedPhrase)}&op=translate`;

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = () => {
    if (!enabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(normalizedPhrase);
    utterance.lang = "pt-BR";
    const brazilianVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase() === "pt-br");
    if (brazilianVoice) utterance.voice = brazilianVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-wrap items-center gap-2" onClick={(event) => event.stopPropagation()}>
      <Button
        type="button"
        variant="outline"
        className={cn("h-9 gap-2 px-3 text-xs", isSpeaking && "border-primary bg-primary/10 text-primary")}
        onClick={speak}
        disabled={!enabled}
        aria-label={isSpeaking ? copy.speaking : copy.listen}
        aria-pressed={isSpeaking}
        title={copy.listen}
      >
        <Volume2 aria-hidden="true" size={16} />
        {isSpeaking ? (
          <span className="audio-waves" aria-hidden="true"><i /><i /><i /></span>
        ) : !compact ? copy.listen : null}
      </Button>
      {enabled ? (
        <Button asChild variant="ghost" className="h-9 gap-1.5 px-3 text-xs">
          <a href={translateUrl} target="_blank" rel="noreferrer" aria-label={copy.translate}>
            {compact ? (language === "es" ? "Traducir" : "Translate") : copy.translate}
            <ExternalLink aria-hidden="true" size={14} />
          </a>
        </Button>
      ) : (
        <Button type="button" variant="ghost" className="h-9 gap-1.5 px-3 text-xs" disabled>
          {language === "es" ? "Traducir" : "Translate"}
          <ExternalLink aria-hidden="true" size={14} />
        </Button>
      )}
    </div>
  );
}