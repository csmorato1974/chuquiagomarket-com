import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/mockProducts';
import { User, Mail, Calendar, Plus, Settings } from 'lucide-react';

// Mock user data
const mockUser = {
  id: 'user1',
  name: 'Carlos M.',
  email: 'carlos@email.com',
  createdAt: new Date('2023-06-15'),
};

const Profile = () => {
  const userProducts = mockProducts.filter(p => p.sellerId === mockUser.id);
  const formattedDate = new Date(mockUser.createdAt).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <Layout>
      <div className="container-market py-8 md:py-12">
        {/* Profile header */}
        <div className="bg-card rounded-2xl border p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {mockUser.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{mockUser.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Miembro desde {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none">
                <Settings className="h-4 w-4" />
                Editar perfil
              </Button>
              <Button variant="accent" className="flex-1 md:flex-none" asChild>
                <Link to="/publicar">
                  <Plus className="h-4 w-4" />
                  Nuevo producto
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* User products */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
            Mis productos ({userProducts.length})
          </h2>
          
          {userProducts.length > 0 ? (
            <ProductGrid products={userProducts} />
          ) : (
            <div className="text-center py-16 bg-muted/50 rounded-2xl">
              <p className="text-muted-foreground mb-4">
                Aún no has publicado ningún producto
              </p>
              <Button variant="accent" asChild>
                <Link to="/publicar">
                  <Plus className="h-4 w-4" />
                  Publicar mi primer producto
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
