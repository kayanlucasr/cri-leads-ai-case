import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL?.trim();
const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();

if (!url || !secretKey) {
  throw new Error(
    'Configure SUPABASE_URL e SUPABASE_SECRET_KEY no ambiente do backend (backend/.env).',
  );
}

// Valida sem incluir os valores recebidos nas mensagens de erro.
let parsedUrl;
try {
  parsedUrl = new URL(url);
} catch {
  throw new Error('SUPABASE_URL deve ser uma URL HTTPS válida do projeto Supabase.');
}

if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) {
  throw new Error('SUPABASE_URL deve ser uma URL HTTPS válida do projeto Supabase.');
}

if (!secretKey.startsWith('sb_secret_')) {
  throw new Error('SUPABASE_SECRET_KEY deve ser uma Secret key (sb_secret_...) do servidor.');
}

export const supabase = createClient(url, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
