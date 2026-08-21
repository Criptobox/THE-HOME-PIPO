import React, { useEffect, useState } from 'react';
import { Download, Sparkles, X, Smartphone, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      setIsInstallable(false);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser from showing default mini-infobar
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferredPrompt) {
      return 'unavailable';
    }

    // Show native installation prompt dialog
    await deferredPrompt.prompt();

    // Wait for user choice
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
    return choiceResult.outcome;
  };

  return {
    isInstallable,
    isInstalled,
    triggerInstall,
  };
}

interface PwaInstallButtonProps {
  className?: string;
  variant?: 'header' | 'hero' | 'banner';
}

export const PwaInstallButton: React.FC<PwaInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, triggerInstall } = usePwaInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstalledToast, setShowInstalledToast] = useState(false);

  if (!isInstallable || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        setShowInstalledToast(true);
        setTimeout(() => setShowInstalledToast(false), 4000);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  if (variant === 'header') {
    return (
      <>
        <button
          id="pwa-header-install-btn"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`px-3 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl text-xs font-black shadow-md shadow-orange-950/30 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-orange-400/40 animate-pulse ${className}`}
          title="Instalar THE HOME PIPO en tu dispositivo"
          aria-label="Instalar Aplicación"
        >
          <Download className="w-3.5 h-3.5 text-amber-200" />
          <span className="hidden sm:inline">Instalar App</span>
          <span className="sm:hidden">Instalar</span>
        </button>

        {showInstalledToast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400 text-xs sm:text-sm font-black">
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>¡THE HOME PIPO instalado con éxito en tu pantalla de inicio!</span>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      disabled={isInstalling}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg border border-orange-400/30 transition-all cursor-pointer ${className}`}
    >
      <Download className="w-4 h-4 text-amber-200" />
      <span>{isInstalling ? 'Instalando...' : 'Instalar App en tu Celular'}</span>
    </button>
  );
};
