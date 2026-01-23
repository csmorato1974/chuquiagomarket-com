import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/mockProducts';
import { CATEGORIES } from '@/types/marketplace';
import { MapPin, User, Calendar, ArrowLeft, MessageCircle, ShoppingCart, Heart, Share2, Truck, Shield } from 'lucide-react';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
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

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      <div className="container-market py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span>/</span>
          {category && (
            <>
              <Link to={`/productos?category=${category.id}`} className="hover:text-primary">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-card rounded-xl overflow-hidden border">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-contain p-8"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-bold text-foreground">
                  {product.price.toLocaleString('es-BO')} €
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString('es-BO')} €
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="inline-block px-2 py-1 bg-deal/10 text-deal font-semibold text-sm rounded">
                  {discount}% de descuento
                </span>
              )}
            </div>

            {/* Shipping info */}
            <div className="space-y-3 py-4 border-y">
              {product.freeShipping ? (
                <div className="flex items-center gap-2 text-success">
                  <Truck className="h-5 w-5" />
                  <span className="font-medium">Envío gratis</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="h-5 w-5" />
                  <span>Envío calculado al finalizar</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>Ubicación: {product.location}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Button size="xl" className="w-full">
                <ShoppingCart className="h-5 w-5" />
                Comprar ahora
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                <MessageCircle className="h-5 w-5" />
                Contactar vendedor
              </Button>
              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-deal text-deal' : ''}`} />
                  {isFavorite ? 'Guardado' : 'Guardar'}
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  <Share2 className="h-5 w-5" />
                  Compartir
                </Button>
              </div>
            </div>

            {/* Guarantee */}
            <div className="flex items-start gap-3 p-4 bg-secondary rounded-xl">
              <Shield className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Compra protegida</p>
                <p className="text-sm text-muted-foreground">
                  Garantía de devolución si no recibes el producto.
                </p>
              </div>
            </div>

            {/* Seller info */}
            <div className="p-4 bg-card border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{product.sellerName}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Publicado {formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10 pt-8 border-t">
          <h2 className="font-bold text-xl mb-4">Descripción del producto</h2>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
