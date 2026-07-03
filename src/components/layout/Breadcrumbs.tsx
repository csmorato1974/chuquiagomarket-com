import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4 flex-wrap">
    {items.map((c, i) => {
      const isLast = i === items.length - 1;
      return (
        <span key={i} className="flex items-center gap-1">
          {c.to && !isLast ? (
            <Link to={c.to} className="hover:text-primary">{c.label}</Link>
          ) : (
            <span className={isLast ? 'text-foreground' : ''}>{c.label}</span>
          )}
          {!isLast && <ChevronRight className="h-4 w-4" />}
        </span>
      );
    })}
  </nav>
);

export default Breadcrumbs;
