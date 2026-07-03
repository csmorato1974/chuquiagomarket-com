import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface AuditRow {
  id: string;
  actor_id: string | null;
  from_status: string | null;
  to_status: string | null;
  reason_code: string | null;
  notes: string | null;
  created_at: string;
}

interface Props {
  entityType: 'listing' | 'seller_verification';
  entityId: string | null;
  title?: string;
  onClose: () => void;
}

export default function AuditHistoryDialog({ entityType, entityId, title, onClose }: Props) {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!entityId) return;
    setLoading(true);
    supabase
      .from('audit_log')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRows((data ?? []) as AuditRow[]);
        setLoading(false);
      });
  }, [entityType, entityId]);

  return (
    <Dialog open={!!entityId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title ?? 'Historial de moderación'}</DialogTitle>
        </DialogHeader>
        {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
        {!loading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>
        )}
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
          {rows.map((r) => (
            <li key={r.id} className="border-l-2 border-primary/40 pl-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {r.from_status && <Badge variant="outline">{r.from_status}</Badge>}
                <span className="text-muted-foreground">→</span>
                {r.to_status && <Badge>{r.to_status}</Badge>}
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString('es-BO')}
                </span>
              </div>
              {r.reason_code && (
                <p className="text-xs mt-1"><span className="font-medium">Motivo:</span> {r.reason_code}</p>
              )}
              {r.notes && <p className="text-xs mt-1 text-muted-foreground">{r.notes}</p>}
              {r.actor_id && (
                <p className="text-[10px] mt-1 text-muted-foreground">actor: {r.actor_id.slice(0, 8)}…</p>
              )}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
