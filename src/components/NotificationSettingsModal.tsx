import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bell,
  BellRing,
  BellOff,
  Flame,
  UtensilsCrossed,
  Gift,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Sparkles,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  unsubscribeNotifications,
  getNotificationPreferences,
  saveNotificationPreferences,
  NotificationPreferences,
  NotificationPermissionState,
  sendNotificationViaServiceWorker,
  BRAND_NOTIFICATION_ICON,
  BRAND_NOTIFICATION_BADGE,
} from '../utils/notifications';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [permission, setPermission] = useState<NotificationPermissionState>(() =>
    getNotificationPermission()
  );
  const [preferences, setPreferences] = useState<NotificationPreferences>(() =>
    getNotificationPreferences()
  );
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPermission(getNotificationPermission());
      setPreferences(getNotificationPreferences());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleGlobalSubscription = async () => {
    if (preferences.enabled && permission === 'granted') {
      // Unsubscribe
      setIsSubscribing(true);
      try {
        await unsubscribeNotifications();
        const updated = saveNotificationPreferences({ enabled: false });
        setPreferences(updated);
        showToast('🔕 Notificaciones desactivadas con éxito.');
      } finally {
        setIsSubscribing(false);
      }
    } else {
      // Subscribe / Enable
      setIsSubscribing(true);
      try {
        const perm = await requestNotificationPermission();
        setPermission(perm);
        if (perm === 'granted') {
          const updated = saveNotificationPreferences({ enabled: true });
          setPreferences(updated);
          showToast('🔔 ¡Suscripción activada! Recibirás avisos en tiempo real.');
        } else if (perm === 'denied') {
          showToast('⚠️ Permiso bloqueado en el navegador. Por favor habilítalo en los ajustes del sitio.');
        }
      } finally {
        setIsSubscribing(false);
      }
    }
  };

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    const updated = saveNotificationPreferences({ [key]: !preferences[key] });
    setPreferences(updated);
  };

  const handleSendTestNotification = async () => {
    if (permission !== 'granted') {
      const perm = await requestNotificationPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        showToast('⚠️ Se requieren permisos para enviar la prueba.');
        return;
      }
    }

    const sent = await sendNotificationViaServiceWorker('🍕 THE HOME PIPO - Prueba de Alerta', {
      body: '¡Todo perfecto! Las notificaciones con el icono oficial de la pizzería están funcionando.',
      tag: 'pipo-test-alert',
      url: '/#menu',
      icon: BRAND_NOTIFICATION_ICON,
      badge: BRAND_NOTIFICATION_BADGE,
    });

    if (sent) {
      showToast('✅ Alerta de prueba enviada a tu dispositivo.');
    } else {
      showToast('ℹ️ Revisa si tienes notificaciones activadas en el sistema.');
    }
  };

  const isGranted = permission === 'granted';
  const isGlobalActive = isGranted && preferences.enabled;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with Brand Icon */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-orange-950 via-stone-900 to-amber-950 border-b border-orange-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl bg-orange-600/30 border border-orange-500/40 p-2 flex items-center justify-center shadow-inner flex-shrink-0">
              <img
                src={BRAND_NOTIFICATION_ICON}
                alt="THE HOME PIPO"
                className="w-full h-full object-contain filter drop-shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-stone-900 ring-1 ring-emerald-400"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>Ajustes de Notificaciones</span>
                </h3>
              </div>
              <p className="text-xs text-stone-300">
                Personaliza y gestiona las alertas de tus pedidos y promociones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800/80 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Main Subscription Switch Card */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isGlobalActive
                ? 'bg-gradient-to-br from-emerald-950/40 to-stone-900 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                : 'bg-stone-950/70 border-stone-800'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`p-3 rounded-2xl border ${
                    isGlobalActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                >
                  {isGlobalActive ? (
                    <BellRing className="w-5 h-5 animate-pulse" />
                  ) : (
                    <BellOff className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      {isGlobalActive ? 'Suscripción Activa' : 'Notificaciones Desactivadas'}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        isGlobalActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}
                    >
                      {isGlobalActive ? 'RECIBIENDO' : 'PAUSADO'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {isGlobalActive
                      ? 'Recibirás avisos en tu pantalla de inicio y navegador.'
                      : 'Activa para enterarte del estado de tu pizza y descuentos.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleGlobalSubscription}
                disabled={isSubscribing}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isGlobalActive
                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border border-orange-400/40'
                }`}
              >
                {isSubscribing ? (
                  <span>Procesando...</span>
                ) : isGlobalActive ? (
                  <>
                    <BellOff className="w-3.5 h-3.5 text-stone-400" />
                    <span>Desactivar</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-3.5 h-3.5 text-amber-200" />
                    <span>Suscribirse</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Granular Preference Channels */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 px-1">
              Canales y Tipos de Alerta
            </h4>

            {/* Order Updates */}
            <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Estado del Pedido en Cocina</div>
                  <div className="text-[11px] text-stone-400">
                    Avisos de comanda recibida, amasado artesanal y entrega.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePref('orderUpdates')}
                disabled={!isGlobalActive}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  preferences.orderUpdates && isGlobalActive ? 'bg-orange-600' : 'bg-stone-800 opacity-60'
                }`}
                aria-label="Toggle Estado del Pedido"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences.orderUpdates && isGlobalActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Oven Ready Alerts */}
            <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Horno de Piedra a 450°C</div>
                  <div className="text-[11px] text-stone-400">
                    Alerta precisa cuando la masa entra sobre piedra volcánica.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePref('ovenAlerts')}
                disabled={!isGlobalActive}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  preferences.ovenAlerts && isGlobalActive ? 'bg-amber-600' : 'bg-stone-800 opacity-60'
                }`}
                aria-label="Toggle Horno de Piedra"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences.ovenAlerts && isGlobalActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Promotions & Coupons */}
            <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Cupones y Promociones Exclusivas</div>
                  <div className="text-[11px] text-stone-400">
                    Ofertas 2x1, códigos de descuento relámpago y regalos.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePref('specialPromos')}
                disabled={!isGlobalActive}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  preferences.specialPromos && isGlobalActive ? 'bg-red-600' : 'bg-stone-800 opacity-60'
                }`}
                aria-label="Toggle Cupones y Promociones"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences.specialPromos && isGlobalActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound & Haptics */}
            <div className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  {preferences.soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Vibración Háptica y Campanas</div>
                  <div className="text-[11px] text-stone-400">
                    Patrón de vibración y avisos acústicos de confirmación.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePref('soundAlerts')}
                disabled={!isGlobalActive}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  preferences.soundAlerts && isGlobalActive ? 'bg-emerald-600' : 'bg-stone-800 opacity-60'
                }`}
                aria-label="Toggle Sonido y Vibración"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences.soundAlerts && isGlobalActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Test & Brand Icon Preview Banner */}
          <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 p-1.5 flex items-center justify-center flex-shrink-0">
                <img
                  src={BRAND_NOTIFICATION_ICON}
                  alt="Icono de Marca"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white">Identidad de Marca PIPO</div>
                <div className="text-[11px] text-stone-400">
                  Las alertas se emiten con el icono y distintivo oficial de la pizzería.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendTestNotification}
              className="w-full sm:w-auto px-3.5 py-2 bg-stone-800 hover:bg-stone-700 active:scale-95 text-amber-300 font-bold text-xs rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Probar Alerta</span>
            </button>
          </div>

          {/* Status info bar */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 pt-1 border-t border-stone-800/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Permisos del Navegador: <strong className="text-stone-200 uppercase">{permission}</strong></span>
            </span>
            <span>Service Worker Activo</span>
          </div>
        </div>

        {/* Toast Notification Message */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 bg-stone-800 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-stone-700 text-xs font-bold flex items-center gap-2 z-50 justify-center"
            >
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
