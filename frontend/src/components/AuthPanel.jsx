import { useState } from 'react';
import { KeyRound, UserPlus, Shield, ClipboardCheck, User } from 'lucide-react';
import { api } from '../api.js';

const DEMO_ACCOUNTS = [
  { label: 'Applicant', email: 'applicant@test.com', password: 'applicant123', icon: User, color: 'emerald' },
  { label: 'Reviewer', email: 'reviewer@test.com', password: 'reviewer123', icon: ClipboardCheck, color: 'sky' },
  { label: 'Admin', email: 'admin@test.com', password: 'admin123', icon: Shield, color: 'purple' },
];

export default function AuthPanel({ onSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'login'
          ? await api.login({ email, password })
          : await api.register({ name, email, password });
      onSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin(account) {
    setMode('login');
    setEmail(account.email);
    setPassword(account.password);
    setError('');
    setLoading(true);
    try {
      const result = await api.login({ email: account.email, password: account.password });
      onSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3 sm:p-8">
        <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <KeyRound className="h-4 w-4" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Register Applicant
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Morgan"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Applicant Account'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="text-base font-bold text-slate-900">Quick Demo Sign-In</h2>
        <p className="mt-1 text-xs text-slate-500">
          Seeded RBAC test accounts matching <code className="rounded bg-slate-100 px-1 py-0.5">rbac-test-scenarios</code>.
        </p>

        <div className="mt-4 space-y-2.5">
          {DEMO_ACCOUNTS.map((acc) => {
            const Icon = acc.icon;
            return (
              <button
                key={acc.email}
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin(acc)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{acc.label}</p>
                    <p className="text-xs text-slate-500">{acc.email}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700">Sign in →</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
