import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/30 mt-auto">
      <div className="container-market py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Comprar */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Comprar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/productos" className="hover:text-primary hover:underline transition-colors">Registro</Link></li>
              <li><Link to="/productos" className="hover:text-primary hover:underline transition-colors">Cómo comprar</Link></li>
              <li><Link to="/productos" className="hover:text-primary hover:underline transition-colors">Ofertas del día</Link></li>
              <li><Link to="/productos" className="hover:text-primary hover:underline transition-colors">Tiendas</Link></li>
            </ul>
          </div>

          {/* Vender */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Vender</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/publicar" className="hover:text-primary hover:underline transition-colors">Comenzar a vender</Link></li>
              <li><Link to="/publicar" className="hover:text-primary hover:underline transition-colors">Cómo vender</Link></li>
              <li><Link to="#" className="hover:text-primary hover:underline transition-colors">Vendedores profesionales</Link></li>
            </ul>
          </div>

          {/* Herramientas */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Herramientas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">App móvil</a></li>
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">Mapa del sitio</a></li>
            </ul>
          </div>

          {/* Sobre nosotros */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Chuquiago Market</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">Quiénes somos</a></li>
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">Noticias</a></li>
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">Políticas</a></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Ayuda y Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">Centro de ayuda</a></li>
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-primary hover:underline transition-colors">Garantía</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>Copyright © 2024 Chuquiago Market. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary hover:underline">Accesibilidad</a>
            <a href="#" className="hover:text-primary hover:underline">Acuerdo de usuario</a>
            <a href="#" className="hover:text-primary hover:underline">Privacidad</a>
            <a href="#" className="hover:text-primary hover:underline">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
