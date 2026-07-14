import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;

  const posts = db.prepare(`
    SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.status, p.created_at, p.updated_at,
           u.name as author_name
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    WHERE p.status = 'published'
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);

  const total = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'published'").get();

  res.json({ posts, total: total.count, page, limit });
});

router.get('/:slug', (req, res) => {
  const post = db.prepare(`
    SELECT p.*, u.name as author_name
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    WHERE p.slug = ? AND p.status = 'published'
  `).get(req.params.slug);

  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ post });
});

export default router;
