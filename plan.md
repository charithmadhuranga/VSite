# Vioneta Blog System — Implementation Plan

## Architecture Overview

```
vioneta-website/          (existing React frontend)
├── server/               (new — Node.js/Express backend)
│   ├── index.js          (entry point)
│   ├── db.js             (SQLite setup + migrations)
│   ├── auth.js           (JWT auth middleware)
│   ├── routes/
│   │   ├── auth.js       (login/logout)
│   │   ├── posts.js      (CRUD posts)
│   │   └── users.js      (CRUD writers — admin only)
│   └── seed.js           (creates admin + default data)
├── src/
│   ├── main.jsx          (add BrowserRouter)
│   ├── App.jsx           (add Routes)
│   ├── components/
│   │   ├── blog/         (new — public blog pages)
│   │   │   ├── BlogLayout.jsx
│   │   │   ├── BlogList.jsx
│   │   │   └── BlogPost.jsx
│   │   ├── admin/        (new — admin panel)
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── PostEditor.jsx
│   │   │   ├── PostsManager.jsx
│   │   │   └── UsersManager.jsx
│   │   └── writer/       (new — writer panel)
│   │       ├── WriterLayout.jsx
│   │       ├── WriterLogin.jsx
│   │       ├── WriterDashboard.jsx
│   │       └── WriterPosts.jsx
├── Dockerfile            (multi-stage: build frontend → serve with Node)
├── docker-compose.yml
├── Makefile
└── vite.config.js        (add /api proxy for dev)
```

## Database Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin','writer')) DEFAULT 'writer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  author_id INTEGER REFERENCES users(id),
  status TEXT CHECK(status IN ('draft','published')) DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/login` | No | — | Login, returns JWT cookie |
| POST | `/api/auth/logout` | Yes | any | Clear cookie |
| GET | `/api/auth/me` | Yes | any | Current user info |
| GET | `/api/posts` | No | — | Public: published posts |
| GET | `/api/posts/:slug` | No | — | Public: single post |
| GET | `/api/admin/posts` | Yes | admin/writer | All posts |
| POST | `/api/admin/posts` | Yes | admin/writer | Create post |
| PUT | `/api/admin/posts/:id` | Yes | admin/writer | Update post |
| DELETE | `/api/admin/posts/:id` | Yes | admin/writer | Delete post |
| GET | `/api/admin/users` | Yes | admin | List writers |
| POST | `/api/admin/users` | Yes | admin | Create writer |
| PUT | `/api/admin/users/:id` | Yes | admin | Update writer |
| DELETE | `/api/admin/users/:id` | Yes | admin | Delete writer |

## Routing Structure

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Existing landing page | Public |
| `/blog` | BlogList | Public |
| `/blog/:slug` | BlogPost | Public |
| `/blog/admin/login` | AdminLogin | Hidden |
| `/blog/admin` | AdminDashboard | Admin |
| `/blog/admin/posts` | PostsManager | Admin |
| `/blog/admin/posts/new` | PostEditor | Admin |
| `/blog/admin/posts/:id/edit` | PostEditor | Admin |
| `/blog/admin/users` | UsersManager | Admin |
| `/blog/writer/login` | WriterLogin | Hidden |
| `/blog/writer` | WriterDashboard | Writer |
| `/blog/writer/posts` | WriterPosts | Writer |
| `/blog/writer/posts/new` | PostEditor | Writer |
| `/blog/writer/posts/:id/edit` | PostEditor | Writer |

## Implementation Phases

### Phase 1: Backend Foundation
1. Install backend dependencies
2. Create server/index.js — Express entry
3. Create server/db.js — SQLite + tables
4. Create server/auth.js — JWT middleware
5. Create server/seed.js — Admin seed
6. Create server/routes/auth.js — Login/logout
7. Create server/routes/posts.js — Public endpoints
8. Create server/routes/users.js — User management
9. Create server/routes/admin.js — Post management

### Phase 2: Frontend Integration
10. Install react-router-dom, react-quill-new
11. Update vite.config.js — /api proxy
12. Update main.jsx — BrowserRouter
13. Update App.jsx — Routes

### Phase 3: Blog Public Pages
14. Create blog/BlogLayout.jsx
15. Create blog/BlogList.jsx
16. Create blog/BlogPost.jsx

### Phase 4: Admin Panel
17. Create admin/AdminLayout.jsx
18. Create admin/AdminLogin.jsx
19. Create admin/AdminDashboard.jsx
20. Create admin/PostsManager.jsx
21. Create admin/PostEditor.jsx
22. Create admin/UsersManager.jsx

### Phase 5: Writer Panel
23. Create writer/WriterLayout.jsx
24. Create writer/WriterLogin.jsx
25. Create writer/WriterDashboard.jsx
26. Create writer/WriterPosts.jsx

### Phase 6: Docker & Build
27. Create Dockerfile
28. Create docker-compose.yml
29. Create Makefile
30. Create .dockerignore
31. Update Navbar — Add Blog link
32. Update Footer — Add Blog link
