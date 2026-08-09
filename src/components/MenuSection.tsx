import React, { useState } from 'react';
import { Search, Flame, Leaf, Star, Plus, SlidersHorizontal, Eye, Check } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface MenuSectionProps {
  onSelectItemForCustomization: (item: MenuItem) => void;
  onQuickAddToCart: (cartItem: CartItem) => void;
  items?: MenuItem[];
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectItemForCustomization,
  onQuickAddToCart,
  items,
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
    { id: 'especiales', label: 'Especiales Pipo 🌟' },
    { id: 'clasicas', label: 'Clásicas 🍕' },
    { id: 'entradas', label: 'Alitas & Nudos 🍗' },
    { id: 'combos', label: 'Combos 🎁' },
    { id: 'postres', label: 'Bebidas & Postres 🥤' },
  ];

  const filteredItems = currentMenuItems.filter((item) => {
    // Category match
    if (activeCategory !== 'todos') {
      if (activeCategory === 'postres') {
        if (item.category !== 'postres' && item.category !== 'bebidas') return false;
      } else if (item.category !== activeCategory) {
        return false;
      }
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
    <section id="menu" className="py-16 bg-[#0F0E0D] text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-orange-400 text-xs font-bold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5" /> Menú Completo Pipo
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white">
            Nuestras Delicias Horneadas
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            Insumos 100% frescos, masa madre de lenta fermentación y cocción tradicional a leña.
          </p>
        </div>

        {/* Controls: Search + Categories + Filter Toggles */}
        <div className="space-y-6 mb-10">
          
          {/* Search bar & Filter Pills */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar pizza, ingrediente o combo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
              <button
                onClick={() => setFilterPopular(!filterPopular)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  filterPopular
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Más Populares</span>
              </button>

              <button
                onClick={() => setFilterVegetarian(!filterVegetarian)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  filterVegetarian
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>Vegetarianas</span>
              </button>

              <button
                onClick={() => setFilterSpicy(!filterSpicy)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  filterSpicy
                    ? 'bg-red-500/20 border-red-400 text-red-300'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Picantes 🌶️</span>
              </button>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-950/50'
                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/50 rounded-3xl border border-stone-800">
            <p className="text-stone-400 text-sm">No encontramos platillos con los filtros seleccionados.</p>
            <button
              onClick={() => {
                setActiveCategory('todos');
                setSearchQuery('');
                setFilterPopular(false);
                setFilterSpicy(false);
                setFilterVegetarian(false);
              }}
              className="mt-3 text-xs text-amber-400 font-bold underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#181614] rounded-3xl border border-stone-800/80 overflow-hidden shadow-xl hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
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

                  {/* Base Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-stone-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-stone-800 text-amber-400 font-black text-sm shadow-md">
                    Desde ${item.basePrice}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-black font-serif text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-stone-300 text-xs mt-1.5 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Ingredients tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.ingredients.map((ing, i) => (
                      <span key={i} className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded border border-stone-800">
                        {ing}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`w-full py-3 font-extrabold text-xs rounded-2xl border shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                        addedItemId === item.id
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 scale-105 shadow-emerald-950/60 ring-2 ring-emerald-400/50'
                          : 'bg-stone-900 hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-600 text-stone-200 hover:text-white border-stone-800 hover:border-orange-400/40'
                      }`}
                    >
                      {addedItemId === item.id ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-bounce" />
                          <span className="text-white">¡Agregado al Carrito! 🍕</span>
                        </>
                      ) : item.customizable ? (
                        <>
                          <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
                          <span>Personalizar & Pedir</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-orange-400" />
                          <span>Agregar al Carrito (${item.basePrice})</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
