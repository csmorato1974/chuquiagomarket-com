import StaticPage from '@/components/layout/StaticPage';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  { q: '¿Cómo publico un anuncio?', a: 'Regístrate, entra a "Publicar" y completa los datos. Nuestro equipo revisa el anuncio antes de publicarlo.' },
  { q: '¿Cuánto cuesta publicar?', a: 'Publicar es gratis durante la beta.' },
  { q: '¿Cómo contacto a un vendedor?', a: 'Desde la ficha del producto, usa el botón "Contactar vendedor".' },
  { q: '¿Cómo reporto un anuncio sospechoso?', a: 'Cada ficha tiene un botón "Reportar anuncio". Revisamos todos los reportes.' },
  { q: '¿Qué hago si me estafan?', a: 'Repórtalo desde el anuncio y contáctanos por el formulario de contacto.' },
];

const Help = () => (
  <StaticPage title="Ayuda" description="Encuentra respuestas a las preguntas más comunes sobre Chuquiago Market.">
    <Accordion type="single" collapsible className="w-full">
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
