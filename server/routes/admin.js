import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

const router = Router();

// All admin routes require auth
router.use(requireAuth);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET /api/admin/posts — list posts (admin: all, writer: own)
router.get('/posts', (req, res) => {
  let posts;
  if (req.user.role === 'admin') {
    posts = db.prepare(`
      SELECT p.*, u.name as author_name
      FROM posts p LEFT JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `).all();
  } else {
    posts = db.prepare(`
      SELECT p.*, u.name as author_name
      FROM posts p LEFT JOIN users u ON p.author_id = u.id
      WHERE p.author_id = ?
      ORDER BY p.created_at DESC
    `).all(req.user.id);
  }
  res.json({ posts });
});

// POST /api/admin/posts — create post
router.post('/posts', (req, res) => {
  const { title, content, excerpt, cover_image, status } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  let slug = slugify(title);
  const existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(slug);
  if (existing) slug = `${slug}-${Date.now()}`;

  const result = db.prepare(
    'INSERT INTO posts (title, slug, content, excerpt, cover_image, author_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, slug, content, excerpt || '', cover_image || '', req.user.id, status || 'draft');

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ post });
});

// PUT /api/admin/posts/:id — update post
router.put('/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
    return res.status(403).json({ error: 'Cannot edit posts by other authors' });
  }

  const { title, content, excerpt, cover_image, status } = req.body;
  let slug = post.slug;
  if (title && title !== post.title) {
    slug = slugify(title);
    const existing = db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').get(slug, post.id);
    if (existing) slug = `${slug}-${Date.now()}`;
  }

  db.prepare(
    'UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, cover_image = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(
    title || post.title,
    slug,
    content || post.content,
    excerpt ?? post.excerpt,
    cover_image ?? post.cover_image,
    status || post.status,
    post.id
  );

  const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(post.id);
  res.json({ post: updated });
});

// DELETE /api/admin/posts/:id — delete post
router.delete('/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
    return res.status(403).json({ error: 'Cannot delete posts by other authors' });
  }

  db.prepare('DELETE FROM posts WHERE id = ?').run(post.id);
  res.json({ message: 'Post deleted' });
});

// User management — admin only
router.get('/users', requireRole('admin'), (req, res) => {
  const users = db.prepare('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC').all();
  res.json({ users });
});

router.post('/users', requireRole('admin'), (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name required' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already exists' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
    email, hash, name, role || 'writer'
  );

  const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ user });
});

router.put('/users/:id', requireRole('admin'), (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { email, password, name, role } = req.body;

  if (email && email !== user.email) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, user.id);
    if (existing) return res.status(409).json({ error: 'Email already exists' });
  }

  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET email = ?, password = ?, name = ?, role = ? WHERE id = ?').run(
      email || user.email, hash, name || user.name, role || user.role, user.id
    );
  } else {
    db.prepare('UPDATE users SET email = ?, name = ?, role = ? WHERE id = ?').run(
      email || user.email, name || user.name, role || user.role, user.id
    );
  }

  const updated = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(user.id);
  res.json({ user: updated });
});

router.delete('/users/:id', requireRole('admin'), (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ error: 'Cannot delete admin accounts' });

  db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
  res.json({ message: 'User deleted' });
});

export default router;
