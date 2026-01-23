import { Link } from 'react-router-dom';
import { Product } from '@/types/marketplace';
import { Heart, Truck } from 'lucide-react';
import { useState } from 'react';

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
    <Link
      to={`/producto/${product.id}`}
      className="group block card-product"
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="favorite-button"
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-deal text-deal' : 'text-muted-foreground'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-foreground line-clamp-2 text-sm mb-2 group-hover:text-primary transition-colors min-h-[40px]">
          {product.title}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-bold text-foreground">
            {product.price.toLocaleString('es-BO')} €
          </span>
          {product.originalPrice && (
            <span className="text-price-old">
              {product.originalPrice.toLocaleString('es-BO')} €
            </span>
          )}
        </div>

        {discount > 0 && (
          <span className="text-sm font-medium text-deal">
            {discount}% de descuento
          </span>
        )}

        {product.freeShipping && (
          <div className="flex items-center gap-1 text-sm text-success mt-2">
            <Truck className="h-4 w-4" />
            <span>Envío gratis</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
