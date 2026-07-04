import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Camera, AlertTriangle, Flag } from 'lucide-react';

const TIPS = [
  { icon: ShieldCheck, title: 'Compra seguro', text: 'Coordina en lugares públicos y transitados. Revisa el producto antes de pagar.', href: '/ayuda#comprar-seguro' },
  { icon: Camera, title: 'Vende con confianza', text: 'Fotos reales, descripción honesta y precio en Bs. Anuncios claros venden más rápido.', href: '/ayuda#vender-mejor' },
  { icon: AlertTriangle, title: 'Evita fraudes', text: 'Nunca adelantes dinero ni compartas códigos. Desconfía de precios demasiado bajos.', href: '/ayuda#evitar-fraudes' },
  { icon: Flag, title: 'Reporta y modera', text: 'Ayúdanos a mantener la comunidad segura reportando anuncios sospechosos.', href: '/ayuda#reportes' },
];

const SafetyTipsSection = () => (
  <section className="py-10 md:py-14">
    <div className="container-market">
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Buenas prácticas en Chuquiago Market</h2>
          <p className="text-muted-foreground text-sm mt-1">Consejos rápidos para comprar y vender con confianza en La Paz.</p>
        </div>
        <Button variant="outline" asChild className="rounded-full">
          <Link to="/ayuda">Ver guía completa</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIPS.map(({ icon: Icon, title, text, href }) => (
          <Link
            key={title}
            to={href}
            className="group p-5 bg-card rounded-2xl border hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default SafetyTipsSection;
