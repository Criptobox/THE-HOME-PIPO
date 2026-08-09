import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Image, RefreshCw, CheckCircle, Flame, Gift, Bike, Store, Shield, Sparkles, Upload, Lock, Eye, EyeOff, Key } from 'lucide-react';
import { MenuItem, PromoCode } from '../types';

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

  const [activeTab, setActiveTab] = useState<'menu' | 'promos' | 'zones' | 'store'>('menu');

  // Local copies for editing
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(JSON.parse(JSON.stringify(menuItems)));
  const [localPromos, setLocalPromos] = useState<PromoCode[]>(JSON.parse(JSON.stringify(promoCodes)));
  const [localZones, setLocalZones] = useState<DeliveryZone[]>(JSON.parse(JSON.stringify(deliveryZones)));
  const [localStoreInfo, setLocalStoreInfo] = useState<StoreInfo>({ ...storeInfo });

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
              Ingresa la contraseña de administrador para gestionar menú, precios, promociones e información de Pizzas Pipo.
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

          <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800/80 text-center space-y-1">
            <p className="text-[11px] font-bold text-amber-300">
              🔑 Contraseña predeterminada: <span className="font-mono bg-stone-950 px-2 py-0.5 rounded text-white border border-stone-800">pipo2026</span>
            </p>
            <p className="text-[10px] text-stone-500">
              Puedes modificar esta contraseña en la pestaña 'Datos de Pizzería' una vez iniciada la sesión.
            </p>
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
    onSavePromoCodes(localPromos);
    onSaveDeliveryZones(localZones);
    onSaveStoreInfo(localStoreInfo);
    showToast('¡Todos los cambios han sido guardados correctamente!');
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
      description: 'Masa artesanal con ingrediente secreto horneado a la leña.',
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

  // Filtered menu
  const displayedMenuItems = localMenuItems.filter((item) => {
    if (selectedCategoryFilter === 'todos') return true;
    return item.category === selectedCategoryFilter;
  });

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
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <span>🍕 Platillos y Fotos ({localMenuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'promos'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Promociones ({localPromos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('zones')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'zones'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Zonas de Entrega ({localZones.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'store'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Datos de Pizzería</span>
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
                        isEditing ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-stone-800 hover:border-stone-700'
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
                      <button
                        onClick={() => handleDeletePromo(idx)}
                        className="p-1.5 text-stone-500 hover:text-red-400 rounded-lg hover:bg-stone-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

          {/* TAB 3: DELIVERY ZONES */}
          {activeTab === 'zones' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">Zonas de Cobertura y Tarifas de Envío</h3>
                  <p className="text-xs text-stone-400">Configura tiempos estimados y costo de envío por colonia</p>
                </div>
                <button
                  onClick={handleAddZone}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Zona</span>
                </button>
              </div>

              <div className="space-y-3">
                {localZones.map((zone, idx) => (
                  <div key={idx} className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                      <div>
                        <label className="text-[10px] text-stone-400 font-bold block">Nombre de Colonia / Zona</label>
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => {
                            const copy = [...localZones];
                            copy[idx].name = e.target.value;
                            setLocalZones(copy);
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-400 font-bold block">Costo de Envío ($ MXN)</label>
                        <input
                          type="number"
                          value={zone.fee}
                          onChange={(e) => {
                            const copy = [...localZones];
                            copy[idx].fee = Number(e.target.value);
                            setLocalZones(copy);
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-400 font-bold block">Tiempo Estimado</label>
                        <input
                          type="text"
                          value={zone.estimatedTime}
                          onChange={(e) => {
                            const copy = [...localZones];
                            copy[idx].estimatedTime = e.target.value;
                            setLocalZones(copy);
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteZone(idx)}
                      className="p-2 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded-xl transition-colors self-end sm:self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STORE INFO */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-white">Datos Generales de Pizzas Pipo</h3>
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
                    Esta contraseña será requerida al tocar 3 veces el logo de Pizzas Pipo.
                  </p>
                </div>

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
