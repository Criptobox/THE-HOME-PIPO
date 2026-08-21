import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Phone, RefreshCw, X, AlertCircle } from 'lucide-react';

export const OfflineStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  const [showReconnectedToast, setShowReconnectedToast] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsDismissed(false);
      setShowReconnectedToast(true);
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false);
      setShowReconnectedToast(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        setIsOnline(true);
        setShowReconnectedToast(true);
        setTimeout(() => setShowReconnectedToast(false), 3500);
      } else {
        setIsOnline(false);
      }
      setIsChecking(false);
    }, 600);
  };

  // 1. Toast when connection is restored
  if (showReconnectedToast) {
    return (
      <aside aria-label="Notificación de conexión" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-emerald-400/40 text-xs sm:text-sm font-bold">
          <Wifi className="w-4 h-4 text-emerald-100 animate-pulse" />
          <span>¡Conexión a internet restablecida!</span>
        </div>
      </aside>
    );
  }

  // 2. Banner when offline (if not dismissed)
  if (!isOnline && !isDismissed) {
    return (
      <aside aria-label="Aviso de modo sin conexión" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up">
        <div className="bg-stone-900/95 backdrop-blur-md text-stone-100 p-4 rounded-2xl border border-amber-500/40 shadow-2xl ring-1 ring-amber-500/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 flex-shrink-0">
                <WifiOff className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>Modo Sin Conexión</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    Caché Activo
                  </span>
                </h4>
                <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                  Estás navegando con el menú guardado. Para pedir al instante mientras vuelve tu señal, puedes llamarnos directamente.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-lg hover:bg-stone-800 transition-colors"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3.5 pt-3 border-t border-stone-800 flex items-center gap-2">
            <button
              onClick={handleManualCheck}
              disabled={isChecking}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 rounded-xl text-xs font-bold transition-all border border-stone-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Comprobando...' : 'Reintentar'}</span>
            </button>

            <a
              href="tel:5512345678"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-950/40"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Llamar al Horno</span>
            </a>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
