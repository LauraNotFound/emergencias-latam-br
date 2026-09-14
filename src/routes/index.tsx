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
  MapPin,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  phase: string;
  phrasePT: string;
  phraseES: string;
};

type Category = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  color: "medical" | "emergency" | "document" | "bank";
  mapSearchQuery: string;
  steps: Step[];
};

const categories: Category[] = [
  {
    id: "salud",
    title: "Salud",
    shortTitle: "centro médico",
    description: "Atención médica y farmacias",
    icon: HeartPulse,
    color: "medical",
    mapSearchQuery: "hospital",
    steps: [
      {
        id: "salud-1",
        phase: "Recepción",
        phrasePT: "Onde posso receber atendimento médico?",
        phraseES: "¿Dónde puedo recibir atención médica?",
      },
      {
        id: "salud-2",
        phase: "Triaje",
        phrasePT: "Estou com dor aqui. Preciso de atendimento urgente.",
        phraseES: "Tengo dolor aquí. Necesito atención urgente.",
      },
      {
        id: "salud-3",
        phase: "Consulta",
        phrasePT: "Quais são os meus sintomas e o diagnóstico?",
        phraseES: "¿Cuáles son mis síntomas y el diagnóstico?",
      },
      {
        id: "salud-4",
        phase: "Medicamentos",
        phrasePT: "Onde fica a farmácia mais próxima?",
        phraseES: "¿Dónde está la farmacia más cercana?",
      },
    ],
  },
  {
    id: "policia",
    title: "Policía / Denuncias",
    shortTitle: "comisaría",
    description: "Emergencias y denuncias",
    icon: ShieldAlert,
    color: "emergency",
    mapSearchQuery: "delegacia de policia",
    steps: [
      {
        id: "policia-1",
        phase: "Llegada",
        phrasePT: "Preciso registrar um boletim de ocorrência.",
        phraseES: "Necesito presentar una denuncia policial.",
      },
      {
        id: "policia-2",
        phase: "Relato",
        phrasePT: "Isto aconteceu hoje neste endereço.",
        phraseES: "Esto ocurrió hoy en esta dirección.",
      },
      {
        id: "policia-3",
        phase: "Documentos",
        phrasePT: "Meu documento foi roubado. Esta é uma cópia.",
        phraseES: "Me robaron el documento. Esta es una copia.",
      },
      {
        id: "policia-4",
        phase: "Comprobante",
        phrasePT: "Posso receber uma cópia do boletim de ocorrência?",
        phraseES: "¿Puedo recibir una copia de la denuncia?",
      },
    ],
  },
  {
    id: "registro",
    title: "Registro Migratorio",
    shortTitle: "Policía Federal",
    description: "Trámites en la Polícia Federal",
    icon: Building2,
    color: "document",
    mapSearchQuery: "policia federal",
    steps: [
      {
        id: "registro-1",
        phase: "Información",
        phrasePT: "Preciso fazer meu registro migratório.",
        phraseES: "Necesito hacer mi registro migratorio.",
      },
      {
        id: "registro-2",
        phase: "Turno",
        phrasePT: "Tenho um agendamento. Onde devo aguardar?",
        phraseES: "Tengo una cita. ¿Dónde debo esperar?",
      },
      {
        id: "registro-3",
        phase: "Documentos",
        phrasePT: "Estes são meu passaporte e comprovante de residência.",
        phraseES: "Estos son mi pasaporte y comprobante de domicilio.",
      },
      {
        id: "registro-4",
        phase: "Seguimiento",
        phrasePT: "Como posso acompanhar o andamento do pedido?",
        phraseES: "¿Cómo puedo consultar el estado de la solicitud?",
      },
    ],
  },
  {
    id: "bancos",
    title: "Bancos",
    shortTitle: "banco",
    description: "Cuenta, tarjeta y atención",
    icon: Landmark,
    color: "bank",
    mapSearchQuery: "banco",
    steps: [
      {
        id: "bancos-1",
        phase: "Recepción",
        phrasePT: "Gostaria de abrir uma conta bancária.",
        phraseES: "Quisiera abrir una cuenta bancaria.",
      },
      {
        id: "bancos-2",
        phase: "Requisitos",
        phrasePT: "Quais documentos são necessários para estrangeiros?",
        phraseES: "¿Qué documentos necesitan las personas extranjeras?",
      },
      {
        id: "bancos-3",
        phase: "Tarjeta",
        phrasePT: "Meu cartão foi bloqueado. Podem me ajudar?",
        phraseES: "Mi tarjeta fue bloqueada. ¿Pueden ayudarme?",
      },
      {
        id: "bancos-4",
        phase: "Seguridad",
        phrasePT: "Não reconheço esta transação na minha conta.",
        phraseES: "No reconozco esta transacción en mi cuenta.",
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
  const selected = categories.find((category) => category.id === selectedId);

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
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => setSelectedId(null)}
            aria-label="Volver al menú"
          >
            <ArrowLeft aria-hidden="true" size={20} />
            Volver
          </Button>

          <header className="mt-5 flex items-start gap-4">
            <div className={cn("flex size-14 shrink-0 items-center justify-center rounded-lg border", colorStyles[selected.color])}>
              <CategoryIcon aria-hidden="true" size={28} strokeWidth={2.2} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-medium text-muted-foreground">Guía paso a paso</p>
              <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {selected.title}
              </h1>
            </div>
          </header>

          <Button asChild size="wide" variant={selected.color === "emergency" ? "emergency" : "default"} className="mt-7">
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" size={20} />
              Buscar {selected.shortTitle} cercano
              <ExternalLink aria-hidden="true" className="ml-auto" size={17} />
            </a>
          </Button>

          <section className="mt-8" aria-labelledby="steps-heading">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-primary">Frases útiles</p>
                <h2 id="steps-heading" className="mt-1 text-xl font-bold text-foreground">
                  Sigue estos pasos
                </h2>
              </div>
              <p className="shrink-0 text-sm font-medium text-muted-foreground" aria-live="polite">
                {completedCount} de {selected.steps.length}
              </p>
            </div>

            <div className="space-y-3">
              {selected.steps.map((step, index) => {
                const isComplete = Boolean(completed[step.id]);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCompleted((current) => ({ ...current, [step.id]: !current[step.id] }))}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-lg border bg-card p-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-5",
                      isComplete ? "border-border bg-muted/60 opacity-65" : "border-border hover:border-primary/35 hover:shadow-md",
                    )}
                    aria-pressed={isComplete}
                    aria-label={`${isComplete ? "Marcar como pendiente" : "Marcar como completado"}: ${step.phrasePT}`}
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
                        {step.phase}
                      </span>
                      <span className={cn("mt-3 block text-lg font-bold leading-snug text-foreground sm:text-xl", isComplete && "line-through")}>
                        {step.phrasePT}
                      </span>
                      <span className={cn("mt-2 block text-sm leading-relaxed text-muted-foreground", isComplete && "line-through")}>
                        {step.phraseES}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 pb-12 pt-8 sm:px-6 sm:pt-14">
        <header>
          <div className="flex items-center gap-2 text-primary">
            <Cross aria-hidden="true" size={21} strokeWidth={3} />
            <p className="text-sm font-bold">Ayuda práctica en Brasil</p>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">Asistencia Rápida</h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            Elige lo que necesitas. Encontrarás frases en portugués para mostrar o decir durante cada paso.
          </p>
        </header>

        <section className="mt-8" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="sr-only">Categorías de ayuda</h2>
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
                    <span className="block text-base font-bold leading-snug text-foreground sm:text-lg">{category.title}</span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground sm:text-sm">{category.description}</span>
                  </span>
                  <span className="mt-3 flex items-center gap-1 text-xs font-bold text-primary">
                    Ver guía <ChevronRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="mt-8 flex gap-3 border-l-4 border-emergency bg-emergency-soft px-4 py-3" aria-label="Aviso de emergencia">
          <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0 text-emergency" size={20} />
          <p className="text-sm leading-relaxed text-foreground">
            <strong>Emergencia inmediata:</strong> llama al <strong>192</strong> (SAMU) o al <strong>190</strong> (Policía).
          </p>
        </aside>
      </div>
    </main>
  );
}