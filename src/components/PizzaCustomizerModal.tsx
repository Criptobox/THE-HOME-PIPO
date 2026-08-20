import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus, Flame, Check, AlertCircle, Loader2, Sparkles, Tag, TrendingUp, Trash2, Info, Layers, FlameKindling, CheckCircle2, XCircle } from 'lucide-react';
import { MenuItem, PizzaSize, CrustType, CartItem, Topping, PizzaDoneness } from '../types';
import { PIZZA_SIZES, CRUST_OPTIONS, TOPPINGS } from '../data/menu';

interface PizzaCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  toppings?: Topping[];
}

export const DONENESS_OPTIONS: Array<{
  id: PizzaDoneness;
  name: string;
  badge: string;
  description: string;
  crustFinish: string;
  iconColor: string;
}> = [
  {
    id: 'poco_hecha',
    name: 'Poco Hecha',
    badge: 'Tierna & Suave',
    description: 'Queso perfectamente fundido y elástico, masa blanca y esponjosa sin puntos oscuros.',
    crustFinish: 'Cocción suave sobre piedra',
    iconColor: 'text-amber-400',
  },
  {
    id: 'normal',
    name: 'Normal (Recomendada del Pizzero)',
    badge: 'Punto Clásico PIPO',
    description: 'Borde dorado con ligeros alveolos tostados, queso con burbujas bronceadas y base crujiente.',
    crustFinish: 'Equilibrio perfecto a 450°C',
    iconColor: 'text-orange-500',
  },
  {
    id: 'muy_dorada',
    name: 'Muy Dorada (Bien Tostada)',
    badge: 'Extra Crujiente',
    description: 'Orilla bien tostada con motas ahumadas estilo piedra volcánica, queso gratinado intenso.',
    crustFinish: 'Toque ahumado volcánico',
    iconColor: 'text-red-500',
  },
];

export const PizzaCustomizerModal: React.FC<PizzaCustomizerModalProps> = ({
  item,
  onClose,
  onAddToCart,
  toppings,
}) => {
  if (!item) return null;

  const allToppings = toppings && toppings.length > 0 ? toppings : TOPPINGS;
  const availableToppings = allToppings.filter((t) => t.available !== false);

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('unica');
  const [selectedCrust, setSelectedCrust] = useState<CrustType>('tradicional');
  const [selectedDoneness, setSelectedDoneness] = useState<PizzaDoneness>('normal');
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [selectedExtraToppings, setSelectedExtraToppings] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [activeCategory, setActiveCategory] = useState<'todos' | 'carne' | 'marina' | 'vegetal' | 'queso'>('todos');
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const sizeOption = PIZZA_SIZES.find((s) => s.id === selectedSize) || PIZZA_SIZES[0];
  const crustOption = CRUST_OPTIONS.find((c) => c.id === selectedCrust) || CRUST_OPTIONS[0];
  const donenessOption = DONENESS_OPTIONS.find((d) => d.id === selectedDoneness) || DONENESS_OPTIONS[1];

  // Price Calculation
  const basePriceForSize = Math.round(item.basePrice * sizeOption.priceMultiplier);
  const extraToppingsCost = selectedExtraToppings.reduce((acc, id) => {
    const topping = allToppings.find((t) => t.id === id);
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

  const toggleExcludedIngredient = (ingredientName: string) => {
    if (excludedIngredients.includes(ingredientName)) {
      setExcludedIngredients(excludedIngredients.filter((name) => name !== ingredientName));
    } else {
      setExcludedIngredients([...excludedIngredients, ingredientName]);
    }
  };

  const resetExcludedIngredients = () => {
    setExcludedIngredients([]);
  };

  const filteredToppings = activeCategory === 'todos'
    ? availableToppings
    : availableToppings.filter((t) => t.category === activeCategory);

  const handleAdd = () => {
    const extraToppingNames = selectedExtraToppings
      .map((id) => allToppings.find((t) => t.id === id)?.name)
      .filter(Boolean);

    const detailsParts = [
      `Tamaño: ${sizeOption.name} (${sizeOption.slices} rebanadas)`,
      `Masa: ${crustOption.name}`,
      `Cocción: ${donenessOption.name.split(' (')[0]}`,
    ];

    if (excludedIngredients.length > 0) {
      detailsParts.push(`🚫 SIN: ${excludedIngredients.join(', ')}`);
    }

    if (extraToppingNames.length > 0) {
      detailsParts.push(`➕ EXTRAS: ${extraToppingNames.join(', ')}`);
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
        doneness: selectedDoneness,
        excludedIngredients: excludedIngredients.length > 0 ? excludedIngredients : undefined,
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        className="bg-white dark:bg-[#181614] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-stone-900/20 dark:shadow-red-950/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with circular volcanic stone pizza display and title */}
        <div className="relative bg-gradient-to-b from-stone-900 via-[#1c1917] to-stone-950 p-6 border-b border-stone-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white rounded-full transition-colors border border-stone-700 z-20 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Circular Pizza Showcase on Volcanic Stone Base */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-2 bg-gradient-to-br from-amber-600 via-orange-500 to-stone-800 shadow-2xl ring-4 ring-stone-800/80 flex items-center justify-center relative group">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-stone-800 bg-stone-950 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110 hover:rotate-6"
                  />
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/30 pointer-events-none" />
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-stone-950 text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/50 shadow whitespace-nowrap">
                30 cm Artesanal
              </div>
            </div>

            {/* Pizza Info & Live Pricing */}
            <div className="flex-1 text-center sm:text-left space-y-1.5 pt-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-600/60 shadow-xs flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500 inline" /> Horno a 450°C
                </span>
                {item.popular && (
                  <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 fill-stone-950" /> POPULAR
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-serif text-white leading-tight">
                {item.name}
              </h2>

              <p className="text-stone-300 text-xs line-clamp-2 max-w-md">
                {item.description}
              </p>
            </div>

            {/* Quick Live Cost Card */}
            <div className="hidden md:flex flex-col items-end justify-center bg-stone-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30 text-right shadow-lg">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Precio Unitario</span>
              <span className="text-2xl font-black text-amber-400">${unitPrice}</span>
              <span className="text-[10px] text-stone-400 font-medium">MXN por pizza</span>
            </div>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Item description */}
          <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
            {item.description}
          </p>

          {/* Ingredients list & EXCLUDE/REMOVE INGREDIENTS SECTION */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-stone-100/80 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-stone-900 dark:text-white uppercase tracking-wide">
                  Ingredientes Base de la Receta
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                  (Toca para quitar)
                </span>
              </div>

              {excludedIngredients.length > 0 && (
                <button
                  type="button"
                  onClick={resetExcludedIngredients}
                  className="text-[11px] text-orange-600 dark:text-orange-400 font-bold hover:underline self-start sm:self-auto cursor-pointer"
                >
                  Restaurar todos
                </button>
              )}
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
              ¿No deseas algún ingrediente en tu pizza (ej. cebolla, chile o piña)? Selecciónalo para indicarle a la cocina que lo prepare <strong className="text-stone-700 dark:text-stone-200">SIN</strong> ese ingrediente.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {item.ingredients.map((ing, i) => {
                const isExcluded = excludedIngredients.includes(ing);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleExcludedIngredient(ing)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                      isExcluded
                        ? 'bg-red-100 dark:bg-red-950/80 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-300 line-through ring-1 ring-red-400/50'
                        : 'bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-orange-400 dark:hover:border-orange-500'
                    }`}
                    title={isExcluded ? `Haz clic para volver a incluir ${ing}` : `Haz clic para quitar ${ing}`}
                  >
                    {isExcluded ? (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    )}
                    <span>{isExcluded ? `SIN ${ing}` : ing}</span>
                  </button>
                );
              })}
            </div>

            {excludedIngredients.length > 0 && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-[11px] text-red-800 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>
                  <strong>Aviso para la cocina:</strong> Se preparará la pizza sin: <span className="font-bold underline">{excludedIngredients.join(', ')}</span>.
                </span>
              </div>
            )}
          </div>

          {/* REAL-TIME INCREMENTAL COST BAR SECTION */}
          <div className="bg-gradient-to-b from-amber-50/80 to-orange-50/80 dark:from-[#1E1B18] dark:to-[#161412] p-4 sm:p-5 rounded-2xl border border-amber-300 dark:border-amber-500/30 space-y-3.5 shadow-sm dark:shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <h3 className="text-xs font-extrabold text-stone-900 dark:text-white uppercase tracking-wider">
                  Costo Incremental en Tiempo Real
                </h3>
              </div>

              {totalIncrementalCost > 0 ? (
                <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700/60 animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>+${totalIncrementalCost} en extras</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-900 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-800">
                  Precio Base Sin Extras
                </span>
              )}
            </div>

            {/* Stacked Proportional Cost Bar */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-full bg-stone-200 dark:bg-stone-900 rounded-full overflow-hidden flex p-0.5 border border-stone-300 dark:border-stone-800 shadow-inner">
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
                <div className="bg-white dark:bg-stone-900/90 p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-center shadow-xs">
                  <span className="text-stone-500 dark:text-stone-400 block text-[10px]">1. Base ({sizeOption.name})</span>
                  <span className="font-extrabold text-stone-900 dark:text-white">${basePriceForSize}</span>
                </div>

                <div className={`p-2 rounded-xl border text-center ${crustExtraCost > 0 ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-300' : 'bg-white dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'}`}>
                  <span className="block text-[10px]">2. Masa / Orilla</span>
                  <span className="font-extrabold">
                    {crustExtraCost > 0 ? `+$${crustExtraCost}` : 'Incluido'}
                  </span>
                </div>

                <div className={`p-2 rounded-xl border text-center ${extraToppingsCost > 0 ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300' : 'bg-white dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'}`}>
                  <span className="block text-[10px]">3. Extras ({selectedExtraToppings.length})</span>
                  <span className="font-extrabold">
                    {extraToppingsCost > 0 ? `+$${extraToppingsCost}` : '$0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Extra Badges */}
            {selectedExtraToppings.length > 0 && (
              <div className="pt-2 border-t border-amber-200 dark:border-stone-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    Extras Seleccionados ({selectedExtraToppings.length}):
                  </span>
                  <button
                    onClick={clearExtraToppings}
                    className="text-[10px] text-red-600 dark:text-red-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpiar Extras</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedExtraToppings.map((id) => {
                    const top = allToppings.find((t) => t.id === id);
                    if (!top) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-300 px-2.5 py-1 rounded-xl text-xs font-extrabold animate-fadeIn"
                      >
                        <span>{top.name}</span>
                        <span className="text-emerald-700 dark:text-emerald-400">(+${top.price})</span>
                        <button
                          onClick={() => toggleTopping(id)}
                          className="hover:text-red-600 p-0.5 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
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
            <label className="text-xs font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wide flex items-center justify-between">
              <span>1. Medida de la Pizza</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px] bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">Medida Única Artesanal</span>
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {PIZZA_SIZES.map((size) => {
                const isSelected = selectedSize === size.id;
                const calcPrice = Math.round(item.basePrice * size.priceMultiplier);
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
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">Precio Base</span>
                      <span className="text-base font-black text-amber-700 dark:text-amber-300">
                        ${calcPrice} MXN
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Crust Selection */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wide flex items-center justify-between">
              <span>2. Selecciona la Masa</span>
              <span className="text-stone-500 dark:text-stone-400 normal-case font-normal text-[11px]">Estirado artesanal</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CRUST_OPTIONS.map((crust) => {
                const isSelected = selectedCrust === crust.id;
                return (
                  <button
                    key={crust.id}
                    onClick={() => setSelectedCrust(crust.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-red-600 to-orange-600 dark:from-red-950/80 dark:to-orange-950/80 border-red-600 dark:border-orange-500 text-white shadow-md ring-1 ring-orange-500/40'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                        {crust.name}
                      </span>
                      <span className={`text-xs font-black ${isSelected ? 'text-amber-200' : crust.extraCost > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-stone-500 dark:text-stone-400'}`}>
                        {crust.extraCost > 0 ? `+$${crust.extraCost}` : 'Incluido'}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 ${isSelected ? 'text-orange-100 dark:text-stone-300' : 'text-stone-500 dark:text-stone-400'}`}>
                      {crust.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cooking Doneness Selector - Volcanic Stone Oven */}
          <div className="space-y-3 p-4 sm:p-4.5 rounded-2xl bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-transparent dark:from-stone-900/90 dark:via-[#1a1715] dark:to-transparent border border-orange-200 dark:border-orange-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <label className="text-xs font-extrabold text-orange-900 dark:text-orange-400 uppercase tracking-wide flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>3. Punto de Cocción (Horno de Piedra Volcánica a 450°C)</span>
              </label>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                Sabor artesanal al punto
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DONENESS_OPTIONS.map((doneness) => {
                const isSelected = selectedDoneness === doneness.id;
                return (
                  <button
                    key={doneness.id}
                    type="button"
                    onClick={() => setSelectedDoneness(doneness.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white border-orange-500 shadow-md shadow-orange-950/30 ring-2 ring-orange-500/50'
                        : 'bg-white dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-300 hover:border-orange-400/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-black/30 text-amber-200 border border-white/20'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                        }`}>
                          {doneness.badge}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-amber-200" />
                        )}
                      </div>

                      <h4 className={`text-xs sm:text-sm font-extrabold ${isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>
                        {doneness.name}
                      </h4>

                      <p className={`text-[11px] mt-1.5 leading-snug ${isSelected ? 'text-orange-100' : 'text-stone-500 dark:text-stone-400'}`}>
                        {doneness.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 flex items-center gap-1 text-[10px] font-bold">
                      <span className={isSelected ? 'text-amber-200' : 'text-orange-700 dark:text-orange-400'}>
                        🔥 {doneness.crustFinish}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra Toppings */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                4. Ingredientes Extra (+$30 MXN c/u)
              </label>

              {/* Topping Category Filter Pills */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800 text-[10px] overflow-x-auto">
                {(['todos', 'carne', 'marina', 'vegetal', 'queso'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-red-600 text-white'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredToppings.length === 0 ? (
              <div className="p-4 text-center bg-stone-100 dark:bg-stone-900/60 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800">
                <p className="text-xs font-bold text-stone-600 dark:text-stone-400">No hay ingredientes extras disponibles en esta categoría.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredToppings.map((topping) => {
                  const isChecked = selectedExtraToppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping.id)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all duration-200 active:scale-95 ${
                        isChecked
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm ring-1 ring-emerald-500/50'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="truncate">{topping.name}</span>
                      </div>
                      <span className={`text-[11px] font-extrabold ml-1 flex-shrink-0 ${isChecked ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        +${topping.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wide flex items-center justify-between">
              <span>5. Notas o Instrucciones Especiales</span>
              <span className="text-stone-500 text-[10px] font-normal lowercase">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Masa bien tostada sobre la piedra, cortar en 8 rebanadas, sin orégano..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-2xl px-4 py-3 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

        </div>

        {/* Modal Footer with Real-Time Total & Add Button */}
        <div className="p-4 sm:p-5 bg-stone-100 dark:bg-[#141210] border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          
          {/* Quantity selector */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-stone-950 px-3 py-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-sm w-6 text-center text-stone-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price breakdown pill for small mobile */}
            <div className="sm:hidden text-right">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block">Total x{quantity}</span>
              <span className="text-xl font-black text-amber-700 dark:text-amber-400">${totalPrice}</span>
            </div>
          </div>

          {/* Price & Add Button */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
            <div className="hidden sm:block text-right">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                <span>P/U: ${unitPrice}</span>
                {totalIncrementalCost > 0 && (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">(+${totalIncrementalCost} extras)</span>
                )}
              </div>
              <span className="text-2xl font-black text-amber-700 dark:text-amber-400 block leading-none mt-0.5">
                ${totalPrice}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={isAdding}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 text-amber-200 animate-spin" />
                  <span>Agregando al Carrito...</span>
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4 text-amber-200" />
                  <span>Agregar al Carrito (${totalPrice})</span>
                </>
              )}
            </button>
          </div>

        </div>

      </motion.div>
    </motion.div>
  );
};

