import React, { useState } from 'react';
import { Gift, Flame, Tag, Plus, Clock, Star, Check } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface PromosAndCombosProps {
  onAddToCart: (cartItem: CartItem) => void;
  items?: MenuItem[];
}

export const PromosAndCombos: React.FC<PromosAndCombosProps> = ({ onAddToCart, items }) => {
  const [addedComboId, setAddedComboId] = useState<string | null>(null);
  const currentMenuItems = items || MENU_ITEMS;
  const comboItems = currentMenuItems.filter((item) => item.category === 'combos');

  const dailyPromos = [
    {
      title: 'Martes 2x1 en Medianas',
      day: 'Cada Martes',
      description: 'Compra 1 Pizza Mediana de cualquier especialidad y llévate la segunda gratis.',
      tag: 'CÓDIGO: MARTES2X1',
      price: '$189 (2 Pizzas)',
    },
    {
      title: 'Jueves de Orilla Rellena Gratis',
      day: 'Cada Jueves',
      description: 'En la compra de cualquier Pizza Grande o Familiar, la orilla de queso va por nuestra cuenta.',
      tag: 'CÓDIGO: ORILLAGRATIS',
      price: 'Ahorra $35',
    },
  ];

  const handleAddCombo = (item: typeof MENU_ITEMS[0]) => {
    setAddedComboId(item.id);
    setTimeout(() => {
      setAddedComboId(null);
    }, 1200);

    const cartItem: CartItem = {
      cartItemId: `combo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      menuItem: item,
      title: item.name,
      detailsText: item.description,
      unitPrice: item.basePrice,
      quantity: 1,
    };
    onAddToCart(cartItem);
  };

  return (
    <section id="promos" className="py-16 bg-[#0E0D0C] text-stone-100 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-bold tracking-wider uppercase">
            <Gift className="w-3.5 h-3.5 text-amber-400" /> Promociones & Combos Pipo
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white">
            Combos Especiales y Ahorros
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            Diseñados para compartir en pareja, familia o fiesta con el máximo sabor y al mejor precio.
          </p>
        </div>

        {/* Daily Special Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dailyPromos.map((promo, idx) => (
            <div
              key={idx}
              className="relative bg-gradient-to-br from-red-950/80 via-stone-900 to-stone-950 p-6 sm:p-8 rounded-3xl border border-orange-500/30 shadow-2xl overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/40">
                    {promo.day}
                  </span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/40">
                    {promo.price}
                  </span>
                </div>

                <h3 className="text-2xl font-black font-serif text-white">{promo.title}</h3>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{promo.description}</p>
              </div>

              <div className="pt-6 border-t border-stone-800/80 mt-4 flex items-center justify-between">
                <span className="text-xs font-extrabold text-orange-400 font-mono tracking-wider bg-black/40 px-3 py-1.5 rounded-lg border border-orange-500/20">
                  {promo.tag}
                </span>
                <span className="text-xs text-stone-400 font-semibold">Aplica al finalizar el pedido</span>
              </div>
            </div>
          ))}
        </div>

        {/* Combos Cards Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black font-serif text-white text-center">
            Paquetes Frecuentes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comboItems.map((combo) => (
              <div
                key={combo.id}
                className="bg-[#181614] rounded-3xl border border-stone-800/80 overflow-hidden shadow-xl flex flex-col sm:flex-row justify-between group hover:border-orange-500/40 transition-all duration-300"
              >
                <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden flex-shrink-0">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181614] sm:bg-gradient-to-r sm:from-transparent sm:to-[#181614] opacity-80" />
                </div>

                <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/40">
                      Combo Pipo
                    </span>
                    <h4 className="text-xl font-black font-serif text-white mt-1.5">{combo.name}</h4>
                    <p className="text-stone-300 text-xs mt-1.5 leading-relaxed">{combo.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Precio Especial</span>
                      <span className="text-2xl font-black text-amber-400">${combo.basePrice}</span>
                    </div>

                    <button
                      onClick={() => handleAddCombo(combo)}
                      className={`px-4 py-2.5 font-extrabold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center gap-1.5 active:scale-95 ${
                        addedComboId === combo.id
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white scale-105 shadow-emerald-950/60 ring-2 ring-emerald-400/50'
                          : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white hover:scale-105'
                      }`}
                    >
                      {addedComboId === combo.id ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-bounce" />
                          <span>¡Combo Agregado! 🎁</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Agregar Combo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
