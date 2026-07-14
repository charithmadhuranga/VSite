import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from './AdminLayout';

let ReactQuill;
try {
  ReactQuill = (await import('react-quill-new')).default;
} catch {}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [QuillEditor, setQuillEditor] = useState(null);

  useEffect(() => {
    import('react-quill-new').then((mod) => setQuillEditor(() => mod.default)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch('/api/admin/posts', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const post = (data.posts || []).find((p) => p.id === Number(id));
        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setExcerpt(post.excerpt || '');
          setCoverImage(post.cover_image || '');
          setStatus(post.status);
        }
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (newStatus) => {
    setSaving(true);
    const body = { title, content, excerpt, cover_image: coverImage, status: newStatus || status };
    const url = isEditing ? `/api/admin/posts/${id}` : '/api/admin/posts';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      navigate('/blog/admin/posts');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Post' : 'New Post'}</h1>
      </div>

      <div className="space-y-5 max-w-4xl">
        <div>
          <label className="block text-sm text-white/60 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Excerpt</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="Short description"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Cover Image URL</label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Content</label>
          {QuillEditor ? (
            <div className="quill-dark rounded-lg overflow-hidden border border-white/10">
              <QuillEditor
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                className="bg-white/5 text-white"
              />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors font-mono"
              placeholder="Write your post content here (HTML supported)..."
            />
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving || !title}
            className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving || !title}
            className="inline-flex items-center gap-2 bg-primary text-dark text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
