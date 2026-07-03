export const formatBs = (n: number): string =>
  `Bs ${n.toLocaleString('es-BO')}`;

export const formatDate = (d: Date | string): string =>
  new Date(d).toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const timeAgo = (d: Date | string): string => {
  const date = new Date(d);
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 30) return `hace ${days} días`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  const years = Math.floor(days / 365);
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
};

export const LA_PAZ_ZONES = [
  'Sopocachi',
  'Miraflores',
  'San Miguel',
  'Calacoto',
  'Achumani',
  'Obrajes',
  'Zona Sur',
  'Centro',
  'El Alto',
  'Villa Fátima',
  'Cota Cota',
  'Irpavi',
] as const;

export const CONDITION_LABEL: Record<string, string> = {
  new: 'Nuevo',
  like_new: 'Como nuevo',
  good: 'Buen estado',
  fair: 'Aceptable',
};

export const DELIVERY_LABEL: Record<string, string> = {
  pickup: 'Recojo en persona',
  delivery_lapaz: 'Delivery en La Paz',
  shipping_bo: 'Envío a Bolivia',
};

export const STATUS_LABEL: Record<string, string> = {
  draft: 'Borrador',
  pending_review: 'En revisión',
  published: 'Publicado',
  paused: 'Pausado',
  rejected: 'Rechazado',
  sold: 'Vendido',
  archived: 'Archivado',
};

export const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
  published: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  paused: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  sold: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  archived: 'bg-muted text-muted-foreground',
};
