import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Publish from "./pages/Publish";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EditListing from "./pages/EditListing";
import ListingStatusPage from "./pages/ListingStatus";
import Verification from "./pages/Verification";
import Moderation from "./pages/admin/Moderation";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Terms from "./pages/Terms";
import Policies from "./pages/Policies";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/publicar" element={<Protected><Publish /></Protected>} />
          <Route path="/perfil" element={<Protected><Profile /></Protected>} />
          <Route path="/perfil/verificacion" element={<Protected><Verification /></Protected>} />
          <Route path="/anuncio/:id/editar" element={<Protected><EditListing /></Protected>} />
          <Route path="/anuncio/:id/estado" element={<Protected><ListingStatusPage /></Protected>} />
          <Route path="/admin/moderacion" element={<Protected><Moderation /></Protected>} />
          <Route path="/ayuda" element={<Help />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/acuerdo" element={<Terms />} />
          <Route path="/politicas" element={<Policies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
