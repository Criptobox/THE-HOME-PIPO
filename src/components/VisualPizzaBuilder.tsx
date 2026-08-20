import React, { useState } from 'react';
import { PizzaSize, CrustType, SauceType, ToppingCoverage, CartItem, Topping } from '../types';
import { PIZZA_SIZES, CRUST_OPTIONS, SAUCE_OPTIONS, TOPPINGS } from '../data/menu';
import { Flame, Check, Sparkles, RotateCcw, Plus, Layers, AlertCircle } from 'lucide-react';

interface VisualPizzaBuilderProps {
  onAddToCart: (cartItem: CartItem) => void;
  toppings?: Topping[];
}

export const VisualPizzaBuilder: React.FC<VisualPizzaBuilderProps> = ({ onAddToCart, toppings }) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('unica');
  const [selectedCrust, setSelectedCrust] = useState<CrustType>('tradicional');
  const [selectedSauce, setSelectedSauce] = useState<SauceType>('tomate_clasico');
  const [cheeseLevel, setCheeseLevel] = useState<'ligero' | 'normal' | 'extra'>('normal');

  const allToppings = toppings && toppings.length > 0 ? toppings : TOPPINGS;
  const availableToppings = allToppings.filter((t) => t.available !== false);

  // Selected toppings map: toppingId -> coverage
  const [activeToppings, setActiveToppings] = useState<Record<string, ToppingCoverage>>({});
  const [activeCoverageMode, setActiveCoverageMode] = useState<ToppingCoverage>('full');

  const sizeOption = PIZZA_SIZES.find((s) => s.id === selectedSize) || PIZZA_SIZES[0];
  const crustOption = CRUST_OPTIONS.find((c) => c.id === selectedCrust) || CRUST_OPTIONS[0];
  const sauceOption = SAUCE_OPTIONS.find((s) => s.id === selectedSauce) || SAUCE_OPTIONS[0];

  // Price Calculation (Base $130 MXN)
  const basePrice = Math.round(130 * sizeOption.priceMultiplier);
  const extraCheeseCost = cheeseLevel === 'extra' ? 30 : cheeseLevel === 'ligero' ? 0 : 0;
  
  const toppingsCost = Object.entries(activeToppings).reduce((acc, [id, coverage]) => {
    const topping = allToppings.find((t) => t.id === id);
    if (!topping) return acc;
    // If half coverage, cost is 60% of full price
    const cost = coverage === 'full' ? topping.price : Math.round(topping.price * 0.65);
    return acc + cost;
  }, 0);

  const totalPrice = basePrice + crustOption.extraCost + extraCheeseCost + toppingsCost;

  const toggleTopping = (toppingId: string) => {
    setActiveToppings((prev) => {
      const current = prev[toppingId];
      if (current) {
        // If already selected, remove it
        const copy = { ...prev };
        delete copy[toppingId];
        return copy;
      } else {
        // Add with active coverage mode
        return { ...prev, [toppingId]: activeCoverageMode };
      }
    });
  };

  const updateCoverage = (toppingId: string, coverage: ToppingCoverage) => {
    setActiveToppings((prev) => ({
      ...prev,
      [toppingId]: coverage,
    }));
  };

  const resetPizza = () => {
    setSelectedSize('unica');
    setSelectedCrust('tradicional');
    setSelectedSauce('tomate_clasico');
    setCheeseLevel('normal');
    setActiveToppings({});
  };

  const handleAddToCart = () => {
    const toppingDetails = Object.entries(activeToppings).map(([id, cov]) => {
      const t = allToppings.find((top) => top.id === id);
      const covText = cov === 'left' ? ' (Mitad Izq)' : cov === 'right' ? ' (Mitad Der)' : '';
      return `${t?.name}${covText}`;
    });

    const detailsParts = [
      `Tamaño: ${sizeOption.name}`,
      `Masa: ${crustOption.name}`,
      `Salsa: ${sauceOption.name}`,
      `Queso: ${cheeseLevel.toUpperCase()}`,
    ];

    if (toppingDetails.length > 0) {
      detailsParts.push(`Toppings (${toppingDetails.length}): ${toppingDetails.join(', ')}`);
    } else {
      detailsParts.push('Solo Queso');
    }

    const cartItem: CartItem = {
      cartItemId: `custom_${Date.now()}`,
      title: `Pizza Creada por ti (${sizeOption.name})`,
      detailsText: detailsParts.join(' • '),
      sizeName: sizeOption.name,
      crustName: crustOption.name,
      unitPrice: totalPrice,
      quantity: 1,
    };

    onAddToCart(cartItem);
  };

  // Generate visual positions for SVG toppings on the pizza
  const renderVisualToppingElements = (toppingId: string, coverage: ToppingCoverage) => {
    // Generate deterministic points on circle
    const points: Array<{ x: number; y: number; rot: number }> = [
      { x: 0, y: -50, rot: 12 },
      { x: 45, y: -25, rot: 45 },
      { x: -40, y: -30, rot: -20 },
      { x: 20, y: 35, rot: 80 },
      { x: -30, y: 40, rot: -40 },
      { x: 60, y: 10, rot: 15 },
      { x: -60, y: 0, rot: -60 },
      { x: 0, y: 10, rot: 0 },
      { x: -15, y: -70, rot: 30 },
      { x: 25, y: -65, rot: -10 },
      { x: 50, y: 45, rot: 110 },
      { x: -50, y: -50, rot: -80 },
    ];

    return points
      .filter((pt) => {
        if (coverage === 'left') return pt.x <= 5;
        if (coverage === 'right') return pt.x >= -5;
        return true;
      })
      .map((pt, idx) => {
        const key = `${toppingId}_${idx}`;
        const cx = 150 + pt.x;
        const cy = 150 + pt.y;

        switch (toppingId) {
          case 'pepperoni':
            return (
              <g key={key} transform={`translate(${cx}, ${cy})`}>
                <circle r="16" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />
                <circle r="12" fill="#DC2626" />
                <circle r="10" fill="none" stroke="#991B1B" strokeWidth="1" strokeDasharray="3 2" />
              </g>
            );
          case 'champinones':
            return (
              <g key={key} transform={`translate(${cx}, ${cy}) rotate(${pt.rot})`}>
                <path d="M-10,0 A10,10 0 0,1 10,0 Z" fill="#A16207" stroke="#713F12" strokeWidth="1" />
                <rect x="-3" y="0" width="6" height="8" fill="#D97706" rx="1" />
              </g>
            );
          case 'aceitunas':
            return (
              <g key={key} transform={`translate(${cx}, ${cy})`}>
                <circle r="9" fill="#18181B" stroke="#09090B" strokeWidth="1" />
                <circle r="4" fill="#FEF08A" />
              </g>
            );
          case 'pimientos':
            return (
              <g key={key} transform={`translate(${cx}, ${cy}) rotate(${pt.rot})`}>
                <path d="M-12,-4 Q0,-12 12,-4 Q0,2 -12,-4 Z" fill="#16A34A" stroke="#14532D" strokeWidth="1" />
              </g>
            );
          case 'tocino':
            return (
              <g key={key} transform={`translate(${cx}, ${cy}) rotate(${pt.rot})`}>
                <rect x="-14" y="-5" width="28" height="10" rx="2" fill="#991B1B" />
                <rect x="-10" y="-2" width="20" height="4" rx="1" fill="#FCA5A5" />
              </g>
            );
          case 'jalapenos':
            return (
              <g key={key} transform={`translate(${cx}, ${cy}) rotate(${pt.rot})`}>
                <circle r="11" fill="#15803D" stroke="#166534" strokeWidth="1.5" />
                <circle r="5" fill="#BBF7D0" />
                <circle r="2" fill="#15803D" />
              </g>
            );
          case 'pina':
            return (
              <g key={key} transform={`translate(${cx}, ${cy}) rotate(${pt.rot})`}>
                <polygon points="0,-10 10,6 -10,6" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
              </g>
            );
          case 'albahaca':
            return (
              <g key={key} transform={`translate(${cx}, ${cy}) rotate(${pt.rot})`}>
                <ellipse rx="12" ry="6" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
              </g>
            );
          default:
            return (
              <g key={key} transform={`translate(${cx}, ${cy})`}>
                <circle r="10" fill="#D97706" />
              </g>
            );
        }
      });
  };

  return (
    <section id="builder" className="py-16 bg-[#FAF8F5] dark:bg-[#121110] text-stone-900 dark:text-stone-100 border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/80 border border-orange-300 dark:border-orange-800/60 text-orange-900 dark:text-amber-300 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> Creador Interactivo 2D
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-stone-900 dark:text-white">
            Arma tu Pizza Pipo a tu Gusto
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base">
            Diseña cada capa: desde el tamaño y tipo de masa hasta los ingredientes por mitad. ¡Mírala cobran vida en tiempo real!
          </p>
        </div>

        {/* Builder Workspace: Grid with Left Controls & Right Visual Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8 bg-white dark:bg-[#181614] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800/80 shadow-md dark:shadow-2xl">
            
            {/* Step 1: Tamaño */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Paso 1</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {sizeOption.serves}
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-serif">Medida de la Pizza</h3>

              <div className="grid grid-cols-1 gap-2.5">
                {PIZZA_SIZES.map((size) => {
                  return (
                    <div
                      key={size.id}
                      className="p-4 rounded-2xl border bg-gradient-to-br from-stone-50 to-amber-50/40 dark:from-stone-900 dark:to-stone-900/90 border-amber-300/80 dark:border-amber-700/50 text-stone-800 dark:text-stone-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-base border border-orange-200 dark:border-orange-800">
                          🍕
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                              {size.name}
                            </span>
                            <span className="text-[10px] bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md font-bold">
                              Piedra Volcánica
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            {size.slices} rebanadas ({size.cm} cm) • {size.serves}
                          </p>
                        </div>
                      </div>
                      <div className="text-right sm:border-l sm:border-stone-200 dark:sm:border-stone-800 sm:pl-4">
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block">Base Personalizada</span>
                        <span className="text-base font-black text-amber-700 dark:text-amber-300">
                          ${basePrice} MXN
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Tipo de Masa */}
            <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800/80">
              <span className="text-xs font-extrabold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Paso 2</span>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-serif">Tipo de Masa / Orilla</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CRUST_OPTIONS.map((crust) => {
                  const isSelected = selectedCrust === crust.id;
                  return (
                    <button
                      key={crust.id}
                      onClick={() => setSelectedCrust(crust.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-red-600 to-orange-600 dark:from-red-950 dark:to-orange-950 border-red-600 dark:border-orange-500 text-white shadow-md'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                          {crust.name}
                        </span>
                        {crust.extraCost > 0 && (
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-200' : 'text-amber-700 dark:text-amber-300'}`}>
                            +${crust.extraCost}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-1 ${isSelected ? 'text-orange-100 dark:text-stone-300' : 'text-stone-500 dark:text-stone-400'}`}>
                        {crust.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Salsa & Queso */}
            <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800/80">
              <span className="text-xs font-extrabold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Paso 3</span>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white font-serif">Salsa de Base y Queso</h3>

              {/* Salsa options */}
              <div className="flex flex-wrap gap-2">
                {SAUCE_OPTIONS.map((sauce) => {
                  const isSelected = selectedSauce === sauce.id;
                  return (
                    <button
                      key={sauce.id}
                      onClick={() => setSelectedSauce(sauce.id)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-amber-100 dark:bg-stone-800 border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full inline-block border border-black/30"
                        style={{ backgroundColor: sauce.color }}
                      />
                      <span>{sauce.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cheese Level */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">Nivel de Queso:</span>
                {(['ligero', 'normal', 'extra'] as const).map((level) => {
                  const isSelected = cheeseLevel === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setCheeseLevel(level)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold capitalize transition-all ${
                        isSelected
                          ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-400 text-amber-900 dark:text-amber-300 font-bold'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400'
                      }`}
                    >
                      {level} {level === 'extra' ? '(+$25)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Toppings & Coverage Mode */}
            <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-extrabold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Paso 4</span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white font-serif">Agrega tus Toppings</h3>
                </div>

                {/* Coverage mode selector */}
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] text-stone-600 dark:text-stone-400 px-2 font-medium">Aplicar a:</span>
                  {(['full', 'left', 'right'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setActiveCoverageMode(mode)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        activeCoverageMode === mode
                          ? 'bg-red-600 text-white'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      {mode === 'full' ? 'Toda' : mode === 'left' ? 'Mitad Izq' : 'Mitad Der'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings Grid */}
              {availableToppings.length === 0 ? (
                <div className="p-6 text-center bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800">
                  <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300">No hay agregos disponibles en este momento.</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">El administrador activará los agregos en breve.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                  {availableToppings.map((topping) => {
                    const isSelected = !!activeToppings[topping.id];
                    const coverage = activeToppings[topping.id];

                    return (
                      <div
                        key={topping.id}
                        onClick={() => toggleTopping(topping.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-orange-50 dark:bg-orange-950/60 border-orange-500 text-stone-900 dark:text-white shadow-sm'
                            : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-orange-950 dark:text-white' : 'text-stone-900 dark:text-stone-200'}`}>
                            {topping.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />}
                        </div>

                        <div className="flex items-center justify-between mt-1.5 text-[10px]">
                          <span className="text-stone-500 dark:text-stone-400">+${topping.price}</span>
                          {isSelected && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextCov = coverage === 'full' ? 'left' : coverage === 'left' ? 'right' : 'full';
                                updateCoverage(topping.id, nextCov);
                              }}
                              className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-900/80 px-1.5 py-0.5 rounded text-white dark:text-amber-200 font-bold"
                            >
                              {coverage === 'full' ? 'Toda' : coverage === 'left' ? 'Izq' : 'Der'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reset Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={resetPizza}
                className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Canvas</span>
              </button>
            </div>

          </div>

          {/* Canvas Preview Column (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 bg-white dark:bg-[#181614] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md dark:shadow-2xl flex flex-col items-center justify-between space-y-6">
            
            <div className="w-full text-center">
              <span className="text-xs uppercase font-extrabold text-amber-700 dark:text-amber-400 tracking-wider">Vista Previa en Tiempo Real</span>
              <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                Tu Pizza Pipo {sizeOption.name}
              </h3>
            </div>

            {/* Interactive SVG Pizza Display */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center filter drop-shadow-[0_20px_30px_rgba(224,56,18,0.2)]">
              <svg viewBox="0 0 300 300" className="w-full h-full transform hover:scale-105 transition-transform duration-300">
                
                {/* Crust / Dough Layer */}
                <circle cx="150" cy="150" r="140" fill="#D97706" stroke="#92400E" strokeWidth="6" />
                <circle cx="150" cy="150" r="132" fill="#F59E0B" />

                {/* Sauce Layer */}
                <circle cx="150" cy="150" r="118" fill={sauceOption.color} opacity="0.9" />

                {/* Cheese Layer */}
                <circle
                  cx="150"
                  cy="150"
                  r="110"
                  fill="#FEF08A"
                  opacity={cheeseLevel === 'extra' ? 0.95 : cheeseLevel === 'normal' ? 0.85 : 0.65}
                />

                {/* Half Divider Line if halves selected */}
                {Object.values(activeToppings).some((c) => c !== 'full') && (
                  <line x1="150" y1="35" x2="150" y2="265" stroke="#78350F" strokeWidth="2" strokeDasharray="4 4" />
                )}

                {/* Rendered Toppings */}
                {Object.entries(activeToppings).map(([id, cov]) => renderVisualToppingElements(id, cov as ToppingCoverage))}

                {/* Slice Cut Overlay Lines */}
                <g stroke="#92400E" strokeWidth="1" strokeDasharray="2 3" opacity="0.4">
                  <line x1="150" y1="10" x2="150" y2="290" />
                  <line x1="10" y1="150" x2="290" y2="150" />
                  <line x1="50" y1="50" x2="250" y2="250" />
                  <line x1="250" y1="50" x2="50" y2="250" />
                </g>
              </svg>
            </div>

            {/* Price & Summary Box */}
            <div className="w-full bg-stone-50 dark:bg-stone-900/90 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
                <span>Ingredientes seleccionados:</span>
                <span className="font-bold text-amber-800 dark:text-amber-300">{Object.keys(activeToppings).length} toppings</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 dark:text-stone-400 block font-medium">Total de tu creación</span>
                  <span className="text-3xl font-black text-amber-700 dark:text-amber-400">${totalPrice}</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="px-5 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
