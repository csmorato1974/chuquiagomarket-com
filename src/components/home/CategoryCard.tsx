import { Link } from 'react-router-dom';
import { CategoryInfo } from '@/types/marketplace';

interface CategoryCardProps {
  category: CategoryInfo;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      to={`/productos?category=${category.id}`}
      className="group flex flex-col items-center justify-center p-6 bg-card rounded-xl border card-hover text-center"
    >
      <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {category.icon}
      </span>
      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryCard;
