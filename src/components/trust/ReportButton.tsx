import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const REASONS = [
  { id: 'fraud', label: 'Posible fraude o estafa' },
  { id: 'prohibited', label: 'Producto prohibido' },
  { id: 'spam', label: 'Spam o duplicado' },
  { id: 'other', label: 'Otro motivo' },
] as const;

type Reason = typeof REASONS[number]['id'];

const ReportButton = ({ listingId }: { listingId: string }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Reason>('fraud');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!user) return toast.error('Inicia sesión para reportar');
    setSubmitting(true);
    const { data: existing } = await supabase.from('listing_flags')
      .select('id').eq('listing_id', listingId).eq('reporter_id', user.id).eq('status', 'open').maybeSingle();
    if (existing) {
      setSubmitting(false);
      toast.info('Ya tienes un reporte abierto para este anuncio.');
      setOpen(false);
      return;
    }
    const { error } = await supabase.from('listing_flags').insert({
      listing_id: listingId, reporter_id: user.id, reason, note: note || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success('Gracias por avisar. Revisaremos el anuncio.');
    setOpen(false); setNote('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="h-4 w-4" /> Reportar anuncio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Reportar este anuncio</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Motivo</Label>
            <div className="mt-2 space-y-2">
              {REASONS.map((r) => (
                <label key={r.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="reason" value={r.id} checked={reason === r.id}
                    onChange={(e) => setReason(e.target.value as Reason)} />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="note">Detalles (opcional)</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} className="mt-2" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={submit} disabled={submitting}>Enviar reporte</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportButton;
