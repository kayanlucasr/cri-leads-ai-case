-- Executar depois de schema.sql e seed.sql, com acesso administrativo.
-- Resultados esperados pressupõem uma base contendo somente o seed inalterado.

-- 1. Qual origem gerou mais leads?
-- Retorna todas as origens empatadas no maior total. Base vazia: nenhuma linha.
-- Esperado: site, 12 leads.
WITH totals AS (
    SELECT source, COUNT(*) AS total_leads
    FROM public.leads
    GROUP BY source
)
SELECT source, total_leads
FROM totals
WHERE total_leads = (SELECT MAX(total_leads) FROM totals)
ORDER BY source;

-- 2. Qual o percentual de leads qualificados em cada origem?
-- Denominador: todos os leads da própria origem, não o total geral.
-- 100.0 evita divisão inteira; ROUND apresenta duas casas decimais.
-- Uma origem sem leads aparece com total 0 e percentual NULL (não calculável).
-- Esperado: indicacao 3/4 = 75.00%; whatsapp 3/8 = 37.50%; site 2/12 = 16.67%.
WITH sources (source) AS (
    VALUES ('site'), ('whatsapp'), ('indicacao')
)
SELECT
    sources.source,
    COUNT(leads.id) AS total_leads,
    COUNT(leads.id) FILTER (WHERE leads.status = 'qualificado') AS qualified_leads,
    ROUND(
        100.0 * COUNT(leads.id) FILTER (WHERE leads.status = 'qualificado')
        / NULLIF(COUNT(leads.id), 0),
        2
    ) AS qualified_percentage
FROM sources
LEFT JOIN public.leads AS leads ON leads.source = sources.source
GROUP BY sources.source
ORDER BY qualified_percentage DESC NULLS LAST, sources.source;

-- 3. Outro padrão: qual origem tem maior proporção de leads perdidos?
-- Esperado: site 3/12 = 25.00%; whatsapp 1/8 = 12.50%; indicacao 0/4 = 0.00%.
-- Site tem maior proporção de perdidos nesta amostra fictícia.
-- Isso não demonstra causa, retorno financeiro ou taxa histórica de conversão:
-- a tabela contém apenas o status atual de cada lead.
WITH sources (source) AS (
    VALUES ('site'), ('whatsapp'), ('indicacao')
)
SELECT
    sources.source,
    COUNT(leads.id) AS total_leads,
    COUNT(leads.id) FILTER (WHERE leads.status = 'perdido') AS lost_leads,
    ROUND(
        100.0 * COUNT(leads.id) FILTER (WHERE leads.status = 'perdido')
        / NULLIF(COUNT(leads.id), 0),
        2
    ) AS lost_percentage
FROM sources
LEFT JOIN public.leads AS leads ON leads.source = sources.source
GROUP BY sources.source
ORDER BY lost_percentage DESC NULLS LAST, sources.source;

-- Conferência adicional: distribuição por origem e status.
-- Totais esperados: 24 leads; 6 novos, 6 em contato, 8 qualificados e 4 perdidos.
SELECT
    source,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE status = 'novo') AS new_leads,
    COUNT(*) FILTER (WHERE status = 'em_contato') AS contacted_leads,
    COUNT(*) FILTER (WHERE status = 'qualificado') AS qualified_leads,
    COUNT(*) FILTER (WHERE status = 'perdido') AS lost_leads
FROM public.leads
GROUP BY source
ORDER BY source;
