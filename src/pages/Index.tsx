import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategoryCard from '@/components/home/CategoryCard';
import ProductGrid from '@/components/products/ProductGrid';
import { CATEGORIES } from '@/types/marketplace';
import { mockProducts } from '@/data/mockProducts';
import { Link } from 'react-router-dom';

const Index = () => {
  const recentProducts = mockProducts.slice(0, 8);

  return (
    <Layout>
      {/* Hero */}
      <HeroSection />

      {/* Categories - eBay style circular */}
      <section className="py-10 md:py-14 bg-card">
        <div className="container-market">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8">
            Explora categorías populares
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 md:gap-8">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Today's Deals */}
      <section className="py-10 md:py-14">
        <div className="container-market">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Ofertas del día
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Todo con envío gratis
              </p>
            </div>
            <Link 
              to="/productos"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todo
            </Link>
          </div>
          
          <ProductGrid products={recentProducts} />
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-10 md:py-14 bg-card">
        <div className="container-market">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Lo más buscado
            </h2>
            <Link 
              to="/productos"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todo
            </Link>
          </div>
          
          <ProductGrid products={[...mockProducts].reverse().slice(0, 4)} />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-10 md:py-14">
        <div className="container-market">
          <div className="hero-gradient rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                ¿Tienes algo que vender?
              </h2>
              <p className="text-foreground/80">
                Publica gratis y llega a miles de compradores.
              </p>
            </div>
            <Link 
              to="/publicar"
              className="shrink-0 bg-foreground text-background font-semibold px-8 py-3 rounded-full hover:bg-foreground/90 transition-colors"
            >
              Vender ahora
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
