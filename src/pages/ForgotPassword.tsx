import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Ingresa tu correo');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/restablecer`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo enviar el correo';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-market py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Recuperar contraseña</h1>
            <p className="text-muted-foreground mt-2">
              Te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          <div className="bg-card rounded-2xl border p-6 md:p-8">
            {sent ? (
              <div className="text-center space-y-4">
                <p className="text-foreground">
                  Si <strong>{email}</strong> tiene una cuenta, te enviamos un enlace para restablecer la contraseña.
                </p>
                <p className="text-sm text-muted-foreground">Revisa también tu carpeta de spam.</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth"><ArrowLeft className="h-4 w-4" /> Volver al inicio de sesión</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                <Button type="submit" size="xl" className="w-full" disabled={loading}>
                  {loading ? 'Enviando…' : 'Enviar enlace'}
                </Button>
                <div className="text-center">
                  <Link to="/auth" className="text-sm text-primary hover:underline">
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
