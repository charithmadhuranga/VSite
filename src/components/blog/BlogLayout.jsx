import { Outlet, Link } from 'react-router-dom';

export default function BlogLayout() {
  return (
    <div className="min-h-screen bg-dark">
      <nav className="border-b border-white/5 bg-dark/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-white tracking-tight">
            V<span className="text-primary">ioneta</span>
          </Link>
          <Link to="/blog" className="text-sm text-white/60 hover:text-white transition-colors">
            Blog
          </Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <Outlet />
      </main>
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} Vioneta (Pvt) Limited. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
