import { Link } from 'react-router-dom';
import { Product } from '@/types/marketplace';
import { Heart, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { formatBs, timeAgo, CONDITION_LABEL } from '@/lib/format';
import VerifiedBadge from '@/components/trust/VerifiedBadge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/producto/${product.id}`} className="group block card-product">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <button onClick={handleFavoriteClick} className="favorite-button">
          <Heart
            className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-deal text-deal' : 'text-muted-foreground'}`}
          />
        </button>
        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide bg-background/90 text-foreground px-2 py-0.5 rounded">
          {CONDITION_LABEL[product.condition]}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-foreground line-clamp-2 text-sm mb-2 group-hover:text-primary transition-colors min-h-[40px]">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-bold text-foreground">{formatBs(product.price)}</span>
          {product.originalPrice && (
            <span className="text-price-old text-xs">{formatBs(product.originalPrice)}</span>
          )}
        </div>

        {discount > 0 && (
          <span className="text-xs font-medium text-deal">{discount}% menos</span>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {product.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeAgo(product.publishedAt ?? product.createdAt)}
          </span>
          {product.sellerVerified && <VerifiedBadge showLabel={false} />}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
