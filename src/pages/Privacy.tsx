import StaticPage from '@/components/layout/StaticPage';

const Privacy = () => (
  <StaticPage
    title="Política de privacidad"
    description="Cómo tratamos tus datos personales en Chuquiago Market."
  >
    <p>En Chuquiago Market respetamos tu privacidad. Este documento resume qué información recogemos y cómo la usamos durante la beta.</p>
    <h2>Información que recogemos</h2>
    <ul>
      <li>Datos de cuenta: nombre, correo electrónico.</li>
      <li>Datos de anuncios: título, descripción, precio, fotos y zona.</li>
      <li>Datos de uso: páginas visitadas, dispositivo y navegador.</li>
    </ul>
    <h2>Uso de tus datos</h2>
    <p>Usamos tus datos para operar la plataforma, mostrar tus anuncios y comunicarnos contigo. No los vendemos a terceros.</p>
    <h2>Tus derechos</h2>
    <p>Puedes solicitar acceder, corregir o eliminar tus datos escribiendo a <strong>hola@chuquiagomarket.com</strong>.</p>
    <p className="text-sm text-muted-foreground">Este documento es una versión beta y puede actualizarse.</p>
  </StaticPage>
);

export default Privacy;
