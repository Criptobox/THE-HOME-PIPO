import React, { useState, useEffect } from 'react';
import { ShoppingBag, Flame, Phone, MapPin, Sparkles, Clock, Menu as MenuIcon, X, Sun, Moon, Laptop, ChevronDown, UtensilsCrossed, MessageCircle, Bell, BellRing, Download, Settings } from 'lucide-react';
import { getNotificationPermission, NotificationPermissionState, getNotificationPreferences } from '../utils/notifications';
import { PwaInstallButton } from './PwaInstallButton';
import { NotificationSettingsModal } from './NotificationSettingsModal';

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
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isCartBumping, setIsCartBumping] = useState(false);
  const [notificationPerm, setNotificationPerm] = useState<NotificationPermissionState>(() => getNotificationPermission());
  const [notificationPrefs, setNotificationPrefs] = useState(() => getNotificationPreferences());
  const prevCartCountRef = React.useRef(cartItemCount);

  // Sync notification preferences and permission updates
  useEffect(() => {
    const handlePrefsChange = () => {
      setNotificationPerm(getNotificationPermission());
      setNotificationPrefs(getNotificationPreferences());
    };
    window.addEventListener('pipo-notification-prefs-changed', handlePrefsChange);
    return () => window.removeEventListener('pipo-notification-prefs-changed', handlePrefsChange);
  }, []);

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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121110]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 text-stone-900 dark:text-white shadow-sm dark:shadow-2xl transition-colors">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 text-white text-xs font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <Flame className="w-3.5 h-3.5 animate-pulse text-yellow-300 shrink-0" />
        <span className="truncate max-w-4xl">
          {tickerMessage || '🔥 ¡PIZZAS ARTESANALES SOBRE PIEDRA VOLCÁNICA! Masa fresca y horneadas a 450°C • Servicio a Domicilio y en Sucursal'}
        </span>
        <Flame className="w-3.5 h-3.5 animate-pulse text-yellow-300 shrink-0 hidden sm:inline" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with 3-Tap Admin trigger */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group select-none relative"
            title="THE HOME PIPO - Toca 3 veces para modo Administrador"
          >
            <div className="relative w-12 h-12 bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform duration-300 border border-orange-400/40">
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
              <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-600 dark:text-orange-500 inline shrink-0" /> HORNO DE GAS SOBRE PIEDRA VOLCÁNICA
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100/90 dark:bg-[#1A1816] px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800/80 shadow-inner">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md shadow-red-900/30'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-200/70 dark:hover:bg-stone-800/60'
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
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform animate-pulse cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Estado de Pedido</span>
              </button>
            )}

            {/* Quick WhatsApp Contact */}
            <a
              href={`https://wa.me/52${(storePhone || '5567470079').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('¡Hola THE HOME PIPO! Quisiera consultar el menú y hacer un pedido.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-stone-800 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-emerald-50 dark:bg-stone-900/90 dark:hover:bg-emerald-950/40 border border-stone-200 hover:border-emerald-500/40 dark:border-stone-800 dark:hover:border-emerald-600/40 transition-all shadow-sm group"
              title="Abrir chat de WhatsApp con THE HOME PIPO"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                {storePhone && storePhone.includes('(')
                  ? storePhone.match(/\(([^)]+)\)/)?.[1] || storePhone
                  : storePhone || '55 6747 0079'}
              </span>
            </a>

            {/* PWA Install Button (visible when beforeinstallprompt fires and not installed) */}
            <PwaInstallButton variant="header" />

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              id="cart-button"
              className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-red-900/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-orange-400/30 cursor-pointer ${
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

            {/* Push Notifications & Preferences */}
            <button
              onClick={() => setIsNotificationSettingsOpen(true)}
              className={`p-2.5 rounded-2xl border transition-all flex items-center justify-center active:scale-95 cursor-pointer relative ${
                notificationPerm === 'granted' && notificationPrefs.enabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-900/90 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 border-stone-200 dark:border-stone-800'
              }`}
              title={
                notificationPerm === 'granted' && notificationPrefs.enabled
                  ? 'Notificaciones push activas (Haz clic para configurar o cancelar suscripción)'
                  : 'Gestionar notificaciones push y alertas'
              }
              aria-label="Ajustes de Notificaciones"
            >
              {notificationPerm === 'granted' && notificationPrefs.enabled ? (
                <BellRing className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              {notificationPerm === 'granted' && notificationPrefs.enabled && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-stone-900"></span>
              )}
            </button>

            {/* Theme Selector */}
            {onThemeModeChange && (
              <div className="relative">
                <button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-900/90 hover:bg-stone-200 dark:hover:bg-stone-800 text-amber-700 dark:text-amber-400 border border-stone-200 dark:border-stone-800 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
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
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
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
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
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
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
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
              className="lg:hidden p-2 text-stone-800 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 cursor-pointer"
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
              className="w-full mb-2 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Ver Estado del Pedido Activo</span>
            </button>
          )}

          {/* PWA Install Button for Mobile Drawer */}
          <div className="py-1">
            <PwaInstallButton variant="header" className="w-full justify-center !py-2.5" />
          </div>

          {/* Mobile Notifications Settings Button */}
          <button
            onClick={() => {
              setIsNotificationSettingsOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer border border-stone-200 dark:border-stone-800"
          >
            <div className="flex items-center gap-2.5">
              {notificationPerm === 'granted' && notificationPrefs.enabled ? (
                <BellRing className="w-4 h-4 text-emerald-500" />
              ) : (
                <Bell className="w-4 h-4 text-amber-500" />
              )}
              <span>Ajustes de Notificaciones</span>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              notificationPerm === 'granted' && notificationPrefs.enabled
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}>
              {notificationPerm === 'granted' && notificationPrefs.enabled ? 'ACTIVO' : 'CONFIGURAR'}
            </span>
          </button>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                activeSection === item.id
                  ? 'bg-red-600/10 text-red-700 dark:text-orange-400 border border-red-500/30'
                  : 'text-stone-800 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 mt-2 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 px-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> 1:00 PM - 11:00 PM
            </span>
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Abierto Hoy
            </span>
          </div>
        </div>
      )}

      {/* Notification Preferences & Subscription Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />
    </header>
  );
};


