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
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-accent/60" />
        
        <div className="container-market relative z-10 py-12 md:py-20">
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 leading-tight">
              Encuentra lo que buscas por menos
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 mb-6">
              Miles de productos nuevos y usados en el marketplace de Bolivia.
            </p>

            <Button size="lg" asChild className="rounded-full px-8">
              <Link to="/productos">
                Explorar ahora
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
