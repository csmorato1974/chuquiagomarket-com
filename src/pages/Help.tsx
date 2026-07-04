import StaticPage from '@/components/layout/StaticPage';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Handshake, AlertTriangle, Flag, BadgeCheck, Camera,
  MessageCircle, MapPin, Wallet, Eye, PhoneOff, LinkIcon,
} from 'lucide-react';

const SECTIONS = [
  { id: 'comprar-seguro', label: 'Comprar seguro' },
  { id: 'vender-mejor', label: 'Vender mejor' },
  { id: 'evitar-fraudes', label: 'Evitar fraudes' },
  { id: 'como-funciona', label: 'Cómo funciona' },
  { id: 'reportes', label: 'Reportes y moderación' },
];

const FAQS = [
  { q: '¿Cómo publico un anuncio?', a: 'Regístrate, entra a "Publicar" y completa los datos. Nuestro equipo revisa el anuncio antes de publicarlo.' },
  { q: '¿Cuánto cuesta publicar?', a: 'Publicar es gratis durante la beta.' },
  { q: '¿Cómo contacto a un vendedor?', a: 'Desde la ficha del producto, usa el botón "Contactar vendedor".' },
  { q: '¿Cómo reporto un anuncio sospechoso?', a: 'Cada ficha tiene un botón "Reportar anuncio". Revisamos todos los reportes.' },
  { q: '¿Qué hago si me estafan?', a: 'Repórtalo desde el anuncio y contáctanos por el formulario de contacto.' },
];

const Tip = ({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl border bg-card">
    <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{text}</p>
    </div>
  </div>
);

const Section = ({ id, title, subtitle, children }: { id: string; title: string; subtitle: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24 not-prose mb-10">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">{title}</h2>
    <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
    <div className="grid gap-3 md:grid-cols-2">{children}</div>
  </section>
);

const Help = () => (
  <StaticPage
    title="Centro de ayuda y buenas prácticas"
    description="Guía para comprar y vender con confianza en Chuquiago Market, el marketplace local de La Paz."
  >
    <div className="not-prose mb-10 p-4 rounded-xl border bg-secondary/40">
      <p className="text-sm font-semibold text-foreground mb-2">En esta guía</p>
      <ul className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="inline-block text-sm px-3 py-1 rounded-full bg-card border hover:bg-secondary transition-colors">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>

    <Section
      id="comprar-seguro"
      title="Comprar seguro"
      subtitle="Coordina encuentros en lugares públicos, transitados y conocidos por ambas partes."
    >
      <Tip
        icon={MapPin}
        title="Elige lugares públicos y transitados"
        text="Prefiere puntos concurridos y bien iluminados en La Paz (plazas, centros comerciales, cafés, estaciones). Son ejemplos de referencia, no lugares 'garantizados': la seguridad depende del contexto y la hora."
      />
      <Tip
        icon={Eye}
        title="Revisa el producto antes de pagar"
        text="Prueba el producto, verifica accesorios, número de serie y estado real frente al anuncio. Si algo no coincide, no cierres la venta."
      />
      <Tip
        icon={Wallet}
        title="No adelantes dinero"
        text="Evita pagos, depósitos o QR antes de ver el producto en persona. Prefiere efectivo en el encuentro o pago verificado en el momento."
      />
      <Tip
        icon={BadgeCheck}
        title="Fíjate en el badge de verificación"
        text="El distintivo indica vendedores que completaron nuestro proceso de verificación. No sustituye tu propio criterio, pero es una señal útil."
      />
    </Section>

    <Section
      id="vender-mejor"
      title="Vender mejor"
      subtitle="Un anuncio claro y honesto vende más rápido y genera confianza."
    >
      <Tip icon={Camera} title="Fotos reales y bien iluminadas" text="Usa luz natural, muestra el producto desde varios ángulos e incluye defectos si los hay. Evita fotos de internet." />
      <Tip icon={ShieldCheck} title="Descripción honesta" text="Indica estado, antigüedad, motivo de venta y qué incluye. La transparencia reduce devoluciones y desconfianza." />
      <Tip icon={Wallet} title="Precio en bolivianos" text="Publica el precio en Bs. y sé claro con si es negociable. Compara con anuncios similares para ajustar." />
      <Tip icon={MessageCircle} title="Responde rápido y con respeto" text="Responder pronto por WhatsApp y coordinar puntos y horarios claros mejora tu reputación como vendedor." />
    </Section>

    <Section
      id="evitar-fraudes"
      title="Evitar fraudes"
      subtitle="Señales de alerta habituales. Ante la duda, corta el contacto y reporta."
    >
      <Tip icon={AlertTriangle} title="Precios demasiado bajos" text="Si un producto parece 'ganga imposible', probablemente lo sea. Compara con el precio de mercado antes de escribir." />
      <Tip icon={PhoneOff} title="Nunca compartas códigos SMS ni QR" text="Ningún vendedor o comprador legítimo necesita códigos de verificación de tu WhatsApp, banco o billetera." />
      <Tip icon={LinkIcon} title="Desconfía de enlaces externos" text="Evita links de 'pasarelas' o 'envíos' fuera de conversaciones directas. Verifica el dominio y no ingreses tus datos bancarios." />
      <Tip icon={Wallet} title="Sin pagos por adelantado ni 'envíos garantizados'" text="Los 'envíos con seguro' que exigen pagar antes de ver el producto son un patrón clásico de fraude." />
    </Section>

    <Section
      id="como-funciona"
      title="Cómo funciona Chuquiago Market"
      subtitle="Somos una plataforma local que conecta y modera. El trato final ocurre entre las personas."
    >
      <Tip icon={ShieldCheck} title="Conectamos y moderamos" text="Revisamos los anuncios antes de publicarlos según nuestras reglas. Nuestro rol es facilitar el contacto y mantener la comunidad sana." />
      <Tip icon={Handshake} title="El pago y la entrega los coordinan ustedes" text="No procesamos pagos ni gestionamos envíos: comprador y vendedor acuerdan cómo, cuándo y dónde se realiza la transacción." />
      <Tip icon={MessageCircle} title="Contacto directo por WhatsApp" text="Desde cada ficha puedes escribir al vendedor por WhatsApp para preguntar, coordinar y cerrar la venta." />
      <Tip icon={BadgeCheck} title="Publicar es gratis" text="Durante la beta puedes publicar sin costo. Ayúdanos reportando anuncios que no cumplan las reglas." />
    </Section>

    <Section
      id="reportes"
      title="Reportes y moderación"
      subtitle="La comunidad nos ayuda a mantener la plataforma segura."
    >
      <Tip icon={Flag} title="Reporta desde la ficha del anuncio" text="Usa el botón 'Reportar anuncio' cuando veas contenido falso, prohibido, engañoso o sospechoso." />
      <Tip icon={ShieldCheck} title="Qué revisamos" text="Fotos que no coinciden, categorías prohibidas, precios engañosos, duplicados y patrones de fraude reportados por la comunidad." />
      <Tip icon={AlertTriangle} title="Si crees que te estafaron" text="Reporta el anuncio, guarda capturas de la conversación y escríbenos desde contacto. También puedes acudir a las autoridades locales." />
      <Tip icon={MessageCircle} title="¿No encuentras respuesta?" text="Escríbenos desde el formulario de contacto y te responderemos por correo." />
    </Section>

    <div className="not-prose mb-10 p-4 rounded-xl border bg-secondary/40 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-foreground">¿Tu caso no está aquí?</p>
      <Link to="/contacto" className="text-sm font-semibold text-primary hover:underline">Contáctanos →</Link>
    </div>

    <h2 id="faqs" className="scroll-mt-24 text-xl md:text-2xl font-bold text-foreground mb-2">Preguntas frecuentes</h2>
    <Accordion type="single" collapsible className="w-full not-prose">
      {FAQS.map((f, i) => (
        <AccordionItem key={i} value={`f-${i}`}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </StaticPage>
);

export default Help;
