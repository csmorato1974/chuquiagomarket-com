import { BadgeCheck } from 'lucide-react';

interface Props {
  className?: string;
  showLabel?: boolean;
}

const VerifiedBadge = ({ className = '', showLabel = true }: Props) => (
  <span
    className={`inline-flex items-center gap-1 text-primary text-xs font-medium ${className}`}
    title="Vendedor verificado"
  >
    <BadgeCheck className="h-4 w-4" />
    {showLabel && <span>Verificado</span>}
  </span>
);

export default VerifiedBadge;
