import { STATUS_OPTIONS } from '../constants/leads.js';

export default function LeadSummary({ leads }) {
  return (
    <section aria-labelledby="summary-title">
      <h2 id="summary-title">Resumo geral</h2>
      <dl className="summary-grid">
        <div className="summary-card summary-total">
          <dt>Total</dt>
          <dd>{leads.length}</dd>
        </div>
        {STATUS_OPTIONS.map((status) => (
          <div className="summary-card" key={status.value}>
            <dt>{status.summaryLabel}</dt>
            <dd>{leads.filter((lead) => lead.status === status.value).length}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
