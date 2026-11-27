import { useEffect, useState } from 'react';
import { api } from './api.js';
import Navbar from './components/Navbar.jsx';
import CoachDirectory from './components/CoachDirectory.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import ApplicantDashboard from './components/ApplicantDashboard.jsx';
import ReviewerDashboard from './components/ReviewerDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

function defaultTabForRole(role) {
  if (role === 'ADMIN') return 'admin';
  if (role === 'REVIEWER') return 'reviewer';
  if (role === 'APPLICANT') return 'applicant';
  return 'coaches';
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('coaches');
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('healthsrs_token');
    if (!token) {
      setCheckingSession(false);
      return;
    }
    api
      .me()
      .then((u) => {
        setUser(u);
        setActiveTab(defaultTabForRole(u.role));
      })
      .catch(() => {
        localStorage.removeItem('healthsrs_token');
      })
      .finally(() => setCheckingSession(false));
  }, []);

  function handleAuthSuccess(authResponse) {
    localStorage.setItem('healthsrs_token', authResponse.token);
    setUser(authResponse.user);
    setActiveTab(defaultTabForRole(authResponse.user.role));
  }

  function handleLogout() {
    localStorage.removeItem('healthsrs_token');
    setUser(null);
    setActiveTab('coaches');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {checkingSession ? (
          <div className="py-20 text-center text-sm text-slate-500">Loading workspace...</div>
        ) : activeTab === 'auth' && !user ? (
          <AuthPanel onSuccess={handleAuthSuccess} />
        ) : activeTab === 'applicant' && user?.role === 'APPLICANT' ? (
          <ApplicantDashboard />
        ) : activeTab === 'reviewer' && user?.role === 'REVIEWER' ? (
          <ReviewerDashboard />
        ) : activeTab === 'admin' && user?.role === 'ADMIN' ? (
          <AdminDashboard />
        ) : (
          <CoachDirectory user={user} onApplyClick={() => setActiveTab('auth')} />
        )}
      </main>
    </div>
  );
}
