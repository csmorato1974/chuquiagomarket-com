import StaticPage from '@/components/layout/StaticPage';

const Policies = () => (
  <StaticPage
    title="Políticas de publicación"
    description="Qué puedes y qué no puedes publicar en Chuquiago Market."
  >
    <h2>Permitido</h2>
    <ul>
      <li>Productos usados o nuevos, legales, en buen estado.</li>
      <li>Servicios ofrecidos por vendedores locales, cumpliendo la ley.</li>
      <li>Vehículos con papeles al día.</li>
    </ul>
    <h2>Prohibido</h2>
    <ul>
      <li>Armas, munición y explosivos.</li>
      <li>Drogas, medicamentos con receta y sustancias controladas.</li>
      <li>Animales vivos.</li>
      <li>Productos falsificados o robados.</li>
      <li>Contenido sexual explícito.</li>
    </ul>
    <h2>Buenas prácticas</h2>
    <ul>
      <li>Sube fotos reales del producto.</li>
      <li>Describe el estado con honestidad.</li>
      <li>Responde con rapidez a los compradores.</li>
    </ul>
    <p>El incumplimiento puede llevar al rechazo del anuncio o al cierre de la cuenta.</p>
  </StaticPage>
);

export default Policies;
