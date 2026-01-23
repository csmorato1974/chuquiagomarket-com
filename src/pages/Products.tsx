import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { CATEGORIES, Category } from '@/types/marketplace';
import { mockProducts } from '@/data/mockProducts';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') as Category | null;

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = categoryFilter
        ? product.category === categoryFilter
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const handleCategoryClick = (categoryId: Category | null) => {
    if (categoryId) {
      searchParams.set('category', categoryId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || categoryFilter;

  return (
    <Layout>
      <div className="container-market py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los productos'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-card rounded-xl border p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Categorías</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !categoryFilter
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  Todas
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      categoryFilter === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Filters Sidebar - Mobile */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
              <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-card shadow-xl animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold">Filtros</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-3">Categorías</h3>
                  <nav className="space-y-1">
                    <button
                      onClick={() => handleCategoryClick(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !categoryFilter
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      Todas
                    </button>
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          categoryFilter === category.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm">
                    Búsqueda: {searchQuery}
                    <button
                      onClick={() => {
                        searchParams.delete('search');
                        setSearchParams(searchParams);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {categoryFilter && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm">
                    {CATEGORIES.find(c => c.id === categoryFilter)?.name}
                    <button onClick={() => handleCategoryClick(null)}>
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            <ProductGrid
              products={filteredProducts}
              emptyMessage="No se encontraron productos con estos filtros"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
