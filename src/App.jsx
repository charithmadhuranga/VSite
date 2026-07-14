import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Features from './components/Features';
import Industries from './components/Industries';
import Stats from './components/Stats';
import Team from './components/Team';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import NoiseOverlay from './components/NoiseOverlay';
import BlogLayout from './components/blog/BlogLayout';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import PostsManager from './components/admin/PostsManager';
import PostEditor from './components/admin/PostEditor';
import UsersManager from './components/admin/UsersManager';
import WriterLayout from './components/writer/WriterLayout';
import WriterLogin from './components/writer/WriterLogin';
import WriterDashboard from './components/writer/WriterDashboard';
import WriterPosts from './components/writer/WriterPosts';

function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!showContent) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [showContent]);

  const handleLoaderComplete = () => {
    setLoaded(true);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />
      {showContent && (
        <>
          <CustomCursor />
          <NoiseOverlay />
          <div className="custom-cursor-active min-h-screen bg-dark">
            <Navbar />
            <Hero />
            <Stats />
            <Products />
            <Features />
            <Industries />
            <Team />
            <CTA />
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/blog" element={<BlogLayout />}>
        <Route index element={<BlogList />} />
        <Route path=":slug" element={<BlogPost />} />
      </Route>
      <Route path="/blog/admin/login" element={<AdminLogin />} />
      <Route path="/blog/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="posts" element={<PostsManager />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/:id/edit" element={<PostEditor />} />
        <Route path="users" element={<UsersManager />} />
      </Route>
      <Route path="/blog/writer/login" element={<WriterLogin />} />
      <Route path="/blog/writer" element={<WriterLayout />}>
        <Route index element={<WriterDashboard />} />
        <Route path="posts" element={<WriterPosts />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/:id/edit" element={<PostEditor />} />
      </Route>
    </Routes>
  );
}
