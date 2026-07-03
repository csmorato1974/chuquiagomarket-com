import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SafetyNotice from '@/components/trust/SafetyNotice';
import VerifiedBadge from '@/components/trust/VerifiedBadge';
import ReportButton from '@/components/trust/ReportButton';
import { mockProducts } from '@/data/mockProducts';
import { CATEGORIES } from '@/types/marketplace';
import {
  MapPin, User, Calendar, ArrowLeft, MessageCircle, Heart, Share2,
  Truck, Tag, PackageCheck,
} from 'lucide-react';
import { useState } from 'react';
import { formatBs, formatDate, CONDITION_LABEL, DELIVERY_LABEL } from '@/lib/format';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container-market py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Button asChild>
            <Link to="/productos"><ArrowLeft className="h-4 w-4" /> Volver a productos</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const category = CATEGORIES.find((c) => c.id === product.category);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      <div className="container-market py-6 md:py-8">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            ...(category ? [{ label: category.name, to: `/productos?category=${category.id}` }] : []),
            { label: product.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imágenes */}
          <div className="space-y-4">
            <div className="aspect-square bg-card rounded-xl overflow-hidden border">
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-contain p-8" />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
              {product.title}
            </h1>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-bold text-foreground">
                  {formatBs(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatBs(product.originalPrice)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="inline-block px-2 py-1 bg-deal/10 text-deal font-semibold text-sm rounded">
                  {discount}% de descuento
                </span>
              )}
            </div>

            {/* Detalles del anuncio */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {product.location}, La Paz
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" /> {CONDITION_LABEL[product.condition]}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" /> {formatDate(product.publishedAt ?? product.createdAt)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <PackageCheck className="h-4 w-4" />
                {product.deliveryMethods.map((m) => DELIVERY_LABEL[m]).join(' · ')}
              </div>
              {product.freeShipping && (
                <div className="flex items-center gap-2 text-success col-span-2">
                  <Truck className="h-4 w-4" /> Envío gratis en La Paz
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full">
                <MessageCircle className="h-5 w-5" /> Contactar vendedor
              </Button>
              <div className="flex gap-3">
                <Button size="lg" variant="outline" className="flex-1" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-deal text-deal' : ''}`} />
                  {isFavorite ? 'Guardado' : 'Guardar'}
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  <Share2 className="h-5 w-5" /> Compartir
                </Button>
              </div>
            </div>

            <SafetyNotice />

            {/* Vendedor */}
            <div className="p-4 bg-card border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{product.sellerName}</p>
                    {product.sellerVerified && <VerifiedBadge />}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" /> Vendedor en La Paz
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <ReportButton listingId={product.id} />
            </div>
          </div>
        </div>

        {/* Descripción */}
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
