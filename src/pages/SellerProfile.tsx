import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductGrid from '@/components/products/ProductGrid';
import VerifiedBadge from '@/components/trust/VerifiedBadge';
import { fetchListingsBySeller, fetchSellerPublic } from '@/lib/listings';
import { Product, SellerPublic } from '@/types/marketplace';
import { buildWaUrl } from '@/lib/whatsapp';
import { getAvatarSignedUrl } from '@/lib/avatars';
import { MapPin, MessageCircle, Store, User } from 'lucide-react';

const SellerProfile = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [seller, setSeller] = useState<SellerPublic | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;
    (async () => {
      const [s, list] = await Promise.all([
        fetchSellerPublic(sellerId),
        fetchListingsBySeller(sellerId),
      ]);
      setSeller(s);
      setProducts(list);
      setLoading(false);
    })();
  }, [sellerId]);

  if (loading) return <Layout><div className="container-market py-12">Cargando…</div></Layout>;
  if (!seller) return (
    <Layout>
      <div className="container-market py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Vendedor no encontrado</h1>
        <Button asChild><Link to="/productos">Volver a productos</Link></Button>
      </div>
    </Layout>
  );

  const waUrl = seller.whatsappPhone
    ? buildWaUrl(seller.whatsappPhone, `Hola ${seller.displayName}, te escribo desde Chuquiago Market.`)
    : null;

  const onWaClick = () => {
    if (waUrl) window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Layout>
      <div className="container-market py-6 md:py-8">
        <Breadcrumbs items={[
          { label: 'Inicio', to: '/' },
          { label: 'Vendedores' },
          { label: seller.displayName },
        ]} />

        <div className="bg-card rounded-2xl border p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {seller.avatarUrl ? (
                <img src={seller.avatarUrl} alt={seller.displayName} className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{seller.displayName}</h1>
                {seller.verified && <VerifiedBadge />}
              </div>
              <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                {seller.zone && (
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {seller.zone}, La Paz</div>
                )}
                <div className="flex items-center gap-1"><Store className="h-4 w-4" /> {products.length} anuncios publicados</div>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <Button
                size="lg"
                onClick={onWaClick}
                disabled={!waUrl}
                title={waUrl ? 'Abrir WhatsApp' : 'El vendedor aún no configuró WhatsApp'}
                className="w-full md:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                {waUrl ? 'Contactar por WhatsApp' : 'Contacto no disponible'}
              </Button>
            </div>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-4">Productos publicados</h2>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-16 bg-muted/50 rounded-2xl">
            <Store className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-1">Este vendedor aún no tiene productos publicados</p>
            <p className="text-sm text-muted-foreground">Vuelve más tarde para ver novedades.</p>
          </div>
        )}

        {/* TODO: futura sección de reputación (reseñas + estrellas) del vendedor */}
      </div>
    </Layout>
  );
};

export default SellerProfile;
