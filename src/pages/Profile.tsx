import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ListingStatus, Product } from '@/types/marketplace';
import { STATUS_LABEL, STATUS_COLOR, formatDate } from '@/lib/format';
import VerifiedBadge from '@/components/trust/VerifiedBadge';
import { User, Mail, Calendar, Plus, Settings, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchMyListings } from '@/lib/listings';
import { supabase } from '@/integrations/supabase/client';

const STATUSES: (ListingStatus | 'all')[] = ['all','published','pending_review','draft','paused','sold','rejected','archived'];

const Profile = () => {
  const { user, signOut } = useAuth();
  const [filter, setFilter] = useState<ListingStatus | 'all'>('all');
  const [listings, setListings] = useState<Product[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: prof }, { data: verif }, mine] = await Promise.all([
        supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle(),
        supabase.from('seller_verifications').select('status').eq('user_id', user.id).maybeSingle(),
        fetchMyListings(),
      ]);
      setDisplayName(prof?.display_name || user.email?.split('@')[0] || 'Usuario');
      setVerified(verif?.status === 'verified');
      setListings(mine);
    })();
  }, [user]);

  const visible = filter === 'all' ? listings : listings.filter((p) => p.status === filter);
  const joinedAt = user?.created_at ? new Date(user.created_at) : new Date();

  return (
    <Layout>
      <div className="container-market py-8 md:py-12">
        <div className="bg-card rounded-2xl border p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
                {verified && <VerifiedBadge />}
              </div>
              <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-1"><Mail className="h-4 w-4" /> {user?.email}</div>
                <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Miembro desde {formatDate(joinedAt)}</div>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap w-full md:w-auto">
              <Button variant="outline" asChild><Link to="/perfil/verificacion"><BadgeCheck className="h-4 w-4" /> Verificarme</Link></Button>
              <Button variant="outline" onClick={() => signOut()}><Settings className="h-4 w-4" /> Cerrar sesión</Button>
              <Button variant="accent" asChild><Link to="/publicar"><Plus className="h-4 w-4" /> Nuevo anuncio</Link></Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4">Mis anuncios ({listings.length})</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-sm border ${filter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-secondary'}`}>
                {s === 'all' ? 'Todos' : STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          {visible.length > 0 ? (
            <div className="space-y-4">
              {visible.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 bg-card border rounded-xl">
                  <img src={p.images[0]} alt={p.title} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.location} · {formatDate(p.createdAt)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${STATUS_COLOR[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                  <div className="hidden sm:flex gap-2">
                    <Button variant="ghost" size="sm" asChild><Link to={`/anuncio/${p.id}/estado`}>Ver</Link></Button>
                    <Button variant="ghost" size="sm" asChild><Link to={`/anuncio/${p.id}/editar`}>Editar</Link></Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/50 rounded-2xl">
              <p className="text-muted-foreground mb-4">No hay anuncios con este estado</p>
              <Button variant="accent" asChild><Link to="/publicar"><Plus className="h-4 w-4" /> Publicar anuncio</Link></Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
