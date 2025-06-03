import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AIPersonV2 from "./pages/AIPersonV2";
import ModernIndex from "./pages/ModernIndex";
import VenderComoGenteGrande from "./pages/VenderComoGenteGrande";
import { useTracking } from "@/hooks/useTracking";
import { GTMEvents } from '@/lib/gtm';

const queryClient = new QueryClient();

// Componente para rastrear mudanças de rota
const RouteTracker = () => {
  const location = useLocation();
  const { trackEvent } = useTracking();

  useEffect(() => {
    // Rastreia visualização de página no GTM usando eventos centralizados
    GTMEvents.pageView({
      page_path: location.pathname + location.search,
      route_change: true
    });

    // Rastreia mudança de rota no sistema personalizado
    trackEvent('route_change', {
      path: location.pathname,
      search: location.search,
      hash: location.hash
    });
  }, [location, trackEvent]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RouteTracker />
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/modern" element={<ModernIndex />} />
        <Route path="/aipersonv2" element={<AIPersonV2 />} />
        <Route path="/vender-como-gente-grande" element={<VenderComoGenteGrande />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
