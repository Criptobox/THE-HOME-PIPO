import React, { useState } from 'react';
import { X, Plus, Minus, Flame, Check, AlertCircle, Loader2, Sparkles, Tag, TrendingUp, Trash2, Info, Layers } from 'lucide-react';
import { MenuItem, PizzaSize, CrustType, CartItem } from '../types';
import { PIZZA_SIZES, CRUST_OPTIONS, TOPPINGS } from '../data/menu';

interface PizzaCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const PizzaCustomizerModal: React.FC<PizzaCustomizerModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('grande');
  const [selectedCrust, setSelectedCrust] = useState<CrustType>('tradicional');
  const [selectedExtraToppings, setSelectedExtraToppings] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [activeCategory, setActiveCategory] = useState<'todos' | 'carne' | 'vegetal' | 'queso'>('todos');
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const sizeOption = PIZZA_SIZES.find((s) => s.id === selectedSize) || PIZZA_SIZES[2];
  const crustOption = CRUST_OPTIONS.find((c) => c.id === selectedCrust) || CRUST_OPTIONS[0];

  // Price Calculation
  const basePriceForSize = Math.round(item.basePrice * sizeOption.priceMultiplier);
  const extraToppingsCost = selectedExtraToppings.reduce((acc, id) => {
    const topping = TOPPINGS.find((t) => t.id === id);
    return acc + (topping ? topping.price : 0);
  }, 0);

  const crustExtraCost = crustOption.extraCost;
  const totalIncrementalCost = crustExtraCost + extraToppingsCost;

  const unitPrice = basePriceForSize + totalIncrementalCost;
  const totalPrice = unitPrice * quantity;

  // Percentages for the stacked cost bar
  const basePercentage = Math.round((basePriceForSize / unitPrice) * 100);
  const crustPercentage = Math.round((crustExtraCost / unitPrice) * 100);
  const toppingsPercentage = Math.round((extraToppingsCost / unitPrice) * 100);

  const toggleTopping = (toppingId: string) => {
    if (selectedExtraToppings.includes(toppingId)) {
      setSelectedExtraToppings(selectedExtraToppings.filter((id) => id !== toppingId));
    } else {
      setSelectedExtraToppings([...selectedExtraToppings, toppingId]);
    }
  };

  const clearExtraToppings = () => {
    setSelectedExtraToppings([]);
  };

  const filteredToppings = activeCategory === 'todos'
    ? TOPPINGS
    : TOPPINGS.filter((t) => t.category === activeCategory);

  const handleAdd = () => {
    const extraToppingNames = selectedExtraToppings
      .map((id) => TOPPINGS.find((t) => t.id === id)?.name)
      .filter(Boolean);

    const detailsParts = [
      `Tamaño: ${sizeOption.name} (${sizeOption.slices} rebanadas)`,
      `Masa: ${crustOption.name}`,
    ];

    if (extraToppingNames.length > 0) {
      detailsParts.push(`Extras: ${extraToppingNames.join(', ')}`);
    }

    setIsAdding(true);
    setTimeout(() => {
      const cartItem: CartItem = {
        cartItemId: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        menuItem: item,
        title: item.name,
        detailsText: detailsParts.join(' • '),
        sizeName: sizeOption.name,
        crustName: crustOption.name,
        unitPrice,
        quantity,
        specialInstructions: specialInstructions.trim() || undefined,
      };

      onAddToCart(cartItem);
      setIsAdding(false);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#181614] border border-stone-800 text-stone-100 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-red-950/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image preview */}
        <div className="relative h-44 sm:h-52 overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-[#181614]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-[11px] uppercase font-black tracking-wider text-orange-400 bg-orange-950/80 px-2.5 py-1 rounded-md border border-orange-800/50">
                Personaliza tu Pizza
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
                {item.name}
              </h2>
            </div>

            {/* Live Price Tag on Banner */}
            <div className="hidden sm:block text-right bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-500/40">
              <span className="text-[10px] text-stone-400 block font-bold uppercase">Precio por Pizza</span>
              <span className="text-xl font-black text-amber-300">${unitPrice}</span>
            </div>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Item description */}
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            {item.description}
          </p>

          {/* Ingredients list */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-xs font-semibold text-stone-400 w-full mb-1">Ingredientes base incluidos:</span>
            {item.ingredients.map((ing, i) => (
              <span key={i} className="text-[11px] bg-stone-900 text-amber-200 px-2.5 py-1 rounded-lg border border-stone-800">
                {ing}
              </span>
            ))}
          </div>

          {/* REAL-TIME INCREMENTAL COST BAR SECTION */}
          <div className="bg-gradient-to-b from-[#1E1B18] to-[#161412] p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-3.5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Costo Incremental en Tiempo Real
                </h3>
              </div>

              {totalIncrementalCost > 0 ? (
                <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-700/60 animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>+${totalIncrementalCost} en extras</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold text-stone-400 bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800">
                  Precio Base Sin Extras
                </span>
              )}
            </div>

            {/* Stacked Proportional Cost Bar */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-full bg-stone-900 rounded-full overflow-hidden flex p-0.5 border border-stone-800 shadow-inner">
                {/* Base Size Segment */}
                <div
                  style={{ width: `${basePercentage}%` }}
                  className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-l-full transition-all duration-300"
                  title={`Base Pizza (${sizeOption.name}): $${basePriceForSize} (${basePercentage}%)`}
                />
                {/* Crust Segment */}
                {crustExtraCost > 0 && (
                  <div
                    style={{ width: `${crustPercentage}%` }}
                    className="h-full bg-amber-500 transition-all duration-300"
                    title={`Orilla Especial (${crustOption.name}): +$${crustExtraCost} (${crustPercentage}%)`}
                  />
                )}
                {/* Toppings Segment */}
                {extraToppingsCost > 0 && (
                  <div
                    style={{ width: `${toppingsPercentage}%` }}
                    className="h-full bg-emerald-500 rounded-r-full transition-all duration-300"
                    title={`Ingredientes Extra (${selectedExtraToppings.length}): +$${extraToppingsCost} (${toppingsPercentage}%)`}
                  />
                )}
              </div>

              {/* Bar Legend */}
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                <div className="bg-stone-900/90 p-2 rounded-xl border border-stone-800 text-center">
                  <span className="text-stone-400 block text-[10px]">1. Base ({sizeOption.name})</span>
                  <span className="font-extrabold text-white">${basePriceForSize}</span>
                </div>

                <div className={`p-2 rounded-xl border text-center ${crustExtraCost > 0 ? 'bg-amber-950/40 border-amber-800/60 text-amber-300' : 'bg-stone-900/90 border-stone-800 text-stone-400'}`}>
                  <span className="block text-[10px]">2. Masa / Orilla</span>
                  <span className="font-extrabold">
                    {crustExtraCost > 0 ? `+$${crustExtraCost}` : 'Incluido'}
                  </span>
                </div>

                <div className={`p-2 rounded-xl border text-center ${extraToppingsCost > 0 ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' : 'bg-stone-900/90 border-stone-800 text-stone-400'}`}>
                  <span className="block text-[10px]">3. Extras ({selectedExtraToppings.length})</span>
                  <span className="font-extrabold">
                    {extraToppingsCost > 0 ? `+$${extraToppingsCost}` : '$0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Extra Badges */}
            {selectedExtraToppings.length > 0 && (
              <div className="pt-2 border-t border-stone-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-300">
                    Extras Seleccionados ({selectedExtraToppings.length}):
                  </span>
                  <button
                    onClick={clearExtraToppings}
                    className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpiar Extras</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedExtraToppings.map((id) => {
                    const top = TOPPINGS.find((t) => t.id === id);
                    if (!top) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 px-2.5 py-1 rounded-xl text-xs font-extrabold animate-fadeIn"
                      >
                        <span>{top.name}</span>
                        <span className="text-emerald-400">(+${top.price})</span>
                        <button
                          onClick={() => toggleTopping(id)}
                          className="hover:text-white p-0.5 rounded-full hover:bg-emerald-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wide flex items-center justify-between">
              <span>1. Selecciona el Tamaño</span>
              <span className="text-stone-400 normal-case font-normal text-[11px]">Cambia el precio base</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PIZZA_SIZES.map((size) => {
                const isSelected = selectedSize === size.id;
                const calcPrice = Math.round(item.basePrice * size.priceMultiplier);
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-br from-red-950/80 to-orange-950/80 border-orange-500 text-white shadow-lg ring-1 ring-orange-500/40'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs sm:text-sm text-white">{size.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-orange-400" />}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">{size.slices} rebanadas ({size.cm}cm)</p>
                    <p className="text-[10px] text-stone-500">{size.serves}</p>
                    <p className="text-xs sm:text-sm font-black text-amber-300 mt-2">${calcPrice}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Crust Selection */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wide flex items-center justify-between">
              <span>2. Selecciona la Masa / Orilla</span>
              <span className="text-stone-400 normal-case font-normal text-[11px]">Añade costo extra de orilla</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CRUST_OPTIONS.map((crust) => {
                const isSelected = selectedCrust === crust.id;
                return (
                  <button
                    key={crust.id}
                    onClick={() => setSelectedCrust(crust.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-br from-red-950/80 to-orange-950/80 border-orange-500 text-white shadow-lg ring-1 ring-orange-500/40'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-white">{crust.name}</span>
                      <span className={`text-xs font-black ${crust.extraCost > 0 ? 'text-amber-300' : 'text-stone-400'}`}>
                        {crust.extraCost > 0 ? `+$${crust.extraCost}` : 'Incluido'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">{crust.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra Toppings */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wide">
                3. Ingredientes Extra (Suma en tiempo real)
              </label>

              {/* Topping Category Filter Pills */}
              <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-[10px]">
                {(['todos', 'carne', 'vegetal', 'queso'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors ${
                      activeCategory === cat
                        ? 'bg-orange-600 text-white'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredToppings.map((topping) => {
                const isChecked = selectedExtraToppings.includes(topping.id);
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all duration-200 active:scale-95 ${
                      isChecked
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="truncate">{topping.name}</span>
                    </div>
                    <span className={`text-[11px] font-extrabold ml-1 flex-shrink-0 ${isChecked ? 'text-emerald-400' : 'text-amber-400'}`}>
                      +${topping.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300 block">
              Instrucciones Especiales para la Cocina
            </label>
            <input
              type="text"
              placeholder="Ej: Masa bien cocida, cortar en 8 rebanadas, sin cebolla..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-orange-500"
            />
          </div>

        </div>

        {/* Modal Footer with Real-Time Total & Add Button */}
        <div className="p-4 sm:p-5 bg-[#141210] border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          
          {/* Quantity selector */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-2xl border border-stone-800">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-sm w-6 text-center text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price breakdown pill for small mobile */}
            <div className="sm:hidden text-right">
              <span className="text-[10px] text-stone-400 block">Total x{quantity}</span>
              <span className="text-xl font-black text-amber-400">${totalPrice}</span>
            </div>
          </div>

          {/* Price & Add Button */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
            <div className="hidden sm:block text-right">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                <span>P/U: ${unitPrice}</span>
                {totalIncrementalCost > 0 && (
                  <span className="text-emerald-400 font-bold">(+${totalIncrementalCost} extras)</span>
                )}
              </div>
              <span className="text-2xl font-black text-amber-400 block leading-none mt-0.5">
                ${totalPrice}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={isAdding}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Agregando al Carrito...</span>
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4 text-amber-300" />
                  <span>Agregar al Carrito (${totalPrice})</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

