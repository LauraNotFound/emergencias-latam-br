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

type Language = "es" | "pt";

const copy = {
  es: {
    title: "Sugerir frase",
    description: "Comparte una frase útil para esta guía.",
    category: "Categoría",
    spanish: "Frase en español",
    portuguese: "Traducción al portugués",
    send: "Enviar sugerencia",
  },
  pt: {
    title: "Sugerir frase",
    description: "Compartilhe uma frase útil para este guia.",
    category: "Categoria",
    spanish: "Frase em espanhol",
    portuguese: "Tradução para o português",
    send: "Enviar sugestão",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <form action="PLACEHOLDER_WEBHOOK_URL" method="POST" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="suggestion-category">{text.category}</Label>
            <Input id="suggestion-category" name="category" value={category} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suggestion-spanish">{text.spanish}</Label>
            <Textarea id="suggestion-spanish" name="phraseES" minLength={2} maxLength={500} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suggestion-portuguese">{text.portuguese}</Label>
            <Textarea id="suggestion-portuguese" name="phrasePT" minLength={2} maxLength={500} required />
          </div>
          <Button type="submit" className="w-full">{text.send}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}