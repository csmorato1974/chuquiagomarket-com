import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/mockProducts';
import { CATEGORIES } from '@/types/marketplace';
import { MapPin, User, Calendar, ArrowLeft, MessageCircle, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container-market py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Button asChild>
            <Link to="/productos">
              <ArrowLeft className="h-4 w-4" />
              Volver a productos
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const category = CATEGORIES.find(c => c.id === product.category);
  const formattedDate = new Date(product.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Layout>
      <div className="container-market py-6 md:py-8">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/productos">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {category && (
              <Link
                to={`/productos?category=${category.id}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                {category.icon} {category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {product.title}
            </h1>

            {/* Price */}
            <p className="text-3xl md:text-4xl font-extrabold text-primary">
              {product.price.toLocaleString('es-BO')} €
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              {product.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="xl" variant="accent" className="flex-1">
                <ShoppingCart className="h-5 w-5" />
                Comprar ahora
              </Button>
              <Button size="xl" variant="outline" className="flex-1">
                <MessageCircle className="h-5 w-5" />
                Contactar vendedor
              </Button>
            </div>

            {/* Description */}
            <div className="pt-6 border-t">
              <h2 className="font-semibold text-lg mb-3">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Seller info */}
            <div className="p-4 bg-muted rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{product.sellerName}</p>
                  <p className="text-sm text-muted-foreground">Vendedor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
