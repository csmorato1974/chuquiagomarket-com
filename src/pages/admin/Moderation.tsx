import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useRoles } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatBs } from '@/lib/format';
import {
  REJECTION_REASONS,
  FLAG_RESOLUTIONS,
  VERIFICATION_REJECTIONS,
  FLAG_REASONS,
} from '@/lib/moderation';
import AuditHistoryDialog from '@/components/admin/AuditHistoryDialog';
import type { Database } from '@/integrations/supabase/types';

type RejectionReasonCode = Database['public']['Enums']['rejection_reason_code'];
type FlagResolution = Database['public']['Enums']['flag_resolution'];
type VerificationRejection = Database['public']['Enums']['verification_rejection'];

type Listing = {
  id: string;
  title: string;
  price_bs: number;
  seller_id: string;
  created_at: string;
  status: string;
  zone: string | null;
};
type Flag = {
  id: string;
  listing_id: string;
  reporter_id: string | null;
  reason: string;
  note: string | null;
  status: string;
  created_at: string;
};
type Verif = {
  user_id: string;
  status: string;
  submitted_at: string | null;
  notes: string | null;
};

type RejectTarget =
  | { kind: 'listing'; id: string }
  | { kind: 'flag'; id: string; listingId: string }
  | { kind: 'verif'; userId: string };

type HistoryTarget = { entityType: 'listing' | 'seller_verification'; entityId: string; title: string };

export default function Moderation() {
  const { user, loading: authLoading } = useAuth();
  const { isStaff, loading: roleLoading } = useRoles();

  const [listings, setListings] = useState<Listing[]>([]);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [verifs, setVerifs] = useState<Verif[]>([]);
  const [reload, setReload] = useState(0);

  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);
  const [reasonCode, setReasonCode] = useState<string>('');
  const [reasonNotes, setReasonNotes] = useState('');

  const [history, setHistory] = useState<HistoryTarget | null>(null);

  useEffect(() => {
    if (!isStaff) return;
    (async () => {
      const [{ data: ls }, { data: fs }, { data: vs }] = await Promise.all([
        supabase.from('listings').select('id,title,price_bs,seller_id,created_at,status,zone').eq('status', 'pending_review').order('created_at'),
        supabase.from('listing_flags').select('*').eq('status', 'open').order('created_at'),
        supabase.from('seller_verifications').select('user_id,status,submitted_at,notes').eq('status', 'pending').order('submitted_at'),
      ]);
      setListings((ls ?? []) as Listing[]);
      setFlags((fs ?? []) as Flag[]);
      setVerifs((vs ?? []) as Verif[]);
    })();
  }, [isStaff, reload]);

  if (authLoading || roleLoading) return <Layout><div className="p-8 text-center">Cargando…</div></Layout>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isStaff) return <Navigate to="/" replace />;

  const openReject = (t: RejectTarget) => {
    setRejectTarget(t);
    setReasonCode('');
    setReasonNotes('');
  };

  const approveListing = async (id: string) => {
    const { error } = await supabase
      .from('listings')
      .update({ status: 'published' as const, rejection_reason_code: null, rejection_notes: null })
      .eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Anuncio publicado');
    setReload((r) => r + 1);
  };

  const approveVerif = async (userId: string) => {
    const { error } = await supabase
      .from('seller_verifications')
      .update({ status: 'verified' as const, reviewed_at: new Date().toISOString(), rejection_code: null })
      .eq('user_id', userId);
    if (error) return toast.error(error.message);
    toast.success('Vendedor verificado');
    setReload((r) => r + 1);
  };

  const dismissFlag = async (id: string) => {
    const { error } = await supabase
      .from('listing_flags')
      .update({ status: 'dismissed', resolution: 'no_action', resolved_by: user.id, resolved_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Reporte descartado');
    setReload((r) => r + 1);
  };

  const submitReject = async () => {
    if (!rejectTarget || !reasonCode) return;
    if (rejectTarget.kind === 'listing') {
      const label = REJECTION_REASONS[reasonCode] ?? reasonCode;
      const { error } = await supabase
        .from('listings')
        .update({
          status: 'rejected' as const,
          rejection_reason_code: reasonCode as never,
          rejection_notes: reasonNotes || null,
          rejection_reason: [label, reasonNotes].filter(Boolean).join(' — '),
        })
        .eq('id', rejectTarget.id);
      if (error) return toast.error(error.message);
      toast.success('Anuncio rechazado');
    } else if (rejectTarget.kind === 'flag') {
      const { error } = await supabase
        .from('listing_flags')
        .update({
          status: 'resolved',
          resolution: reasonCode as never,
          resolved_by: user.id,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', rejectTarget.id);
      if (error) return toast.error(error.message);
      toast.success('Reporte resuelto');
    } else if (rejectTarget.kind === 'verif') {
      const { error } = await supabase
        .from('seller_verifications')
        .update({
          status: 'rejected' as const,
          rejection_code: reasonCode as never,
          notes: reasonNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('user_id', rejectTarget.userId);
      if (error) return toast.error(error.message);
      toast.success('Verificación rechazada');
    }
    setRejectTarget(null);
    setReload((r) => r + 1);
  };

  const reasonOptions = rejectTarget?.kind === 'listing'
    ? REJECTION_REASONS
    : rejectTarget?.kind === 'flag'
    ? FLAG_RESOLUTIONS
    : VERIFICATION_REJECTIONS;

  return (
    <Layout>
      <Helmet><title>Moderación · Chuquiago Market</title></Helmet>
      <div className="container-market py-6">
        <h1 className="text-2xl font-bold mb-4">Panel de moderación</h1>

        <Tabs defaultValue="listings">
          <TabsList>
            <TabsTrigger value="listings">Anuncios <Badge variant="secondary" className="ml-2">{listings.length}</Badge></TabsTrigger>
            <TabsTrigger value="flags">Reportes <Badge variant="secondary" className="ml-2">{flags.length}</Badge></TabsTrigger>
            <TabsTrigger value="verifs">Verificaciones <Badge variant="secondary" className="ml-2">{verifs.length}</Badge></TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-4">
            {listings.length === 0 && <p className="text-muted-foreground">Nada pendiente.</p>}
            <ul className="space-y-2">
              {listings.map((l) => (
                <li key={l.id} className="border rounded-md p-3 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <Link to={`/producto/${l.id}`} className="font-medium hover:underline">{l.title}</Link>
                    <div className="text-xs text-muted-foreground">{formatBs(Number(l.price_bs))} · {l.zone ?? '—'} · {new Date(l.created_at).toLocaleDateString('es-BO')}</div>
                    <div className="text-[10px] text-muted-foreground">seller: {l.seller_id.slice(0, 8)}…</div>
                  </div>
                  <Button size="sm" onClick={() => approveListing(l.id)}>Aprobar</Button>
                  <Button size="sm" variant="destructive" onClick={() => openReject({ kind: 'listing', id: l.id })}>Rechazar</Button>
                  <Button size="sm" variant="outline" onClick={() => setHistory({ entityType: 'listing', entityId: l.id, title: l.title })}>Historial</Button>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="flags" className="mt-4">
            {flags.length === 0 && <p className="text-muted-foreground">Sin reportes abiertos.</p>}
            <ul className="space-y-2">
              {flags.map((f) => (
                <li key={f.id} className="border rounded-md p-3 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <Link to={`/producto/${f.listing_id}`} className="font-medium hover:underline">Anuncio {f.listing_id.slice(0, 8)}…</Link>
                    <div className="text-xs">Motivo: <Badge variant="outline">{FLAG_REASONS[f.reason] ?? f.reason}</Badge></div>
                    {f.note && <div className="text-xs text-muted-foreground mt-1">{f.note}</div>}
                    <div className="text-[10px] text-muted-foreground">{new Date(f.created_at).toLocaleString('es-BO')}</div>
                  </div>
                  <Button size="sm" onClick={() => openReject({ kind: 'flag', id: f.id, listingId: f.listing_id })}>Resolver</Button>
                  <Button size="sm" variant="outline" onClick={() => dismissFlag(f.id)}>Descartar</Button>
                  <Button size="sm" variant="outline" onClick={() => setHistory({ entityType: 'listing', entityId: f.listing_id, title: `Anuncio ${f.listing_id.slice(0, 8)}` })}>Historial</Button>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="verifs" className="mt-4">
            {verifs.length === 0 && <p className="text-muted-foreground">Sin verificaciones pendientes.</p>}
            <ul className="space-y-2">
              {verifs.map((v) => (
                <li key={v.user_id} className="border rounded-md p-3 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-medium">Usuario {v.user_id.slice(0, 8)}…</div>
                    <div className="text-xs text-muted-foreground">Enviado: {v.submitted_at ? new Date(v.submitted_at).toLocaleString('es-BO') : '—'}</div>
                    {v.notes && <div className="text-xs mt-1">{v.notes}</div>}
                  </div>
                  <Button size="sm" onClick={() => approveVerif(v.user_id)}>Verificar</Button>
                  <Button size="sm" variant="destructive" onClick={() => openReject({ kind: 'verif', userId: v.user_id })}>Rechazar</Button>
                  <Button size="sm" variant="outline" onClick={() => setHistory({ entityType: 'seller_verification', entityId: v.user_id, title: `Verificación ${v.user_id.slice(0, 8)}` })}>Historial</Button>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {rejectTarget?.kind === 'flag' ? 'Resolver reporte' : 'Motivo del rechazo'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={reasonCode} onValueChange={setReasonCode}>
              <SelectTrigger><SelectValue placeholder="Selecciona un motivo" /></SelectTrigger>
              <SelectContent>
                {Object.entries(reasonOptions).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {rejectTarget?.kind !== 'flag' && (
              <Textarea
                placeholder="Notas (opcional, visibles para el vendedor)"
                value={reasonNotes}
                onChange={(e) => setReasonNotes(e.target.value)}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancelar</Button>
            <Button onClick={submitReject} disabled={!reasonCode}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {history && (
        <AuditHistoryDialog
          entityType={history.entityType}
          entityId={history.entityId}
          title={`Historial · ${history.title}`}
          onClose={() => setHistory(null)}
        />
      )}
    </Layout>
  );
}
