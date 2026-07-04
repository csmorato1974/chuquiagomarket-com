import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const next = (location.state as { from?: string } | null)?.from || '/perfil';
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error('Completa todos los campos');
    if (!isLogin && !formData.name) return toast.error('Ingresa tu nombre');
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email, password: formData.password,
        });
        if (error) throw error;
        toast.success('¡Bienvenido!');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: formData.name },
          },
        });
        if (error) throw error;
        toast.success('¡Cuenta creada!');
      }
      navigate(next, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error de autenticación';
      toast.error(msg);
    } finally { setIsLoading(false); }
  };

  return (
    <Layout>
      <div className="container-market py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">C</span>
              </div>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? 'Accede para vender y comprar' : 'Únete a Chuquiago Market'}
            </p>
          </div>

          <div className="bg-card rounded-2xl border p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="name" type="text" placeholder="Tu nombre" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-10 h-12" />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="tu@email.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10 h-12" />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-10 pr-11 h-12" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {isLogin && (
                  <div className="mt-2 text-right">
                    <Link to="/recuperar" className="text-sm text-primary hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                )}
              </div>
              <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
                {isLoading ? (isLogin ? 'Entrando…' : 'Creando…') : (<>{isLogin ? 'Entrar' : 'Crear cuenta'}<ArrowRight className="h-5 w-5" /></>)}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium ml-1 hover:underline">
                  {isLogin ? 'Regístrate' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
