import { Link } from 'react-router-dom';
import { Product, CATEGORIES } from '@/types/marketplace';
import { MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const category = CATEGORIES.find(c => c.id === product.category);

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group block bg-card rounded-xl border overflow-hidden card-hover"
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {category && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-card/90 backdrop-blur text-xs font-medium">
            {category.icon} {category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <p className="text-2xl font-bold text-primary mb-2">
          {product.price.toLocaleString('es-BO')} €
        </p>

        {product.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{product.location}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
