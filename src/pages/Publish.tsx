import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CATEGORIES, Condition, DeliveryMethod, ListingStatus } from '@/types/marketplace';
import { LA_PAZ_ZONES, CONDITION_LABEL, DELIVERY_LABEL } from '@/lib/format';
import { Upload, Info, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ImagePicker from '@/components/publish/ImagePicker';

const CONDITIONS: Condition[] = ['new', 'like_new', 'good', 'fair'];
const DELIVERIES: DeliveryMethod[] = ['pickup', 'delivery_lapaz', 'shipping_bo'];

interface FormState {
  title: string; price: string; categorySlug: string; zone: string;
  condition: Condition | ''; delivery: DeliveryMethod[]; description: string;
  image: File | null;
}

const empty: FormState = {
  title: '', price: '', categorySlug: '', zone: '', condition: '',
  delivery: [], description: '', image: null,
};

interface Props { editingId?: string }

const Publish = ({ editingId }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [existingCover, setExistingCover] = useState<string | null>(null);

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      const { data } = await supabase.from('listings').select('*, categories:category_id(slug)').eq('id', editingId).maybeSingle();
      if (!data) return;
      setForm({
        title: data.title,
        price: String(data.price_bs),
        categorySlug: (data as any).categories?.slug ?? '',
        zone: data.zone ?? '',
        condition: data.condition as Condition,
        delivery: (data.delivery_methods ?? []) as DeliveryMethod[],
        description: data.description ?? '',
        image: null,
      });
      setExistingCover(data.cover_image_url);
    })();
  }, [editingId]);

  const toggleDelivery = (m: DeliveryMethod) =>
    setForm((f) => ({ ...f, delivery: f.delivery.includes(m) ? f.delivery.filter((x) => x !== m) : [...f.delivery, m] }));

  const validate = () => {
    if (!form.title || !form.price || !form.categorySlug || !form.zone ||
        !form.condition || form.delivery.length === 0 || !form.description) {
      toast.error('Completa todos los campos'); return false;
    }
    return true;
  };

  const uploadImage = async (listingId: string): Promise<string | null> => {
    if (!form.image) return null;
    const ext = form.image.name.split('.').pop();
    const path = `${listingId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('listing-images').upload(path, form.image);
    if (error) throw error;
    await supabase.from('listing_images').insert({ listing_id: listingId, path, sort_order: 0 });
    return supabase.storage.from('listing-images').getPublicUrl(path).data.publicUrl;
  };

  const persist = async (status: 'draft' | 'pending_review') => {
    if (!user) return;
    if (status === 'pending_review' && !validate()) return;
    if (status === 'draft' && !form.title) { toast.error('Ponle un título al borrador'); return; }
    setIsSubmitting(true);
    try {
      const category = CATEGORIES.find((c) => c.slug === form.categorySlug);
      let categoryId: string | null = null;
      if (category) {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', category.slug).maybeSingle();
        categoryId = cat?.id ?? null;
      }
      const payload = {
        seller_id: user.id,
        title: form.title,
        description: form.description,
        price_bs: Number(form.price) || 0,
        zone: form.zone || null,
        condition: (form.condition || 'good') as Condition,
        delivery_methods: form.delivery,
        category_id: categoryId,
        status,
      };
      let id = editingId;
      if (editingId) {
        // Editing a published listing sends it back to review.
        const { data: existing } = await supabase.from('listings').select('status').eq('id', editingId).maybeSingle();
        const nextStatus = existing?.status === 'published' ? 'pending_review' : status;
        const { error } = await supabase.from('listings').update({ ...payload, status: nextStatus }).eq('id', editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('listings').insert(payload).select('id').single();
        if (error) throw error;
        id = data.id;
      }
      if (id && form.image) {
        const url = await uploadImage(id);
        if (url) await supabase.from('listings').update({ cover_image_url: url }).eq('id', id);
      }
      toast.success(status === 'draft' ? 'Borrador guardado' : 'Anuncio enviado a revisión');
      navigate('/perfil');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally { setIsSubmitting(false); }
  };

  return (
    <Layout>
      <div className="container-market py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {editingId ? 'Editar anuncio' : 'Publicar anuncio'}
          </h1>
          <p className="text-muted-foreground mb-6">
            Completa el formulario. Revisaremos tu anuncio antes de publicarlo.
          </p>

          <div className="mb-8 p-4 rounded-xl border bg-secondary/40">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Reglas de publicación</p>
                <ul className="list-disc ml-4 space-y-0.5 text-muted-foreground">
                  <li>Publica fotos reales del producto.</li>
                  <li>Prohibido armas, drogas, animales y falsificaciones.</li>
                  <li>El precio debe estar en bolivianos (Bs).</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); persist('pending_review'); }} className="space-y-6">
            <div>
              <Label className="text-base">Foto del producto</Label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-input rounded-xl cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors overflow-hidden">
                  {form.image ? (
                    <div className="flex items-center gap-2 text-primary"><Check className="h-6 w-6" /><span className="font-medium">{form.image.name}</span></div>
                  ) : existingCover ? (
                    <img src={existingCover} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Camera className="h-12 w-12 mb-2" />
                      <span className="font-medium">Haz clic para subir una foto</span>
                      <span className="text-sm">PNG, JPG hasta 10MB</span>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-base">Título</Label>
              <Input id="title" placeholder="Ej: iPhone 14 Pro 256GB" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 h-12" maxLength={100} />
            </div>

            <div>
              <Label htmlFor="price" className="text-base">Precio (Bs)</Label>
              <Input id="price" type="number" placeholder="0" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-2 h-12" min="0" />
            </div>

            <div>
              <Label className="text-base">Categoría</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {CATEGORIES.map((c) => (
                  <button key={c.slug} type="button" onClick={() => setForm({ ...form, categorySlug: c.slug })}
                    className={`p-4 rounded-xl border-2 text-sm font-medium ${form.categorySlug === c.slug ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="zone" className="text-base">Zona en La Paz</Label>
              <select id="zone" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="mt-2 h-12 w-full border border-input rounded-md px-3 bg-background">
                <option value="">Selecciona una zona</option>
                {LA_PAZ_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            <div>
              <Label className="text-base">Estado del producto</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {CONDITIONS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, condition: c })}
                    className={`p-3 rounded-xl border-2 text-sm font-medium ${form.condition === c ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'}`}>
                    {CONDITION_LABEL[c]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base">Método de entrega</Label>
              <div className="mt-2 space-y-2">
                {DELIVERIES.map((m) => (
                  <label key={m} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-secondary/40">
                    <input type="checkbox" checked={form.delivery.includes(m)} onChange={() => toggleDelivery(m)} />
                    <span className="text-sm">{DELIVERY_LABEL[m]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-base">Descripción</Label>
              <Textarea id="description" placeholder="Describe tu producto…" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 min-h-[120px]" maxLength={1000} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => persist('draft')} disabled={isSubmitting}>
                <Save className="h-5 w-5" /> Guardar borrador
              </Button>
              <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                <Upload className="h-5 w-5" /> {editingId ? 'Guardar cambios' : 'Enviar a revisión'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Publish;
