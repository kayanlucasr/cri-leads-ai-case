import { SOURCE_LABELS, STATUS_OPTIONS } from '../constants/leads.js';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

export default function LeadTable({ leads, hasLeads }) {
  if (leads.length === 0) {
    return (
      <p className="state-message" role="status">
        {hasLeads
          ? 'Nenhum lead corresponde ao status selecionado. Selecione Todos ou outro status.'
          : 'Nenhum lead encontrado.'}
      </p>
    );
  }

  return (
    <div className="table-scroll" role="region" aria-label="Tabela de leads" tabIndex={0}>
      <table>
        <caption className="visually-hidden">Leads ordenados do mais recente para o mais antigo</caption>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Telefone</th>
            <th scope="col">Imóvel de interesse</th>
            <th scope="col">Origem</th>
            <th scope="col">Status</th>
            <th scope="col">Data de criação</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const status = STATUS_OPTIONS.find((option) => option.value === lead.status);
            const date = new Date(lead.created_at);

            return (
              <tr key={lead.id}>
                <th scope="row">{lead.name}</th>
                <td className="nowrap">{lead.phone}</td>
                <td className="property-cell">{lead.property_interest}</td>
                <td>{SOURCE_LABELS[lead.source] ?? lead.source}</td>
                <td><span className={`status-badge status-${status?.value ?? 'unknown'}`}>{status?.label ?? lead.status}</span></td>
                <td className="nowrap">
                  {Number.isNaN(date.getTime())
                    ? 'Data indisponível'
                    : <time dateTime={lead.created_at}>{dateFormatter.format(date)}</time>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
