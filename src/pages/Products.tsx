import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { CATEGORIES, Category } from '@/types/marketplace';
import { mockProducts } from '@/data/mockProducts';
import { Button } from '@/components/ui/button';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Filter, X } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') as Category | null;
  const currentCategory = categoryFilter ? CATEGORIES.find(c => c.id === categoryFilter) : null;

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const handleCategoryClick = (categoryId: Category | null) => {
    if (categoryId) searchParams.set('category', categoryId);
    else searchParams.delete('category');
    setSearchParams(searchParams);
    setShowFilters(false);
  };

  const clearFilters = () => setSearchParams({});
  const hasActiveFilters = searchQuery || categoryFilter;

  const pageTitle = currentCategory
    ? `${currentCategory.name} en La Paz — Chuquiago Market`
    : searchQuery
    ? `Resultados para "${searchQuery}" — Chuquiago Market`
    : 'Todos los anuncios en La Paz — Chuquiago Market';

  const pageDescription = currentCategory?.description ??
    'Compra y vende productos de segunda mano y nuevos en La Paz. Publica gratis en Chuquiago Market.';

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <div className="container-market py-8">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            currentCategory ? { label: currentCategory.name } : { label: 'Productos' },
          ]}
        />

        {/* Header categoría o búsqueda */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {currentCategory ? `${currentCategory.name} en La Paz` :
                searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los anuncios'}
            </h1>
            {currentCategory && (
              <p className="text-muted-foreground mt-2">{currentCategory.description}</p>
            )}
            <p className="text-muted-foreground text-sm mt-1">
              {filteredProducts.length} anuncio{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-card rounded-xl border p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Categorías</h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                    Limpiar
                  </button>
                )}
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !categoryFilter ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                >
                  Todas
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      categoryFilter === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sidebar mobile */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
              <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-card shadow-xl animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold">Filtros</h2>
                  <button onClick={() => setShowFilters(false)}><X className="h-6 w-6" /></button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-3">Categorías</h3>
                  <nav className="space-y-1">
                    <button
                      onClick={() => handleCategoryClick(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${!categoryFilter ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
                    >
                      Todas
                    </button>
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg ${categoryFilter === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm">
                    Búsqueda: {searchQuery}
                    <button onClick={() => { searchParams.delete('search'); setSearchParams(searchParams); }}>
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {categoryFilter && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm">
                    {CATEGORIES.find(c => c.id === categoryFilter)?.name}
                    <button onClick={() => handleCategoryClick(null)}><X className="h-4 w-4" /></button>
                  </span>
                )}
              </div>
            )}

            <ProductGrid products={filteredProducts} emptyMessage="No se encontraron anuncios con estos filtros" />

            {/* FAQ por categoría */}
            {currentCategory && (
              <section className="mt-12 pt-8 border-t">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Preguntas frecuentes sobre {currentCategory.name}
                </h2>
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
