import express from 'express';
import leadsRouter from './routes/leads.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT deve ser um número inteiro entre 1 e 65535.');
  process.exit(1);
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/leads', leadsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Backend disponível em http://127.0.0.1:${port}`);
});

server.on('error', (error) => {
  console.error(
    error.code === 'EADDRINUSE'
      ? `A porta ${port} já está em uso.`
      : 'Não foi possível iniciar o servidor.',
  );
  process.exit(1);
});
