import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CATEGORIES, Category, Condition, DeliveryMethod } from '@/types/marketplace';
import { LA_PAZ_ZONES, CONDITION_LABEL, DELIVERY_LABEL } from '@/lib/format';
import { Camera, Upload, Check, Info, Save } from 'lucide-react';
import { toast } from 'sonner';

const CONDITIONS: Condition[] = ['new', 'like_new', 'good', 'fair'];
const DELIVERIES: DeliveryMethod[] = ['pickup', 'delivery_lapaz', 'shipping_bo'];

const Publish = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '' as Category | '',
    zone: '' as string,
    condition: '' as Condition | '',
    delivery: [] as DeliveryMethod[],
    description: '',
    image: null as File | null,
  });

  const toggleDelivery = (m: DeliveryMethod) => {
    setFormData((f) => ({
      ...f,
      delivery: f.delivery.includes(m) ? f.delivery.filter((x) => x !== m) : [...f.delivery, m],
    }));
  };

  const validate = () => {
    if (!formData.title || !formData.price || !formData.category ||
        !formData.zone || !formData.condition || formData.delivery.length === 0 ||
        !formData.description) {
      toast.error('Por favor completa todos los campos');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    // Mock: crearíamos un listing con status='pending_review'
    toast.success('Tu anuncio está en revisión. Te avisaremos cuando esté publicado.');
    navigate('/perfil');
  };

  const handleDraft = async () => {
    if (!formData.title) {
      toast.error('Ponle al menos un título para guardar el borrador');
      return;
    }
    toast.success('Borrador guardado');
    navigate('/perfil');
  };

  return (
    <Layout>
      <div className="container-market py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Publicar anuncio
          </h1>
          <p className="text-muted-foreground mb-6">
            Completa el formulario. Revisaremos tu anuncio antes de publicarlo.
          </p>

          {/* Reglas */}
          <div className="mb-8 p-4 rounded-xl border bg-secondary/40">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Reglas de publicación</p>
                <ul className="list-disc ml-4 space-y-0.5 text-muted-foreground">
                  <li>Publica fotos reales del producto, no de internet.</li>
                  <li>Prohibido armas, drogas, animales y productos falsificados.</li>
                  <li>El precio debe estar en bolivianos (Bs).</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto */}
            <div>
              <Label className="text-base">Foto del producto</Label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-input rounded-xl cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                  {formData.image ? (
                    <div className="flex items-center gap-2 text-primary">
                      <Check className="h-6 w-6" />
                      <span className="font-medium">{formData.image.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Camera className="h-12 w-12 mb-2" />
                      <span className="font-medium">Haz clic para subir una foto</span>
                      <span className="text-sm">PNG, JPG hasta 10MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  />
                </label>
              </div>
            </div>

            {/* Título */}
            <div>
              <Label htmlFor="title" className="text-base">Título del anuncio</Label>
              <Input
                id="title"
                placeholder="Ej: iPhone 14 Pro Max 256GB"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2 h-12"
                maxLength={100}
              />
            </div>

            {/* Precio */}
            <div>
              <Label htmlFor="price" className="text-base">Precio (Bs)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-2 h-12"
                min="0"
              />
            </div>

            {/* Categoría */}
            <div>
              <Label className="text-base">Categoría</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.id })}
                    className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      formData.category === category.id
                        ? 'border-primary bg-primary/5'
                        : 'border-input hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Zona */}
            <div>
              <Label htmlFor="zone" className="text-base">Zona en La Paz</Label>
              <select
                id="zone"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="mt-2 h-12 w-full border border-input rounded-md px-3 bg-background"
              >
                <option value="">Selecciona una zona</option>
                {LA_PAZ_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            {/* Estado */}
            <div>
              <Label className="text-base">Estado del producto</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: c })}
                    className={`p-3 rounded-xl border-2 text-sm font-medium ${
                      formData.condition === c
                        ? 'border-primary bg-primary/5'
                        : 'border-input hover:border-primary/50'
                    }`}
                  >
                    {CONDITION_LABEL[c]}
                  </button>
                ))}
              </div>
            </div>

            {/* Entrega */}
            <div>
              <Label className="text-base">Método de entrega</Label>
              <div className="mt-2 space-y-2">
                {DELIVERIES.map((m) => (
                  <label key={m} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-secondary/40">
                    <input
                      type="checkbox"
                      checked={formData.delivery.includes(m)}
                      onChange={() => toggleDelivery(m)}
                    />
                    <span className="text-sm">{DELIVERY_LABEL[m]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="description" className="text-base">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe tu producto: estado, características, qué incluye…"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 min-h-[120px]"
                maxLength={1000}
              />
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={handleDraft}>
                <Save className="h-5 w-5" /> Guardar borrador
              </Button>
              <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Enviando…
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" /> Enviar a revisión
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Publish;
