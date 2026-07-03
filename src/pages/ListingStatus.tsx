import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { STATUS_LABEL, STATUS_COLOR, formatDate } from '@/lib/format';
import { CheckCircle2, Clock, XCircle, Eye, MousePointerClick, Heart } from 'lucide-react';
import { ListingStatus } from '@/types/marketplace';
import { REJECTION_REASONS } from '@/lib/moderation';

interface Row {
  id: string; title: string; status: ListingStatus; created_at: string;
  published_at: string | null; rejection_reason: string | null;
  rejection_reason_code: string | null; rejection_notes: string | null; seller_id: string;
}

const timeline: { key: ListingStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'draft', label: 'Borrador', icon: Clock },
  { key: 'pending_review', label: 'En revisión', icon: Clock },
  { key: 'published', label: 'Publicado', icon: CheckCircle2 },
];

const ListingStatusPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [row, setRow] = useState<Row | null>(null);
  const [stats, setStats] = useState<Record<'view' | 'contact_click' | 'favorite', number>>({ view: 0, contact_click: 0, favorite: 0 });

  const load = async () => {
    if (!id) return;
    const { data } = await supabase.from('listings').select('id,title,status,created_at,published_at,rejection_reason,rejection_reason_code,rejection_notes,seller_id').eq('id', id).maybeSingle();
    setRow(data as Row | null);
    const { data: events } = await supabase.from('lead_events').select('type').eq('listing_id', id);
    const s: Record<'view' | 'contact_click' | 'favorite', number> = { view: 0, contact_click: 0, favorite: 0 };
    (events ?? []).forEach((e: { type: string }) => {
      if (e.type === 'view' || e.type === 'contact_click' || e.type === 'favorite') s[e.type]++;
    });
    setStats(s);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  if (!row) return <Layout><div className="container-market py-12">Cargando…</div></Layout>;
  if (user && row.seller_id !== user.id) return <Layout><div className="container-market py-12">No autorizado.</div></Layout>;

  const setStatus = async (status: ListingStatus) => {
    await supabase.from('listings').update({ status }).eq('id', row.id);
    setRow({ ...row, status });
  };

  const resubmit = async () => {
    await supabase.from('listings').update({
      status: 'pending_review',
      rejection_reason: null,
      rejection_reason_code: null,
      rejection_notes: null,
    }).eq('id', row.id);
    await load();
  };

  return (
    <Layout>
      <div className="container-market py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{row.title}</h1>
        <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${STATUS_COLOR[row.status]}`}>
          {STATUS_LABEL[row.status]}
        </span>

        {row.status === 'rejected' && (row.rejection_reason_code || row.rejection_notes || row.rejection_reason) && (
          <div className="mt-4 p-4 border border-destructive/40 rounded-xl bg-destructive/5">
            <div className="flex items-center gap-2 font-semibold text-destructive mb-1"><XCircle className="h-5 w-5" />Rechazado</div>
            {row.rejection_reason_code && (
              <p className="text-sm font-medium">{REJECTION_REASONS[row.rejection_reason_code] ?? row.rejection_reason_code}</p>
            )}
            {row.rejection_notes ? (
              <p className="text-sm text-muted-foreground mt-1">{row.rejection_notes}</p>
            ) : (!row.rejection_reason_code && row.rejection_reason && (
              <p className="text-sm">{row.rejection_reason}</p>
            ))}
          </div>
        )}

        <section className="mt-8">
          <h2 className="font-semibold mb-4">Progreso</h2>
          <ol className="space-y-3">
            {timeline.map((step) => {
              const done =
                (step.key === 'draft') ||
                (step.key === 'pending_review' && row.status !== 'draft') ||
                (step.key === 'published' && row.status === 'published');
              const Icon = step.icon;
              return (
                <li key={step.key} className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${done ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={done ? 'text-foreground' : 'text-muted-foreground'}>{step.label}</span>
                </li>
              );
            })}
          </ol>
          <p className="text-xs text-muted-foreground mt-3">
            Creado: {formatDate(row.created_at)}{row.published_at && ` · Publicado: ${formatDate(row.published_at)}`}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-semibold mb-4">Interés recibido</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Eye, label: 'Vistas', val: stats.view },
              { icon: MousePointerClick, label: 'Contactos', val: stats.contact_click },
              { icon: Heart, label: 'Favoritos', val: stats.favorite },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="p-4 bg-card border rounded-xl text-center">
                <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{val}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link to={`/anuncio/${row.id}/editar`}>Editar</Link></Button>
          {row.status === 'published' && <Button variant="outline" onClick={() => setStatus('paused')}>Pausar</Button>}
          {row.status === 'paused' && <Button variant="outline" onClick={() => setStatus('published')}>Reanudar</Button>}
          {row.status === 'published' && <Button variant="outline" onClick={() => setStatus('sold')}>Marcar como vendido</Button>}
          {row.status !== 'archived' && <Button variant="outline" onClick={() => setStatus('archived')}>Archivar</Button>}
        </section>
      </div>
    </Layout>
  );
};

export default ListingStatusPage;
