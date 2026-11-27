import { useEffect, useMemo, useState } from 'react';
import { Award, BriefcaseMedical, Phone, Search, Sparkles } from 'lucide-react';
import { api } from '../api.js';

export default function CoachDirectory({ onApplyClick, user }) {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('ALL');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getCoaches()
      .then((data) => {
        if (mounted) setCoaches(data || []);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const specializations = useMemo(() => {
    const specs = new Set(coaches.map((c) => c.specialization).filter(Boolean));
    return ['ALL', ...Array.from(specs)];
  }, [coaches]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return coaches.filter((c) => {
      const matchesSpec = selectedSpec === 'ALL' || c.specialization === selectedSpec;
      const matchesQuery =
        !q ||
        c.name?.toLowerCase().includes(q) ||
        c.specialization?.toLowerCase().includes(q) ||
        c.certification?.toLowerCase().includes(q);
      return matchesSpec && matchesQuery;
    });
  }, [coaches, search, selectedSpec]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-700 to-slate-900 px-6 py-8 text-white shadow-lg sm:px-8">
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-emerald-50">
              <Sparkles className="h-3.5 w-3.5" />
              Verified Health Coach Network
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Certified Health Coaches Directory
            </h1>
            <p className="text-sm text-emerald-100/90 sm:text-base">
              Browse board-certified specialists in nutrition, fitness, mental wellness, and chronic care management.
            </p>
          </div>
          {!user && (
            <button
              type="button"
              onClick={onApplyClick}
              className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            >
              Become a Health Coach
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by coach name, specialization, certification..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {specializations.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => setSelectedSpec(spec)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedSpec === spec
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {spec === 'ALL' ? 'All Specializations' : spec}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white p-5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No health coaches match your current search criteria.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((coach) => (
            <div
              key={coach.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{coach.name}</h3>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <BriefcaseMedical className="h-3.5 w-3.5" />
                      {coach.specialization}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {coach.experience} yrs exp
                  </span>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{coach.certification}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{coach.phoneNumber || 'Contact via platform'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
