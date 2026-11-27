import { useEffect, useMemo, useState } from 'react';
import { Check, Clock, X } from 'lucide-react';
import { api } from '../api.js';
import { StatusBadge } from './StatusBadge.jsx';

export default function ReviewerDashboard() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [notesById, setNotesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  async function loadQueue() {
    setLoading(true);
    try {
      const data = await api.getReviewApplications();
      setApplications(data || []);
      const initialNotes = {};
      (data || []).forEach((a) => {
        initialNotes[a.id] = a.reviewerNotes || '';
      });
      setNotesById(initialNotes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQueue();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return applications;
    return applications.filter((a) => a.status === filter);
  }, [applications, filter]);

  async function updateStatus(id, status) {
    setUpdatingId(id);
    setError('');
    try {
      await api.updateApplicationStatus(id, {
        status,
        reviewerNotes: notesById[id] || '',
      });
      await loadQueue();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Review Queue</h1>
          <p className="text-sm text-slate-500">
            Evaluate submitted coach credentials. Approving an application adds the coach to the directory.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No applications in this status filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div key={app.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-900">{app.applicant?.name}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-xs text-slate-500">{app.applicant?.email}</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {app.specialization} · {app.certification} · {app.experienceYears} yrs experience
                  </p>
                  {app.bio && <p className="mt-2 text-sm text-slate-600">{app.bio}</p>}
                </div>

                <div className="text-right text-xs text-slate-400">
                  <div>App #{app.id}</div>
                  <div>{app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : ''}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={notesById[app.id] ?? ''}
                  onChange={(e) => setNotesById({ ...notesById, [app.id]: e.target.value })}
                  placeholder="Add reviewer feedback or credential verification notes..."
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={updatingId === app.id}
                    onClick={() => updateStatus(app.id, 'UNDER_REVIEW')}
                    className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 disabled:opacity-50"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    In Review
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === app.id}
                    onClick={() => updateStatus(app.id, 'APPROVED')}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === app.id}
                    onClick={() => updateStatus(app.id, 'REJECTED')}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
