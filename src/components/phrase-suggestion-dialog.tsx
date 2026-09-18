import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type Language = "es" | "pt" | "en";
type SourceLanguage = "es" | "pt" | "en";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyYSkmYIEGJH43VRGpFvN3p6q4SNFVSa7IqS_B4KAiYYNFwUbNY70-OcXQqfWPi53G5/exec";

const languageOptions: Array<{ value: SourceLanguage; label: string }> = [
  { value: "es", label: "Español" },
  { value: "pt", label: "Português" },
  { value: "en", label: "English" },
];

const copy = {
  es: {
    title: "Sugerir frase",
    description: "Comparte una frase útil para esta guía.",
    category: "Categoría",
    sourceLanguage: "Idioma de origen",
    source: "Frase de origen",
    translation: "Traducción",
    fields: { es: "Español", pt: "Português", en: "English" },
    send: "Enviar sugerencia",
    sending: "Enviando…",
    successTitle: "¡Sugerencia enviada!",
    successText: "Gracias por ayudar a mejorar esta guía.",
    error: "No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.",
  },
  pt: {
    title: "Sugerir frase",
    description: "Compartilhe uma frase útil para este guia.",
    category: "Categoria",
    sourceLanguage: "Idioma de origem",
    source: "Frase de origem",
    translation: "Tradução",
    fields: { es: "Español", pt: "Português", en: "English" },
    send: "Enviar sugestão",
    sending: "Enviando…",
    successTitle: "Sugestão enviada!",
    successText: "Obrigado por ajudar a melhorar este guia.",
    error: "Não foi possível enviar. Verifique sua conexão e tente novamente.",
  },
  en: {
    title: "Suggest a phrase",
    description: "Share a useful phrase for this guide.",
    category: "Category",
    sourceLanguage: "Source language",
    source: "Source phrase",
    translation: "Translation",
    fields: { es: "Español", pt: "Português", en: "English" },
    send: "Send suggestion",
    sending: "Sending…",
    successTitle: "Suggestion sent!",
    successText: "Thank you for helping improve this guide.",
    error: "Could not send your suggestion. Check your connection and try again.",
  },
};

export function PhraseSuggestionDialog({
  open,
  onOpenChange,
  category,
  language,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  language: Language;
}) {
  const text = copy[language];
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>("es");
  const [phrases, setPhrases] = useState<Record<SourceLanguage, string>>({ es: "", pt: "", en: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    if (open) return;
    setSourceLanguage("es");
    setPhrases({ es: "", pt: "", en: "" });
    setStatus("idle");
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    const translations = Object.fromEntries(
      Object.entries(phrases).filter(([key]) => key !== sourceLanguage),
    );
    const payload = {
      category,
      sourceLanguage,
      sourcePhrase: phrases[sourceLanguage],
      translations,
      phraseES: phrases.es,
      phrasePT: phrases.pt,
      phraseEN: phrases.en,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setStatus("success");
      window.setTimeout(() => onOpenChange(false), 1800);
    } catch {
      setStatus("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        {status === "success" ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center" role="status" aria-live="polite">
            <CheckCircle2 className="text-primary" aria-hidden="true" size={42} />
            <p className="mt-4 text-lg font-bold text-foreground">{text.successTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">{text.successText}</p>
          </div>
        ) : <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="suggestion-category">{text.category}</Label>
            <Input id="suggestion-category" name="category" value={category} readOnly />
          </div>
          <div className="space-y-2">
            <Label>{text.sourceLanguage}</Label>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1" role="group" aria-label={text.sourceLanguage}>
              {languageOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={sourceLanguage === option.value ? "default" : "ghost"}
                  className="h-10 min-h-0 px-2 text-xs sm:text-sm"
                  aria-pressed={sourceLanguage === option.value}
                  onClick={() => setSourceLanguage(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          {([sourceLanguage, ...languageOptions.map(({ value }) => value).filter((value) => value !== sourceLanguage)] as SourceLanguage[]).map((fieldLanguage) => {
            const isSource = fieldLanguage === sourceLanguage;
            const id = `suggestion-${fieldLanguage}`;
            return (
              <div key={fieldLanguage} className="space-y-2">
                <Label htmlFor={id}>
                  {isSource ? text.source : text.translation} · {text.fields[fieldLanguage]}
                </Label>
                <Textarea
                  id={id}
                  name={`phrase${fieldLanguage.toUpperCase()}`}
                  value={phrases[fieldLanguage]}
                  onChange={(event) => setPhrases((current) => ({ ...current, [fieldLanguage]: event.target.value }))}
                  minLength={2}
                  maxLength={500}
                  required
                  disabled={status === "sending"}
                />
              </div>
            );
          })}
          {status === "error" && <p className="text-sm font-medium text-destructive" role="alert">{text.error}</p>}
          <Button type="submit" className="w-full" disabled={status === "sending"}>
            {status === "sending" && <LoaderCircle className="animate-spin" aria-hidden="true" size={18} />}
            {status === "sending" ? text.sending : text.send}
          </Button>
        </form>}
      </DialogContent>
    </Dialog>
  );
}