import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Features from './components/Features';
import Industries from './components/Industries';
import Stats from './components/Stats';
import Team from './components/Team';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-dark">
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
  );
}
