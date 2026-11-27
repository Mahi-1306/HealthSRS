import { HeartPulse, LogOut, ShieldCheck, Users, ClipboardCheck, FileText } from 'lucide-react';
import { RoleBadge } from './StatusBadge.jsx';

export default function Navbar({ user, activeTab, setActiveTab, onLogout }) {
  const tabs = [{ id: 'coaches', label: 'Coach Directory', icon: Users }];

  if (user?.role === 'APPLICANT') {
    tabs.unshift({ id: 'applicant', label: 'My Applications', icon: FileText });
  } else if (user?.role === 'REVIEWER') {
    tabs.unshift({ id: 'reviewer', label: 'Review Queue', icon: ClipboardCheck });
  } else if (user?.role === 'ADMIN') {
    tabs.unshift({ id: 'admin', label: 'Admin Console', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab(user ? tabs[0].id : 'coaches')}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-base font-bold tracking-tight text-slate-900">HealthSRS</span>
              <span className="block text-[11px] font-medium text-slate-500">Coach Credentialing &amp; Review</span>
            </div>
          </button>

          <nav className="hidden items-center gap-1 sm:flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-2.5 text-right md:flex">
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <RoleBadge role={user.role} />
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('auth')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === 'auth'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
              }`}
            >
              Sign In / Apply
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 sm:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
