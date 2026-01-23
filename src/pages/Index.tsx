import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategoryCard from '@/components/home/CategoryCard';
import ProductGrid from '@/components/products/ProductGrid';
import { CATEGORIES } from '@/types/marketplace';
import { mockProducts } from '@/data/mockProducts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const recentProducts = mockProducts.slice(0, 8);

  return (
    <Layout>
      {/* Hero */}
      <HeroSection />

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container-market">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Categorías
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container-market">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Productos recientes
            </h2>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/productos">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <ProductGrid products={recentProducts} />

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" size="lg" asChild className="w-full">
              <Link to="/productos">
                Ver todos los productos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container-market">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              ¿Tienes algo que vender?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Publica tu producto en menos de 1 minuto y llega a miles de compradores.
            </p>
            <Button size="xl" variant="accent" asChild>
              <Link to="/publicar">
                Publicar gratis
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
