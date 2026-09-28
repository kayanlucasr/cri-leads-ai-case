# Notas de desenvolvimento

## Decisões aprovadas

- React + Vite e JavaScript no frontend; Node.js + Express no backend.
- Supabase/PostgreSQL para persistência e OpenAI API para sugestão de mensagem,
  ambos acessados pelo backend nas próximas etapas.
- Cadastro inicial via SQL, com pelo menos 20 leads fictícios variados. Sem CRUD nesta versão.
- Prioridades: funcionamento ponta a ponta, legibilidade, responsabilidades claras,
  tratamento básico de erros e credenciais protegidas.
- Rate limiting, timeouts avançados e proteção adicional contra abuso ficam como melhorias futuras.
- Mudanças arquiteturais relevantes devem ser apresentadas antes da implementação.
- Cada etapa depende de confirmação do usuário antes de avançar.

## Etapa 1 — estrutura inicial

- Impacto baixo: diretório inicialmente vazio, sem funcionalidades existentes.
- Dois pacotes npm independentes, sem gerenciador de monorepo ou processo adicional.
- Node.js 24 como versão mínima do projeto, alinhada ao ambiente disponível (24.13.0; npm 11.6.2).
- ES modules em ambos os pacotes.
- Recursos nativos do Node carregam `.env` opcional e reiniciam o servidor em desenvolvimento;
  não é necessário instalar dotenv ou nodemon.
- Dependências diretas: React/React DOM 19.3.0, Vite 8.3.1,
  plugin React 6.1.1 e Express 5.2.1. Lockfiles preservam a resolução da instalação.
- Página inicial estática apenas para verificar React; sem interface de leads.
- GET /api/health verifica somente que o backend responde, não banco ou IA.
- Rota inexistente retorna 404 em JSON; porta inválida ou ocupada tem mensagem de erro.
- Serviços locais vinculados a 127.0.0.1. Vite usa porta 5173 e encaminha /api ao backend na 3001.
- O proxy evita configuração de CORS no desenvolvimento. Publicação e roteamento de produção serão decididos depois.
- .env.example contém apenas PORT. Nenhuma credencial é necessária nesta etapa.
- Diretórios reservados usam .gitkeep; implementações futuras serão criadas somente na etapa correspondente.
- README inicial contém execução e validação; documentação final será consolidada posteriormente.

## Dificuldades

- A consulta inicial ao npm foi bloqueada pelo ambiente restrito (ENOTCACHED).
  A consulta e a instalação foram repetidas com autorização de rede. Não foi um erro da aplicação.
- O ambiente restrito também bloqueou subprocessos do Vite e do Node watch (EPERM).
  Build e servidores funcionaram após execução autorizada fora dessa restrição.

## Validação da Etapa 1

- Instalações concluídas; npm reportou zero vulnerabilidades nos dois pacotes naquele momento.
- npm run build do frontend concluído com sucesso.
- npm run dev iniciou frontend e backend sem arquivo .env.
- HTTP 200 na página inicial e no módulo React transformado pelo Vite.
- GET /api/health retornou status ok tanto diretamente na porta 3001 como pelo proxy na 5173.
- Rota inexistente retornou HTTP 404 em JSON.
- PORT inválida e porta ocupada encerraram o processo com código 1 e mensagem compreensível.
- git check-ignore confirmou exclusão de .env, variantes locais, node_modules e dist;
  .env.example permanece versionável.
- Git inicializado na branch main, sem commit e sem remoto configurado.
- Validação por build e HTTP; não foi feita inspeção visual em navegador.

## Requisitos preservados para a Etapa 2 (não implementada)

- Campos: id, name, phone, property_interest, source, status e created_at.
- source: site, whatsapp, indicacao.
- status: novo, em_contato, qualificado, perdido.
- A interface poderá traduzir os valores, como Indicação e Em contato.
- database/queries.sql deverá identificar explicitamente:
  1. Qual origem gerou mais leads? Preservar empates no resultado.
  2. Qual o percentual de leads qualificados em cada origem?
     Denominador: total de leads daquela origem.
  3. Qual outro padrão relevante pode ser observado? Proposta: comparar a proporção
     de perdidos por origem, descrevendo apenas os dados fictícios, sem inferir causalidade.
- schema.sql, seed.sql e queries.sql serão criados somente após autorização da próxima etapa.

## Limitações e melhorias futuras

- Sem integração de Supabase ou OpenAI, sem login e sem funcionalidade de leads nesta etapa.
- Dados reais e exposição pública exigirão revisão de acesso e custos.
- Modelo OpenAI ainda será definido; não há SDK ou chave de IA configurados.
- Lint e testes de funcionalidades serão considerados nas etapas correspondentes.
