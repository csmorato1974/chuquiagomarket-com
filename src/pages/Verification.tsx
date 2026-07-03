import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { BadgeCheck, Clock, XCircle, ShieldQuestion, Upload } from 'lucide-react';

type VerifStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

const META: Record<VerifStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  unverified: { label: 'Sin verificar', icon: ShieldQuestion, color: 'text-muted-foreground' },
  pending: { label: 'En revisión', icon: Clock, color: 'text-yellow-600' },
  verified: { label: 'Verificado', icon: BadgeCheck, color: 'text-primary' },
  rejected: { label: 'Rechazado', icon: XCircle, color: 'text-destructive' },
};

const Verification = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<VerifStatus>('unverified');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from('seller_verifications').select('status,notes').eq('user_id', user.id).maybeSingle();
      if (data) { setStatus(data.status as VerifStatus); setNotes(data.notes ?? ''); }
      setLoading(false);
    })();
  }, [user]);

  const submit = async () => {
    if (!user) return;
    if (!file && status === 'unverified') return toast.error('Sube tu documento');
    try {
      let path: string | undefined;
      if (file) {
        const ext = file.name.split('.').pop();
        path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from('verification-docs').upload(path, file);
        if (error) throw error;
      }
      const { error } = await supabase.from('seller_verifications').upsert({
        user_id: user.id,
        status: 'pending' as const,
        notes,
        submitted_at: new Date().toISOString(),
        ...(path ? { id_document_path: path } : {}),
      });
      if (error) throw error;
      setStatus('pending');
      toast.success('Solicitud enviada. Te avisaremos cuando terminemos la revisión.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  };

  if (loading) return <Layout><div className="container-market py-12">Cargando…</div></Layout>;
  const M = META[status];
  const Icon = M.icon;

  return (
    <Layout>
      <div className="container-market py-8 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Verificación de vendedor</h1>
        <p className="text-muted-foreground mb-6">
          Un vendedor verificado genera más confianza y tiene mejor visibilidad.
        </p>

        <div className="p-4 border rounded-xl bg-card mb-6 flex items-center gap-3">
          <Icon className={`h-6 w-6 ${M.color}`} />
          <div>
            <p className="font-semibold">Estado actual: {M.label}</p>
            {status === 'pending' && <p className="text-sm text-muted-foreground">Estamos revisando tu solicitud.</p>}
          </div>
        </div>

        {(status === 'unverified' || status === 'rejected') && (
          <div className="space-y-4">
            <div>
              <Label>Documento de identidad (foto de tu CI, PNG/JPG/PDF)</Label>
              <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2" />
            </div>
            <div>
              <Label>Nota (opcional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" placeholder="Cuéntanos sobre ti o tu tienda" />
            </div>
            <Button onClick={submit}><Upload className="h-4 w-4" /> Enviar verificación</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Verification;
