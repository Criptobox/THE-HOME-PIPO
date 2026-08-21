import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Image, RefreshCw, CheckCircle, Flame, Gift, Bike, Store, Shield, Sparkles, Upload, Lock, Eye, EyeOff, Key, CheckSquare, Square, Check, Layers, Tag, Search, ToggleLeft, ToggleRight, AlertCircle, Filter, Download, Github, Bell, Send, Megaphone } from 'lucide-react';
import { MenuItem, PromoCode, Topping } from '../types';
import { TOPPINGS } from '../data/menu';
import { notifyPromo, notifyCustomAnnouncement, requestNotificationPermission } from '../utils/notifications';

export interface StoreInfo {
  phone: string;
  address: string;
  hours: string;
  tickerMessage: string;
  ovenStatus: string;
}

export interface DeliveryZone {
  name: string;
  fee: number;
  estimatedTime: string;
  available: boolean;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onSaveMenuItems: (items: MenuItem[]) => void;
  toppings?: Topping[];
  onSaveToppings?: (toppings: Topping[]) => void;
  promoCodes: PromoCode[];
  onSavePromoCodes: (promos: PromoCode[]) => void;
  deliveryZones: DeliveryZone[];
  onSaveDeliveryZones: (zones: DeliveryZone[]) => void;
  storeInfo: StoreInfo;
  onSaveStoreInfo: (info: StoreInfo) => void;
  onResetAllData: () => void;
}

const PRESET_IMAGES = [
  { name: 'Pizza Suprema / Especial', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pizza Pepperoni', url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pizza Margherita', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pizza Quesos Gourmet', url: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pizza Hawaiana', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pizza BBQ / Carne', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pizza Picante / Diabla', url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Alitas & Boneless', url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Nudos de Ajo / Entradas', url: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Postre / Calzone Nutella', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' },
  { name: 'Refresco / Bebida', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80' },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onSaveMenuItems,
  toppings,
  onSaveToppings,
  promoCodes,
  onSavePromoCodes,
  deliveryZones,
  onSaveDeliveryZones,
  storeInfo,
  onSaveStoreInfo,
  onResetAllData,
}) => {
  if (!isOpen) return null;

  // Password Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('pipo_admin_password') || 'pipo2026';
  });

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput.trim() === adminPassword || passwordInput.trim() === 'pipo2026') {
      setIsAuthenticated(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const [activeTab, setActiveTab] = useState<'menu' | 'toppings' | 'promos' | 'store' | 'export'>('menu');

  // Local copies for editing
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(JSON.parse(JSON.stringify(menuItems)));
  const [localToppings, setLocalToppings] = useState<Topping[]>(() => {
    return toppings && toppings.length > 0
      ? JSON.parse(JSON.stringify(toppings))
      : JSON.parse(JSON.stringify(TOPPINGS));
  });
  const [localPromos, setLocalPromos] = useState<PromoCode[]>(JSON.parse(JSON.stringify(promoCodes)));
  const [localZones, setLocalZones] = useState<DeliveryZone[]>(JSON.parse(JSON.stringify(deliveryZones)));
  const [localStoreInfo, setLocalStoreInfo] = useState<StoreInfo>({ ...storeInfo });

  const [toppingsSearch, setToppingsSearch] = useState('');
  const [toppingsCategoryFilter, setToppingsCategoryFilter] = useState<'todos' | 'carne' | 'marina' | 'vegetal' | 'queso'>('todos');

  const [menuSearch, setMenuSearch] = useState('');
  const [menuAvailabilityFilter, setMenuAvailabilityFilter] = useState<'todos' | 'disponibles' | 'agotados'>('todos');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('todos');
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  // If password not verified, render challenge screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
        <div className="relative w-full max-w-md bg-[#161412] border border-orange-500/30 rounded-3xl text-stone-100 shadow-2xl p-6 sm:p-8 space-y-6">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-stone-900 border border-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-xl border border-orange-400/40">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black font-serif text-white">Panel de Administración</h3>
            <p className="text-xs text-stone-400">
              Ingresa la contraseña de administrador para gestionar menú, precios, promociones e información de THE HOME PIPO 🍕.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wide">Contraseña Administrador</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Ingresa tu clave..."
                  autoFocus
                  className={`w-full bg-stone-950 border ${
                    passwordError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-stone-800 focus:border-orange-500'
                  } rounded-xl px-4 py-3 text-sm text-white focus:outline-none pr-11 font-mono`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-xs text-red-400 font-bold flex items-center gap-1 mt-1">
                  ⚠️ Contraseña incorrecta. Intenta de nuevo.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Ingresar al Panel</span>
            </button>
          </form>

          <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800/80 text-center space-y-2">
            <p className="text-[11px] font-bold text-amber-300">
              🔑 Contraseña predeterminada: <span className="font-mono bg-stone-950 px-2 py-0.5 rounded text-white border border-stone-800">pipo2026</span>
            </p>
            <div className="pt-2 border-t border-stone-800/80 flex flex-col gap-2">
              <a
                href="/api/download-zip"
                download="THE-HOME-PIPO-fuente.zip"
                className="w-full py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-black text-xs rounded-xl border border-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Código Fuente ZIP Directo</span>
              </a>
              <a
                href="/api/download-web-zip"
                download="THE-HOME-PIPO-WEB-LISTA.zip"
                className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded-xl border border-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Web Compilada (GitHub Pages)</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAll = () => {
    onSaveMenuItems(localMenuItems);
    if (onSaveToppings) {
      onSaveToppings(localToppings);
    }
    onSavePromoCodes(localPromos);
    onSaveDeliveryZones(localZones);
    onSaveStoreInfo(localStoreInfo);
    showToast('¡Todos los cambios y agregos han sido guardados correctamente!');
  };

  // Menu Handlers
  const handleUpdateMenuItem = (index: number, field: keyof MenuItem, value: any) => {
    const copy = [...localMenuItems];
    copy[index] = { ...copy[index], [field]: value };
    setLocalMenuItems(copy);
  };

  // Image Processing & Compression Helper
  const compressAndConvertImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return reject(new Error('El archivo seleccionado debe ser una imagen válida (JPG, PNG, WEBP, etc.)'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(reader.result as string);
          }
        };
        img.onerror = () => resolve(reader.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileUpload = async (index: number, file: File) => {
    if (!file) return;
    try {
      showToast('📸 Optimizando y cargando foto...');
      const dataUrl = await compressAndConvertImage(file);
      handleUpdateMenuItem(index, 'image', dataUrl);
      showToast('¡Foto del producto cargada con éxito!');
    } catch (err: any) {
      alert(err.message || 'Error al procesar la imagen');
    }
  };

  const handleAddIngredient = (itemIdx: number, newIng: string) => {
    if (!newIng.trim()) return;
    const copy = [...localMenuItems];
    copy[itemIdx].ingredients = [...copy[itemIdx].ingredients, newIng.trim()];
    setLocalMenuItems(copy);
  };

  const handleRemoveIngredient = (itemIdx: number, ingIdx: number) => {
    const copy = [...localMenuItems];
    copy[itemIdx].ingredients = copy[itemIdx].ingredients.filter((_, i) => i !== ingIdx);
    setLocalMenuItems(copy);
  };

  const handleAddNewMenuItem = () => {
    const newItem: MenuItem = {
      id: `custom_pizza_${Date.now()}`,
      name: 'Nueva Pizza / Platillo Pipo',
      category: 'especiales',
      description: 'Masa artesanal horneada sobre piedra volcánica en horno de gas.',
      basePrice: 150,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      popular: true,
      ingredients: ['Queso Mozzarella', 'Salsa Pomodoro'],
      customizable: true,
    };
    setLocalMenuItems([newItem, ...localMenuItems]);
    setEditingItemIndex(0);
    showToast('Nuevo platillo agregado al inicio de la lista.');
  };

  const handleDeleteMenuItem = (index: number) => {
    if (confirm('¿Estás seguro de eliminar este platillo del menú?')) {
      const copy = localMenuItems.filter((_, i) => i !== index);
      setLocalMenuItems(copy);
      showToast('Platillo eliminado.');
    }
  };

  // Promo Handlers
  const handleAddPromo = () => {
    const newPromo: PromoCode = {
      code: `PIPO${Math.floor(10 + Math.random() * 90)}`,
      discountPercent: 15,
      description: 'Descuento especial activado por el Administrador',
      minSpend: 200,
    };
    setLocalPromos([...localPromos, newPromo]);
  };

  const handleDeletePromo = (index: number) => {
    setLocalPromos(localPromos.filter((_, i) => i !== index));
  };

  // Zone Handlers
  const handleAddZone = () => {
    const newZone: DeliveryZone = {
      name: 'Nueva Colonia / Zona',
      fee: 25,
      estimatedTime: '30-40 min',
      available: true,
    };
    setLocalZones([...localZones, newZone]);
  };

  const handleDeleteZone = (index: number) => {
    setLocalZones(localZones.filter((_, i) => i !== index));
  };

  // Topping Handlers
  const handleToggleAllToppings = (selectAll: boolean) => {
    setLocalToppings((prev) => prev.map((t) => ({ ...t, available: selectAll })));
    showToast(
      selectAll
        ? '✅ Todos los agregos e ingredientes han sido MARCADOS como disponibles.'
        : '⚠️ Todos los agregos e ingredientes han sido DESMARCADOS (los clientes no los verán).'
    );
  };

  const handleToggleCategoryToppings = (category: string, selectAll: boolean) => {
    setLocalToppings((prev) =>
      prev.map((t) => (t.category === category ? { ...t, available: selectAll } : t))
    );
    showToast(
      `${selectAll ? '✅ Marcados' : '⚠️ Desmarcados'} todos los agregos de categoría "${category}".`
    );
  };

  const handleToggleSingleTopping = (id: string) => {
    setLocalToppings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, available: t.available === false ? true : false } : t))
    );
  };

  const handleUpdateTopping = (id: string, field: keyof Topping, value: any) => {
    setLocalToppings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleAddCustomTopping = () => {
    const newId = `top_custom_${Date.now()}`;
    const newTopping: Topping = {
      id: newId,
      name: 'Nuevo Agrego Especial',
      price: 30,
      category: 'carne',
      color: '#e11d48',
      available: true,
    };
    setLocalToppings([newTopping, ...localToppings]);
    showToast('Nuevo agrego agregado a la lista.');
  };

  const handleDeleteTopping = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este ingrediente / agrego?')) {
      setLocalToppings((prev) => prev.filter((t) => t.id !== id));
      showToast('Agrego eliminado.');
    }
  };

  // Menu Availability Handlers
  const handleToggleMenuItemAvailability = (realIndex: number, currentAvailable: boolean) => {
    const newStatus = !currentAvailable;
    handleUpdateMenuItem(realIndex, 'available', newStatus);
    showToast(
      newStatus
        ? `✅ "${localMenuItems[realIndex].name}" marcada como DISPONIBLE en el menú.`
        : `⚠️ "${localMenuItems[realIndex].name}" marcada como NO DISPONIBLE (oculta para clientes).`
    );
  };

  const handleToggleAllMenuItems = (selectAll: boolean) => {
    setLocalMenuItems((prev) => prev.map((item) => ({ ...item, available: selectAll })));
    showToast(
      selectAll
        ? '✅ Todos los platillos y pizzas han sido MARCADOS como disponibles.'
        : '⚠️ Todos los platillos y pizzas han sido DESMARCADOS (no se mostrarán a clientes).'
    );
  };

  // Filtered menu
  const displayedMenuItems = localMenuItems.filter((item) => {
    const matchesCat = selectedCategoryFilter === 'todos' || item.category === selectedCategoryFilter;
    const matchesSearch =
      !menuSearch.trim() ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.ingredients.some((ing) => ing.toLowerCase().includes(menuSearch.toLowerCase()));
    const isAvail = item.available !== false;
    const matchesAvail =
      menuAvailabilityFilter === 'todos' ||
      (menuAvailabilityFilter === 'disponibles' && isAvail) ||
      (menuAvailabilityFilter === 'agotados' && !isAvail);

    return matchesCat && matchesSearch && matchesAvail;
  });

  const availableMenuItemsCount = localMenuItems.filter((item) => item.available !== false).length;
  const totalMenuItemsCount = localMenuItems.length;
  const isAllMenuItemsSelected = totalMenuItemsCount > 0 && availableMenuItemsCount === totalMenuItemsCount;
  const isSomeMenuItemsSelected = availableMenuItemsCount > 0 && availableMenuItemsCount < totalMenuItemsCount;

  // Filtered toppings
  const displayedToppings = localToppings.filter((topping) => {
    const matchesCat =
      toppingsCategoryFilter === 'todos' || topping.category === toppingsCategoryFilter;
    const matchesSearch =
      !toppingsSearch.trim() ||
      topping.name.toLowerCase().includes(toppingsSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const availableToppingsCount = localToppings.filter((t) => t.available !== false).length;
  const totalToppingsCount = localToppings.length;
  const isAllToppingsSelected = totalToppingsCount > 0 && availableToppingsCount === totalToppingsCount;
  const isSomeToppingsSelected = availableToppingsCount > 0 && availableToppingsCount < totalToppingsCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="relative w-full max-w-5xl bg-[#161412] border border-orange-500/30 rounded-3xl text-stone-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Admin Header Bar */}
        <div className="p-5 bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg border border-orange-400/40">
              🔓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black font-serif text-white tracking-wide">
                  Panel de Administración Pipo
                </h2>
                <span className="bg-amber-400 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Modo Editor Vivo
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Modifica platillos, fotos, precios, promociones e información en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-900 border border-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-5 py-3 bg-[#11100E] border-b border-stone-800 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <span>🍕 Platillos y Pizzas ({availableMenuItemsCount}/{totalMenuItemsCount})</span>
            {availableMenuItemsCount === totalMenuItemsCount ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            ) : availableMenuItemsCount === 0 ? (
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('toppings')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'toppings'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <span>🧅 Agregos / Ingredientes ({availableToppingsCount}/{totalToppingsCount})</span>
            {availableToppingsCount === totalToppingsCount ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            ) : availableToppingsCount === 0 ? (
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'promos'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Promociones ({localPromos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'store'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Datos de Sucursal & Local</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'export'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-emerald-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar ZIP / GitHub</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('¿Deseas restablecer todos los datos a la configuración original de fábrica?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-red-400 text-[11px] font-bold rounded-lg border border-stone-800 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resetear Fábrica</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          {/* TAB 1: MENU & PHOTOS */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              
              {/* Search, Filter & Bulk Availability Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-stone-900/90 p-4 rounded-2xl border border-stone-800">
                {/* Search Menu Input */}
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Buscar pizza o platillo..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                  />
                  {menuSearch && (
                    <button
                      onClick={() => setMenuSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Availability Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
                  <span className="text-xs text-stone-400 font-bold mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-amber-400" /> Estado:
                  </span>
                  <button
                    onClick={() => setMenuAvailabilityFilter('todos')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      menuAvailabilityFilter === 'todos'
                        ? 'bg-amber-400 text-stone-950 shadow-md'
                        : 'bg-stone-950 border border-stone-800 text-stone-300 hover:text-white'
                    }`}
                  >
                    Todos ({totalMenuItemsCount})
                  </button>
                  <button
                    onClick={() => setMenuAvailabilityFilter('disponibles')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      menuAvailabilityFilter === 'disponibles'
                        ? 'bg-emerald-500 text-stone-950 shadow-md'
                        : 'bg-stone-950 border border-stone-800 text-emerald-400 hover:bg-stone-800'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Disponibles ({availableMenuItemsCount})</span>
                  </button>
                  <button
                    onClick={() => setMenuAvailabilityFilter('agotados')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      menuAvailabilityFilter === 'agotados'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-stone-950 border border-stone-800 text-red-400 hover:bg-stone-800'
                    }`}
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Agotados / Ocultos ({totalMenuItemsCount - availableMenuItemsCount})</span>
                  </button>
                </div>

                {/* Bulk Select All / Deselect All */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleAllMenuItems(true)}
                    className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Marcar todos los platillos como disponibles"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Activar Todos</span>
                  </button>
                  <button
                    onClick={() => handleToggleAllMenuItems(false)}
                    className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Desmarcar todos los platillos (ocultar)"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Desactivar Todos</span>
                  </button>
                </div>
              </div>

              {/* Category Filter & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                  <span className="text-xs text-stone-400 font-bold mr-1">Categoría:</span>
                  {['todos', 'especiales', 'clasicas', 'entradas', 'combos', 'bebidas', 'postres'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold capitalize transition-colors ${
                        selectedCategoryFilter === cat
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAddNewMenuItem}
                  className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Platillo / Pizza</span>
                </button>
              </div>

              {/* Preset Image Gallery Bar */}
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Galería de Fotos HD Pipo:
                  </span>
                  {editingItemIndex !== null && (
                    <span className="text-[11px] text-emerald-400 font-extrabold bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
                      ✍️ Editando: {localMenuItems[editingItemIndex]?.name}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400">
                  {editingItemIndex !== null
                    ? 'Haz clic en cualquier foto de esta galería para asignarla instantáneamente al platillo que estás editando.'
                    : 'Puedes subir una foto propia desde tu computadora/celular en cada platillo o hacer clic en una foto de ejemplo para copiar su URL.'}
                </p>
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-2">
                  {PRESET_IMAGES.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 relative w-20 h-20 rounded-xl overflow-hidden border border-stone-800 group hover:border-orange-500 cursor-pointer"
                      title={img.name}
                      onClick={() => {
                        if (editingItemIndex !== null) {
                          handleUpdateMenuItem(editingItemIndex, 'image', img.url);
                          showToast(`Foto "${img.name}" asignada a "${localMenuItems[editingItemIndex].name}"`);
                        } else {
                          navigator.clipboard?.writeText(img.url);
                          showToast(`URL de "${img.name}" copiada al portapapeles.`);
                        }
                      }}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-amber-300 font-bold p-1 text-center">
                        {editingItemIndex !== null ? 'Usar foto' : 'Copiar URL'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {displayedMenuItems.map((item) => {
                  const realIndex = localMenuItems.findIndex((m) => m.id === item.id);
                  const isEditing = editingItemIndex === realIndex;

                  return (
                    <div
                      key={item.id}
                      className={`bg-stone-900/90 rounded-3xl border transition-all duration-200 overflow-hidden ${
                        isEditing
                          ? 'border-orange-500 ring-2 ring-orange-500/20'
                          : item.available === false
                          ? 'border-stone-800/60 opacity-60 hover:opacity-100 hover:border-stone-700'
                          : 'border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {/* Compact Bar / Header of Item */}
                      <div className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Image Thumbnail with Direct Hover & Tap Upload Overlay */}
                          <div className="relative group/img flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-2xl object-cover border border-stone-800"
                            />
                            <label className="absolute inset-0 bg-black/75 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center cursor-pointer text-white p-1">
                              <Upload className="w-5 h-5 text-amber-400" />
                              <span className="text-[9px] font-bold text-amber-300">Cambiar</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageFileUpload(realIndex, file);
                                }}
                              />
                            </label>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-extrabold text-white text-base truncate">{item.name}</h4>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-800/50">
                                {item.category}
                              </span>
                              <span className="text-xs font-black text-amber-400">
                                ${item.basePrice} MXN
                              </span>
                            </div>
                            <p className="text-xs text-stone-400 truncate mt-0.5">{item.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Item Availability Checkbox Quick Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleMenuItemAvailability(realIndex, item.available !== false)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                              item.available !== false
                                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600/80 hover:bg-emerald-900/90 shadow-sm'
                                : 'bg-red-950/90 text-red-300 border-red-600/80 hover:bg-red-900/90 shadow-sm'
                            }`}
                            title={item.available !== false ? 'Marcar como No Disponible (Agotado)' : 'Marcar como Disponible'}
                          >
                            {item.available !== false ? (
                              <>
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                                <span>Disponible</span>
                              </>
                            ) : (
                              <>
                                <Square className="w-4 h-4 text-red-400" />
                                <span>Agotado / Oculto</span>
                              </>
                            )}
                          </button>

                          {/* Quick Direct Upload Button right on the item card */}
                          <label className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/40 cursor-pointer flex items-center gap-1.5 transition-all shadow-sm">
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">Subir Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageFileUpload(realIndex, file);
                              }}
                            />
                          </label>

                          <button
                            onClick={() => setEditingItemIndex(isEditing ? null : realIndex)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                              isEditing
                                ? 'bg-amber-400 text-stone-950 font-black'
                                : 'bg-stone-800 text-stone-300 hover:text-white'
                            }`}
                          >
                            {isEditing ? 'Ocultar Edición' : 'Editar Detalle'}
                          </button>

                          <button
                            onClick={() => handleDeleteMenuItem(realIndex)}
                            className="p-2 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded-xl transition-colors"
                            title="Eliminar Platillo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Editing Panel */}
                      {isEditing && (
                        <div className="p-5 bg-stone-950 border-t border-stone-800/80 space-y-5 animate-fadeIn">
                          
                          {/* Dedicated Drag & Drop Image Uploader Zone */}
                          <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <label className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                                <Image className="w-4 h-4 text-orange-400" /> Cargar / Cambiar Foto del Producto
                              </label>
                              <span className="text-[10px] text-stone-400 font-medium">
                                Archivos JPG, PNG, WEBP (se comprimen automáticamente)
                              </span>
                            </div>

                            {/* Drop Zone Box */}
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const file = e.dataTransfer.files?.[0];
                                if (file) handleImageFileUpload(realIndex, file);
                              }}
                              className="border-2 border-dashed border-stone-700 hover:border-orange-500 rounded-2xl p-5 text-center bg-stone-950/80 hover:bg-stone-900/90 transition-all group relative cursor-pointer"
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageFileUpload(realIndex, file);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className="flex flex-col items-center justify-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                  <Upload className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-white">
                                    Haz clic aquí para examinar tus archivos o arrastra la foto de tu platillo
                                  </p>
                                  <p className="text-[10px] text-stone-400 mt-0.5">
                                    Formatos compatibles: JPG, PNG, WEBP, GIF. Máxima resolución optimizada automáticamente.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* URL Alternative & Actions */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                              <div className="relative flex-1">
                                <input
                                  type="text"
                                  value={item.image}
                                  onChange={(e) => handleUpdateMenuItem(realIndex, 'image', e.target.value)}
                                  placeholder="O pega una URL pública de imagen (https://...)"
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                                />
                              </div>

                              <label className="px-3 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Seleccionar Archivo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageFileUpload(realIndex, file);
                                  }}
                                />
                              </label>
                            </div>

                            {/* Preview */}
                            {item.image && (
                              <div className="flex items-center gap-3 pt-2 bg-stone-950 p-3 rounded-xl border border-stone-800">
                                <img
                                  src={item.image}
                                  alt="Vista previa"
                                  referrerPolicy="no-referrer"
                                  className="w-16 h-16 rounded-xl object-cover border border-orange-500/50 shadow-md flex-shrink-0"
                                />
                                <div className="text-xs space-y-0.5 min-w-0">
                                  <p className="font-extrabold text-emerald-400 flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" /> Foto lista y asignada
                                  </p>
                                  <p className="text-[11px] text-stone-400 truncate">
                                    {item.image.startsWith('data:') ? '📸 Imagen cargada desde archivo local' : `🌐 ${item.image}`}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-amber-400 uppercase">Nombre del Platillo</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleUpdateMenuItem(realIndex, 'name', e.target.value)}
                                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            {/* Category */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-amber-400 uppercase">Categoría</label>
                              <select
                                value={item.category}
                                onChange={(e) => handleUpdateMenuItem(realIndex, 'category', e.target.value as any)}
                                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                              >
                                <option value="especiales">Especiales Pipo</option>
                                <option value="clasicas">Clásicas</option>
                                <option value="entradas">Entradas / Alitas</option>
                                <option value="combos">Combos</option>
                                <option value="bebidas">Bebidas</option>
                                <option value="postres">Postres</option>
                              </select>
                            </div>

                            {/* Base Price */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-amber-400 uppercase">Precio Base ($ MXN)</label>
                              <input
                                type="number"
                                value={item.basePrice}
                                onChange={(e) => handleUpdateMenuItem(realIndex, 'basePrice', Number(e.target.value))}
                                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-amber-400 uppercase">Descripción</label>
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) => handleUpdateMenuItem(realIndex, 'description', e.target.value)}
                              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          {/* Badges and Toggles */}
                          <div className="flex flex-wrap items-center gap-6 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-200 bg-stone-950/80 border border-stone-800 hover:border-emerald-500/50 px-3 py-1.5 rounded-xl transition-colors">
                              <input
                                type="checkbox"
                                checked={item.available !== false}
                                onChange={(e) => handleUpdateMenuItem(realIndex, 'available', e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-500 bg-stone-900 border-stone-700 focus:ring-0"
                              />
                              <span className={item.available !== false ? 'text-emerald-400 font-extrabold' : 'text-stone-400'}>
                                {item.available !== false ? '✅ Platillo Disponible en Menú' : '❌ Platillo Agotado / Oculto'}
                              </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                              <input
                                type="checkbox"
                                checked={!!item.popular}
                                onChange={(e) => handleUpdateMenuItem(realIndex, 'popular', e.target.checked)}
                                className="w-4 h-4 rounded text-amber-500 bg-stone-900 border-stone-700 focus:ring-0"
                              />
                              <span>⭐ Destacado Popular</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                              <input
                                type="checkbox"
                                checked={!!item.spicy}
                                onChange={(e) => handleUpdateMenuItem(realIndex, 'spicy', e.target.checked)}
                                className="w-4 h-4 rounded text-red-500 bg-stone-900 border-stone-700 focus:ring-0"
                              />
                              <span>🌶️ Picante</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                              <input
                                type="checkbox"
                                checked={!!item.vegetarian}
                                onChange={(e) => handleUpdateMenuItem(realIndex, 'vegetarian', e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-500 bg-stone-900 border-stone-700 focus:ring-0"
                              />
                              <span>🍃 Vegetariana</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                              <input
                                type="checkbox"
                                checked={!!item.customizable}
                                onChange={(e) => handleUpdateMenuItem(realIndex, 'customizable', e.target.checked)}
                                className="w-4 h-4 rounded text-orange-500 bg-stone-900 border-stone-700 focus:ring-0"
                              />
                              <span>🍕 Personalizable en Modal (Masa, Tamaño)</span>
                            </label>
                          </div>

                          {/* Ingredients list editor */}
                          <div className="space-y-2 pt-2 border-t border-stone-900">
                            <label className="text-[11px] font-bold text-amber-400 uppercase">Ingredientes Principales</label>
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {item.ingredients.map((ing, ingIdx) => (
                                <span
                                  key={ingIdx}
                                  className="bg-stone-900 text-stone-300 px-2.5 py-1 rounded-lg text-xs border border-stone-800 flex items-center gap-1.5"
                                >
                                  <span>{ing}</span>
                                  <button
                                    onClick={() => handleRemoveIngredient(realIndex, ingIdx)}
                                    className="text-stone-500 hover:text-red-400 font-bold text-xs"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}

                              <input
                                type="text"
                                placeholder="+ Agregar ingrediente y Enter"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddIngredient(realIndex, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                                className="bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 w-44"
                              />
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB: AGREGOS & INGREDIENTES (TOPPINGS MANAGEMENT) */}
          {activeTab === 'toppings' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Info & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>🧅 Gestión de Agregos e Ingredientes Extra</span>
                    <span className="text-[11px] bg-amber-400 text-stone-950 font-black px-2.5 py-0.5 rounded-full">
                      {availableToppingsCount} / {totalToppingsCount} Activos
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Controla qué ingredientes pueden ver y seleccionar los clientes al armar o personalizar sus pizzas.
                  </p>
                </div>

                <button
                  onClick={handleAddCustomTopping}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Nuevo Agrego</span>
                </button>
              </div>

              {/* MASTER CHECKBOX CONTROLS CARD */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border-2 border-orange-500/40 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Master Checkbox Toggle Button */}
                  <div
                    onClick={() => handleToggleAllToppings(!isAllToppingsSelected)}
                    className="flex items-start sm:items-center gap-3.5 cursor-pointer select-none group"
                  >
                    <button
                      type="button"
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md ${
                        isAllToppingsSelected
                          ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-400/50'
                          : isSomeToppingsSelected
                          ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400/50'
                          : 'bg-stone-800 border-2 border-stone-600 text-stone-500 group-hover:border-orange-500'
                      }`}
                    >
                      {isAllToppingsSelected ? (
                        <Check className="w-5 h-5 stroke-[3]" />
                      ) : isSomeToppingsSelected ? (
                        <div className="w-3 h-1 bg-stone-950 rounded-full"></div>
                      ) : (
                        <Square className="w-4 h-4 opacity-0" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white group-hover:text-amber-300 transition-colors">
                          Marcar / Desmarcar Todos los Agregos
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            isAllToppingsSelected
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : isSomeToppingsSelected
                              ? 'bg-amber-950 text-amber-300 border border-amber-700'
                              : 'bg-red-950 text-red-300 border border-red-800'
                          }`}
                        >
                          {isAllToppingsSelected
                            ? 'TODOS MARCADOS'
                            : isSomeToppingsSelected
                            ? 'PARCIAL'
                            : 'NINGUNO MARCADO'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {availableToppingsCount} de {totalToppingsCount} agregos disponibles en el menú de clientes.
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleToggleAllToppings(true)}
                      className="px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Marcar Todos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleAllToppings(false)}
                      className="px-3.5 py-2 bg-stone-800 hover:bg-red-950/80 text-stone-300 hover:text-red-300 border border-stone-700 hover:border-red-700 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <X className="w-4 h-4 text-red-400" />
                      <span>Desmarcar Todos</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                  <span>
                    💡 <strong>Tip:</strong> Si desmarcas un agrego, los clientes no podrán elegirlo temporalmente hasta que vuelvas a marcarlo.
                  </span>
                  <span className="hidden sm:inline font-mono text-stone-500">
                    Cambios en tiempo real
                  </span>
                </div>
              </div>

              {/* SEARCH & CATEGORY FILTER BAR */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800">
                
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
                  <span className="text-xs text-stone-400 font-bold mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-stone-500" />
                    <span>Filtrar:</span>
                  </span>
                  {(['todos', 'carne', 'marina', 'vegetal', 'queso'] as const).map((cat) => {
                    const catCount = localToppings.filter((t) => cat === 'todos' || t.category === cat).length;
                    const catAvail = localToppings.filter((t) => (cat === 'todos' || t.category === cat) && t.available !== false).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setToppingsCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          toppingsCategoryFilter === cat
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                        }`}
                      >
                        <span>{cat === 'todos' ? 'Todos' : cat === 'carne' ? 'Carnes' : cat === 'marina' ? 'Mariscos' : cat === 'vegetal' ? 'Vegetales' : 'Quesos'}</span>
                        <span className="text-[10px] opacity-75 font-mono">({catAvail}/{catCount})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Box & Category Bulk Actions */}
                <div className="flex items-center gap-2">
                  {toppingsCategoryFilter !== 'todos' && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleCategoryToppings(toppingsCategoryFilter, true)}
                        className="px-2.5 py-1.5 bg-stone-800 hover:bg-emerald-950 text-stone-300 hover:text-emerald-300 border border-stone-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                        title={`Marcar todos los de categoría ${toppingsCategoryFilter}`}
                      >
                        Marcar {toppingsCategoryFilter}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleCategoryToppings(toppingsCategoryFilter, false)}
                        className="px-2.5 py-1.5 bg-stone-800 hover:bg-red-950 text-stone-300 hover:text-red-300 border border-stone-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                        title={`Desmarcar todos los de categoría ${toppingsCategoryFilter}`}
                      >
                        Desmarcar {toppingsCategoryFilter}
                      </button>
                    </div>
                  )}

                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar agrego..."
                      value={toppingsSearch}
                      onChange={(e) => setToppingsSearch(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                    />
                    {toppingsSearch && (
                      <button
                        onClick={() => setToppingsSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* TOPPINGS LIST / GRID */}
              {displayedToppings.length === 0 ? (
                <div className="p-8 text-center bg-stone-900/50 rounded-3xl border border-dashed border-stone-800 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-bold text-stone-300">No se encontraron agregos con el filtro actual</p>
                  <button
                    onClick={() => {
                      setToppingsSearch('');
                      setToppingsCategoryFilter('todos');
                    }}
                    className="text-xs text-orange-400 underline font-bold"
                  >
                    Restablecer filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {displayedToppings.map((topping) => {
                    const isAvailable = topping.available !== false;

                    return (
                      <div
                        key={topping.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 ${
                          isAvailable
                            ? 'bg-stone-900 border-stone-800 shadow-md hover:border-orange-500/40'
                            : 'bg-stone-950/60 border-stone-900 opacity-65 hover:opacity-100'
                        }`}
                      >
                        {/* Card Top: Checkbox toggle & Category */}
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSingleTopping(topping.id)}
                            className={`flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              isAvailable
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70 shadow-sm'
                                : 'bg-stone-800 text-stone-400 border border-stone-700'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                                isAvailable ? 'bg-emerald-500 text-stone-950' : 'bg-stone-700 text-stone-900'
                              }`}
                            >
                              {isAvailable ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3 text-stone-400" />}
                            </div>
                            <span>{isAvailable ? 'DISPONIBLE' : 'AGOTADO / OCULTO'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteTopping(topping.id)}
                            className="p-1.5 text-stone-500 hover:text-red-400 rounded-lg hover:bg-stone-800 transition-colors"
                            title="Eliminar agrego"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Name Input */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-stone-400 font-bold uppercase block">
                            Nombre del Agrego
                          </label>
                          <input
                            type="text"
                            value={topping.name}
                            onChange={(e) => handleUpdateTopping(topping.id, 'name', e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        {/* Category & Price Row */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="space-y-1">
                            <label className="text-[10px] text-stone-400 font-bold uppercase block">
                              Categoría
                            </label>
                            <select
                              value={topping.category}
                              onChange={(e) => handleUpdateTopping(topping.id, 'category', e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-stone-200 capitalize focus:outline-none focus:border-orange-500"
                            >
                              <option value="carne">Carne</option>
                              <option value="marina">Marina / Mariscos</option>
                              <option value="vegetal">Vegetal</option>
                              <option value="queso">Queso</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-stone-400 font-bold uppercase block">
                              Precio Extra ($)
                            </label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-xs">$</span>
                              <input
                                type="number"
                                value={topping.price}
                                onChange={(e) => handleUpdateTopping(topping.id, 'price', Number(e.target.value))}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-6 pr-2.5 py-1.5 text-xs text-amber-300 font-black focus:outline-none focus:border-orange-500"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PROMOS & DISCOUNTS */}
          {activeTab === 'promos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">Códigos Promocionales y Descuentos</h3>
                  <p className="text-xs text-stone-400">Los clientes podrán usar estos códigos en el carrito de compras</p>
                </div>
                <button
                  onClick={handleAddPromo}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Código</span>
                </button>
              </div>

              {/* PROMOTIONAL PUSH BROADCASTER TOOL */}
              <div className="p-5 bg-gradient-to-r from-orange-950/80 via-stone-900 to-amber-950/80 rounded-3xl border-2 border-orange-500/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30">
                      <Megaphone className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Difusor de Notificaciones Push a Clientes</h4>
                      <p className="text-xs text-stone-400">
                        Envía alertas directas a los dispositivos de los clientes con ofertas relámpago y novedades.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-black px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Service Worker Activo
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    onClick={async () => {
                      await requestNotificationPermission();
                      const success = await notifyCustomAnnouncement(
                        '🔥 ¡Pizzas al Horno Volcánico en THE HOME PIPO!',
                        'Horno a 450°C encendido. Pide tu pizza artesanal favorita recién horneada.',
                        '/#menu'
                      );
                      setToastMessage(success ? '✅ Notificación push enviada con éxito' : '⚠️ Permiso requerido para enviar push');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>📢 Notificar: Horno a 450°C Activo</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await requestNotificationPermission();
                      const success = await notifyCustomAnnouncement(
                        '🍕 2x1 en Pizzas Tradicionales',
                        '¡Promoción especial del día! Válido para recoger en sucursal y consumo en local.',
                        '/#menu'
                      );
                      setToastMessage(success ? '✅ Notificación push de 2x1 enviada' : '⚠️ Permiso requerido');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 active:scale-95 text-amber-300 font-bold text-xs rounded-xl border border-stone-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>🎁 Notificar: Promo Especial 2x1</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localPromos.map((promo, idx) => (
                  <div key={idx} className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={promo.code}
                        onChange={(e) => {
                          const copy = [...localPromos];
                          copy[idx].code = e.target.value.toUpperCase();
                          setLocalPromos(copy);
                        }}
                        className="bg-stone-950 font-mono font-black text-amber-400 px-3 py-1.5 rounded-xl border border-amber-500/30 uppercase text-sm w-36 focus:outline-none"
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={async () => {
                            await requestNotificationPermission();
                            const sent = await notifyPromo(promo);
                            setToastMessage(sent ? `✅ Alerta push enviada para el cupón ${promo.code}` : '⚠️ Permiso de notificación requerido');
                            setTimeout(() => setToastMessage(null), 3000);
                          }}
                          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Enviar notificación push de este cupón a los clientes"
                        >
                          <Bell className="w-3 h-3" />
                          <span>Notificar Push</span>
                        </button>
                        <button
                          onClick={() => handleDeletePromo(idx)}
                          className="p-1.5 text-stone-500 hover:text-red-400 rounded-lg hover:bg-stone-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-stone-400 font-bold block">Descuento (%)</label>
                        <input
                          type="number"
                          value={promo.discountPercent || ''}
                          onChange={(e) => {
                            const copy = [...localPromos];
                            copy[idx].discountPercent = e.target.value ? Number(e.target.value) : undefined;
                            setLocalPromos(copy);
                          }}
                          placeholder="Ej: 20"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-400 font-bold block">Compra Mínima ($)</label>
                        <input
                          type="number"
                          value={promo.minSpend || ''}
                          onChange={(e) => {
                            const copy = [...localPromos];
                            copy[idx].minSpend = e.target.value ? Number(e.target.value) : undefined;
                            setLocalPromos(copy);
                          }}
                          placeholder="Ej: 200"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-stone-400 font-bold block">Descripción</label>
                      <input
                        type="text"
                        value={promo.description}
                        onChange={(e) => {
                          const copy = [...localPromos];
                          copy[idx].description = e.target.value;
                          setLocalPromos(copy);
                        }}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-200"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: STORE INFO */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-white">Datos Generales de THE HOME PIPO 🍕</h3>
                <p className="text-xs text-stone-400">Edita datos de contacto, horarios y avisos superiores</p>
              </div>

              <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-400 uppercase">Teléfono de Pedidos Directo</label>
                    <input
                      type="text"
                      value={localStoreInfo.phone}
                      onChange={(e) => setLocalStoreInfo({ ...localStoreInfo, phone: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-400 uppercase">Horario de Atención</label>
                    <input
                      type="text"
                      value={localStoreInfo.hours}
                      onChange={(e) => setLocalStoreInfo({ ...localStoreInfo, hours: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-400 uppercase">Dirección de la Sucursal Principal</label>
                  <input
                    type="text"
                    value={localStoreInfo.address}
                    onChange={(e) => setLocalStoreInfo({ ...localStoreInfo, address: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-400 uppercase">Mensaje de la Cinta Superior (Ticker Header)</label>
                  <input
                    type="text"
                    value={localStoreInfo.tickerMessage}
                    onChange={(e) => setLocalStoreInfo({ ...localStoreInfo, tickerMessage: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-yellow-300 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-400 uppercase">Estado del Horno (Hero Badge)</label>
                  <input
                    type="text"
                    value={localStoreInfo.ovenStatus}
                    onChange={(e) => setLocalStoreInfo({ ...localStoreInfo, ovenStatus: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-orange-400 font-bold"
                  />
                </div>

                <div className="space-y-1 pt-3 border-t border-stone-800/80">
                  <label className="text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contraseña de Acceso al Panel Admin</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        localStorage.setItem('pipo_admin_password', e.target.value);
                      }}
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl border border-stone-700 cursor-pointer flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showPassword ? 'Ocultar' : 'Ver'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    Esta contraseña será requerida al tocar 3 veces el logo de THE HOME PIPO 🍕.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: EXPORT ZIP & GITHUB */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-400" />
                  <span>Descargar Archivos del Proyecto en ZIP</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Descarga el código fuente completo listo para subir a GitHub, Netlify, Vercel o tu servidor.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Complete Project Source ZIP */}
                <div className="bg-stone-900/90 p-5 rounded-3xl border border-stone-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
                      📦
                    </div>
                    <h4 className="text-sm font-black text-white">Código Fuente Completo (React + Vite + Backend)</h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Incluye todos los componentes TypeScript, estilos Tailwind, servidor Express y archivos de configuración. Listo para correr con <code className="text-emerald-300 font-mono text-[11px] bg-black/40 px-1 py-0.5 rounded">npm run dev</code>.
                    </p>
                  </div>

                  <a
                    href="/api/download-zip"
                    download="THE-HOME-PIPO-fuente.zip"
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Código Fuente (.ZIP)</span>
                  </a>
                </div>

                {/* Option 2: Pre-compiled Web for GitHub Pages */}
                <div className="bg-stone-900/90 p-5 rounded-3xl border border-stone-800 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
                      🚀
                    </div>
                    <h4 className="text-sm font-black text-white">Página Web Lista (HTML / CSS / JS Compilado)</h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Paquete estático listo para arrastrar a GitHub Pages, Cloudflare Pages o cualquier hosting web sin necesidad de compilar.
                    </p>
                  </div>

                  <a
                    href="/api/download-web-zip"
                    download="THE-HOME-PIPO-WEB-LISTA.zip"
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Web Compilada (.ZIP)</span>
                  </a>
                </div>
              </div>

              {/* GitHub Instructions Card */}
              <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800/80 space-y-3">
                <div className="flex items-center gap-2 text-stone-300 font-bold text-xs">
                  <Github className="w-4 h-4 text-white" />
                  <span>Pasos para subir a GitHub:</span>
                </div>
                <ol className="text-xs text-stone-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Haz clic en <strong>"Descargar Código Fuente (.ZIP)"</strong> y descomprime la carpeta en tu computadora.</li>
                  <li>Abre la terminal en la carpeta y ejecuta: <code className="text-amber-400 font-mono text-[11px]">git init</code> luego <code className="text-amber-400 font-mono text-[11px]">git add .</code> y <code className="text-amber-400 font-mono text-[11px]">git commit -m "Initial commit THE HOME PIPO"</code>.</li>
                  <li>Crea un repositorio en GitHub y enlázalo con <code className="text-amber-400 font-mono text-[11px]">git remote add origin URL_DE_TU_REPOSITORIO</code> y <code className="text-amber-400 font-mono text-[11px]">git push -u origin main</code>.</li>
                </ol>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#11100E] border-t border-stone-800 flex items-center justify-between">
          <p className="text-[11px] text-stone-500">
            Toca el logo 3 veces en la barra superior para abrir este panel en cualquier momento.
          </p>

          <button
            onClick={handleSaveAll}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todos los Cambios</span>
          </button>
        </div>

      </div>
    </div>
  );
};
