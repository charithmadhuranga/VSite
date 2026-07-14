import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

function UserModal({ user: editUser, onClose, onSave }) {
  const [email, setEmail] = useState(editUser?.email || '');
  const [name, setName] = useState(editUser?.name || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(editUser?.role || 'writer');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const body = { email, name, role };
    if (password) body.password = password;
    if (editUser && !password) delete body.password;

    const url = editUser ? `/api/admin/users/${editUser.id}` : '/api/admin/users';
    const method = editUser ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error); setSaving(false); return; }
    onSave(data.user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{editUser ? 'Edit Writer' : 'Add Writer'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-sm text-red-400">{error}</div>}

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50" />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50" />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">{editUser ? 'New Password (leave blank to keep)' : 'Password'}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!editUser}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50" />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50">
              <option value="writer">Writer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-primary text-dark text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : editUser ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const fetchUsers = () => {
    fetch('/api/admin/users', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => { setUsers(data.users || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id) => {
    if (!confirm('Delete this writer?')) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE', credentials: 'include' });
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleSave = (user) => {
    if (modal?.user) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers([user, ...users]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Writers</h1>
        <button
          onClick={() => setModal({ user: null })}
          className="inline-flex items-center gap-2 bg-primary text-dark text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Writer
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-white/40">No writers yet.</div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white truncate">{u.name}</div>
                <div className="text-xs text-white/40 truncate">{u.email}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {u.role}
              </span>
              <span className="text-xs text-white/40 shrink-0 hidden sm:block">
                {new Date(u.created_at).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setModal({ user: u })} className="p-2 rounded-lg text-white/40 hover:text-primary hover:bg-white/5 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                {u.role !== 'admin' && (
                  <button onClick={() => deleteUser(u.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <UserModal user={modal.user} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}
