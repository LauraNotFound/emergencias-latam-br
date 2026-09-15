CREATE TABLE public.phrase_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  category TEXT NOT NULL CHECK (category IN ('salud', 'policia', 'registro', 'bancos')),
  phrase_pt TEXT NOT NULL CHECK (char_length(phrase_pt) BETWEEN 2 AND 300),
  translation TEXT NOT NULL CHECK (char_length(translation) BETWEEN 2 AND 500),
  translation_language TEXT NOT NULL CHECK (translation_language IN ('es', 'en')),
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.phrase_suggestions TO authenticated;
GRANT ALL ON public.phrase_suggestions TO service_role;

ALTER TABLE public.phrase_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit their own phrase suggestions"
ON public.phrase_suggestions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own phrase suggestions"
ON public.phrase_suggestions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX phrase_suggestions_user_created_idx
ON public.phrase_suggestions (user_id, created_at DESC);