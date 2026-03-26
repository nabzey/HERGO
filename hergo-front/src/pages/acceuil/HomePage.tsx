import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from './sections/HeroSection';
import PopularHebergements from './sections/PopularHebergements';
import TrendingDestinations from './sections/TrendingDestinations';
import WhyHergo from './sections/WhyHergo';
import CTASection from './sections/CTASection';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PopularHebergements />
        <TrendingDestinations />
        <WhyHergo />
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
