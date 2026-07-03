import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/30 mt-auto">
      <div className="container-market py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-foreground mb-4">Comprar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/productos" className="hover:text-primary hover:underline">Explorar anuncios</Link></li>
              <li><Link to="/ayuda" className="hover:text-primary hover:underline">Cómo comprar</Link></li>
              <li><Link to="/politicas" className="hover:text-primary hover:underline">Compra segura</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Vender</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/publicar" className="hover:text-primary hover:underline">Publicar anuncio</Link></li>
              <li><Link to="/politicas" className="hover:text-primary hover:underline">Reglas de publicación</Link></li>
              <li><Link to="/ayuda" className="hover:text-primary hover:underline">Cómo vender</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Chuquiago Market</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/ayuda" className="hover:text-primary hover:underline">Ayuda</Link></li>
              <li><Link to="/contacto" className="hover:text-primary hover:underline">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/acuerdo" className="hover:text-primary hover:underline">Acuerdo de usuario</Link></li>
              <li><Link to="/privacidad" className="hover:text-primary hover:underline">Privacidad</Link></li>
              <li><Link to="/cookies" className="hover:text-primary hover:underline">Cookies</Link></li>
              <li><Link to="/politicas" className="hover:text-primary hover:underline">Políticas</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>© 2026 Chuquiago Market · Marketplace local de La Paz · Beta</p>
          <p>Hecho con ❤️ en Bolivia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
