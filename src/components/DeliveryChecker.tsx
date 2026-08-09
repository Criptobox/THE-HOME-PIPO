import React, { useState } from 'react';
import { MapPin, Bike, Search, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { DELIVERY_ZONES } from '../data/menu';

interface DeliveryCheckerProps {
  zones?: Array<{
    name: string;
    fee: number;
    estimatedTime: string;
    available: boolean;
  }>;
}

export const DeliveryChecker: React.FC<DeliveryCheckerProps> = ({ zones }) => {
  const currentZones = zones || DELIVERY_ZONES;
  const [query, setQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<typeof currentZones[0] | null>(currentZones[0] || null);

  const handleSearch = () => {
    if (!query.trim()) return;
    const found = currentZones.find((z) => z.name.toLowerCase().includes(query.toLowerCase()));
    if (found) {
      setSelectedZone(found);
    } else {
      setSelectedZone({
        name: query,
        fee: 30,
        estimatedTime: '35-45 min',
        available: true,
      });
    }
  };

  return (
    <section id="cobertura" className="py-16 bg-[#121110] text-stone-100 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-bold tracking-wider uppercase">
            <Bike className="w-3.5 h-3.5" /> Envíos Rápidos
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white">
            Verifica la Cobertura en tu Zona
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            Entregamos tu pizza hirviendo y crujiente en bolsas térmicas especializadas de alta tecnología.
          </p>
        </div>

        {/* Checker Box */}
        <div className="max-w-2xl mx-auto bg-[#181614] p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Escribe tu colonia o código postal (ej: Condesa, Polanco, Centro)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-stone-900 border border-stone-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Verificar</span>
            </button>
          </div>

          {selectedZone && (
            <div className="bg-stone-900 p-5 rounded-2xl border border-emerald-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-extrabold text-sm text-white">{selectedZone.name}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800/50">
                  ¡Zona con Cobertura!
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-800 text-xs">
                <div>
                  <span className="text-stone-400 block">Tiempo estimado de entrega:</span>
                  <span className="font-black text-amber-300 text-sm flex items-center gap-1 mt-0.5">
                    <Clock className="w-4 h-4" /> {selectedZone.estimatedTime}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block">Costo de envío:</span>
                  <span className="font-black text-white text-sm mt-0.5">
                    {selectedZone.fee === 0 ? '¡ENVÍO GRATIS!' : `$${selectedZone.fee} MXN`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Zones list quick view */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-400 block">Zonas principales con servicio hoy:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentZones.map((z) => (
                <button
                  key={z.name}
                  onClick={() => setSelectedZone(z)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                    selectedZone?.name === z.name
                      ? 'bg-orange-950/60 border-orange-500 text-amber-300 font-bold'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="block truncate font-bold text-white">{z.name}</span>
                  <span className="text-[10px] text-stone-400">{z.estimatedTime}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
