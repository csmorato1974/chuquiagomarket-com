import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { CATEGORIES, Product } from '@/types/marketplace';
import { fetchPublishedListings } from '@/lib/listings';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Filter, X } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category');
  const currentCategory = categoryFilter ? CATEGORIES.find((c) => c.slug === categoryFilter) : null;

  useEffect(() => {
    fetchPublishedListings({ search: searchQuery || undefined, categorySlug: categoryFilter })
      .then(setProducts).catch(() => setProducts([]));
  }, [searchQuery, categoryFilter]);

  const handleCategoryClick = (slug: string | null) => {
    if (slug) searchParams.set('category', slug); else searchParams.delete('category');
    setSearchParams(searchParams);
    setShowFilters(false);
  };
  const clearFilters = () => setSearchParams({});
  const hasActive = searchQuery || categoryFilter;

  const pageTitle = currentCategory ? `${currentCategory.name} en La Paz — Chuquiago Market`
    : searchQuery ? `Resultados para "${searchQuery}" — Chuquiago Market`
    : 'Todos los anuncios en La Paz — Chuquiago Market';
  const pageDescription = currentCategory?.description ?? 'Compra y vende en La Paz. Publica gratis en Chuquiago Market.';

  return (
    <Layout>
      <Helmet><title>{pageTitle}</title><meta name="description" content={pageDescription} /></Helmet>

      <div className="container-market py-8">
        <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, currentCategory ? { label: currentCategory.name } : { label: 'Productos' }]} />

        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold">
              {currentCategory ? `${currentCategory.name} en La Paz` : searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los anuncios'}
            </h1>
            {currentCategory && <p className="text-muted-foreground mt-2">{currentCategory.description}</p>}
            <p className="text-muted-foreground text-sm mt-1">{products.length} anuncio{products.length !== 1 ? 's' : ''}</p>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden"><Filter className="h-4 w-4" /> Filtros</Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-card rounded-xl border p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Categorías</h2>
                {hasActive && <button onClick={clearFilters} className="text-sm text-primary hover:underline">Limpiar</button>}
              </div>
              <nav className="space-y-1">
                <button onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg ${!categoryFilter ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>Todas</button>
                {CATEGORIES.map((c) => (
                  <button key={c.slug} onClick={() => handleCategoryClick(c.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${categoryFilter === c.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                    {c.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
              <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-card shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold">Filtros</h2>
                  <button onClick={() => setShowFilters(false)}><X className="h-6 w-6" /></button>
                </div>
                <div className="p-4">
                  <nav className="space-y-1">
                    <button onClick={() => handleCategoryClick(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${!categoryFilter ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>Todas</button>
                    {CATEGORIES.map((c) => (
                      <button key={c.slug} onClick={() => handleCategoryClick(c.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg ${categoryFilter === c.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                        {c.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-16 bg-muted/50 rounded-2xl">
                <p className="font-medium mb-1">Sin resultados</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {hasActive ? 'Prueba limpiando los filtros o busca otra categoría.' : 'Aún no hay anuncios publicados. Estamos en beta cerrada.'}
                </p>
                {hasActive ? (
                  <Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>
                ) : (
                  <Button variant="accent" asChild><a href="/publicar">Publicar el primero</a></Button>
                )}
              </div>
            ) : (
              <ProductGrid products={products} emptyMessage="No hay anuncios con estos filtros" />
            )}
            {currentCategory && (
              <section className="mt-12 pt-8 border-t">
                <h2 className="text-xl font-bold mb-4">Preguntas frecuentes sobre {currentCategory.name}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {currentCategory.faq.map((f, i) => (
                    <AccordionItem key={i} value={`q-${i}`}>
                      <AccordionTrigger>{f.q}</AccordionTrigger>
                      <AccordionContent>{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
