import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((res) => { if (!res.ok) throw new Error('Post not found'); return res.json(); })
      .then((data) => { setPost(data.post); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Post not found</h1>
        <Link to="/blog" className="text-primary hover:text-primary/80 transition-colors">
          &larr; Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to blog
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-white/40">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" /> {post.author_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </header>

      {post.cover_image && (
        <div className="rounded-2xl overflow-hidden mb-8 border border-white/5">
          <img src={post.cover_image} alt={post.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-p:text-white/70 prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white prose-code:text-primary/90 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
          prose-img:rounded-xl prose-img:border prose-img:border-white/5
          prose-blockquote:border-primary/30 prose-blockquote:text-white/60"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
