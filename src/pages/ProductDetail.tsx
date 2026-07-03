import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SafetyNotice from '@/components/trust/SafetyNotice';
import VerifiedBadge from '@/components/trust/VerifiedBadge';
import ReportButton from '@/components/trust/ReportButton';
import { CATEGORIES, Product } from '@/types/marketplace';
import { MapPin, User, Calendar, ArrowLeft, MessageCircle, Heart, Share2, Tag, PackageCheck } from 'lucide-react';
import { formatBs, formatDate, CONDITION_LABEL, DELIVERY_LABEL } from '@/lib/format';
import { fetchListingById } from '@/lib/listings';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const p = await fetchListingById(id);
      setProduct(p); setLoading(false);
      if (p) {
        supabase.from('lead_events').insert({ listing_id: id, user_id: user?.id ?? null, type: 'view' });
      }
      if (user && id) {
        const { data } = await supabase.from('favorites').select('user_id').eq('user_id', user.id).eq('listing_id', id).maybeSingle();
        setIsFavorite(!!data);
      }
    })();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) return toast.error('Inicia sesión para guardar');
    if (!id) return;
    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', id);
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, listing_id: id });
      await supabase.from('lead_events').insert({ listing_id: id, user_id: user.id, type: 'favorite' });
      setIsFavorite(true);
    }
  };

  const onContact = () => {
    if (id) supabase.from('lead_events').insert({ listing_id: id, user_id: user?.id ?? null, type: 'contact_click' });
    toast.info('Función de mensajería próximamente.');
  };

  if (loading) return <Layout><div className="container-market py-12">Cargando…</div></Layout>;
  if (!product) return (
    <Layout>
      <div className="container-market py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Button asChild><Link to="/productos"><ArrowLeft className="h-4 w-4" /> Volver</Link></Button>
      </div>
    </Layout>
  );

  const category = CATEGORIES.find((c) => c.slug === product.category);

  return (
    <Layout>
      <div className="container-market py-6 md:py-8">
        <Breadcrumbs items={[
          { label: 'Inicio', to: '/' },
          ...(category ? [{ label: category.name, to: `/productos?category=${category.slug}` }] : []),
          { label: product.title },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square bg-card rounded-xl overflow-hidden border">
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-contain p-8" />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-bold leading-tight">{product.title}</h1>
            <div className="text-3xl md:text-4xl font-bold">{formatBs(product.price)}</div>

            <div className="grid grid-cols-2 gap-3 py-4 border-y text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {product.location}, La Paz</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Tag className="h-4 w-4" /> {CONDITION_LABEL[product.condition]}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> {formatDate(product.publishedAt ?? product.createdAt)}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><PackageCheck className="h-4 w-4" /> {product.deliveryMethods.map((m) => DELIVERY_LABEL[m]).join(' · ')}</div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full" onClick={onContact}><MessageCircle className="h-5 w-5" /> Contactar vendedor</Button>
              <div className="flex gap-3">
                <Button size="lg" variant="outline" className="flex-1" onClick={toggleFavorite}>
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-deal text-deal' : ''}`} /> {isFavorite ? 'Guardado' : 'Guardar'}
                </Button>
                <Button size="lg" variant="outline" className="flex-1"><Share2 className="h-5 w-5" /> Compartir</Button>
              </div>
            </div>

            <SafetyNotice />

            <div className="p-4 bg-card border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"><User className="h-6 w-6 text-muted-foreground" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{product.sellerName}</p>
                    {product.sellerVerified && <VerifiedBadge />}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" /> Vendedor en La Paz</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end"><ReportButton listingId={product.id} /></div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t">
          <h2 className="font-bold text-xl mb-4">Descripción del producto</h2>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{product.description}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
