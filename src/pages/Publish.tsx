import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CATEGORIES, Category } from '@/types/marketplace';
import { Camera, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

const Publish = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '' as Category | '',
    description: '',
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category || !formData.description) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('¡Producto publicado con éxito!');
    navigate('/productos');
  };

  return (
    <Layout>
      <div className="container-market py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Publicar producto
          </h1>
          <p className="text-muted-foreground mb-8">
            Completa el formulario para publicar tu producto
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image upload */}
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

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-base">Título del producto</Label>
              <Input
                id="title"
                placeholder="Ej: iPhone 14 Pro Max 256GB"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2 h-12"
                maxLength={100}
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price" className="text-base">Precio (€)</Label>
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

            {/* Category */}
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

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-base">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe tu producto: estado, características, incluye..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 min-h-[120px]"
                maxLength={1000}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Publicar producto
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Publish;
