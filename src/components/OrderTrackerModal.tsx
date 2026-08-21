import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, CheckCircle, Flame, Store, PackageCheck, Clock, Phone, Sparkles, UtensilsCrossed, Volume2, MessageCircle, Bell, BellRing, BellOff, Settings } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { soundService } from '../utils/audio';
import { buildWhatsAppOrderUrl, PIPO_FORMATTED_PHONE } from '../utils/whatsapp';
import {
  getNotificationPermission,
  requestNotificationPermission,
  notifyOrderStatus,
  NotificationPermissionState,
} from '../utils/notifications';
import { NotificationSettingsModal } from './NotificationSettingsModal';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onSimulateNextStatus: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onSimulateNextStatus,
}) => {
  if (!order) return null;

  const [minutesLeft, setMinutesLeft] = useState(order.estimatedMinutes || 15);
  const [notificationPerm, setNotificationPerm] = useState<NotificationPermissionState>(() => getNotificationPermission());
  const [isRequestingPerm, setIsRequestingPerm] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Fire confetti on creation
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E03812', '#F59E0B', '#22C55E', '#FFFFFF'],
    });

    const timer = setInterval(() => {
      setMinutesLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000);

    return () => clearInterval(timer);
  }, [order.id]);

  const handleEnableNotifications = async () => {
    setIsRequestingPerm(true);
    try {
      const perm = await requestNotificationPermission();
      setNotificationPerm(perm);
      if (perm === 'granted') {
        notifyOrderStatus(order.id, order.status, {
          orderType: order.orderType,
          tableNumber: order.tableNumber,
          total: order.total,
        });
      }
    } finally {
      setIsRequestingPerm(false);
    }
  };

  const isDineIn = order.orderType === 'dine_in';

  const stages: Array<{ id: OrderStatus; label: string; icon: any; desc: string }> = isDineIn ? [
    { id: 'recibido', label: 'Recibido', icon: PackageCheck, desc: 'Enviado a cocina y comanda abierta' },
    { id: 'preparando', label: 'Amasando', icon: Sparkles, desc: 'Estirado artesanal e ingredientes frescos' },
    { id: 'horneando', label: 'En Horno', icon: Flame, desc: 'Horno de gas a 450°C sobre piedra volcánica' },
    { id: 'listo', label: 'Sirviendo', icon: UtensilsCrossed, desc: `Llevando a tu mesa ${order.tableNumber ? `(#${order.tableNumber})` : ''}` },
    { id: 'entregado', label: 'Servido', icon: CheckCircle, desc: '¡Buen provecho en THE HOME PIPO!' },
  ] : [
    { id: 'recibido', label: 'Recibido', icon: PackageCheck, desc: 'Orden confirmada en mostrador' },
    { id: 'preparando', label: 'Amasando', icon: Sparkles, desc: 'Estirado artesanal e ingredientes frescos' },
    { id: 'horneando', label: 'En Horno', icon: Flame, desc: 'Horno de gas a 450°C sobre piedra volcánica' },
    { id: 'listo', label: 'En Mostrador', icon: Store, desc: 'Listo y caliente en mostrador para recoger' },
    { id: 'entregado', label: 'Entregado', icon: CheckCircle, desc: '¡Gracias por tu compra en THE HOME PIPO!' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === order.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.90, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.90, y: 20 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="bg-white dark:bg-[#181614] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
              <PackageCheck className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">¡Pedido Confirmado!</span>
              <h2 className="text-xl font-black font-serif text-stone-900 dark:text-white">Orden #{order.id}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Estimated Time Card */}
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 dark:from-red-950/80 dark:via-orange-950/80 dark:to-stone-900 p-5 rounded-2xl border border-orange-300 dark:border-orange-500/40 text-center space-y-2 shadow-md">
          <span className="text-xs text-white dark:text-amber-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 animate-spin text-white dark:text-orange-400" />
            <span>Tiempo Estimado de Preparación</span>
          </span>
          <div className="text-4xl font-black text-white font-serif tracking-tight">
            ~{minutesLeft} minutos
          </div>
          <p className="text-xs text-orange-100 dark:text-stone-300">
            {order.orderType === 'dine_in'
              ? `Para consumir en local ${order.tableNumber ? `• Mesa ${order.tableNumber}` : ''}`
              : 'Para recoger en mostrador • Sucursal THE HOME PIPO'}
          </p>
        </div>

        {/* Step by Step Timeline Progress Bar */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
            Estado de Horneado en Vivo
          </span>

          <div className="relative flex items-center justify-between px-2">
            {/* Connecting Progress Line */}
            <div className="absolute top-1/2 left-6 right-6 h-1 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 -z-0" />
            <div 
              className="absolute top-1/2 left-6 h-1 bg-gradient-to-r from-red-600 to-amber-500 -translate-y-1/2 -z-0 transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 88)}%`,
              }}
            />

            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.id} className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isCurrent
                        ? 'bg-amber-400 text-stone-950 border-amber-500 scale-125 shadow-lg shadow-amber-500/40 animate-pulse'
                        : isCompleted
                        ? 'bg-red-600 text-white border-orange-500'
                        : 'bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-600 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                      isCurrent ? 'text-amber-700 dark:text-amber-300 font-black' : isCompleted ? 'text-stone-900 dark:text-white' : 'text-stone-400 dark:text-stone-500'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Stage Highlight Box */}
        <div className="bg-stone-50 dark:bg-stone-900/90 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
            <span className="font-bold text-stone-900 dark:text-white uppercase text-[11px]">Etapa Actual:</span>
            <span className="text-amber-700 dark:text-amber-400 font-extrabold">{stages[currentStageIndex]?.label || 'En Proceso'}</span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-xs">
            {stages[currentStageIndex]?.desc}
          </p>
        </div>

        {/* Order Items Breakdown Summary */}
        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs">
          <span className="font-bold text-stone-900 dark:text-stone-300 block">Detalles del Pedido:</span>
          <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>{item.quantity}x {item.title}</span>
                <span className="font-semibold text-stone-900 dark:text-stone-200">${item.unitPrice * item.quantity} MXN</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between font-black text-amber-800 dark:text-amber-400 text-sm">
            <span>Total a pagar en caja / pagado:</span>
            <span>${order.total} MXN</span>
          </div>
        </div>

        {/* Push Notification Card for Order Updates */}
        <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900/90 border border-orange-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border flex-shrink-0 ${
                notificationPerm === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30'
              }`}>
                {notificationPerm === 'granted' ? (
                  <BellRing className="w-4 h-4 animate-bounce" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>
              <div>
                <span className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                  <span>Notificaciones Push del Pedido</span>
                  {notificationPerm === 'granted' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Activadas
                    </span>
                  )}
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {notificationPerm === 'granted'
                    ? 'Te avisaremos cuando tu pizza entre al horno y cuando esté lista para entrega.'
                    : 'Recibe una alerta en tu dispositivo aunque cierres o cambies de pestaña.'}
                </p>
              </div>
            </div>

            {notificationPerm !== 'granted' ? (
              <button
                onClick={handleEnableNotifications}
                disabled={isRequestingPerm || notificationPerm === 'unsupported'}
                className="px-3 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{isRequestingPerm ? 'Activando...' : 'Activar Avisos'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-2.5 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
                  title="Personalizar qué alertas recibir o cancelar suscripción"
                >
                  <Settings className="w-3 h-3" />
                  <span>Ajustes</span>
                </button>
                <button
                  onClick={() => {
                    notifyOrderStatus(order.id, order.status, {
                      orderType: order.orderType,
                      tableNumber: order.tableNumber,
                      total: order.total,
                    });
                  }}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-[11px] rounded-lg transition-colors cursor-pointer whitespace-nowrap border border-amber-500/30"
                  title="Probar notificación en tu dispositivo"
                >
                  Probar Alerta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp & Sucursal Contact Box */}
        <div className="space-y-2.5">
          {/* WhatsApp Direct Action Button */}
          <a
            href={buildWhatsAppOrderUrl(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white flex-shrink-0" />
            <span>Abrir / Reenviar Comanda en WhatsApp ({PIPO_FORMATTED_PHONE})</span>
          </a>

          <div className="bg-stone-100 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 font-black">
                🍕
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-semibold block">Atención en Mostrador</span>
                <span className="font-bold text-stone-900 dark:text-white text-sm">THE HOME PIPO ({PIPO_FORMATTED_PHONE})</span>
              </div>
            </div>

            <a
              href={`tel:+52${PIPO_FORMATTED_PHONE.replace(/\s+/g, '')}`}
              className="px-3.5 py-2 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Llamar</span>
            </a>
          </div>
        </div>

        {/* Action and simulator buttons */}
        <div className="pt-2 flex items-center justify-between gap-2 flex-wrap text-center border-t border-stone-100 dark:border-stone-800/80 pt-4">
          <button
            onClick={() => soundService.playOrderSuccessSound()}
            className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-semibold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 cursor-pointer transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Escuchar Notificación Sonora</span>
          </button>

          <button
            onClick={() => {
              soundService.playOrderSuccessSound();
              onSimulateNextStatus();
            }}
            className="text-[11px] text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-300 font-semibold underline cursor-pointer ml-auto"
          >
            [Demo] Simular avance de estado en cocina
          </button>
        </div>

      </motion.div>

      {/* Preferences modal */}
      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setNotificationPerm(getNotificationPermission());
        }}
      />
    </motion.div>
  );
};
