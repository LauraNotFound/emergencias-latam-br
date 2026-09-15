import type { User } from "@supabase/supabase-js";
import { LogIn, LogOut, MessageSquarePlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { PhraseActions } from "@/components/phrase-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export type AppLanguage = "es" | "en";
export type SuggestionCategory = "salud" | "policia" | "registro" | "bancos";

type CategoryOption = {
  id: SuggestionCategory;
  label: string;
};

type Copy = {
  account: string;
  signOut: string;
  suggest: string;
  signInTitle: string;
  signUpTitle: string;
  signInDescription: string;
  signUpDescription: string;
  email: string;
  password: string;
  passwordHint: string;
  signIn: string;
  signUp: string;
  switchToSignUp: string;
  switchToSignIn: string;
  continueGoogle: string;
  working: string;
  confirmEmail: string;
  authError: string;
  suggestionTitle: string;
  suggestionDescription: string;
  category: string;
  chooseCategory: string;
  portuguesePhrase: string;
  translation: string;
  notes: string;
  notesPlaceholder: string;
  submit: string;
  submitted: string;
  suggestionError: string;
  validationError: string;
  close: string;
};

const copyByLanguage: Record<AppLanguage, Copy> = {
  es: {
    account: "Mi cuenta",
    signOut: "Cerrar sesión",
    suggest: "Sugerir una frase",
    signInTitle: "Inicia sesión",
    signUpTitle: "Crea tu cuenta",
    signInDescription: "Inicia sesión para enviar una frase que falta.",
    signUpDescription: "Regístrate para ayudarnos a mejorar esta guía.",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordHint: "Mínimo 8 caracteres",
    signIn: "Iniciar sesión",
    signUp: "Registrarme",
    switchToSignUp: "¿No tienes cuenta? Regístrate",
    switchToSignIn: "¿Ya tienes cuenta? Inicia sesión",
    continueGoogle: "Continuar con Google",
    working: "Espera un momento…",
    confirmEmail: "Revisa tu correo y confirma tu cuenta. Luego podrás iniciar sesión.",
    authError: "No pudimos completar el acceso. Revisa los datos e inténtalo de nuevo.",
    suggestionTitle: "Sugerir una frase",
    suggestionDescription: "Cuéntanos qué necesitaste decir o preguntar en Brasil.",
    category: "Categoría",
    chooseCategory: "Selecciona una categoría",
    portuguesePhrase: "Frase en portugués",
    translation: "Significado en español",
    notes: "Contexto o fase (opcional)",
    notesPlaceholder: "Por ejemplo: al llegar a recepción",
    submit: "Enviar sugerencia",
    submitted: "¡Gracias! Tu sugerencia fue enviada.",
    suggestionError: "No pudimos enviar la sugerencia. Inténtalo de nuevo.",
    validationError: "Completa los campos obligatorios con información válida.",
    close: "Cerrar",
  },
  en: {
    account: "My account",
    signOut: "Sign out",
    suggest: "Suggest a phrase",
    signInTitle: "Sign in",
    signUpTitle: "Create your account",
    signInDescription: "Sign in to submit a missing phrase.",
    signUpDescription: "Register to help us improve this guide.",
    email: "Email",
    password: "Password",
    passwordHint: "At least 8 characters",
    signIn: "Sign in",
    signUp: "Register",
    switchToSignUp: "New here? Create an account",
    switchToSignIn: "Already registered? Sign in",
    continueGoogle: "Continue with Google",
    working: "Please wait…",
    confirmEmail: "Check your email and confirm your account. You can then sign in.",
    authError: "We couldn’t complete sign-in. Check your details and try again.",
    suggestionTitle: "Suggest a phrase",
    suggestionDescription: "Tell us what you needed to say or ask in Brazil.",
    category: "Category",
    chooseCategory: "Choose a category",
    portuguesePhrase: "Phrase in Portuguese",
    translation: "Meaning in English",
    notes: "Context or phase (optional)",
    notesPlaceholder: "For example: when arriving at reception",
    submit: "Send suggestion",
    submitted: "Thank you! Your suggestion was sent.",
    suggestionError: "We couldn’t send your suggestion. Please try again.",
    validationError: "Complete the required fields with valid information.",
    close: "Close",
  },
};

const authSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
});

const suggestionSchema = z.object({
  category: z.enum(["salud", "policia", "registro", "bancos"]),
  phrasePT: z.string().trim().min(2).max(300),
  translation: z.string().trim().min(2).max(500),
  notes: z.string().trim().max(500),
});

export function AccountActions({
  language,
  user,
  onSignIn,
  onSuggest,
  onSignOut,
}: {
  language: AppLanguage;
  user: User | null;
  onSignIn: () => void;
  onSuggest: () => void;
  onSignOut: () => void;
}) {
  const copy = copyByLanguage[language];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" className="h-9 px-3 text-sm" onClick={onSuggest}>
        <MessageSquarePlus aria-hidden="true" size={17} />
        {copy.suggest}
      </Button>
      {user ? (
        <Button type="button" variant="ghost" className="h-9 px-3 text-sm" onClick={onSignOut} title={user.email ?? copy.signOut}>
          <LogOut aria-hidden="true" size={17} />
          {copy.signOut}
        </Button>
      ) : (
        <Button type="button" variant="ghost" className="h-9 px-3 text-sm" onClick={onSignIn}>
          <LogIn aria-hidden="true" size={17} />
          {copy.signIn}
        </Button>
      )}
    </div>
  );
}

export function AuthDialog({
  language,
  open,
  onOpenChange,
  onAuthenticated,
}: {
  language: AppLanguage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: () => void;
}) {
  const copy = copyByLanguage[language];
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [phrasePT, setPhrasePT] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const result = authSchema.safeParse({ email: form.get("email"), password: form.get("password") });
    if (!result.success) {
      setIsError(true);
      setMessage(copy.validationError);
      return;
    }
    setBusy(true);
    const response = mode === "signup"
      ? await supabase.auth.signUp({
          email: result.data.email,
          password: result.data.password,
          options: { emailRedirectTo: window.location.origin },
        })
      : await supabase.auth.signInWithPassword(result.data);
    setBusy(false);
    if (response.error) {
      setIsError(true);
      setMessage(copy.authError);
      return;
    }
    if (mode === "signup" && !response.data.session) {
      setIsError(false);
      setMessage(copy.confirmEmail);
      return;
    }
    onOpenChange(false);
    onAuthenticated();
  }

  async function handleGoogle() {
    setBusy(true);
    setMessage("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setBusy(false);
      setIsError(true);
      setMessage(copy.authError);
      return;
    }
    if (!result.redirected) {
      setBusy(false);
      onOpenChange(false);
      onAuthenticated();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? copy.signInTitle : copy.signUpTitle}</DialogTitle>
          <DialogDescription>{mode === "signin" ? copy.signInDescription : copy.signUpDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">{copy.email}</Label>
            <Input id="auth-email" name="email" type="email" autoComplete="email" maxLength={255} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password">{copy.password}</Label>
            <Input id="auth-password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} maxLength={72} required />
            <p className="text-xs text-muted-foreground">{copy.passwordHint}</p>
          </div>
          {message && <p role="status" className={isError ? "text-sm text-destructive" : "text-sm text-medical"}>{message}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? copy.working : mode === "signin" ? copy.signIn : copy.signUp}</Button>
        </form>
        <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /><span>o / or</span><span className="h-px flex-1 bg-border" /></div>
        <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>{copy.continueGoogle}</Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }}
        >
          {mode === "signin" ? copy.switchToSignUp : copy.switchToSignIn}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function SuggestionDialog({
  language,
  open,
  onOpenChange,
  categories,
  defaultCategory,
}: {
  language: AppLanguage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryOption[];
  defaultCategory?: SuggestionCategory | undefined;
}) {
  const copy = copyByLanguage[language];
  const [category, setCategory] = useState<SuggestionCategory | "">(defaultCategory ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const result = suggestionSchema.safeParse({
      category,
      phrasePT: form.get("phrasePT"),
      translation: form.get("translation"),
      notes: form.get("notes") ?? "",
    });
    if (!result.success) {
      setIsError(true);
      setMessage(copy.validationError);
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("phrase_suggestions").insert({
      category: result.data.category,
      phrase_pt: result.data.phrasePT,
      translation: result.data.translation,
      translation_language: language,
      notes: result.data.notes || null,
    });
    setBusy(false);
    if (error) {
      setIsError(true);
      setMessage(copy.suggestionError);
      return;
    }
    setIsError(false);
    setMessage(copy.submitted);
    event.currentTarget.reset();
    setCategory(defaultCategory ?? "");
    setPhrasePT("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.suggestionTitle}</DialogTitle>
          <DialogDescription>{copy.suggestionDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{copy.category}</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as SuggestionCategory)}>
              <SelectTrigger><SelectValue placeholder={copy.chooseCategory} /></SelectTrigger>
              <SelectContent>{categories.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phrase-pt">{copy.portuguesePhrase}</Label>
            <Textarea
              id="phrase-pt"
              name="phrasePT"
              minLength={2}
              maxLength={300}
              value={phrasePT}
              onChange={(event) => setPhrasePT(event.target.value)}
              required
            />
            <PhraseActions phrase={phrasePT} language={language} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="translation">{copy.translation}</Label>
            <Textarea id="translation" name="translation" minLength={2} maxLength={500} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{copy.notes}</Label>
            <Textarea id="notes" name="notes" maxLength={500} placeholder={copy.notesPlaceholder} />
          </div>
          {message && <p role="status" className={isError ? "text-sm text-destructive" : "text-sm font-medium text-medical"}>{message}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? copy.working : copy.submit}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
