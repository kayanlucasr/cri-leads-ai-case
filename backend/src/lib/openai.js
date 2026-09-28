import OpenAI from 'openai';

let client;

export function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim();

  if (!apiKey || !model) {
    const error = new Error('Configure OPENAI_API_KEY e OPENAI_MODEL no backend.');
    error.code = 'AI_NOT_CONFIGURED';
    throw error;
  }

  // Inicialização sob demanda mantém a listagem disponível sem configurar IA.
  client ??= new OpenAI({ apiKey, timeout: 30_000, maxRetries: 0 });
  return { client, model };
}
