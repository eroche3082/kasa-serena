import { 
  HeroSection, 
  ServicesSection, 
  MaterialsSection, 
  ConsultingSection, 
  EstimatorSection, 
  DistributorsSection, 
  ContactSection 
} from '@/features/home';
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
      <MaterialsSection />
      <ConsultingSection />
      <EstimatorSection />
      <DistributorsSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
