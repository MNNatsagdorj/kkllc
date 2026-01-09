import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import CategorySection from '../components/home/CategorySection';
import TrustSection from '../components/home/TrustSection';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <CategorySection />
      <TrustSection />
      <CTASection />
    </main>
  );
}

