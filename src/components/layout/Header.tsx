import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Plus, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container-market">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
            <span className="hidden sm:block font-bold text-xl text-foreground">
              Chuquiago<span className="text-primary">Market</span>
            </span>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-input bg-background focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </form>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="accent" size="default" asChild>
              <Link to="/publicar">
                <Plus className="h-5 w-5" />
                Vender
              </Link>
            </Button>
            <Button variant="outline" size="default" asChild>
              <Link to="/auth">
                <User className="h-5 w-5" />
                Entrar
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
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-input bg-background focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-card animate-fade-in">
          <div className="container-market py-4 flex flex-col gap-3">
            <Button variant="accent" size="lg" className="w-full" asChild>
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
