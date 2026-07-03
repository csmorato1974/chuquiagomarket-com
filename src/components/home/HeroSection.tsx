import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MapPin } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  return (
    <section className="relative w-full">
      <div
        className="relative w-full min-h-[380px] md:min-h-[460px] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        {/* Overlay legible sin cubrir la foto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="container-market relative z-10 py-12 md:py-20 flex items-center min-h-[380px] md:min-h-[460px]">
          <div className="max-w-xl text-white">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider bg-white/15 backdrop-blur px-3 py-1 rounded-full mb-4">
              <MapPin className="h-3 w-3" /> La Paz · Beta
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Compra y vende en La Paz, fácil y seguro
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-6">
              Publica gratis en minutos. Encuentra productos cerca de ti,
              coordina con vendedores locales y compra con confianza.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild className="rounded-full px-6">
                <Link to="/productos">Explorar productos</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="rounded-full px-6">
                <Link to="/publicar">Publicar anuncio</Link>
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-5 text-sm text-white/80">
              <ShieldCheck className="h-4 w-4" />
              Vendedores verificados · Reglas claras · Reporta anuncios
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
