# Case CRI

Case técnico Junior de leads imobiliários. Estrutura inicial, scripts de banco e
consulta de leads pelo backend implementados. Integração validada com os 24 leads
do Supabase real, incluindo campos e ordenação.

## Executar localmente

Pré-requisito: Node.js 24 ou superior e npm. Ambiente validado: Windows/PowerShell.

Em um terminal, a partir da raiz:

```powershell
cd backend
npm ci
# Na primeira configuração, se .env ainda não existir:
Copy-Item .env.example .env
# Preencha SUPABASE_URL e SUPABASE_SECRET_KEY no .env antes de iniciar.
npm run dev
```

Em outro terminal, a partir da raiz:

```powershell
cd frontend
npm ci
npm run dev
```

Abra http://127.0.0.1:5173 para ver a interface de leads. O endereço
http://127.0.0.1:3001/api/health deve retornar `{"status":"ok"}`.
http://127.0.0.1:5173/api/health deve retornar o mesmo JSON através do proxy.
Encerre cada processo com Ctrl+C.

## Configuração

O backend agora exige as configurações do Supabase ao iniciar. Preencha somente
o arquivo local `backend/.env` (ignorado pelo Git):

| Variável | Onde obter | Obrigatória |
|---|---|---|
| `SUPABASE_URL` | Painel do projeto Supabase → botão **Connect** → **Project URL** | Sim |
| `SUPABASE_SECRET_KEY` | **Settings → API Keys → Secret keys**, chave `sb_secret_...` | Sim |
| `PORT` | Definida localmente; padrão `3001` | Não |

Copie a URL e a chave do mesmo projeto que contém os 24 leads.
Use a URL raiz do projeto, sem `/rest/v1`: o SDK acrescenta o caminho da API.
Se ainda não houver uma Secret key, crie uma nessa seção do painel. Não use a chave publishable/anon,
nem a senha do PostgreSQL. A configuração desta implementação exige o formato novo
`sb_secret_...`, sem suporte à chave JWT legada `service_role`.
Não cole a chave em mensagens, no README ou em `.env.example`.

Se mudar a porta, ajuste também o destino do proxy em `frontend/vite.config.js`.
O frontend não precisa de variáveis de ambiente nesta etapa.
Nunca versione `.env` nem coloque secrets no frontend.
Reinicie o backend depois de alterar `.env`.

Dentro de `frontend`, `npm run build` gera `dist/` e `npm run preview` permite
conferir esse build localmente. O proxy `/api` foi configurado apenas para desenvolvimento.
Dentro de `backend`, `npm start` executa o servidor sem reinício automático.

Para habilitar a sugestão de mensagem, acrescente também em `backend/.env`:

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Preencha a chave localmente a partir de [API keys da OpenAI](https://platform.openai.com/api-keys).
Não envie a chave ao frontend, ao Git ou em mensagens. Reinicie o backend após configurar.
Sem chave ou modelo, a listagem continua funcionando e a geração responde 503.
Modelo configurado e validado: `gpt-4.1-mini`. Após regularizar o crédito da API,
passaram os testes reais de geração com três leads do seed e um interesse contendo
tentativa de instrução. Mantenha saldo disponível para novas chamadas.

Na interface, selecione um lead em **Lead para mensagem** e clique em **Gerar mensagem**.
Revise o texto antes de usar **Copiar mensagem**. Nada é enviado automaticamente.
O endpoint é `POST /api/leads/:id/message`, sem body, com sucesso `{ "message": "..." }`.

## API de leads — Etapa 3

`GET http://127.0.0.1:3001/api/leads` retorna HTTP 200 com `{ "leads": [...] }`.
Cada lead contém `id`, `name`, `phone`, `property_interest`, `source`, `status` e
`created_at`. Ordenação: `created_at` decrescente, com `id` crescente como desempate.
Não há filtros, paginação ou operações de escrita. Base vazia retorna `{ "leads": [] }`.

Exemplo com um item do seed; a resposta completa validada contém 24 itens:

```json
{
  "leads": [
    {
      "id": "00000000-0000-4000-8000-000000000012",
      "name": "Lucas Ribeiro",
      "phone": "(00) 90000-0012",
      "property_interest": "Apartamento de 2 quartos na Vila Nova",
      "source": "site",
      "status": "perdido",
      "created_at": "2026-09-26T15:00:00+00:00"
    }
  ]
}
```

Com o backend configurado e em execução, teste no PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3001/api/health
$response = Invoke-RestMethod http://127.0.0.1:3001/api/leads
$response.leads.Count # Esperado: 24 no projeto atual
$response.leads | Select-Object id, source, status, created_at
```

Compare os IDs e campos com `public.leads` no Supabase; confirme a ordem decrescente
de criação. O endpoint `/api/health` verifica o processo HTTP, não a conexão ao banco.
Uma falha de consulta retorna HTTP 500 com
`{"error":"Não foi possível consultar os leads. Tente novamente mais tarde."}`.
Uma rota inexistente continua retornando HTTP 404.

Sem as variáveis obrigatórias, com URL inválida ou com tipo de chave incorreto, o
processo falha ao iniciar, indicando os nomes das configurações sem imprimir seus valores.
Uma chave com formato correto mas inválida só pode ser rejeitada pelo serviço remoto
na consulta. Confira projeto, chave e permissões se o endpoint retornar 500.

### RLS e credencial do backend

A Secret key usa o papel `service_role`, que tem `BYPASSRLS`. RLS continua habilitada,
mas suas políticas não restringem esse cliente. A chave tem privilégios elevados,
não é uma credencial somente de leitura; deve ficar exclusivamente no servidor.
O código desta etapa expõe apenas uma consulta com campos explícitos.
Não foram alterados schema, grants ou políticas. Se faltar permissão de tabela ao
papel, isso ainda pode causar erro; contornar RLS não dispensa grants.

Em uma arquitetura com acesso direto pelo navegador, usaríamos uma chave publishable
com políticas RLS e grants adequados; para dados privados, também autenticação e
políticas por usuário. Isso seria outra arquitetura, fora desta etapa. Sem políticas
de leitura, a chave pública não teria acesso às linhas atuais.

Esta API não tem autenticação, conforme o escopo: quem alcançar o backend pode
consultar os leads. O servidor permanece vinculado a `127.0.0.1` para uso local.
Revisar acesso antes de publicar ou usar dados reais.
Referência: [API keys do Supabase](https://supabase.com/docs/guides/getting-started/api-keys).

## Banco de dados — Etapa 2

No SQL Editor de um projeto Supabase de desenvolvimento, execute separadamente,
com o papel administrativo padrão, nesta ordem:

1. [database/schema.sql](database/schema.sql): cria `public.leads`, tipos, constraints e RLS.
2. [database/seed.sql](database/seed.sql): insere 24 leads fictícios.
3. [database/queries.sql](database/queries.sql): execute cada consulta selecionada para
   visualizar os três resultados analíticos e a distribuição de conferência.

O schema deve ser executado somente uma vez, em banco sem `public.leads`.
Se a tabela já existir, o script falha sem substituir dados ou estrutura.
O seed pode ser repetido: IDs existentes são ignorados, sem apagar ou atualizar dados.
Use um banco dedicado ao case; os totais abaixo pressupõem somente os dados do seed.

| Origem | Novos | Em contato | Qualificados | Perdidos | Total | % qualificados | % perdidos |
|---|---:|---:|---:|---:|---:|---:|---:|
| site | 4 | 3 | 2 | 3 | 12 | 16,67% | 25,00% |
| whatsapp | 2 | 2 | 3 | 1 | 8 | 37,50% | 12,50% |
| indicacao | 0 | 1 | 3 | 0 | 4 | 75,00% | 0,00% |
| Total | 6 | 6 | 8 | 4 | 24 | 33,33% | 16,67% |

Respostas da análise:

- **Maior volume:** site, com 12 leads (50% dos 24).
- **Qualificados por origem:** indicação 75%, WhatsApp 37,5% e site 16,67%.
  Cada percentual usa o total da própria origem como denominador.
- **Terceiro insight:** site também tem a maior proporção de perdidos (25%),
  seguido de WhatsApp (12,5%) e indicação (0%). Isso descreve uma amostra fictícia
  pequena; não demonstra causalidade nem desempenho real de campanhas.

As consultas tratam empates, valores zero e base vazia. Sem leads em uma origem,
seu percentual é `NULL` (não calculável); com leads e nenhum qualificado/perdido,
é 0%. Os percentuais globais são calculados por 8/24 e 4/24, e não pela média
simples dos percentuais das origens.

Para validar: confira a tabela acima, repita o seed e confirme que continuam 24
registros. RLS está ativa sem políticas públicas: leitura anônima não está
liberada. O SQL Editor administrativo consegue consultar; a integração da aplicação
é feita pelo backend. Os telefones têm DDD 00 e são apenas demonstrativos.

Scripts executados pelo assistente em PostgreSQL 18 local isolado. O usuário também
confirmou execução e validação de schema, seed e queries no Supabase, com 24 registros.

## Estado do projeto

Há scripts SQL validados e código de consulta ao Supabase implementado no backend,
com consulta validada nos 24 registros do Supabase real. A interface de leads está
implementada e aprovada. A sugestão com IA foi validada com OpenAI real pelo endpoint
e pela interface, sem persistência ou envio automático de mensagens.
Decisões e próximos passos estão em [docs/development-notes.md](docs/development-notes.md).
