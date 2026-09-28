-- 24 leads inteiramente fictícios. Telefones com DDD 00 são demonstrativos:
-- não devem ser usados para contato. Datas fixas tornam a análise reproduzível.
-- UUIDs fixos permitem repetir o seed sem duplicar ou sobrescrever registros.
-- ON CONFLICT não restaura registros do seed que tenham sido editados.
BEGIN;

INSERT INTO public.leads
    (id, name, phone, property_interest, source, status, created_at)
VALUES
    ('00000000-0000-4000-8000-000000000001', 'Ana Costa', '(00) 90000-0001', 'Apartamento de 2 quartos no Centro', 'site', 'novo', '2026-09-01 09:00:00-03'),
    ('00000000-0000-4000-8000-000000000002', 'Bruno Lima', '(00) 90000-0002', 'Casa de 3 quartos no Jardim das Flores', 'site', 'novo', '2026-09-02 10:15:00-03'),
    ('00000000-0000-4000-8000-000000000003', 'Carla Nunes', '(00) 90000-0003', 'Studio no bairro Universitário', 'site', 'novo', '2026-09-04 14:30:00-03'),
    ('00000000-0000-4000-8000-000000000004', 'Diego Alves', '(00) 90000-0004', 'Terreno no bairro Primavera', 'site', 'novo', '2026-09-07 11:00:00-03'),
    ('00000000-0000-4000-8000-000000000005', 'Elisa Rocha', '(00) 90000-0005', 'Apartamento de 1 quarto no Centro', 'site', 'em_contato', '2026-09-08 16:45:00-03'),
    ('00000000-0000-4000-8000-000000000006', 'Felipe Dias', '(00) 90000-0006', 'Casa no bairro Vila Nova', 'site', 'em_contato', '2026-09-10 08:30:00-03'),
    ('00000000-0000-4000-8000-000000000007', 'Gabriela Melo', '(00) 90000-0007', 'Sala comercial no Centro', 'site', 'em_contato', '2026-09-12 13:00:00-03'),
    ('00000000-0000-4000-8000-000000000008', 'Henrique Reis', '(00) 90000-0008', 'Apartamento de 3 quartos no bairro Aurora', 'site', 'qualificado', '2026-09-15 10:00:00-03'),
    ('00000000-0000-4000-8000-000000000009', 'Isabela Martins', '(00) 90000-0009', 'Casa de 2 quartos no bairro Primavera', 'site', 'qualificado', '2026-09-18 15:20:00-03'),
    ('00000000-0000-4000-8000-000000000010', 'João Teixeira', '(00) 90000-0010', 'Studio no Centro', 'site', 'perdido', '2026-09-20 17:00:00-03'),
    ('00000000-0000-4000-8000-000000000011', 'Karina Souza', '(00) 90000-0011', 'Terreno no Jardim das Flores', 'site', 'perdido', '2026-09-23 09:40:00-03'),
    ('00000000-0000-4000-8000-000000000012', 'Lucas Ribeiro', '(00) 90000-0012', 'Apartamento de 2 quartos na Vila Nova', 'site', 'perdido', '2026-09-26 12:00:00-03'),
    ('00000000-0000-4000-8000-000000000013', 'Marina Lopes', '(00) 90000-0013', 'Casa de 3 quartos no bairro Aurora', 'whatsapp', 'novo', '2026-09-01 11:00:00-03'),
    ('00000000-0000-4000-8000-000000000014', 'Nicolas Santos', '(00) 90000-0014', 'Apartamento de 1 quarto na Vila Nova', 'whatsapp', 'novo', '2026-09-05 14:00:00-03'),
    ('00000000-0000-4000-8000-000000000015', 'Olívia Castro', '(00) 90000-0015', 'Sala comercial no bairro Aurora', 'whatsapp', 'em_contato', '2026-09-09 16:00:00-03'),
    ('00000000-0000-4000-8000-000000000016', 'Pedro Freitas', '(00) 90000-0016', 'Terreno no bairro Vila Nova', 'whatsapp', 'em_contato', '2026-09-13 10:30:00-03'),
    ('00000000-0000-4000-8000-000000000017', 'Renata Barros', '(00) 90000-0017', 'Apartamento de 2 quartos no Centro', 'whatsapp', 'qualificado', '2026-09-16 13:15:00-03'),
    ('00000000-0000-4000-8000-000000000018', 'Sérgio Azevedo', '(00) 90000-0018', 'Casa no Jardim das Flores', 'whatsapp', 'qualificado', '2026-09-19 09:00:00-03'),
    ('00000000-0000-4000-8000-000000000019', 'Talita Mendes', '(00) 90000-0019', 'Studio no bairro Universitário', 'whatsapp', 'qualificado', '2026-09-22 15:00:00-03'),
    ('00000000-0000-4000-8000-000000000020', 'Vinícius Duarte', '(00) 90000-0020', 'Apartamento de 3 quartos no Centro', 'whatsapp', 'perdido', '2026-09-25 11:45:00-03'),
    ('00000000-0000-4000-8000-000000000021', 'Yasmin Moreira', '(00) 90000-0021', 'Casa de 2 quartos na Vila Nova', 'indicacao', 'em_contato', '2026-09-03 10:00:00-03'),
    ('00000000-0000-4000-8000-000000000022', 'André Campos', '(00) 90000-0022', 'Apartamento de 2 quartos no bairro Aurora', 'indicacao', 'qualificado', '2026-09-11 14:20:00-03'),
    ('00000000-0000-4000-8000-000000000023', 'Bianca Cardoso', '(00) 90000-0023', 'Terreno no bairro Primavera', 'indicacao', 'qualificado', '2026-09-17 16:30:00-03'),
    ('00000000-0000-4000-8000-000000000024', 'Caio Fernandes', '(00) 90000-0024', 'Sala comercial no Centro', 'indicacao', 'qualificado', '2026-09-24 08:45:00-03')
ON CONFLICT (id) DO NOTHING;

COMMIT;
