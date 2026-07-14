import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, Menu } from 'lucide-react';

const WriterAuthContext = createContext(null);
export { WriterAuthContext };

export function useWriterAuth() {
  return useContext(WriterAuthContext);
}

const sidebarLinks = [
  { to: '/blog/writer', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/blog/writer/posts', icon: FileText, label: 'My Posts' },
];

export default function WriterLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { setUser(data.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    window.location.href = '/blog/writer/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'writer') {
    return <Navigate to="/blog/writer/login" replace />;
  }

  return (
    <WriterAuthContext.Provider value={{ user, logout }}>
      <div className="min-h-screen bg-dark flex">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/[0.02] border-r border-white/5 flex flex-col transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-6 border-b border-white/5">
            <Link to="/" className="text-lg font-bold text-white tracking-tight">
              V<span className="text-primary">ioneta</span>
            </Link>
            <p className="text-xs text-white/40 mt-1">Writer Panel</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active ? 'bg-primary/10 text-primary' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="text-sm text-white/60 mb-2">{user.email}</div>
            <button onClick={logout} className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b border-white/5 flex items-center px-6 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </WriterAuthContext.Provider>
  );
}
