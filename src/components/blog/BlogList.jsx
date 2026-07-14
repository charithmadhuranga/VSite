import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => { setPosts(data.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
        <p className="text-white/50 text-lg">Insights on edge computing, IoT, and the future of intelligent infrastructure.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <p className="text-lg">No posts published yet.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-primary/20 transition-all duration-300"
            >
              {post.cover_image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  {post.author_name && <span>&middot; {post.author_name}</span>}
                </div>
                <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-white/50 line-clamp-2 mb-4">{post.excerpt}</p>
                )}
                <span className="inline-flex items-center gap-1 text-sm text-primary/80 group-hover:text-primary transition-colors">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
