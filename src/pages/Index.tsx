import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import SafetyTipsSection from '@/components/home/SafetyTipsSection';
import CategoryCard from '@/components/home/CategoryCard';
import ProductGrid from '@/components/products/ProductGrid';
import SafetyNotice from '@/components/trust/SafetyNotice';
import { CATEGORIES, Product } from '@/types/marketplace';
import { fetchPublishedListings } from '@/lib/listings';
import { Link } from 'react-router-dom';
import { Camera, MessageCircle, Handshake, BadgeCheck, BookOpen, Flag } from 'lucide-react';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetchPublishedListings({ limit: 12 }).then(setProducts).catch(() => setProducts([])); }, []);
  const recent = products.slice(0, 8);
  const near = [...products].reverse().slice(0, 4);

  return (
    <Layout>
      <HeroSection />

      <section className="py-10 md:py-14 bg-card">
        <div className="container-market">
          <h2 className="text-xl md:text-2xl font-bold mb-8">Explora categorías populares</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 md:gap-8">
            {CATEGORIES.map((category) => <CategoryCard key={category.id} category={category} />)}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-market">
          <h2 className="text-xl md:text-2xl font-bold mb-8">Cómo funciona</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: '1. Publica', text: 'Sube fotos, describe tu producto y elige zona. Es gratis.' },
              { icon: MessageCircle, title: '2. Contacta', text: 'Los compradores interesados te escriben directamente.' },
              { icon: Handshake, title: '3. Entrega', text: 'Coordinan un punto seguro en La Paz y cierran la venta.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-6 bg-card rounded-2xl border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><Icon className="h-6 w-6" /></div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-card">
        <div className="container-market">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Publicaciones recientes en La Paz</h2>
              <p className="text-muted-foreground text-sm mt-1">Anuncios locales verificados</p>
            </div>
            <Link to="/productos" className="text-sm font-medium text-primary hover:underline">Ver todo</Link>
          </div>
          {recent.length > 0 ? (
            <ProductGrid products={recent} />
          ) : (
            <div className="text-center py-16 bg-muted/50 rounded-2xl">
              <Camera className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">Aún no hay anuncios publicados</p>
              <p className="text-sm text-muted-foreground mb-4">Estamos en beta cerrada. Los primeros anuncios llegarán pronto.</p>
              <Link to="/publicar" className="text-primary font-medium hover:underline">Sé el primero en publicar</Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-market">
          <h2 className="text-xl md:text-2xl font-bold mb-8">Compra con confianza</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              { icon: BadgeCheck, title: 'Vendedores verificados', text: 'Identificamos a vendedores confiables con un distintivo.' },
              { icon: BookOpen, title: 'Reglas claras', text: 'Publicaciones revisadas según nuestras políticas.' },
              { icon: Flag, title: 'Reporta anuncios', text: 'Ayúdanos a mantener la comunidad segura.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-6 bg-card rounded-2xl border">
                <Icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <SafetyNotice />
        </div>
      </section>

      {near.length > 0 && (
        <section className="py-10 md:py-14 bg-card">
          <div className="container-market">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Cerca de ti</h2>
              <Link to="/productos" className="text-sm font-medium text-primary hover:underline">Ver todo</Link>
            </div>
            <ProductGrid products={near} />
          </div>
        </section>
      )}

      <section className="py-10 md:py-14">
        <div className="container-market">
          <div className="hero-gradient rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">¿Tienes algo que vender en La Paz?</h2>
              <p className="text-foreground/80">Publica gratis y llega a miles de compradores paceños.</p>
            </div>
            <Link to="/publicar" className="shrink-0 bg-foreground text-background font-semibold px-8 py-3 rounded-full hover:bg-foreground/90 transition-colors">
              Vender ahora
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
