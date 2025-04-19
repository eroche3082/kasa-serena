import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import DesignToolsSection from '@/components/home/DesignToolsSection';
import EstimatorSection from '@/components/home/EstimatorSection';
import DistributorsSection from '@/components/home/DistributorsSection';
import ProfessionalDashboardSection from '@/components/home/ProfessionalDashboardSection';
import ComingSoonSection from '@/components/home/ComingSoonSection';
import ContactSection from '@/components/home/ContactSection';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const HomePage = () => {
  const [location, setLocation] = useLocation();

  // Handle anchor links (hash navigation)
  useEffect(() => {
    // Check if URL has a hash
    if (location.includes('#')) {
      const id = location.split('#')[1];
      const element = document.getElementById(id);
      
      if (element) {
        // Scroll to the element with offset for the fixed header
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <DesignToolsSection />
      <EstimatorSection />
      <DistributorsSection />
      <ProfessionalDashboardSection />
      <ComingSoonSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
