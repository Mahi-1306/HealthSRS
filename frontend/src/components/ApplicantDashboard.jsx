import { useEffect, useState } from 'react';
import { CheckCircle2, Edit3, PlusCircle, Send } from 'lucide-react';
import { api } from '../api.js';
import { StatusBadge } from './StatusBadge.jsx';

const EMPTY_FORM = {
  specialization: 'Nutrition & Weight Management',
  certification: '',
  experienceYears: 1,
  phoneNumber: '',
  bio: '',
};

const SPECIALIZATIONS = [
  'Nutrition & Weight Management',
  'Fitness & Exercise',
  'Mental Health & Wellness',
  'Chronic Disease Management',
  'Preventive & Lifestyle Medicine',
];

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadApplications() {
    setLoading(true);
    try {
      const data = await api.getMyApplications();
      setApplications(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        experienceYears: Number(form.experienceYears),
      };
      if (editingId) {
        await api.updateApplication(editingId, payload);
        setSuccess('Application updated successfully.');
      } else {
        await api.createApplication(payload);
        setSuccess('Application submitted for review.');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadApplications();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(app) {
    setEditingId(app.id);
    setForm({
      specialization: app.specialization,
      certification: app.certification,
      experienceYears: app.experienceYears,
      phoneNumber: app.phoneNumber || '',
      bio: app.bio || '',
    });
    setError('');
    setSuccess('');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <PlusCircle className="h-5 w-5 text-emerald-600" />
            {editingId ? `Edit Application #${editingId}` : 'New Coach Application'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Specialization
            </label>
            <select
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Certification
            </label>
            <input
              type="text"
              required
              value={form.certification}
              onChange={(e) => setForm({ ...form, certification: e.target.value })}
              placeholder="e.g. NBHWC Certified Health Coach"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Experience (Years)
              </label>
              <input
                type="number"
                min={0}
                max={60}
                required
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Phone Number
              </label>
              <input
                type="text"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                placeholder="+1-555-0199"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Background &amp; Coaching Summary
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Describe your coaching methodology and relevant clinical or wellness experience..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Submit Application'}
          </button>
        </form>
      </div>

      <div className="space-y-4 lg:col-span-7">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">My Submitted Applications</h2>
          <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            {applications.length} total
          </span>
        </div>

        {loading ? (
          <div className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            You haven&apos;t submitted any Health Coach applications yet. Use the form on the left to apply.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900">{app.specialization}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {app.certification} · {app.experienceYears} yrs experience
                    </p>
                  </div>
                  {app.status !== 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => startEdit(app)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )}
                </div>

                {app.bio && <p className="mt-3 text-sm text-slate-600">{app.bio}</p>}

                {app.reviewerNotes && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Reviewer Notes: </span>
                    {app.reviewerNotes}
                  </div>
                )}

                <p className="mt-3 text-xs text-slate-400">
                  Submitted {app.submissionDate ? new Date(app.submissionDate).toLocaleString() : 'recently'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
