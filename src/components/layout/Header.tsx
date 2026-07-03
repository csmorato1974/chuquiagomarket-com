import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, Bell, ShoppingCart, Menu, X, User, Plus } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES } from '@/types/marketplace';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/productos');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b">
      {/* Top bar */}
      <div className="border-b bg-secondary/30">
        <div className="container-market">
          <div className="flex h-9 items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {user ? (
                  <>Hola, <Link to="/perfil" className="text-primary hover:underline font-medium">mi cuenta</Link> · <button onClick={() => signOut()} className="text-primary hover:underline font-medium">salir</button></>
                ) : (
                  <>¡Hola! <Link to="/auth" className="text-primary hover:underline font-medium">Inicia sesión</Link> o <Link to="/auth" className="text-primary hover:underline font-medium">regístrate</Link></>
                )}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/productos" className="nav-link">Ofertas del día</Link>
              <Link to="/publicar" className="nav-link">Vender</Link>
              <Link to="#" className="nav-link">Ayuda</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-market">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="Chuquiago Market" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Buscar cualquier cosa"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-ebay"
              />
              <button type="button" className="h-12 px-4 bg-background border-2 border-l-0 border-border flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Categorías
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="submit" className="search-button-ebay">
                Buscar
              </button>
            </div>
          </form>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="#">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="#">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/auth">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Buscar en Chuquiago Market"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-11 pl-4 pr-4 rounded-l-full border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
            />
            <button type="submit" className="h-11 px-6 bg-primary text-primary-foreground font-semibold rounded-r-full">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Categories nav - Desktop */}
        <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/productos?category=${category.id}`}
              className="nav-link whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
          <Link to="/productos" className="nav-link whitespace-nowrap flex items-center gap-1">
            Más <ChevronDown className="h-4 w-4" />
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-card animate-fade-in">
          <div className="container-market py-4 flex flex-col gap-3">
            <Button size="lg" className="w-full" asChild>
              <Link to="/publicar" onClick={() => setIsMenuOpen(false)}>
                <Plus className="h-5 w-5" />
                Vender producto
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <User className="h-5 w-5" />
                Iniciar sesión
              </Link>
            </Button>
            <div className="border-t pt-3 mt-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">Categorías</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    to={`/productos?category=${category.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm py-2 px-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
