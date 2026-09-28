import { useRef, useState } from 'react';
import { generateLeadMessage } from '../services/api.js';

export default function MessageSuggestion({ leads }) {
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const generating = useRef(false);
  const selectedLead = leads.find((lead) => lead.id === selectedId);

  function selectLead(event) {
    setSelectedId(event.target.value);
    setMessage('');
    setError('');
    setCopyStatus('');
  }

  async function handleGenerate(event) {
    event.preventDefault();
    if (!selectedLead || generating.current) return;

    generating.current = true;
    setLoading(true);
    setMessage('');
    setError('');
    setCopyStatus('');
    try {
      setMessage(await generateLeadMessage(selectedLead.id));
    } catch (error) {
      setError(error instanceof TypeError
        ? 'Não foi possível conectar ao backend. Verifique a conexão e tente novamente.'
        : error.message || 'Não foi possível gerar a sugestão. Tente novamente.');
    } finally {
      generating.current = false;
      setLoading(false);
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus('Mensagem copiada.');
    } catch {
      setCopyStatus('Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.');
    }
  }

  return (
    <section className="message-panel" aria-labelledby="message-title">
      <h2 id="message-title">Sugestão de primeira mensagem</h2>
      <p className="table-note">Gerada por IA para revisão humana. Nenhuma mensagem será enviada automaticamente.</p>
      <form className="message-form" onSubmit={handleGenerate}>
        <div className="message-lead-select">
          <label htmlFor="message-lead">Lead para mensagem</label>
          <select id="message-lead" value={selectedId} onChange={selectLead} disabled={loading || leads.length === 0}>
            <option value="">Selecione um lead</option>
            {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name}</option>)}
          </select>
        </div>
        <button type="submit" disabled={!selectedLead || loading}>
          {loading ? 'Gerando...' : 'Gerar mensagem'}
        </button>
      </form>
      {selectedLead && (
        <p className="selected-lead"><strong>{selectedLead.name}</strong> — {selectedLead.property_interest}</p>
      )}
      {loading && <p role="status">Gerando sugestão de mensagem...</p>}
      {error && <p className="state-message error-message" role="alert">{error}</p>}
      {message && (
        <div className="message-result">
          <p className="generated-message" role="status">{message}</p>
          <button className="secondary-button" type="button" onClick={copyMessage}>Copiar mensagem</button>
          {copyStatus && <p className="table-note" role="status">{copyStatus}</p>}
        </div>
      )}
    </section>
  );
}
