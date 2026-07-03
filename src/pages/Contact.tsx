import { useState } from 'react';
import StaticPage from '@/components/layout/StaticPage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Completa todos los campos');
      return;
    }
    toast.success('Mensaje enviado. Te responderemos por correo.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <StaticPage
      title="Contacto"
      description="¿Tienes dudas o necesitas ayuda? Escríbenos y te responderemos por correo."
    >
      <form onSubmit={submit} className="space-y-4 not-prose">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="email">Correo</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="message">Mensaje</Label>
          <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 min-h-[140px]" />
        </div>
        <Button type="submit">Enviar mensaje</Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6">
        También puedes escribirnos a <strong>hola@chuquiagomarket.com</strong>
      </p>
    </StaticPage>
  );
};

export default Contact;
