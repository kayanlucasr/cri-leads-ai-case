export async function getLeads({ signal } = {}) {
  const response = await fetch('/api/leads', { signal });

  if (!response.ok) {
    throw new Error('Não foi possível carregar os leads.');
  }

  const data = await response.json();
  if (!Array.isArray(data.leads)) {
    throw new Error('Resposta de leads inválida.');
  }

  return data.leads;
}

export async function generateLeadMessage(id) {
  const response = await fetch(`/api/leads/${encodeURIComponent(id)}/message`, { method: 'POST' });

  if (!response.ok) {
    const messages = {
      400: 'O identificador do lead é inválido.',
      404: 'Lead não encontrado. Recarregue a lista.',
      422: 'Os dados deste lead não permitem gerar uma sugestão.',
      503: 'Geração indisponível. Configure a chave e o modelo da OpenAI no backend.',
    };
    throw new Error(messages[response.status] ?? 'Não foi possível gerar a mensagem. Tente novamente mais tarde.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('A geração retornou uma resposta inválida. Tente novamente.');
  }
  if (typeof data?.message !== 'string' || !data.message.trim()) {
    throw new Error('A geração retornou uma resposta inválida. Tente novamente.');
  }
  return data.message;
}
