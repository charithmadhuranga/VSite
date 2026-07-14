import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Clock, FileText } from 'lucide-react';
import JoditEditor from 'jodit-react';
import { useAdminAuth } from './AdminLayout';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const isEditing = Boolean(id);
  const editor = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [lastSaved, setLastSaved] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  const joditConfig = useMemo(() => ({
    theme: 'dark',
    height: 'calc(100vh - 380px)',
    minHeight: 400,
    readonly: false,
    spellcheck: true,
    placeholder: 'Start writing your story...',
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_as_html',
    enter: 'br',
    toolbarAdaptive: true,
    showCharsCounter: true,
    showWordsCounter: true,
    counterClassName: 'jodit-word-counter',
    statusbar: true,
    sourceEditorNativeLength: true,
    buttons: [
      'source', '|',
      'bold', 'strikethrough', 'underline', 'italic', '|',
      'superscript', 'subscript', '|',
      'font', 'fontsize', 'paragraph', '|',
      'align', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'link', 'image', 'video', 'table', 'horizontal', '|',
      'undo', 'redo', '|',
      'hr', 'copyformat', '|',
      'fullsize', 'print',
    ],
    buttonsXS: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'link', 'image', '|',
      'undo', 'redo', '|',
      'more',
    ],
    filebrowser: false,
    events: {
      afterInit: () => {},
    },
  }), []);

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
          setWordCount(post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 0);
        }
        setLoading(false);
      });
  }, [id]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    const text = newContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  };

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
      setLastSaved(new Date());
      if (!isEditing && data.post?.id) {
        navigate(`/blog/admin/posts/${data.post.id}/edit`, { replace: true });
      } else {
        setStatus(newStatus || status);
      }
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
    <div className="h-[calc(100vh-2rem)] flex flex-col -m-6 lg:-m-8">
      {/* Header */}
      <div className="shrink-0 border-b border-white/5 bg-[#0d1117] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/blog/admin/posts')} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-white text-lg font-semibold focus:outline-none placeholder-white/25 truncate"
                placeholder="Untitled post"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            {lastSaved && (
              <span className="text-xs text-white/30 hidden sm:flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}

            <span className={`text-xs px-2 py-0.5 rounded-full ${status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {status}
            </span>

            <button
              onClick={() => handleSave('draft')}
              disabled={saving || !title}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 hidden sm:flex"
            >
              Save draft
            </button>

            <button
              onClick={() => handleSave('published')}
              disabled={saving || !title}
              className="inline-flex items-center gap-1.5 bg-primary text-dark text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="shrink-0 border-b border-white/5 bg-[#0d1117] px-6 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/30 transition-colors"
            placeholder="Excerpt — a short summary for the blog listing"
          />
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/30 transition-colors"
            placeholder="Cover image URL (optional)"
          />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <JoditEditor
          ref={editor}
          value={content}
          config={joditConfig}
          onBlur={handleContentChange}
          onChange={() => {}}
        />
      </div>

      {/* Footer bar */}
      <div className="shrink-0 border-t border-white/5 bg-[#0d1117] px-6 py-2 flex items-center justify-between text-xs text-white/30">
        <span className="flex items-center gap-1.5">
          <FileText className="w-3 h-3" />
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        <span>{user.name}</span>
      </div>

      {/* Mobile save buttons */}
      <div className="shrink-0 border-t border-white/5 bg-[#0d1117] px-6 py-3 flex sm:hidden gap-2">
        <button
          onClick={() => handleSave('draft')}
          disabled={saving || !title}
          className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
        >
          Save draft
        </button>
        <button
          onClick={() => handleSave('published')}
          disabled={saving || !title}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-dark text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
