# Case CRI

Case técnico Junior de leads imobiliários. Somente a estrutura inicial está implementada.

## Executar localmente

Pré-requisito: Node.js 24 ou superior e npm. Ambiente validado: Windows/PowerShell.

Em um terminal, a partir da raiz:

```powershell
cd backend
npm ci
npm run dev
```

Em outro terminal, a partir da raiz:

```powershell
cd frontend
npm ci
npm run dev
```

Abra http://127.0.0.1:5173 para ver a página inicial. O endereço
http://127.0.0.1:3001/api/health deve retornar `{"status":"ok"}`.
http://127.0.0.1:5173/api/health deve retornar o mesmo JSON através do proxy.
Encerre cada processo com Ctrl+C.

## Configuração

O backend funciona sem `.env` nesta etapa. Para configurar a porta, execute
`Copy-Item .env.example .env` dentro de `backend` e edite `PORT`.
Se mudar a porta, ajuste também o destino do proxy em `frontend/vite.config.js`.
O frontend não precisa de variáveis de ambiente nesta etapa.
Nunca versione `.env` nem coloque secrets no frontend.

Dentro de `frontend`, `npm run build` gera `dist/` e `npm run preview` permite
conferir esse build localmente. O proxy `/api` foi configurado apenas para desenvolvimento.
Dentro de `backend`, `npm start` executa o servidor sem reinício automático.

## Estado do projeto

Ainda não há banco, interface de leads ou integração com IA. Os diretórios vazios
contêm `.gitkeep` para preservar a estrutura no Git.
Decisões e próximos passos estão em [docs/development-notes.md](docs/development-notes.md).
