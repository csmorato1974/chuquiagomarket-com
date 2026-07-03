import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';

const REASONS = [
  { id: 'fraud', label: 'Posible fraude o estafa' },
  { id: 'prohibited', label: 'Producto prohibido' },
  { id: 'spam', label: 'Spam o duplicado' },
  { id: 'other', label: 'Otro motivo' },
];

const ReportButton = ({ listingId }: { listingId: string }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('fraud');
  const [note, setNote] = useState('');

  const submit = () => {
    // Mock: en el futuro insertamos en listing_flags
    console.log('Reportando anuncio', { listingId, reason, note });
    toast.success('Gracias por avisar. Nuestro equipo revisará el anuncio.');
    setOpen(false);
    setNote('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="h-4 w-4" />
          Reportar anuncio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar este anuncio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Motivo</Label>
            <div className="mt-2 space-y-2">
              {REASONS.map((r) => (
                <label key={r.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="note">Detalles (opcional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Cuéntanos qué pasa con este anuncio"
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={submit}>Enviar reporte</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportButton;
