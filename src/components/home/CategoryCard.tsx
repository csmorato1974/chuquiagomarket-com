import { Link } from 'react-router-dom';
import { CategoryInfo } from '@/types/marketplace';

// Import category images
import electronicsImg from '@/assets/categories/electronics.jpg';
import fashionImg from '@/assets/categories/fashion.jpg';
import homeImg from '@/assets/categories/home.jpg';
import sportsImg from '@/assets/categories/sports.jpg';
import vehiclesImg from '@/assets/categories/vehicles.jpg';
import otherImg from '@/assets/categories/other.jpg';

const categoryImages: Record<string, string> = {
  electronics: electronicsImg,
  fashion: fashionImg,
  home: homeImg,
  sports: sportsImg,
  vehicles: vehiclesImg,
  other: otherImg,
};

interface CategoryCardProps {
  category: CategoryInfo;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const imageSrc = categoryImages[category.image];

  return (
    <Link
      to={`/productos?category=${category.id}`}
      className="group flex flex-col items-center gap-3"
    >
      <div className="category-circle">
        <img
          src={imageSrc}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryCard;
