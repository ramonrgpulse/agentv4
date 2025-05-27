
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import { fontVariables } from '@/lib/fonts';
import './styles/tailwind.css';

import { initializeGTM, trackUTMParameters } from '@/lib/gtm';

// Initialize GTM
if (typeof window !== "undefined") {
  initializeGTM();
  trackUTMParameters();
}

// Adiciona classes iniciais ao body
document.body.classList.add(
  'min-h-screen',
  'antialiased',
  'bg-brutal-oldpaper',
  'text-brutal-dark',
  'transition-colors',
  'duration-200'
);

// Aplica as variáveis de fonte ao documento
Object.entries(fontVariables).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});

// Força o modo claro para consistência visual
if (typeof window !== 'undefined') {
  document.documentElement.classList.add('light');
  document.documentElement.classList.remove('dark');
}

// Cria uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Renderiza a aplicação
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col bg-brutal-oldpaper">
              <App />
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
