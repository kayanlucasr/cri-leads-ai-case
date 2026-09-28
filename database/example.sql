INSERT INTO public.leads
    (id, name, phone, property_interest, source, status, created_at)
    ('00000000-0000-4000-8000-000000000025', 'João Paulo', '(00) 90001-0001', 'Apartamento de 2 quartos no Centro', 'site', 'novo', '2026-09-01 09:00:00-03'),
    ON CONFLICT (id) DO NOTHING;
