import { useEffect, useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { api } from '../api.js';
import { RoleBadge, StatusBadge } from './StatusBadge.jsx';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [section, setSection] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'REVIEWER' });
  const [newCoach, setNewCoach] = useState({
    name: '',
    specialization: 'Nutrition & Weight Management',
    certification: '',
    experience: 3,
    phoneNumber: '',
  });

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [u, a, c] = await Promise.all([
        api.getUsers(),
        api.getAllApplications(),
        api.getCoaches(),
      ]);
      setUsers(u || []);
      setApplications(a || []);
      setCoaches(c || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createUser(newUser);
      setNewUser({ name: '', email: '', password: '', role: 'REVIEWER' });
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRoleChange(user, role) {
    setError('');
    try {
      await api.updateUser(user.id, { name: user.name, email: user.email, role });
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteUser(id) {
    setError('');
    try {
      await api.deleteUser(id);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateCoach(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createCoach({ ...newCoach, experience: Number(newCoach.experience) });
      setNewCoach({
        name: '',
        specialization: 'Nutrition & Weight Management',
        certification: '',
        experience: 3,
        phoneNumber: '',
      });
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteCoach(id) {
    setError('');
    try {
      await api.deleteCoach(id);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Registered Users</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Applications</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{applications.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Certified Coaches</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">{coaches.length}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'users', label: 'Users & Roles' },
          { id: 'applications', label: 'All Applications' },
          { id: 'coaches', label: 'Manage Coaches' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSection(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              section === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      ) : section === 'users' ? (
        <div className="grid gap-6 lg:grid-cols-12">
          <form
            onSubmit={handleCreateUser}
            className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4"
          >
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <UserPlus className="h-4 w-4 text-emerald-600" />
              Create User
            </h3>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="APPLICANT">APPLICANT</option>
              <option value="REVIEWER">REVIEWER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add User
            </button>
          </form>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <RoleBadge role={u.role} />
                          <select
                            aria-label={`Change role for ${u.email}`}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u, e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                          >
                            <option value="APPLICANT">APPLICANT</option>
                            <option value="REVIEWER">REVIEWER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : section === 'applications' ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Specialization &amp; Certification</th>
                  <th className="px-4 py-3">Exp</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{app.applicant?.name}</div>
                      <div className="text-xs text-slate-500">{app.applicant?.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{app.specialization}</div>
                      <div className="text-xs text-slate-500">{app.certification}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{app.experienceYears} yrs</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <form
            onSubmit={handleCreateCoach}
            className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4"
          >
            <h3 className="text-base font-bold text-slate-900">Add Certified Coach</h3>
            <input
              type="text"
              required
              placeholder="Coach Name"
              value={newCoach.name}
              onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Specialization"
              value={newCoach.specialization}
              onChange={(e) => setNewCoach({ ...newCoach, specialization: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Certification"
              value={newCoach.certification}
              onChange={(e) => setNewCoach({ ...newCoach, certification: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                required
                placeholder="Years"
                value={newCoach.experience}
                onChange={(e) => setNewCoach({ ...newCoach, experience: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newCoach.phoneNumber}
                onChange={(e) => setNewCoach({ ...newCoach, phoneNumber: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add Coach
            </button>
          </form>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Coach</th>
                    <th className="px-4 py-3">Certification</th>
                    <th className="px-4 py-3">Exp</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coaches.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="text-xs text-emerald-700">{c.specialization}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{c.certification}</td>
                      <td className="px-4 py-3 text-slate-700">{c.experience} yrs</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteCoach(c.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
