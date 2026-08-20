import React from 'react';
import { MapPin, Store, Clock, Phone, Sparkles, Navigation, UtensilsCrossed, ShoppingBag } from 'lucide-react';

interface BranchLocationSectionProps {
  storeInfo?: {
    address?: string;
    phone?: string;
    hours?: string;
  };
}

export const DeliveryChecker: React.FC<BranchLocationSectionProps> = ({ storeInfo }) => {
  const address = storeInfo?.address || 'Av. de los Hornos #450, Col. Centro Histórico, Ciudad de México';
  const phone = storeInfo?.phone || '55 6747 0079';
  const hours = storeInfo?.hours || 'Lunes a Domingo: 12:00 PM – 11:00 PM';

  return (
    <section id="sucursal" className="py-16 bg-stone-100/70 dark:bg-[#121110] text-stone-900 dark:text-stone-100 border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-400 text-xs font-black tracking-wider uppercase">
            <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Sucursal Matriz & Atención al Cliente
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-stone-900 dark:text-white">
            Visítanos en THE HOME PIPO 🍕
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Ordena desde nuestra web y pasa a recoger tu pizza caliente recién salida del horno de gas sobre piedras volcánicas, o ven a disfrutarla en nuestras cómodas mesas con amigos y familia.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: Para Recoger en Mostrador */}
          <div className="bg-white dark:bg-[#181614] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md dark:shadow-xl space-y-4 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black font-serif text-stone-900 dark:text-white">Pide y Recoge en Mostrador</h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                Haz tu pedido en línea, te avisamos por WhatsApp o pantalla cuando tu pizza entre al horno y recógela sin filas.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Tiempo promedio de preparación: 15 a 20 minutos</span>
            </div>
          </div>

          {/* Card 2: Comer en el Local */}
          <div className="bg-white dark:bg-[#181614] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md dark:shadow-xl space-y-4 hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white shadow-lg">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black font-serif text-stone-900 dark:text-white">Disfruta en Nuestras Mesas</h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                Ambiente rústico y acogedor con música agradable, bebidas frías, alitas y la pizza con el queso recién derretido.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-orange-900 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-3 py-2 rounded-xl border border-orange-200 dark:border-orange-800/40">
              <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Masa madre horneada a 450°C al momento</span>
            </div>
          </div>

        </div>

        {/* Location & Hours Detailed Box */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#181614] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-lg dark:shadow-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            
            {/* Address */}
            <div className="space-y-1.5">
              <span className="text-xs font-black text-amber-800 dark:text-amber-400 flex items-center justify-center sm:justify-start gap-1 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-500" /> Ubicación
              </span>
              <p className="text-sm font-bold text-stone-900 dark:text-white leading-snug">{address}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">Fácil acceso con estacionamiento cercano</p>
            </div>

            {/* Hours */}
            <div className="space-y-1.5">
              <span className="text-xs font-black text-amber-800 dark:text-amber-400 flex items-center justify-center sm:justify-start gap-1 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Horarios de Horno
              </span>
              <p className="text-sm font-bold text-stone-900 dark:text-white leading-snug">{hours}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">● Abierto hoy</p>
            </div>

            {/* Phone & Contact */}
            <div className="space-y-1.5">
              <span className="text-xs font-black text-amber-800 dark:text-amber-400 flex items-center justify-center sm:justify-start gap-1 uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5 text-orange-600 dark:text-orange-500" /> Contacto Directo
              </span>
              <p className="text-sm font-bold text-stone-900 dark:text-white leading-snug">{phone}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">Atención a clientes y pedidos</p>
            </div>

          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
              <Store className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>THE HOME PIPO te espera con el horno siempre encendido.</span>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Ver en Google Maps</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
