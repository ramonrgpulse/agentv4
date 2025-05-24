
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

// Add Google Tag Manager
const addGoogleTagManager = () => {
  // Add GTM script
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-PWR9KZC');
  `;
  document.head.appendChild(script);

  // Add GTM noscript
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-PWR9KZC";
  iframe.height = "0";
  iframe.width = "0";
  iframe.style.display = "none";
  iframe.style.visibility = "hidden";
  noscript.appendChild(iframe);
  document.body.prepend(noscript);
};

// Initialize GTM
if (typeof window !== "undefined") {
  addGoogleTagManager();
  
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_title: document.title,
    page_location: window.location.href
  });
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
