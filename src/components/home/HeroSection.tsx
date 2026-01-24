import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  return (
    <section className="relative w-full">
      <div 
        className="relative w-full min-h-[300px] md:min-h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="container-market relative z-10 py-12 md:py-20 flex items-end justify-start h-full min-h-[300px] md:min-h-[400px]">
          <Button size="lg" asChild className="rounded-full px-8">
            <Link to="/productos">
              Explorar ahora
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
