-- Executar uma vez em um banco novo, antes de seed.sql.
-- Se public.leads já existir, o script falha sem substituir a tabela.
BEGIN;

CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    property_interest TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'novo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT leads_name_not_blank CHECK (name ~ '[^[:space:]]'),
    CONSTRAINT leads_phone_not_blank CHECK (phone ~ '[^[:space:]]'),
    CONSTRAINT leads_property_interest_not_blank
        CHECK (property_interest ~ '[^[:space:]]'),
    CONSTRAINT leads_source_allowed
        CHECK (source IN ('site', 'whatsapp', 'indicacao')),
    CONSTRAINT leads_status_allowed
        CHECK (status IN ('novo', 'em_contato', 'qualificado', 'perdido'))
);

-- Sem políticas públicas: acesso pelo SQL Editor administrativo e,
-- futuramente, pelo backend com credencial adequada guardada no servidor.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

COMMIT;
