import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Flame, Leaf, Star, Plus, SlidersHorizontal, Eye, Check, Loader2, Sparkles } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface MenuSectionProps {
  onSelectItemForCustomization: (item: MenuItem) => void;
  onQuickAddToCart: (cartItem: CartItem) => void;
  items?: MenuItem[];
  isLoading?: boolean;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectItemForCustomization,
  onQuickAddToCart,
  items,
  isLoading = false,
}) => {
  const currentMenuItems = items || MENU_ITEMS;
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);
  const [filterPopular, setFilterPopular] = useState(false);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const categories = [
    { id: 'todos', label: 'Todo el Menú' },
    { id: 'carnes', label: 'Carnes 🥩' },
    { id: 'marina', label: 'Marina 🦐' },
    { id: 'carne_fria', label: 'Carne Fría 🍕' },
    { id: 'quesos', label: 'Quesos 🧀' },
    { id: 'vegetales', label: 'Vegetales 🍃' },
    { id: 'adicionales_bebidas', label: 'Adicionales & Bebidas 🥤' },
  ];

  const filteredItems = currentMenuItems.filter((item) => {
    // Category match
    if (activeCategory !== 'todos') {
      if (item.category !== activeCategory) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchIng = item.ingredients.some((ing) => ing.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchIng) return false;
    }

    // Filters
    if (filterVegetarian && !item.vegetarian) return false;
    if (filterSpicy && !item.spicy) return false;
    if (filterPopular && !item.popular) return false;

    return true;
  });

  const handleItemClick = (item: MenuItem) => {
    // Pop animation trigger
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId(null);
    }, 1200);

    if (item.customizable) {
      onSelectItemForCustomization(item);
    } else {
      // Direct add for simple non-customizable items
      const cartItem: CartItem = {
        cartItemId: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        menuItem: item,
        title: item.name,
        detailsText: item.description,
        unitPrice: item.basePrice,
        quantity: 1,
      };
      onQuickAddToCart(cartItem);
    }
  };

  return (
    <section id="menu" className="py-16 bg-[#FAF8F5] dark:bg-[#0F0E0D] text-stone-900 dark:text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800/60 text-red-700 dark:text-orange-400 text-xs font-bold tracking-wider uppercase">
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600 dark:text-amber-400" />
                <span>Sincronizando Menú Artesanal...</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5" />
                <span>Menú Completo Pipo</span>
              </>
            )}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-stone-900 dark:text-white">
            Nuestras Pizzas Artesanales
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base">
            Masa fresca estirada a mano, horneadas sobre <strong>piedra volcánica</strong> en horno de gas. Medida única artesanal (30 cm - 8 rebanadas).
          </p>
        </div>

        {/* Controls: Search + Categories + Filter Toggles */}
        <div className="space-y-6 mb-10">
          
          {/* Search bar & Filter Pills */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-500 dark:text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar pizza, ingrediente o combo..."
                value={searchQuery}
                disabled={isLoading}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-orange-500 shadow-sm disabled:opacity-60"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
              <button
                onClick={() => setFilterPopular(!filterPopular)}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors disabled:opacity-60 ${
                  filterPopular
                    ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-400 text-amber-900 dark:text-amber-300 font-bold'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Más Populares</span>
              </button>

              <button
                onClick={() => setFilterVegetarian(!filterVegetarian)}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors disabled:opacity-60 ${
                  filterVegetarian
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-400 text-emerald-900 dark:text-emerald-300 font-bold'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>Vegetarianas</span>
              </button>

              <button
                onClick={() => setFilterSpicy(!filterSpicy)}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors disabled:opacity-60 ${
                  filterSpicy
                    ? 'bg-red-100 dark:bg-red-500/20 border-red-300 dark:border-red-400 text-red-900 dark:text-red-300 font-bold'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Picantes 🌶️</span>
              </button>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                disabled={isLoading}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 disabled:opacity-60 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-950/30'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Menu Grid / Skeleton Screen */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={sk}
                className="bg-white dark:bg-[#181614] rounded-3xl border border-stone-200 dark:border-stone-800/80 overflow-hidden shadow-md flex flex-col justify-between shimmer-mask"
              >
                {/* Skeleton Image Area */}
                <div className="relative h-48 bg-stone-200 dark:bg-stone-800/60 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-stone-300 dark:bg-stone-700/50 flex items-center justify-center text-stone-400 dark:text-stone-600">
                    <Flame className="w-6 h-6 animate-pulse" />
                  </div>
                  {/* Skeleton Badge */}
                  <div className="absolute top-3 left-3 w-20 h-5 bg-stone-300 dark:bg-stone-700 rounded-md" />
                  {/* Skeleton Price */}
                  <div className="absolute bottom-3 right-3 w-24 h-7 bg-stone-300 dark:bg-stone-700 rounded-xl" />
                </div>

                {/* Skeleton Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Title placeholder */}
                    <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-lg w-3/4" />
                    {/* Description lines */}
                    <div className="space-y-1.5">
                      <div className="h-3 bg-stone-200 dark:bg-stone-800/80 rounded-md w-full" />
                      <div className="h-3 bg-stone-200 dark:bg-stone-800/80 rounded-md w-5/6" />
                    </div>
                  </div>

                  {/* Ingredients chips skeleton */}
                  <div className="flex gap-1.5 pt-1">
                    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-16" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-20" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-14" />
                  </div>

                  {/* Button skeleton */}
                  <div className="pt-2">
                    <div className="h-11 bg-stone-200 dark:bg-stone-800 rounded-2xl w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="text-center py-16 bg-white dark:bg-stone-900/50 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm"
          >
            <p className="text-stone-600 dark:text-stone-400 text-sm">No encontramos platillos con los filtros seleccionados.</p>
            <button
              onClick={() => {
                setActiveCategory('todos');
                setSearchQuery('');
                setFilterPopular(false);
                setFilterSpicy(false);
                setFilterVegetarian(false);
              }}
              className="mt-3 text-xs text-orange-600 dark:text-amber-400 font-bold underline"
            >
              Limpiar filtros
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="bg-white dark:bg-[#181614] rounded-3xl border border-stone-200 dark:border-stone-800/80 overflow-hidden shadow-md dark:shadow-xl hover:border-orange-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image Header / Circular Volcanic Stone Base */}
                  <div className="relative pt-6 pb-3 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-stone-100 via-stone-50 to-transparent dark:from-stone-900/80 dark:via-stone-900/40 dark:to-transparent">
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      {item.popular && (
                        <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                          <Star className="w-3 h-3 fill-stone-950" /> POPULAR
                        </span>
                      )}
                      {item.spicy && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          PICANTE 🌶️
                        </span>
                      )}
                      {item.vegetarian && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          VEGGIE 🍃
                        </span>
                      )}
                    </div>

                    {/* Circular Pizza Container with Decorative Stone Border (Optimized diameter to fill width) */}
                    <div className="relative w-52 h-52 sm:w-56 sm:h-56 md:w-60 md:h-60 max-w-[85%] aspect-square rounded-full p-2 bg-gradient-to-br from-amber-600 via-orange-500 to-stone-800 shadow-xl dark:shadow-2xl dark:shadow-orange-950/50 ring-4 ring-stone-900/10 dark:ring-stone-800/80 flex items-center justify-center">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-stone-800 dark:border-stone-700 bg-stone-950 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-108 group-hover:rotate-6 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/30 pointer-events-none" />
                      </div>
                    </div>

                    {/* Base Price Tag */}
                    <div className="mt-3.5 bg-stone-900/95 text-amber-300 dark:bg-stone-950 dark:text-amber-400 px-4 py-1 rounded-full border border-amber-500/40 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5">
                      <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">30 cm</span>
                      <span className="text-amber-400 font-extrabold">${item.basePrice} MXN</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-black font-serif text-stone-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-stone-600 dark:text-stone-300 text-xs mt-1.5 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Ingredients tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.ingredients.map((ing, i) => (
                        <span key={i} className="text-[10px] bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-400 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-800">
                          {ing}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleItemClick(item)}
                        className={`w-full py-3 font-extrabold text-xs rounded-2xl border shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                          addedItemId === item.id
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 scale-105 shadow-emerald-950/60 ring-2 ring-emerald-400/50'
                            : 'bg-stone-100 hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-600 text-stone-800 hover:text-white border-stone-300 hover:border-orange-400/40 dark:bg-stone-900 dark:text-stone-200 dark:border-stone-800'
                        }`}
                      >
                        {addedItemId === item.id ? (
                          <>
                            <Check className="w-4 h-4 text-white animate-bounce" />
                            <span className="text-white">¡Agregado al Carrito! 🍕</span>
                          </>
                        ) : item.customizable ? (
                          <>
                            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <span>Personalizar & Pedir</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <span>Agregar al Carrito (${item.basePrice})</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
};
