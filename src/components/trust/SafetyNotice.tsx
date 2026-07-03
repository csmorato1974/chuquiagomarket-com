import { ShieldAlert } from 'lucide-react';

const SafetyNotice = () => (
  <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/40">
    <ShieldAlert className="h-5 w-5 text-yellow-700 dark:text-yellow-300 shrink-0 mt-0.5" />
    <div className="text-sm text-yellow-900 dark:text-yellow-100">
      <p className="font-semibold mb-1">Compra con seguridad</p>
      <p>
        Nunca pagues por adelantado. Encuéntrate con el vendedor en un lugar público
        de La Paz y revisa el producto antes de pagar.
      </p>
    </div>
  </div>
);

export default SafetyNotice;
