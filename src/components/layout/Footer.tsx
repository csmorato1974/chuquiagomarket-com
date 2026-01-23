import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container-market py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl text-foreground">
                Chuquiago<span className="text-primary">Market</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              El marketplace más sencillo de Bolivia. Compra y vende de forma rápida y segura.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Explorar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/productos" className="hover:text-primary transition-colors">Todos los productos</Link></li>
              <li><Link to="/productos?category=electronics" className="hover:text-primary transition-colors">Electrónica</Link></li>
              <li><Link to="/productos?category=fashion" className="hover:text-primary transition-colors">Moda</Link></li>
              <li><Link to="/productos?category=home" className="hover:text-primary transition-colors">Hogar</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-3">Ayuda</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Cómo funciona</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Términos de uso</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Chuquiago Market. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
