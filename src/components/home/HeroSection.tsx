import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Tag } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container-market relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 animate-fade-in">
            Compra y vende en{' '}
            <span className="text-gradient">Chuquiago Market</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up">
            El marketplace más sencillo de Bolivia. Miles de productos te esperan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Button size="xl" asChild className="w-full sm:w-auto">
              <Link to="/productos">
                <ShoppingBag className="h-5 w-5" />
                Explorar productos
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="accent" asChild className="w-full sm:w-auto pulse-glow">
              <Link to="/publicar">
                <Tag className="h-5 w-5" />
                Vender ahora
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground">10K+</p>
              <p className="text-sm text-muted-foreground">Productos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground">5K+</p>
              <p className="text-sm text-muted-foreground">Usuarios</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground">100%</p>
              <p className="text-sm text-muted-foreground">Gratis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
