import { STATUS_OPTIONS } from '../constants/leads.js';

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="status-filter">
      <label htmlFor="status-filter">Filtrar por status</label>
      <select id="status-filter" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Todos</option>
        {STATUS_OPTIONS.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </select>
    </div>
  );
}
