import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canReset, setCanReset] = useState<boolean | null>(null);

  useEffect(() => {
    // Supabase JS parses the recovery hash automatically and emits PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setCanReset(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setCanReset((prev) => (prev === true ? true : !!data.session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error('La contraseña debe tener al menos 8 caracteres');
    if (password !== confirm) return toast.error('Las contraseñas no coinciden');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Contraseña actualizada. Inicia sesión con la nueva.');
      await supabase.auth.signOut();
      navigate('/auth', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo actualizar la contraseña';
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Nueva contraseña</h1>
            <p className="text-muted-foreground mt-2">Elige una contraseña segura para tu cuenta.</p>
          </div>

          <div className="bg-card rounded-2xl border p-6 md:p-8">
            {canReset === false ? (
              <div className="text-center space-y-4">
                <p className="text-foreground">El enlace de recuperación es inválido o ha expirado.</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/recuperar">Solicitar un nuevo enlace</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="pw">Nueva contraseña</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="pw"
                      type={show ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-11 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={show}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                    >
                      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="pw2">Confirmar contraseña</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="pw2"
                      type={show ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="pl-10 pr-11 h-12"
                    />
                  </div>
                </div>
                <Button type="submit" size="xl" className="w-full" disabled={loading}>
                  {loading ? 'Guardando…' : 'Guardar nueva contraseña'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
