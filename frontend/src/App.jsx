import { useEffect, useState } from 'react';
import LeadSummary from './components/LeadSummary.jsx';
import StatusFilter from './components/StatusFilter.jsx';
import LeadTable from './components/LeadTable.jsx';
import MessageSuggestion from './components/MessageSuggestion.jsx';
import { getLeads } from './services/api.js';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeads() {
      try {
        const data = await getLeads({ signal: controller.signal });
        if (!controller.signal.aborted) setLeads(data);
      } catch {
        if (!controller.signal.aborted) {
          setError('Não foi possível carregar os leads. Verifique se o backend está em execução e recarregue a página.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadLeads();
    return () => controller.abort();
  }, []);

  const filteredLeads = status ? leads.filter((lead) => lead.status === status) : leads;

  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Case CRI</p>
        <h1>Leads imobiliários</h1>
        <p>Acompanhe os interessados e consulte o status de cada lead.</p>
      </header>

      {loading && <p className="state-message" role="status">Carregando leads...</p>}
      {!loading && error && <p className="state-message error-message" role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <LeadSummary leads={leads} />
          <MessageSuggestion leads={leads} />
          <section className="leads-section" aria-labelledby="leads-title">
            <div className="list-header">
              <div>
                <h2 id="leads-title">Lista de leads</h2>
                <p className="results-count" role="status">
                  {filteredLeads.length} {filteredLeads.length === 1 ? 'lead encontrado' : 'leads encontrados'}
                </p>
              </div>
              <StatusFilter value={status} onChange={setStatus} />
            </div>
            <LeadTable leads={filteredLeads} hasLeads={leads.length > 0} />
            <p className="table-note">Datas e horários de Brasília (São Paulo).</p>
          </section>
        </>
      )}
    </main>
  );
}
