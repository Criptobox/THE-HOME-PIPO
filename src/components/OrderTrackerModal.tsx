import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle, Flame, Bike, PackageCheck, Clock, Phone, MapPin, Sparkles } from 'lucide-react';
import { Order, OrderStatus } from '../types';

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

  const [minutesLeft, setMinutesLeft] = useState(order.estimatedMinutes || 35);

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

  const stages: Array<{ id: OrderStatus; label: string; icon: any; desc: string }> = [
    { id: 'recibido', label: 'Recibido', icon: PackageCheck, desc: 'Enviado a cocina' },
    { id: 'preparando', label: 'Amasando', icon: Sparkles, desc: 'Ingredientes frescos' },
    { id: 'horneando', label: 'En Horno', icon: Flame, desc: 'Fuego de leña a 450°C' },
    { id: 'en_camino', label: 'En Camino', icon: Bike, desc: 'Con bolsa térmica' },
    { id: 'entregado', label: 'Entregado', icon: CheckCircle, desc: '¡Buen provecho!' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#181614] border border-stone-800 text-stone-100 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl shadow-red-950/60 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <PackageCheck className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">¡Pedido Confirmado!</span>
              <h2 className="text-xl font-black font-serif text-white">Orden #{order.id}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Estimated Time Card */}
        <div className="bg-gradient-to-r from-red-950/80 via-orange-950/80 to-stone-900 p-5 rounded-2xl border border-orange-500/40 text-center space-y-2 shadow-inner">
          <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 animate-spin text-orange-400" />
            <span>Tiempo Estimado de Entrega</span>
          </span>
          <div className="text-4xl font-black text-white font-serif tracking-tight">
            ~{minutesLeft} minutos
          </div>
          <p className="text-xs text-stone-300">
            {order.orderType === 'delivery'
              ? `Entregando en: ${order.customerAddress || 'Tu domicilio'} (${order.neighborhood})`
              : 'Recoger en Sucursal Centro'}
          </p>
        </div>

        {/* Step by Step Timeline Progress Bar */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">
            Estado de Preparación en Vivo
          </span>

          <div className="relative flex items-center justify-between px-2">
            {/* Connecting Progress Line */}
            <div className="absolute top-1/2 left-6 right-6 h-1 bg-stone-800 -translate-y-1/2 -z-0" />
            <div 
              className="absolute top-1/2 left-6 h-1 bg-gradient-to-r from-red-600 to-amber-400 -translate-y-1/2 -z-0 transition-all duration-500"
              style={{
                width: `${(currentStageIndex / (stages.length - 1)) * 88}%`,
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
                        ? 'bg-amber-400 text-stone-950 border-amber-300 scale-125 shadow-lg shadow-amber-500/40 animate-pulse'
                        : isCompleted
                        ? 'bg-red-600 text-white border-orange-500'
                        : 'bg-stone-900 text-stone-600 border-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                      isCurrent ? 'text-amber-300 font-black' : isCompleted ? 'text-white' : 'text-stone-500'
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
        <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-stone-300">
            <span className="font-bold text-white uppercase text-[11px]">Etapa Actual:</span>
            <span className="text-amber-400 font-extrabold">{stages[currentStageIndex]?.label}</span>
          </div>
          <p className="text-stone-400 text-xs">
            {stages[currentStageIndex]?.desc}
          </p>
        </div>

        {/* Order Items Breakdown Summary */}
        <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
          <span className="font-bold text-stone-300 block">Detalles del Pedido:</span>
          <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-stone-400">
                <span>{item.quantity}x {item.title}</span>
                <span className="font-semibold text-stone-200">${item.unitPrice * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-800 flex justify-between font-black text-amber-400 text-sm">
            <span>Total Pagado / A pagar:</span>
            <span>${order.total}</span>
          </div>
        </div>

        {/* Repartidor Contact Box */}
        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-black">
              🛵
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-semibold block">Repartidor Asignado</span>
              <span className="font-bold text-white text-sm">Pipo Express #12</span>
            </div>
          </div>

          <a
            href="tel:5551234567"
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span>Llamar</span>
          </a>
        </div>

        {/* Demo simulator button */}
        <div className="pt-2 text-center">
          <button
            onClick={onSimulateNextStatus}
            className="text-[11px] text-stone-400 hover:text-amber-300 font-semibold underline"
          >
            [Demo] Avanzar etapa de simulación del pedido
          </button>
        </div>

      </div>
    </div>
  );
};
