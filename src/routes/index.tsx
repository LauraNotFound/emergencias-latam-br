import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  BusFront,
  Check,
  ChevronRight,
  ExternalLink,
  HeartPulse,
  Landmark,
  Languages,
  MapPin,
  MessageSquarePlus,
  Moon,
  Phone,
  RotateCcw,
  ShieldAlert,
  ShoppingBasket,
  Sparkles,
  Store,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { PhraseActions } from "@/components/phrase-actions";
import { PhraseSuggestionDialog } from "@/components/phrase-suggestion-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Language = "es" | "pt";
type Color = "medical" | "emergency" | "document" | "bank";

type Step = {
  id: string;
  phaseES: string;
  phasePT: string;
  phraseES: string;
  phrasePT: string;
};

type Category = {
  id: string;
  titleES: string;
  titlePT: string;
  shortES: string;
  shortPT: string;
  descriptionES: string;
  descriptionPT: string;
  icon: LucideIcon;
  color: Color;
  mapSearchQuery: string;
  steps: Step[];
};

type ApprovedPhrase = {
  categoria: string;
  fraseES: string;
  frasePT: string;
};

const APPROVED_PHRASES_URL =
  "https://script.google.com/macros/s/AKfycbyYSkmYIEGJH43VRGpFvN3p6q4SNFVSa7IqS_B4KAiYYNFwUbNY70-OcXQqfWPi53G5/exec";

const staticCategories: Category[] = [
  {
    id: "salud",
    titleES: "Salud",
    titlePT: "Saúde",
    shortES: "hospital",
    shortPT: "hospital",
    descriptionES: "Atención médica y farmacias",
    descriptionPT: "Atendimento médico e farmácias",
    icon: HeartPulse,
    color: "medical",
    mapSearchQuery: "hospital",
    steps: [
      {
        id: "salud-1",
        phaseES: "Recepción",
        phasePT: "Recepção",
        phraseES: "¿Dónde puedo recibir atención médica?",
        phrasePT: "Onde posso receber atendimento médico?",
      },
      {
        id: "salud-2",
        phaseES: "Triaje",
        phasePT: "Triagem",
        phraseES: "Tengo dolor aquí y necesito atención urgente.",
        phrasePT: "Estou com dor aqui e preciso de atendimento urgente.",
      },
      {
        id: "salud-3",
        phaseES: "Medicamentos",
        phasePT: "Medicamentos",
        phraseES: "¿Dónde está la farmacia más cercana?",
        phrasePT: "Onde fica a farmácia mais próxima?",
      },
    ],
  },
  {
    id: "policia",
    titleES: "Policía/Denuncias",
    titlePT: "Polícia/Denúncias",
    shortES: "comisaría",
    shortPT: "delegacia",
    descriptionES: "Emergencias y denuncias",
    descriptionPT: "Emergências e boletins de ocorrência",
    icon: ShieldAlert,
    color: "emergency",
    mapSearchQuery: "delegacia de policia",
    steps: [
      {
        id: "policia-1",
        phaseES: "Llegada",
        phasePT: "Chegada",
        phraseES: "Necesito presentar una denuncia policial.",
        phrasePT: "Preciso registrar um boletim de ocorrência.",
      },
      {
        id: "policia-2",
        phaseES: "Relato",
        phasePT: "Relato",
        phraseES: "Esto ocurrió hoy en esta dirección.",
        phrasePT: "Isso aconteceu hoje neste endereço.",
      },
      {
        id: "policia-3",
        phaseES: "Comprobante",
        phasePT: "Comprovante",
        phraseES: "¿Puedo recibir una copia de la denuncia?",
        phrasePT: "Posso receber uma cópia do boletim de ocorrência?",
      },
    ],
  },
  {
    id: "registro",
    titleES: "Registro Migratorio",
    titlePT: "Registro Migratório",
    shortES: "Policía Federal",
    shortPT: "Polícia Federal",
    descriptionES: "Trámites migratorios esenciales",
    descriptionPT: "Procedimentos migratórios essenciais",
    icon: Building2,
    color: "document",
    mapSearchQuery: "policia federal",
    steps: [
      {
        id: "registro-1",
        phaseES: "Información",
        phasePT: "Informações",
        phraseES: "Necesito hacer mi registro migratorio.",
        phrasePT: "Preciso fazer meu registro migratório.",
      },
      {
        id: "registro-2",
        phaseES: "Cita",
        phasePT: "Agendamento",
        phraseES: "Tengo una cita. ¿Dónde debo esperar?",
        phrasePT: "Tenho um agendamento. Onde devo aguardar?",
      },
      {
        id: "registro-3",
        phaseES: "Seguimiento",
        phasePT: "Acompanhamento",
        phraseES: "¿Cómo consulto el estado de mi solicitud?",
        phrasePT: "Como posso acompanhar o andamento do pedido?",
      },
    ],
  },
  {
    id: "bancos",
    titleES: "Bancos",
    titlePT: "Bancos",
    shortES: "banco",
    shortPT: "banco",
    descriptionES: "Cuenta, tarjeta y atención",
    descriptionPT: "Conta, cartão e atendimento",
    icon: Landmark,
    color: "bank",
    mapSearchQuery: "banco",
    steps: [
      {
        id: "bancos-1",
        phaseES: "Recepción",
        phasePT: "Recepção",
        phraseES: "Quisiera abrir una cuenta bancaria.",
        phrasePT: "Gostaria de abrir uma conta bancária.",
      },
      {
        id: "bancos-2",
        phaseES: "Requisitos",
        phasePT: "Requisitos",
        phraseES: "¿Qué documentos necesitan los extranjeros?",
        phrasePT: "Quais documentos são necessários para estrangeiros?",
      },
      {
        id: "bancos-3",
        phaseES: "Seguridad",
        phasePT: "Segurança",
        phraseES: "No reconozco esta transacción.",
        phrasePT: "Não reconheço esta transação.",
      },
    ],
  },
  {
    id: "restaurantes",
    titleES: "Restaurantes",
    titlePT: "Restaurantes",
    shortES: "restaurante",
    shortPT: "restaurante",
    descriptionES: "Pedir, consultar y pagar",
    descriptionPT: "Pedir, perguntar e pagar",
    icon: Store,
    color: "bank",
    mapSearchQuery: "restaurante",
    steps: [
      {
        id: "restaurantes-1",
        phaseES: "Entrada",
        phasePT: "Entrada",
        phraseES: "¿Hay una mesa disponible para dos personas?",
        phrasePT: "Tem uma mesa disponível para duas pessoas?",
      },
      {
        id: "restaurantes-2",
        phaseES: "Pedido",
        phasePT: "Pedido",
        phraseES: "¿Este plato contiene carne o frutos secos?",
        phrasePT: "Este prato contém carne ou castanhas?",
      },
      {
        id: "restaurantes-3",
        phaseES: "Pago",
        phasePT: "Pagamento",
        phraseES: "La cuenta, por favor. ¿Puedo pagar con tarjeta?",
        phrasePT: "A conta, por favor. Posso pagar com cartão?",
      },
    ],
  },
  {
    id: "transporte",
    titleES: "Transporte Público",
    titlePT: "Transporte Público",
    shortES: "transporte público",
    shortPT: "transporte público",
    descriptionES: "Metro, autobús y trayectos",
    descriptionPT: "Metrô, ônibus e trajetos",
    icon: BusFront,
    color: "document",
    mapSearchQuery: "metro ou onibus",
    steps: [
      {
        id: "transporte-1",
        phaseES: "Ruta",
        phasePT: "Rota",
        phraseES: "¿Qué autobús va al centro?",
        phrasePT: "Qual ônibus vai para o centro?",
      },
      {
        id: "transporte-2",
        phaseES: "Billete",
        phasePT: "Bilhete",
        phraseES: "¿Dónde puedo comprar o recargar la tarjeta?",
        phrasePT: "Onde posso comprar ou recarregar o cartão?",
      },
      {
        id: "transporte-3",
        phaseES: "Destino",
        phasePT: "Destino",
        phraseES: "¿Puede avisarme cuando llegue a esta parada?",
        phrasePT: "Pode me avisar quando chegar neste ponto?",
      },
    ],
  },
  {
    id: "supermercado",
    titleES: "Supermercado",
    titlePT: "Supermercado",
    shortES: "supermercado",
    shortPT: "supermercado",
    descriptionES: "Compras y productos básicos",
    descriptionPT: "Compras e produtos básicos",
    icon: ShoppingBasket,
    color: "medical",
    mapSearchQuery: "supermercado",
    steps: [
      {
        id: "supermercado-1",
        phaseES: "Producto",
        phasePT: "Produto",
        phraseES: "¿Dónde encuentro agua y alimentos básicos?",
        phrasePT: "Onde encontro água e alimentos básicos?",
      },
      {
        id: "supermercado-2",
        phaseES: "Precio",
        phasePT: "Preço",
        phraseES: "¿Cuál es el precio de este producto?",
        phrasePT: "Qual é o preço deste produto?",
      },
      {
        id: "supermercado-3",
        phaseES: "Caja",
        phasePT: "Caixa",
        phraseES: "¿Aceptan tarjeta internacional?",
        phrasePT: "Vocês aceitam cartão internacional?",
      },
    ],
  },
  {
    id: "telefonia",
    titleES: "Telefonía",
    titlePT: "Telefonia",
    shortES: "tienda de telefonía",
    shortPT: "loja de telefonia",
    descriptionES: "Chip, datos móviles y recargas",
    descriptionPT: "Chip, internet móvel e recargas",
    icon: Phone,
    color: "emergency",
    mapSearchQuery: "loja de telefonia tim claro vivo",
    steps: [
      {
        id: "telefonia-1",
        phaseES: "Compra",
        phasePT: "Compra",
        phraseES: "Necesito un chip prepago para mi teléfono.",
        phrasePT: "Preciso de um chip pré-pago para o meu celular.",
      },
      {
        id: "telefonia-2",
        phaseES: "Activación",
        phasePT: "Ativação",
        phraseES: "¿Pueden ayudarme a activar el chip?",
        phrasePT: "Podem me ajudar a ativar o chip?",
      },
      {
        id: "telefonia-3",
        phaseES: "Recarga",
        phasePT: "Recarga",
        phraseES: "Quiero recargar datos móviles.",
        phrasePT: "Quero fazer uma recarga de internet móvel.",
      },
    ],
  },
];

const normalizeCategoryName = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const isApprovedPhrase = (value: unknown): value is ApprovedPhrase => {
  if (!value || typeof value !== "object") return false;
  const phrase = value as Record<string, unknown>;
  return (
    typeof phrase["categoria"] === "string" &&
    typeof phrase["fraseES"] === "string" &&
    typeof phrase["frasePT"] === "string" &&
    phrase["categoria"].trim().length > 0 &&
    phrase["fraseES"].trim().length > 0 &&
    phrase["frasePT"].trim().length > 0
  );
};

const createDynamicStepId = (categoryId: string, phraseES: string, phrasePT: string) => {
  const source = `${categoryId}\u0000${phraseES.trim()}\u0000${phrasePT.trim()}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `dynamic-${categoryId}-${(hash >>> 0).toString(36)}`;
};

const appendApprovedPhrases = (currentCategories: Category[], values: unknown[]) => {
  const stepsByCategory = new Map<string, Step[]>();

  values.filter(isApprovedPhrase).forEach((phrase) => {
    const categoryName = normalizeCategoryName(phrase.categoria);
    const category = currentCategories.find((candidate) =>
      [candidate.id, candidate.titleES, candidate.titlePT].some(
        (name) => normalizeCategoryName(name) === categoryName,
      ),
    );
    if (!category) return;

    const phraseES = phrase.fraseES.trim();
    const phrasePT = phrase.frasePT.trim();
    const dynamicStep: Step = {
      id: createDynamicStepId(category.id, phraseES, phrasePT),
      phaseES: "Comunidad",
      phasePT: "Comunidade",
      phraseES,
      phrasePT,
    };
    const pendingSteps = stepsByCategory.get(category.id) ?? [];
    const isDuplicate = [...category.steps, ...pendingSteps].some(
      (step) =>
        step.id === dynamicStep.id ||
        (normalizeCategoryName(step.phraseES) === normalizeCategoryName(phraseES) &&
          normalizeCategoryName(step.phrasePT) === normalizeCategoryName(phrasePT)),
    );
    if (!isDuplicate) stepsByCategory.set(category.id, [...pendingSteps, dynamicStep]);
  });

  if (stepsByCategory.size === 0) return currentCategories;
  return currentCategories.map((category) => {
    const approvedSteps = stepsByCategory.get(category.id);
    return approvedSteps ? { ...category, steps: [...category.steps, ...approvedSteps] } : category;
  });
};

const colorStyles: Record<Color, string> = {
  medical: "bg-medical-soft text-medical border-medical/20",
  emergency: "bg-emergency-soft text-emergency border-emergency/20",
  document: "bg-document-soft text-document border-document/20",
  bank: "bg-bank-soft text-bank border-bank/20",
};

const interfaceCopy = {
  es: {
    practicalHelp: "Ayuda práctica para extranjeros en Brasil",
    intro: "Elige lo que necesitas y lleva estas frases en portugués contigo.",
    categories: "Categorías de ayuda",
    view: "Ver guía",
    emergency: "Emergencia inmediata: llama al 192 (ambulancia) o 190 (policía).",
    back: "Volver",
    backLabel: "Volver al menú",
    guide: "Guía paso a paso",
    search: "Buscar",
    nearby: "cercano",
    useful: "Frases útiles",
    follow: "Sigue estos pasos",
    joiner: "de",
    complete: "Marcar como completado",
    pending: "Marcar como pendiente",
    doneTitle: "¡Todo listo!",
    doneText: "Completaste todos los pasos de esta guía.",
    clear: "Limpiar todo",
    suggest: "Sugerir frase",
    dark: "Activar modo oscuro",
    light: "Activar modo claro",
    language: "Cambiar idioma a portugués",
  },
  pt: {
    practicalHelp: "Ajuda prática para estrangeiros no Brasil",
    intro: "Escolha o que você precisa e leve estas frases úteis com você.",
    categories: "Categorias de ajuda",
    view: "Ver guia",
    emergency: "Emergência imediata: ligue 192 (ambulância) ou 190 (polícia).",
    back: "Voltar",
    backLabel: "Voltar ao menu",
    guide: "Guia passo a passo",
    search: "Buscar",
    nearby: "próximo",
    useful: "Frases úteis",
    follow: "Siga estes passos",
    joiner: "de",
    complete: "Marcar como concluído",
    pending: "Marcar como pendente",
    doneTitle: "Tudo pronto!",
    doneText: "Você concluiu todos os passos deste guia.",
    clear: "Limpar tudo",
    suggest: "Sugerir frase",
    dark: "Ativar modo escuro",
    light: "Ativar modo claro",
    language: "Mudar idioma para espanhol",
  },
};

const STORAGE_PREFIX = "pronto-checklist-v1:";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pronto | Ayuda práctica en Brasil" },
      {
        name: "description",
        content:
          "Frases prácticas en portugués para emergencias y situaciones cotidianas en Brasil.",
      },
      { property: "og:title", content: "Pronto | Ayuda práctica en Brasil" },
      { property: "og:description", content: "Guías bilingües para desenvolverte en Brasil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [categories, setCategories] = useState<Category[]>(staticCategories);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [language, setLanguage] = useState<Language>("es");
  const [isDark, setIsDark] = useState(false);
  const [hydratedCategory, setHydratedCategory] = useState<string | null>(null);
  const [celebratingCategory, setCelebratingCategory] = useState<string | null>(null);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const selected = categories.find((category) => category.id === selectedId);
  const copy = interfaceCopy[language];

  useEffect(() => {
    const controller = new AbortController();

    void fetch(APPROVED_PHRASES_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Approved phrases request failed");
        return response.json() as Promise<unknown>;
      })
      .then((payload) => {
        if (!Array.isArray(payload)) return;
        setCategories((current) => appendApprovedPhrases(current, payload));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.lang = language === "es" ? "es" : "pt-BR";
  }, [isDark, language]);

  useEffect(() => {
    if (!selectedId) return;
    const stored = window.localStorage.getItem(`${STORAGE_PREFIX}${selectedId}`);
    if (stored) {
      try {
        setCompleted(JSON.parse(stored) as Record<string, boolean>);
      } catch {
        setCompleted({});
      }
    } else setCompleted({});
    setHydratedCategory(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId || hydratedCategory !== selectedId) return;
    window.localStorage.setItem(`${STORAGE_PREFIX}${selectedId}`, JSON.stringify(completed));
  }, [completed, hydratedCategory, selectedId]);

  useEffect(() => {
    if (!celebratingCategory) return;
    const timeout = window.setTimeout(() => setCelebratingCategory(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [celebratingCategory]);

  const openCategory = (id: string) => {
    setHydratedCategory(null);
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleStep = (stepId: string, category: Category) => {
    setCompleted((current) => {
      const next = { ...current, [stepId]: !current[stepId] };
      const wasComplete = category.steps.every((step) => Boolean(current[step.id]));
      const isComplete = category.steps.every((step) => Boolean(next[step.id]));
      if (!wasComplete && isComplete) setCelebratingCategory(category.id);
      if (!isComplete) setCelebratingCategory(null);
      return next;
    });
  };

  const clearAll = (category: Category) => {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${category.id}`);
    setCompleted({});
    setCelebratingCategory(null);
  };

  const navbar = (
    <nav
      className="flex min-h-14 items-center justify-between gap-3 border-b border-border pb-3"
      aria-label="Pronto"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <img
          className="h-14 w-auto max-w-full shrink-0 rounded-lg object-contain sm:h-16"
          src={isDark ? "/logo-dark.jpg" : "/logo.jpg"}
          alt="Pronto"
        />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsDark((value) => !value)}
          aria-label={isDark ? copy.light : copy.dark}
          title={isDark ? copy.light : copy.dark}
        >
          {isDark ? <Sun aria-hidden="true" size={20} /> : <Moon aria-hidden="true" size={20} />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-10 gap-1.5 px-2.5"
          onClick={() => setLanguage((value) => (value === "es" ? "pt" : "es"))}
          aria-label={copy.language}
          title={copy.language}
        >
          <Languages aria-hidden="true" size={20} />
          <span className="text-xs font-bold">{language.toUpperCase()}</span>
        </Button>
      </div>
    </nav>
  );

  if (selected) {
    const CategoryIcon = selected.icon;
    const completedCount = selected.steps.filter((step) => completed[step.id]).length;
    const allComplete = completedCount === selected.steps.length;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.mapSearchQuery)}`;
    const title = language === "es" ? selected.titleES : selected.titlePT;

    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-4 sm:px-6 sm:pt-8 lg:px-8">
          {navbar}
          <Button
            variant="ghost"
            className="-ml-3 mt-4"
            onClick={() => setSelectedId(null)}
            aria-label={copy.backLabel}
          >
            <ArrowLeft aria-hidden="true" size={20} />
            {copy.back}
          </Button>
          <header className="mt-5 flex items-start gap-4">
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-lg border",
                colorStyles[selected.color],
              )}
            >
              <CategoryIcon aria-hidden="true" size={28} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-medium text-muted-foreground">{copy.guide}</p>
              <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {title}
              </h1>
            </div>
          </header>
          <Button
            asChild
            size="wide"
            variant={selected.color === "emergency" ? "emergency" : "default"}
            className="mt-7"
          >
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin aria-hidden="true" size={20} />
              {copy.search} {language === "es" ? selected.shortES : selected.shortPT} {copy.nearby}
              <ExternalLink aria-hidden="true" className="ml-auto" size={17} />
            </a>
          </Button>
          <section className="mt-8" aria-labelledby="steps-heading">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-primary">{copy.useful}</p>
                <h2 id="steps-heading" className="mt-1 text-xl font-bold text-foreground">
                  {copy.follow}
                </h2>
              </div>
              <p className="shrink-0 text-sm font-medium text-muted-foreground" aria-live="polite">
                {completedCount} {copy.joiner} {selected.steps.length}
              </p>
            </div>
            {celebratingCategory === selected.id && (
              <div
                className="celebration-banner relative mb-4 overflow-hidden rounded-lg border border-medical/30 bg-medical-soft px-5 py-4 text-center"
                role="status"
                aria-live="polite"
              >
                <div className="confetti" aria-hidden="true">
                  {Array.from({ length: 14 }, (_, index) => (
                    <i key={index} />
                  ))}
                </div>
                <Sparkles aria-hidden="true" className="mx-auto text-medical" size={25} />
                <p className="mt-1 font-bold text-foreground">{copy.doneTitle}</p>
                <p className="text-sm text-muted-foreground">{copy.doneText}</p>
              </div>
            )}
            <div className="space-y-3">
              {selected.steps.map((step, index) => {
                const isComplete = Boolean(completed[step.id]);
                return (
                  <article
                    key={step.id}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm transition",
                      isComplete && "opacity-60",
                    )}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "mt-0.5 size-8 shrink-0 rounded-md",
                        isComplete && "border-primary bg-primary text-primary-foreground",
                      )}
                      onClick={() => toggleStep(step.id, selected)}
                      aria-pressed={isComplete}
                      aria-label={`${isComplete ? copy.pending : copy.complete}: ${step.phrasePT}`}
                    >
                      {isComplete && <Check aria-hidden="true" size={17} />}
                    </Button>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                        {index + 1} · {language === "es" ? step.phaseES : step.phasePT}
                      </span>
                      <p
                        className={cn(
                          "mt-3 text-lg font-bold leading-snug text-foreground",
                          isComplete && "line-through",
                        )}
                      >
                        {step.phrasePT}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-sm leading-relaxed text-muted-foreground",
                          isComplete && "line-through",
                        )}
                      >
                        {step.phraseES}
                      </p>
                      <PhraseActions phrase={step.phrasePT} language={language} compact />
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-6 space-y-3">
              {allComplete && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => clearAll(selected)}
                >
                  <RotateCcw aria-hidden="true" size={18} />
                  {copy.clear}
                </Button>
              )}
              <Button type="button" className="w-full" onClick={() => setSuggestionOpen(true)}>
                <MessageSquarePlus aria-hidden="true" size={18} />
                {copy.suggest}
              </Button>
            </div>
          </section>
          <PhraseSuggestionDialog
            open={suggestionOpen}
            onOpenChange={setSuggestionOpen}
            category={title}
            language={language}
          />
          <AppFooter />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-4 sm:px-6 sm:pt-8 lg:px-8">
        {navbar}
        <header className="pb-7 pt-8 sm:pb-9 sm:pt-12">
          <p className="text-sm font-bold text-primary">{copy.practicalHelp}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {copy.intro}
          </p>
        </header>
        <aside
          className="mb-7 rounded-lg border border-emergency/25 bg-emergency-soft px-4 py-3 text-sm font-medium text-foreground"
          aria-label="Emergencia"
        >
          <ShieldAlert aria-hidden="true" className="mr-2 inline text-emergency" size={18} />
          {copy.emergency}
        </aside>
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="mb-4 text-lg font-bold text-foreground">
            {copy.categories}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => openCategory(category.id)}
                  className="group flex min-h-44 w-full min-w-0 flex-col rounded-lg border bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:min-h-48"
                >
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-lg border",
                      colorStyles[category.color],
                    )}
                  >
                    <Icon aria-hidden="true" size={23} />
                  </span>
                  <span className="mt-4 text-base font-bold leading-tight text-card-foreground">
                    {language === "es" ? category.titleES : category.titlePT}
                  </span>
                  <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {language === "es" ? category.descriptionES : category.descriptionPT}
                  </span>
                  <span className="mt-auto flex items-center gap-1 pt-3 text-xs font-bold text-primary">
                    {copy.view}
                    <ChevronRight aria-hidden="true" size={15} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <AppFooter />
      </div>
    </main>
  );
}

function AppFooter() {
  return (
    <footer className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
      <a
        className="font-medium transition-colors hover:text-primary"
        href="https://lauranotfound.github.io/DePortada/"
        target="_blank"
        rel="noreferrer"
      >
        © LauraNotFound🍄 2026
      </a>
    </footer>
  );
}
