const STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  UNDER_REVIEW: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

const ROLE_STYLES = {
  ADMIN: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  REVIEWER: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  APPLICANT: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 ring-slate-500/20';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

export function RoleBadge({ role }) {
  const style = ROLE_STYLES[role] || 'bg-slate-100 text-slate-700 ring-slate-500/20';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}>
      {role}
    </span>
  );
}
