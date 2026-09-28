# Case Técnico CRI — Leads com IA

Mini sistema de captação e atendimento inicial de leads imobiliários desenvolvido como case técnico para a vaga de **Desenvolvedor Jr — Agentes de IA**.

A aplicação permite consultar e filtrar leads armazenados no Supabase, visualizar indicadores por status e utilizar IA para gerar uma sugestão personalizada de primeira mensagem para cada lead.

O projeto foi desenvolvido priorizando **simplicidade, clareza, separação de responsabilidades e funcionamento ponta a ponta**, evitando complexidade desnecessária para o escopo proposto.

---

## Funcionalidades

- Listagem dos leads cadastrados
- Filtro por status
- Resumo visual dos leads por status
- Persistência em PostgreSQL através do Supabase
- Análise dos dados através de consultas SQL
- Geração de primeira mensagem personalizada utilizando IA
- Estados de carregamento, erro e ausência de resultados
- Separação entre frontend, backend e serviços externos
- Credenciais sensíveis mantidas exclusivamente no backend

---

## Arquitetura

```text
                  ┌─────────────────┐
                  │  React + Vite   │
                  │    Frontend     │
                  └────────┬────────┘
                           │
                       HTTP / JSON
                           │
                           ▼
                  ┌─────────────────┐
                  │ Node.js/Express │
                  │     Backend     │
                  └───────┬─────────┘
                          │
                 ┌────────┴────────┐
                 │                 │
                 ▼                 ▼
          ┌─────────────┐    ┌─────────────┐
          │  Supabase   │    │ OpenAI API  │
          │ PostgreSQL  │    │gpt-4.1-mini │
          └─────────────┘    └─────────────┘
```

O frontend não acessa diretamente o banco de dados nem a OpenAI.

O backend centraliza essas integrações, mantendo credenciais sensíveis fora do navegador e separando a interface das regras de acesso aos serviços externos.

---

## Tecnologias

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- Supabase JS SDK
- OpenAI SDK

### Banco de dados

- PostgreSQL
- Supabase

### Inteligência Artificial

- OpenAI API
- `gpt-4.1-mini`

---

## Estrutura do projeto

```text
Case CRI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── queries.sql
│
├── docs/
│   └── development-notes.md
│
├── .gitignore
└── README.md
```

---

# Banco de dados

A entidade principal do projeto é `leads`.

Cada lead possui:

- nome;
- telefone;
- imóvel de interesse;
- origem;
- status;
- data de criação.

As origens disponíveis são:

```text
site
whatsapp
indicacao
```

Os status disponíveis são:

```text
novo
em_contato
qualificado
perdido
```

O banco utiliza constraints para impedir valores inválidos e possui RLS habilitada.

Foram criados **24 leads fictícios** distribuídos entre diferentes origens e status.

Os telefones utilizados são apenas demonstrativos.

---

## Scripts SQL

Os scripts estão disponíveis em:

```text
database/
├── schema.sql
├── seed.sql
└── queries.sql
```

No SQL Editor do Supabase, execute:

1. `schema.sql`
2. `seed.sql`
3. `queries.sql`

O `schema.sql` cria a estrutura da tabela.

O `seed.sql` insere os 24 registros fictícios e pode ser executado novamente sem duplicar os registros existentes.

O `queries.sql` contém as consultas utilizadas na análise dos dados.

---

# Análise dos dados

As consultas SQL foram utilizadas para responder às questões propostas no case.

| Origem | Leads | Qualificados | % Qualificados | Perdidos | % Perdidos |
|---|---:|---:|---:|---:|---:|
| Site | 12 | 2 | 16,67% | 3 | 25,00% |
| WhatsApp | 8 | 3 | 37,50% | 1 | 12,50% |
| Indicação | 4 | 3 | 75,00% | 0 | 0,00% |
| **Total** | **24** | **8** | **33,33%** | **4** | **16,67%** |

### Origem com maior volume

O **site** gerou 12 dos 24 leads da amostra, representando 50% do total.

### Percentual de qualificados

A origem **indicação** apresentou a maior proporção de leads qualificados na amostra:

```text
Indicação    75,00%
WhatsApp     37,50%
Site         16,67%
```

### Padrão adicional observado

O site também apresentou a maior proporção de leads perdidos:

```text
Site         25,00%
WhatsApp     12,50%
Indicação     0,00%
```

Esses resultados representam apenas padrões observados em uma **amostra pequena e fictícia** e não permitem inferir causalidade ou desempenho real das diferentes origens.

---

# Interface

A interface React consome os dados através do backend:

```text
React
   ↓
GET /api/leads
   ↓
Express
   ↓
Supabase
   ↓
PostgreSQL
```

A tela permite:

- visualizar os 24 leads;
- filtrar por status;
- visualizar quantidade de leads por status;
- acompanhar o total de registros;
- selecionar um lead para geração de mensagem com IA.

Os filtros são realizados no frontend porque a base possui apenas 24 registros.

Para uma base significativamente maior, filtros e paginação seriam movidos para o backend.

---

# Automação com IA

A aplicação permite selecionar um lead e solicitar uma sugestão de primeira mensagem de atendimento.

O fluxo é:

```text
Lead selecionado
       ↓
POST /api/leads/:id/message
       ↓
Express
       ↓
Busca do lead no Supabase
       ↓
name + property_interest
       ↓
OpenAI API
       ↓
gpt-4.1-mini
       ↓
Sugestão de mensagem
       ↓
Revisão humana
```

O backend recupera os dados do lead diretamente do banco e envia ao modelo apenas as informações necessárias:

- nome;
- imóvel de interesse.

A IA é orientada a produzir uma mensagem:

- curta;
- cordial;
- profissional;
- natural;
- relacionada ao interesse informado.

Também é instruída a **não inventar**:

- preços;
- disponibilidade;
- localização;
- características não informadas;
- condições comerciais.

A mensagem gerada é apresentada como **sugestão para revisão humana**.

Nada é enviado automaticamente ao lead.

---

## Por que uma implementação stateless?

Embora o case utilize o termo **agente**, a implementação foi intencionalmente mantida simples e stateless.

Não foram utilizados:

- memória;
- ferramentas externas;
- RAG;
- embeddings;
- banco vetorial;
- frameworks de agentes.

O requisito consiste em transformar os dados de um lead em uma sugestão de primeira resposta.

Adicionar essas camadas aumentaria a complexidade sem trazer benefício proporcional para esta versão.

---

# API

## Health check

```http
GET /api/health
```

Resposta:

```json
{
  "status": "ok"
}
```

---

## Listar leads

```http
GET /api/leads
```

Resposta:

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

Os leads são ordenados por data de criação, do mais recente para o mais antigo.

---

## Gerar sugestão de mensagem

```http
POST /api/leads/:id/message
```

Não é necessário enviar body.

O backend utiliza o ID para buscar o lead diretamente no banco.

Resposta:

```json
{
  "message": "..."
}
```

---

# Como executar

## Pré-requisitos

- Node.js
- npm
- Projeto Supabase configurado
- Chave da OpenAI para utilizar a geração de mensagens

Clone o repositório:

```bash
git clone https://github.com/kayanlucasr/cri-leads-ai-case.git
cd cri-leads-ai-case
```

---

## Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm ci
```

Crie o `.env` a partir do exemplo disponível:

```text
.env.example → .env
```

Configure:

```env
PORT=3001

SUPABASE_URL=
SUPABASE_SECRET_KEY=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

As credenciais devem existir apenas no ambiente do backend.

Nunca versione o arquivo `.env`.

Execute:

```bash
npm run dev
```

O backend estará disponível em:

```text
http://127.0.0.1:3001
```

---

## Frontend

Em outro terminal:

```bash
cd frontend
npm ci
npm run dev
```

Acesse:

```text
http://127.0.0.1:5173
```

Durante o desenvolvimento, o Vite utiliza proxy para encaminhar `/api` ao backend.

---

## Build do frontend

```bash
cd frontend
npm run build
```

O build será gerado em:

```text
frontend/dist/
```

---

# Segurança e credenciais

As credenciais do Supabase e da OpenAI ficam exclusivamente no backend.

O projeto não utiliza secrets em variáveis `VITE_` nem envia essas informações ao navegador.

O arquivo:

```text
backend/.env
```

é ignorado pelo Git.

O arquivo:

```text
backend/.env.example
```

contém somente os nomes das configurações necessárias.

A Secret key utilizada pelo backend possui privilégios elevados e, portanto, nunca deve ser exposta ao frontend.

Para uma aplicação real com múltiplos usuários, seriam necessárias políticas de autorização e autenticação adequadas ao domínio.

---

# Principais decisões técnicas

### Por que React?

Permite organizar a interface em componentes simples e controlar de forma clara os estados de carregamento, filtros, erros e geração da mensagem.

### Por que Express?

O backend centraliza o acesso ao banco e à OpenAI, mantendo credenciais sensíveis fora do navegador e separando a interface das integrações externas.

### Por que Supabase?

O Supabase foi a tecnologia sugerida pelo próprio case e fornece PostgreSQL gerenciado com integração simples ao backend.

### Por que PostgreSQL?

O modelo relacional atende diretamente à estrutura dos leads e permite realizar as análises solicitadas através de SQL simples e reproduzível.

### Por que filtrar no frontend?

Com apenas 24 registros, carregar os leads uma vez e realizar o filtro localmente mantém a solução simples.

Em uma aplicação com volume maior, filtros e paginação seriam executados no backend.

### Por que `gpt-4.1-mini`?

A tarefa consiste em gerar uma mensagem curta a partir de poucas informações.

Um modelo menor atende ao requisito sem utilizar um modelo mais robusto do que o necessário.

### Por que não usar um framework de agentes?

O requisito não exige memória, ferramentas ou orquestração.

Uma chamada stateless mantém a solução proporcional ao problema e mais simples de manter e explicar.

---

# Tratamento de erros

A aplicação trata situações como:

- falha ao consultar os leads;
- configuração ausente;
- ID inválido;
- lead inexistente;
- indisponibilidade da OpenAI;
- falha durante geração da mensagem;
- ausência de resultados para determinado filtro.

As mensagens apresentadas ao frontend evitam expor detalhes internos ou credenciais.

---

# Limitações

Esta implementação foi construída especificamente para o escopo do case.

Atualmente:

- não existe autenticação;
- não existe cadastro de leads pela interface;
- não existe edição ou exclusão;
- não existe envio automático de mensagens;
- mensagens geradas não são persistidas;
- filtros são executados no frontend;
- não existe paginação;
- a API foi projetada inicialmente para demonstração do case.

---

# Melhorias futuras

Em uma evolução do projeto, poderiam ser adicionados:

- autenticação e autorização;
- políticas RLS por usuário;
- cadastro e atualização de leads;
- paginação e filtros no backend;
- histórico das mensagens geradas;
- testes automatizados;
- rate limiting para geração com IA;
- observabilidade e métricas;
- configuração separada por ambiente;
- deploy automatizado com CI/CD.

---

# Validação

Durante o desenvolvimento foram validados:

- schema PostgreSQL;
- constraints;
- seed idempotente;
- consultas analíticas;
- execução no Supabase;
- 24 registros cadastrados;
- integração Express → Supabase;
- listagem através da API;
- filtros da interface;
- indicadores por status;
- integração real com a OpenAI;
- geração utilizando diferentes leads;
- tratamento de texto de interesse contendo tentativa de instrução;
- estados de loading e erro;
- build do frontend.

Os scripts SQL foram validados localmente em PostgreSQL e posteriormente executados e conferidos no Supabase.

---

# Documentação técnica

Detalhes adicionais sobre decisões tomadas durante o desenvolvimento, dificuldades encontradas e validações realizadas estão disponíveis em:

```text
docs/development-notes.md
```

---

## Autor

**Kayan Lucas Ribeiro**

Projeto desenvolvido para o case técnico CRI — Desenvolvedor Jr, Agentes de IA.