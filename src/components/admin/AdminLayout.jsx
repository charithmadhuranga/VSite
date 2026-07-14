import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, LogOut, Menu, ChevronsLeft, ChevronsRight } from 'lucide-react';

const AuthContext = createContext(null);
export { AuthContext };

export function useAdminAuth() {
  return useContext(AuthContext);
}

const sidebarLinks = [
  { to: '/blog/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/blog/admin/posts', icon: FileText, label: 'Posts' },
  { to: '/blog/admin/users', icon: Users, label: 'Writers' },
];

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minimized, setMinimized] = useState(() => localStorage.getItem('admin-sidebar-minimized') === 'true');
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('admin-sidebar-minimized', minimized);
  }, [minimized]);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { setUser(data.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    window.location.href = '/blog/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/blog/admin/login" replace />;
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      <div className="min-h-screen bg-dark flex">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white/[0.02] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out ${minimized ? 'lg:w-[68px]' : 'lg:w-64'} ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 w-64'}`}>
          <div className={`border-b border-white/5 flex items-center ${minimized ? 'lg:justify-center lg:p-4' : 'p-6'}`}>
            <Link to="/" className={`font-bold text-white tracking-tight shrink-0 ${minimized ? 'lg:text-lg' : 'text-lg'}`}>
              {minimized ? 'V' : <span>V<span className="text-primary">ioneta</span></span>}
            </Link>
            {!minimized && <p className="text-xs text-white/40 mt-1 ml-0 hidden lg:block">Admin Panel</p>}
            {!minimized && <p className="text-xs text-white/40 mt-1 lg:hidden">Admin Panel</p>}
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  title={minimized ? link.label : undefined}
                  className={`flex items-center gap-3 rounded-lg text-sm transition-all duration-200 ${
                    minimized ? 'lg:justify-center lg:px-2 lg:py-2.5 px-3 py-2.5' : 'px-3 py-2.5'
                  } ${active ? 'bg-primary/10 text-primary' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className={`${minimized ? 'lg:hidden' : ''} whitespace-nowrap`}>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={`border-t border-white/5 ${minimized ? 'lg:p-2' : 'p-4'}`}>
            {!minimized ? (
              <>
                <div className="text-sm text-white/60 mb-2 truncate">{user.email}</div>
                <button onClick={logout} className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <button onClick={logout} title="Logout" className="flex items-center justify-center w-full p-2.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Minimize toggle — desktop only */}
          <button
            onClick={() => setMinimized(!minimized)}
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-card border border-white/10 items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors z-50"
          >
            {minimized ? <ChevronsRight className="w-3 h-3" /> : <ChevronsLeft className="w-3 h-3" />}
          </button>
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
    </AuthContext.Provider>
  );
}
