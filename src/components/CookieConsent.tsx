import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type ConsentType = 'essential' | 'analytics' | 'marketing';

interface CookieConsentProps {
  onConsent?: (consent: Record<ConsentType, boolean>) => void;
}

export function CookieConsent({ onConsent }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<Record<ConsentType, boolean>>({
    essential: true,  // Sempre necessário
    analytics: false,
    marketing: false,
  });

  // Verifica se já existe um consentimento salvo
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedConsent = localStorage.getItem('cookie_consent');
    
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
        
        // Se já tiver consentimento, não mostra o banner
        if (parsedConsent.essential) {
          setShowBanner(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
      }
    }
    
    // Mostra o banner se não tiver consentimento
    setShowBanner(true);
  }, []);

  // Atualiza o consentimento e salva no localStorage
  const updateConsent = (newConsent: Partial<Record<ConsentType, boolean>>) => {
    const updatedConsent = { ...consent, ...newConsent };
    setConsent(updatedConsent);
    
    // Salva no localStorage
    localStorage.setItem('cookie_consent', JSON.stringify(updatedConsent));
    
    // Dispara evento personalizado
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: updatedConsent 
    }));
    
    // Chama callback se fornecido
    if (onConsent) {
      onConsent(updatedConsent);
    }
    
    // Rastreia a aceitação
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'cookie_consent_updated',
        ...updatedConsent,
      });
    }
    
    return updatedConsent;
  };

  // Aceita todos os cookies
  const acceptAll = () => {
    const newConsent = updateConsent({
      essential: true,
      analytics: true,
      marketing: true,
    });
    
    // Rastreia a aceitação
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'cookie_consent_accepted',
        ...newConsent,
      });
    }
    
    setShowBanner(false);
  };

  // Aceita configurações personalizadas
  const saveSettings = () => {
    updateConsent({});
    setShowBanner(false);
  };

  // Rejeita todos os cookies não essenciais
  const rejectNonEssential = () => {
    updateConsent({
      analytics: false,
      marketing: false,
    });
    setShowBanner(false);
  };

  // Se não estiver no navegador ou o banner não deve ser mostrado, retorna null
  if (typeof window === 'undefined' || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Nós usamos cookies
            </h3>
            <p className="text-sm text-gray-600">
              Nós e nossos parceiros usamos cookies para melhorar sua experiência, 
              analisar tráfego e personalizar anúncios. Escolha abaixo os tipos de 
              cookies que você aceita. Saiba mais em nossa{' '}
              <a 
                href="/politica-de-privacidade" 
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidade
              </a>.
            </p>
            
            {showSettings && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="analytics-cookies"
                    checked={consent.analytics}
                    onChange={(e) => updateConsent({ analytics: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="analytics-cookies" className="ml-2 text-sm text-gray-700">
                    Cookies de Análise
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketing-cookies"
                    checked={consent.marketing}
                    onChange={(e) => updateConsent({ marketing: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="marketing-cookies" className="ml-2 text-sm text-gray-700">
                    Cookies de Marketing
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="essential-cookies"
                    checked={consent.essential}
                    disabled
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-100"
                  />
                  <label htmlFor="essential-cookies" className="ml-2 text-sm text-gray-500">
                    Cookies Essenciais (obrigatório)
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-shrink-0 space-x-2">
            {!showSettings ? (
              <>
                <Button
                  onClick={rejectNonEssential}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  Recusar
                </Button>
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  Personalizar
                </Button>
                <Button
                  onClick={acceptAll}
                  size="sm"
                  className="text-sm bg-blue-600 hover:bg-blue-700"
                >
                  Aceitar todos
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={saveSettings}
                  size="sm"
                  className="text-sm bg-blue-600 hover:bg-blue-700"
                >
                  Salvar preferências
                </Button>
              </>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
