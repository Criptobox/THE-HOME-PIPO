import React, { useState } from 'react';
import { ShoppingBag, Flame, Phone, MapPin, Sparkles, Clock, Menu as MenuIcon, X, Sun, Moon, Laptop, ChevronDown, Download, UtensilsCrossed } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  hasActiveOrder: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  storePhone?: string;
  tickerMessage?: string;
  themeMode?: 'system' | 'dark' | 'light';
  effectiveTheme?: 'dark' | 'light';
  onThemeModeChange?: (mode: 'system' | 'dark' | 'light') => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  onOpenCart,
  onOpenTracker,
  onOpenAdmin,
  hasActiveOrder,
  activeSection,
  setActiveSection,
  storePhone,
  tickerMessage,
  themeMode = 'system',
  effectiveTheme = 'dark',
  onThemeModeChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isCartBumping, setIsCartBumping] = useState(false);
  const prevCartCountRef = React.useRef(cartItemCount);

  // Trigger subtle shake and pop animation when a new item is added to cart
  React.useEffect(() => {
    if (cartItemCount > prevCartCountRef.current) {
      setIsCartBumping(true);
      const timer = setTimeout(() => {
        setIsCartBumping(false);
      }, 700);
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartItemCount;
  }, [cartItemCount]);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 1500) {
      const newCount = logoClicks + 1;
      if (newCount >= 3) {
        setLogoClicks(0);
        onOpenAdmin();
      } else {
        setLogoClicks(newCount);
      }
    } else {
      setLogoClicks(1);
    }
    setLastClickTime(now);
    handleNavClick('hero');
  };

  const navItems = [
    { id: 'menu', label: 'Menú' },
    { id: 'builder', label: 'Arma tu Pizza 🍕' },
    { id: 'ai-chef', label: 'Pipo AI Chef ✨' },
    { id: 'sucursal', label: 'Sucursal & Horarios 📍' },
    { id: 'contacto', label: 'Ubicación y Opiniones' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121110]/95 backdrop-blur-md border-b border-stone-200 dark:border-orange-950/40 text-stone-900 dark:text-white shadow-sm dark:shadow-2xl transition-colors">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-red-700 via-orange-600 to-red-700 text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <Flame className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
        <span>{tickerMessage || '¡PIZZAS ARTESANALES SOBRE PIEDRA VOLCÁNICA! Cocinadas en horno de gas a 450°C. Pide para recoger en sucursal o comer en nuestro local.'}</span>
        <Flame className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with 3-Tap Admin trigger */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group select-none relative"
            title="THE HOME PIPO - Toca 3 veces para modo Administrador"
          >
            <div className="relative w-11 h-11 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:scale-105 transition-transform duration-300 border border-orange-400/30">
              <span className="text-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">🍕</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#121110] animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#121110]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 dark:from-white dark:via-amber-100 dark:to-amber-400 bg-clip-text text-transparent font-serif">
                  THE HOME PIPO
                </span>
                {logoClicks > 1 && (
                  <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-1.5 py-0.5 rounded-full animate-pulse">
                    {logoClicks}/3
                  </span>
                )}
              </div>
              <p className="text-[10px] text-amber-700 dark:text-amber-400/90 font-bold tracking-widest uppercase flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-orange-600 dark:text-orange-500 inline" /> Horno de Gas sobre Piedra Volcánica
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100 dark:bg-[#1A1816] px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800/80 shadow-inner">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md shadow-red-900/40 font-extrabold'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-200/80 dark:hover:bg-stone-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Active Order Button */}
            {hasActiveOrder && (
              <button
                onClick={onOpenTracker}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform animate-pulse"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Estado de Pedido</span>
              </button>
            )}

            {/* Quick Phone Call */}
            <a
              href={`tel:${(storePhone || '5557476749').replace(/[^0-9]/g, '')}`}
              className="hidden md:flex items-center gap-2 text-stone-800 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-orange-600 dark:text-orange-500" />
              <span>
                {storePhone && storePhone.includes('(')
                  ? storePhone.match(/\(([^)]+)\)/)?.[1] || storePhone
                  : storePhone || '555-747-6749'}
              </span>
            </a>

            {/* Download ZIP button */}
            <a
              href="/api/download-zip"
              download="THE-HOME-PIPO-v2.zip"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900/90 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-300 text-xs font-bold rounded-2xl border border-stone-200 dark:border-stone-800 transition-all shadow-sm"
              title="Descargar código fuente del proyecto en ZIP (THE HOME PIPO v2)"
            >
              <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Descargar ZIP</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              id="cart-button"
              className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-red-900/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-orange-400/30 ${
                isCartBumping ? 'animate-cart-pop ring-4 ring-orange-500/60 shadow-orange-500/40' : ''
              }`}
              aria-label="Abrir Carrito de Compras"
            >
              <ShoppingBag className={`w-4 h-4 transition-transform duration-300 ${isCartBumping ? 'scale-125 rotate-12 text-yellow-200' : ''}`} />
              <span className="hidden sm:inline">Carrito</span>
              {cartItemCount > 0 && (
                <span className={`bg-amber-400 text-stone-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
                  isCartBumping ? 'animate-badge-pop scale-125 ring-2 ring-white' : 'animate-bounce'
                }`}>
                  {cartItemCount}
                </span>
              )}
              {isCartBumping && (
                <span className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg animate-bounce pointer-events-none border border-white dark:border-stone-900">
                  +1
                </span>
              )}
            </button>

            {/* Theme Selector */}
            {onThemeModeChange && (
              <div className="relative">
                <button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-900/90 hover:bg-stone-200 dark:hover:bg-stone-800 text-amber-700 dark:text-amber-400 border border-stone-200 dark:border-stone-800 transition-all flex items-center gap-1.5 active:scale-95"
                  title={`Tema: ${themeMode === 'system' ? 'Automático (Sistema)' : themeMode === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}`}
                >
                  {themeMode === 'system' ? (
                    <Laptop className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  ) : effectiveTheme === 'light' ? (
                    <Sun className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  )}
                  <ChevronDown className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                </button>

                {themeMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#181614] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase text-stone-500 dark:text-stone-400 tracking-wider">
                      Preferencia de Color
                    </div>

                    <button
                      onClick={() => {
                        onThemeModeChange('system');
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        themeMode === 'system'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60'
                          : 'text-stone-800 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Auto (Sistema OS)</span>
                      </div>
                      {themeMode === 'system' && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-black">✓</span>}
                    </button>

                    <button
                      onClick={() => {
                        onThemeModeChange('dark');
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        themeMode === 'dark'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60'
                          : 'text-stone-800 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span>Modo Oscuro</span>
                      </div>
                      {themeMode === 'dark' && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-black">✓</span>}
                    </button>

                    <button
                      onClick={() => {
                        onThemeModeChange('light');
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        themeMode === 'light'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60'
                          : 'text-stone-800 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                        <span>Modo Claro</span>
                      </div>
                      {themeMode === 'light' && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-black">✓</span>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-800 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#181614] border-b border-stone-200 dark:border-stone-800 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {hasActiveOrder && (
            <button
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="w-full mb-2 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs rounded-xl shadow-md"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Ver Estado del Pedido Activo</span>
            </button>
          )}

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? 'bg-red-600/10 text-red-700 dark:text-orange-400 font-bold border border-red-500/30'
                  : 'text-stone-800 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          <a
            href="/api/download-zip"
            download="THE-HOME-PIPO-v2.zip"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl border border-stone-200 dark:border-stone-800 mt-2"
          >
            <Download className="w-4 h-4 text-amber-500" />
            <span>Descargar Proyecto ZIP (v2)</span>
          </a>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 px-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> 1:00 PM - 11:00 PM
            </span>
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Abierto Hoy
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

