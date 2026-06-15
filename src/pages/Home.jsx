import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import ValueProps from '../components/home/ValueProps';
import CompanyBand from '../components/home/CompanyBand';
import Reviews from '../components/home/Reviews';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <CategorySection />
      <FeaturedProducts />
      <ValueProps />
      <CompanyBand />
      <Reviews />
      <CTASection />
    </main>
  );
}
