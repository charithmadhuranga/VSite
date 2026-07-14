import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';

export default function WriterPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchPosts = () => {
    fetch('/api/admin/posts', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => { setPosts(data.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE', credentials: 'include' });
    setPosts(posts.filter((p) => p.id !== id));
  };

  const filtered = posts.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">My Posts</h1>
        <Link
          to="/blog/writer/posts/new"
          className="inline-flex items-center gap-2 bg-primary text-dark text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'published', 'draft'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${filter === f ? 'bg-primary/10 text-primary' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-white/40">No posts found.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <div key={post.id} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4">
              <div className="min-w-0 flex-1">
                <Link to={`/blog/writer/posts/${post.id}/edit`} className="text-sm font-medium text-white hover:text-primary transition-colors truncate block">
                  {post.title}
                </Link>
                <div className="text-xs text-white/40 mt-1">
                  {new Date(post.updated_at).toLocaleDateString()}
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {post.status}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {post.status === 'published' && (
                  <a href={`/blog/${post.slug}`} target="_blank" className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                    <Eye className="w-4 h-4" />
                  </a>
                )}
                <Link to={`/blog/writer/posts/${post.id}/edit`} className="p-2 rounded-lg text-white/40 hover:text-primary hover:bg-white/5 transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button onClick={() => deletePost(post.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
