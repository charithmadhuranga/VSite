import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, PenLine, Plus } from 'lucide-react';
import { useWriterAuth } from './WriterLayout';

export default function WriterDashboard() {
  const { user } = useWriterAuth();
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    fetch('/api/admin/posts', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const posts = data.posts || [];
        setRecentPosts(posts.slice(0, 5));
        setStats({
          total: posts.length,
          published: posts.filter((p) => p.status === 'published').length,
          drafts: posts.filter((p) => p.status === 'draft').length,
        });
      });
  }, []);

  const cards = [
    { label: 'My Posts', value: stats.total, icon: FileText, color: 'text-primary' },
    { label: 'Published', value: stats.published, icon: Eye, color: 'text-green-400' },
    { label: 'Drafts', value: stats.drafts, icon: PenLine, color: 'text-amber-400' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Welcome back, {user.name}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
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

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white">Recent Posts</h2>
        <Link
          to="/blog/writer/posts/new"
          className="inline-flex items-center gap-2 bg-primary text-dark text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="divide-y divide-white/5">
          {recentPosts.length === 0 ? (
            <div className="px-5 py-8 text-center text-white/40 text-sm">No posts yet. Create your first post!</div>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="px-5 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <Link to={`/blog/writer/posts/${post.id}/edit`} className="text-sm text-white hover:text-primary transition-colors truncate block">
                    {post.title}
                  </Link>
                  <div className="text-xs text-white/40 mt-0.5">{new Date(post.updated_at).toLocaleDateString()}</div>
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
