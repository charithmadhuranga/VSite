import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Eye, PenLine } from 'lucide-react';
import { useAdminAuth } from './AdminLayout';

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState({ posts: 0, users: 0, published: 0, drafts: 0 });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/posts', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/admin/users', { credentials: 'include' }).then((r) => r.json()),
    ]).then(([postData, userData]) => {
      const posts = postData.posts || [];
      setRecentPosts(posts.slice(0, 5));
      setStats({
        posts: posts.length,
        users: (userData.users || []).length,
        published: posts.filter((p) => p.status === 'published').length,
        drafts: posts.filter((p) => p.status === 'draft').length,
      });
    });
  }, []);

  const cards = [
    { label: 'Total Posts', value: stats.posts, icon: FileText, color: 'text-primary' },
    { label: 'Published', value: stats.published, icon: Eye, color: 'text-green-400' },
    { label: 'Drafts', value: stats.drafts, icon: PenLine, color: 'text-amber-400' },
    { label: 'Writers', value: stats.users, icon: Users, color: 'text-purple-400' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Welcome back, {user.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <Icon className={`w-5 h-5 ${card.color} mb-3`} />
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-sm text-white/40">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-white">Recent Posts</h2>
          <Link to="/blog/admin/posts" className="text-sm text-primary hover:text-primary/80 transition-colors">
            View all
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {recentPosts.length === 0 ? (
            <div className="px-5 py-8 text-center text-white/40 text-sm">No posts yet.</div>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="px-5 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <Link to={`/blog/admin/posts/${post.id}/edit`} className="text-sm text-white hover:text-primary transition-colors truncate block">
                    {post.title}
                  </Link>
                  <div className="text-xs text-white/40 mt-0.5">{post.author_name}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ml-4 shrink-0 ${post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {post.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
