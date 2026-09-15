import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  Cross,
  ExternalLink,
  HeartPulse,
  Landmark,
  Languages,
  MapPin,
  Moon,
  ShieldAlert,
  Sun,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import {
  AccountActions,
  AuthDialog,
  SuggestionDialog,
  type SuggestionCategory,
} from "@/components/account-suggestion-dialogs";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  phase: string;
  phaseEN: string;
  phrasePT: string;
  phraseES: string;
  phraseEN: string;
};

type Category = {
  id: string;
  title: string;
  titleEN: string;
  shortTitle: string;
  shortTitleEN: string;
  description: string;
  descriptionEN: string;
  icon: LucideIcon;
  color: "medical" | "emergency" | "document" | "bank";
  mapSearchQuery: string;
  steps: Step[];
};

const categories: Category[] = [
  {
    id: "salud",
    title: "Salud",
    titleEN: "Health",
    shortTitle: "centro médico",
    shortTitleEN: "medical center",
    description: "Atención médica y farmacias",
    descriptionEN: "Medical care and pharmacies",
    icon: HeartPulse,
    color: "medical",
    mapSearchQuery: "hospital",
    steps: [
      {
        id: "salud-1",
        phase: "Recepción",
        phaseEN: "Reception",
        phrasePT: "Onde posso receber atendimento médico?",
        phraseES: "¿Dónde puedo recibir atención médica?",
        phraseEN: "Where can I receive medical care?",
      },
      {
        id: "salud-2",
        phase: "Triaje",
        phaseEN: "Triage",
        phrasePT: "Estou com dor aqui. Preciso de atendimento urgente.",
        phraseES: "Tengo dolor aquí. Necesito atención urgente.",
        phraseEN: "I have pain here. I need urgent care.",
      },
      {
        id: "salud-3",
        phase: "Consulta",
        phaseEN: "Consultation",
        phrasePT: "Quais são os meus sintomas e o diagnóstico?",
        phraseES: "¿Cuáles son mis síntomas y el diagnóstico?",
        phraseEN: "What are my symptoms and diagnosis?",
      },
      {
        id: "salud-4",
        phase: "Medicamentos",
        phaseEN: "Medication",
        phrasePT: "Onde fica a farmácia mais próxima?",
        phraseES: "¿Dónde está la farmacia más cercana?",
        phraseEN: "Where is the nearest pharmacy?",
      },
    ],
  },
  {
    id: "policia",
    title: "Policía / Denuncias",
    titleEN: "Police / Reports",
    shortTitle: "comisaría",
    shortTitleEN: "police station",
    description: "Emergencias y denuncias",
    descriptionEN: "Emergencies and police reports",
    icon: ShieldAlert,
    color: "emergency",
    mapSearchQuery: "delegacia de policia",
    steps: [
      {
        id: "policia-1",
        phase: "Llegada",
        phaseEN: "Arrival",
        phrasePT: "Preciso registrar um boletim de ocorrência.",
        phraseES: "Necesito presentar una denuncia policial.",
        phraseEN: "I need to file a police report.",
      },
      {
        id: "policia-2",
        phase: "Relato",
        phaseEN: "Statement",
        phrasePT: "Isto aconteceu hoje neste endereço.",
        phraseES: "Esto ocurrió hoy en esta dirección.",
        phraseEN: "This happened today at this address.",
      },
      {
        id: "policia-3",
        phase: "Documentos",
        phaseEN: "Documents",
        phrasePT: "Meu documento foi roubado. Esta é uma cópia.",
        phraseES: "Me robaron el documento. Esta es una copia.",
        phraseEN: "My document was stolen. This is a copy.",
      },
      {
        id: "policia-4",
        phase: "Comprobante",
        phaseEN: "Receipt",
        phrasePT: "Posso receber uma cópia do boletim de ocorrência?",
        phraseES: "¿Puedo recibir una copia de la denuncia?",
        phraseEN: "Can I receive a copy of the police report?",
      },
    ],
  },
  {
    id: "registro",
    title: "Registro Migratorio",
    titleEN: "Immigration Registration",
    shortTitle: "Policía Federal",
    shortTitleEN: "Federal Police office",
    description: "Trámites en la Polícia Federal",
    descriptionEN: "Procedures at the Federal Police",
    icon: Building2,
    color: "document",
    mapSearchQuery: "policia federal",
    steps: [
      {
        id: "registro-1",
        phase: "Información",
        phaseEN: "Information",
        phrasePT: "Preciso fazer meu registro migratório.",
        phraseES: "Necesito hacer mi registro migratorio.",
        phraseEN: "I need to complete my immigration registration.",
      },
      {
        id: "registro-2",
        phase: "Turno",
        phaseEN: "Appointment",
        phrasePT: "Tenho um agendamento. Onde devo aguardar?",
        phraseES: "Tengo una cita. ¿Dónde debo esperar?",
        phraseEN: "I have an appointment. Where should I wait?",
      },
      {
        id: "registro-3",
        phase: "Documentos",
        phaseEN: "Documents",
        phrasePT: "Estes são meu passaporte e comprovante de residência.",
        phraseES: "Estos son mi pasaporte y comprobante de domicilio.",
        phraseEN: "These are my passport and proof of address.",
      },
      {
        id: "registro-4",
        phase: "Seguimiento",
        phaseEN: "Follow-up",
        phrasePT: "Como posso acompanhar o andamento do pedido?",
        phraseES: "¿Cómo puedo consultar el estado de la solicitud?",
        phraseEN: "How can I check the status of my application?",
      },
    ],
  },
  {
    id: "bancos",
    title: "Bancos",
    titleEN: "Banks",
    shortTitle: "banco",
    shortTitleEN: "bank",
    description: "Cuenta, tarjeta y atención",
    descriptionEN: "Accounts, cards, and assistance",
    icon: Landmark,
    color: "bank",
    mapSearchQuery: "banco",
    steps: [
      {
        id: "bancos-1",
        phase: "Recepción",
        phaseEN: "Reception",
        phrasePT: "Gostaria de abrir uma conta bancária.",
        phraseES: "Quisiera abrir una cuenta bancaria.",
        phraseEN: "I would like to open a bank account.",
      },
      {
        id: "bancos-2",
        phase: "Requisitos",
        phaseEN: "Requirements",
        phrasePT: "Quais documentos são necessários para estrangeiros?",
        phraseES: "¿Qué documentos necesitan las personas extranjeras?",
        phraseEN: "What documents do foreign nationals need?",
      },
      {
        id: "bancos-3",
        phase: "Tarjeta",
        phaseEN: "Card",
        phrasePT: "Meu cartão foi bloqueado. Podem me ajudar?",
        phraseES: "Mi tarjeta fue bloqueada. ¿Pueden ayudarme?",
        phraseEN: "My card was blocked. Can you help me?",
      },
      {
        id: "bancos-4",
        phase: "Seguridad",
        phaseEN: "Security",
        phrasePT: "Não reconheço esta transação na minha conta.",
        phraseES: "No reconozco esta transacción en mi cuenta.",
        phraseEN: "I do not recognize this transaction on my account.",
      },
    ],
  },
];

const colorStyles = {
  medical: "bg-medical-soft text-medical border-medical/20",
  emergency: "bg-emergency-soft text-emergency border-emergency/20",
  document: "bg-document-soft text-document border-document/20",
  bank: "bg-bank-soft text-bank border-bank/20",
};

type Language = "es" | "en";

const interfaceCopy = {
  es: {
    practicalHelp: "Ayuda práctica en Brasil",
    appTitle: "Asistencia Rápida",
    intro: "Elige lo que necesitas. Encontrarás frases en portugués para mostrar o decir durante cada paso.",
    categoriesLabel: "Categorías de ayuda",
    viewGuide: "Ver guía",
    emergencyLabel: "Aviso de emergencia",
    emergencyLead: "Emergencia inmediata:",
    emergencyText: "llama al",
    police: "Policía",
    back: "Volver",
    backLabel: "Volver al menú",
    guide: "Guía paso a paso",
    search: "Buscar",
    nearby: "cercano",
    usefulPhrases: "Frases útiles",
    followSteps: "Sigue estos pasos",
    progressJoiner: "de",
    markPending: "Marcar como pendiente",
    markComplete: "Marcar como completado",
    languageLabel: "Idioma",
    lightMode: "Activar modo claro",
    darkMode: "Activar modo oscuro",
    completedTitle: "¡Todo listo!",
    completedText: "Completaste todos los pasos de esta guía.",
  },
  en: {
    practicalHelp: "Practical help in Brazil",
    appTitle: "Quick Assistance",
    intro: "Choose what you need. You’ll find Portuguese phrases to show or say at every step.",
    categoriesLabel: "Help categories",
    viewGuide: "View guide",
    emergencyLabel: "Emergency notice",
    emergencyLead: "Immediate emergency:",
    emergencyText: "call",
    police: "Police",
    back: "Back",
    backLabel: "Back to menu",
    guide: "Step-by-step guide",
    search: "Find a nearby",
    nearby: "",
    usefulPhrases: "Useful phrases",
    followSteps: "Follow these steps",
    progressJoiner: "of",
    markPending: "Mark as pending",
    markComplete: "Mark as complete",
    languageLabel: "Language",
    lightMode: "Switch to light mode",
    darkMode: "Switch to dark mode",
    completedTitle: "All done!",
    completedText: "You completed every step in this guide.",
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asistencia Rápida | Ayuda en Brasil" },
      {
        name: "description",
        content: "Frases prácticas en portugués para emergencias y trámites esenciales en Brasil.",
      },
      { property: "og:title", content: "Asistencia Rápida | Ayuda en Brasil" },
      {
        property: "og:description",
        content: "Frases prácticas en portugués para emergencias y trámites esenciales en Brasil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [language, setLanguage] = useState<Language>("es");
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [pendingSuggestion, setPendingSuggestion] = useState(false);
  const [celebratingCategory, setCelebratingCategory] = useState<string | null>(null);
  const selected = categories.find((category) => category.id === selectedId);
  const copy = interfaceCopy[language];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.lang = language;
  }, [isDark, language]);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!celebratingCategory) return;
    const timeout = window.setTimeout(() => setCelebratingCategory(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [celebratingCategory]);

  const openSuggestion = () => {
    if (user) {
      setSuggestionOpen(true);
      return;
    }
    setPendingSuggestion(true);
    setAuthOpen(true);
  };

  const finishAuthentication = () => {
    if (pendingSuggestion) {
      setPendingSuggestion(false);
      setSuggestionOpen(true);
    }
  };

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setSuggestionOpen(false);
  };

  const toggleStep = (stepId: string, category: Category) => {
    setCompleted((current) => {
      const next = { ...current, [stepId]: !current[stepId] };
      const wasComplete = category.steps.every((step) => Boolean(current[step.id]));
      const isComplete = category.steps.every((step) => Boolean(next[step.id]));
      if (!wasComplete && isComplete) setCelebratingCategory(category.id);
      if (!isComplete && celebratingCategory === category.id) setCelebratingCategory(null);
      return next;
    });
  };

  const categoryOptions = categories.map((category) => ({
    id: category.id as SuggestionCategory,
    label: language === "es" ? category.title : category.titleEN,
  }));

  const dialogs = (
    <>
      <AuthDialog language={language} open={authOpen} onOpenChange={setAuthOpen} onAuthenticated={finishAuthentication} />
      <SuggestionDialog
        key={`${selectedId ?? "all"}-${language}`}
        language={language}
        open={suggestionOpen}
        onOpenChange={setSuggestionOpen}
        categories={categoryOptions}
        defaultCategory={(selectedId as SuggestionCategory | null) ?? undefined}
      />
    </>
  );

  const openCategory = (id: string) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (selected) {
    const CategoryIcon = selected.icon;
    const completedCount = selected.steps.filter((step) => completed[step.id]).length;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.mapSearchQuery)}`;

    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pb-12 pt-4 sm:px-6 sm:pt-8">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              className="-ml-3"
              onClick={() => setSelectedId(null)}
              aria-label={copy.backLabel}
            >
              <ArrowLeft aria-hidden="true" size={20} />
              {copy.back}
            </Button>
            <HeaderControls language={language} setLanguage={setLanguage} isDark={isDark} setIsDark={setIsDark} />
          </div>

          <div className="mt-3 flex justify-end">
            <AccountActions language={language} user={user} onSignIn={() => setAuthOpen(true)} onSuggest={openSuggestion} onSignOut={handleSignOut} />
          </div>

          <header className="mt-5 flex items-start gap-4">
            <div className={cn("flex size-14 shrink-0 items-center justify-center rounded-lg border", colorStyles[selected.color])}>
              <CategoryIcon aria-hidden="true" size={28} strokeWidth={2.2} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-medium text-muted-foreground">{copy.guide}</p>
              <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {language === "es" ? selected.title : selected.titleEN}
              </h1>
            </div>
          </header>

          <Button asChild size="wide" variant={selected.color === "emergency" ? "emergency" : "default"} className="mt-7">
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" size={20} />
              {copy.search} {language === "es" ? selected.shortTitle : selected.shortTitleEN} {copy.nearby}
              <ExternalLink aria-hidden="true" className="ml-auto" size={17} />
            </a>
          </Button>

          <section className="mt-8" aria-labelledby="steps-heading">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-primary">{copy.usefulPhrases}</p>
                <h2 id="steps-heading" className="mt-1 text-xl font-bold text-foreground">
                  {copy.followSteps}
                </h2>
              </div>
              <p className="shrink-0 text-sm font-medium text-muted-foreground" aria-live="polite">
                {completedCount} {copy.progressJoiner} {selected.steps.length}
              </p>
            </div>

            {celebratingCategory === selected.id && (
              <div className="celebration-banner relative mb-4 overflow-hidden rounded-lg border border-medical/30 bg-medical-soft px-5 py-4 text-center" role="status" aria-live="polite">
                <div className="confetti" aria-hidden="true">
                  {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
                </div>
                <Sparkles aria-hidden="true" className="mx-auto text-medical" size={25} />
                <p className="mt-1 font-bold text-foreground">{copy.completedTitle}</p>
                <p className="text-sm text-muted-foreground">{copy.completedText}</p>
              </div>
            )}

            <div className="space-y-3">
              {selected.steps.map((step, index) => {
                const isComplete = Boolean(completed[step.id]);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => toggleStep(step.id, selected)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-lg border bg-card p-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-5",
                      isComplete ? "border-border bg-muted/60 opacity-65" : "border-border hover:border-primary/35 hover:shadow-md",
                    )}
                    aria-pressed={isComplete}
                    aria-label={`${isComplete ? copy.markPending : copy.markComplete}: ${step.phrasePT}`}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                        isComplete ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background group-hover:border-primary/60",
                      )}
                      aria-hidden="true"
                    >
                      {isComplete ? <Check size={17} strokeWidth={3} /> : <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="inline-flex rounded-sm bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                        {language === "es" ? step.phase : step.phaseEN}
                      </span>
                      <span className={cn("mt-3 block text-lg font-bold leading-snug text-foreground sm:text-xl", isComplete && "line-through")}>
                        {step.phrasePT}
                      </span>
                      <span className={cn("mt-2 block text-sm leading-relaxed text-muted-foreground", isComplete && "line-through")}>
                        {language === "es" ? step.phraseES : step.phraseEN}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
        {dialogs}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 pb-12 pt-8 sm:px-6 sm:pt-14">
        <header>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Cross aria-hidden="true" size={21} strokeWidth={3} />
              <p className="text-sm font-bold">{copy.practicalHelp}</p>
            </div>
            <HeaderControls language={language} setLanguage={setLanguage} isDark={isDark} setIsDark={setIsDark} />
          </div>
          <div className="mt-3 flex justify-end">
            <AccountActions language={language} user={user} onSignIn={() => setAuthOpen(true)} onSuggest={openSuggestion} onSignOut={handleSignOut} />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-foreground sm:text-4xl">{copy.appTitle}</h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            {copy.intro}
          </p>
        </header>

        <section className="mt-8" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="sr-only">{copy.categoriesLabel}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => openCategory(category.id)}
                  className="group flex min-h-48 flex-col rounded-lg border border-border bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 sm:min-h-52 sm:p-5"
                >
                  <span className={cn("flex size-12 items-center justify-center rounded-lg border", colorStyles[category.color])}>
                    <CategoryIcon aria-hidden="true" size={25} strokeWidth={2.2} />
                  </span>
                  <span className="mt-auto block">
                    <span className="block text-base font-bold leading-snug text-foreground sm:text-lg">
                      {language === "es" ? category.title : category.titleEN}
                    </span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {language === "es" ? category.description : category.descriptionEN}
                    </span>
                  </span>
                  <span className="mt-3 flex items-center gap-1 text-xs font-bold text-primary">
                    {copy.viewGuide} <ChevronRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="mt-8 flex gap-3 border-l-4 border-emergency bg-emergency-soft px-4 py-3" aria-label={copy.emergencyLabel}>
          <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0 text-emergency" size={20} />
          <p className="text-sm leading-relaxed text-foreground">
            <strong>{copy.emergencyLead}</strong> {copy.emergencyText} <strong>192</strong> (SAMU) {language === "es" ? "o al" : "or"} <strong>190</strong> ({copy.police}).
          </p>
        </aside>
      </div>
      {dialogs}
    </main>
  );
}

function HeaderControls({
  language,
  setLanguage,
  isDark,
  setIsDark,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}) {
  const copy = interfaceCopy[language];

  return (
    <nav className="flex shrink-0 items-center gap-2" aria-label={language === "es" ? "Preferencias" : "Preferences"}>
      <div className="flex h-11 items-center rounded-md border border-border bg-card p-1 shadow-sm" aria-label={copy.languageLabel} role="group">
        <Languages aria-hidden="true" className="ml-1 mr-0.5 text-muted-foreground" size={16} />
        {(["es", "en"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            className={cn(
              "flex h-8 min-w-9 items-center justify-center rounded-sm px-2 text-xs font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              language === option ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-pressed={language === option}
            aria-label={option === "es" ? "Español" : "English"}
          >
            {option}
          </button>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsDark(!isDark)}
        aria-label={isDark ? copy.lightMode : copy.darkMode}
        title={isDark ? copy.lightMode : copy.darkMode}
      >
        {isDark ? <Sun aria-hidden="true" size={19} /> : <Moon aria-hidden="true" size={19} />}
      </Button>
    </nav>
  );
}