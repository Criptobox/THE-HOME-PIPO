import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { PizzaCustomizerModal } from './components/PizzaCustomizerModal';
import { VisualPizzaBuilder } from './components/VisualPizzaBuilder';
import { PipoAiSommelier } from './components/PipoAiSommelier';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { DeliveryChecker } from './components/DeliveryChecker';
import { ReviewsAndContact } from './components/ReviewsAndContact';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

import { MenuItem, CartItem, Order, OrderStatus, PromoCode, Review, Topping } from './types';
import { MENU_ITEMS, PROMO_CODES, DELIVERY_ZONES, REVIEWS, TOPPINGS } from './data/menu';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);

  // Editable store state for Admin panel with localStorage persistence
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('pipo_menu_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved menu items', e);
      }
    }
    return MENU_ITEMS;
  });

  const [toppings, setToppings] = useState<Topping[]>(() => {
    const saved = localStorage.getItem('pipo_toppings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved toppings', e);
      }
    }
    return TOPPINGS;
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('pipo_promo_codes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved promos', e);
      }
    }
    return PROMO_CODES;
  });

  const [deliveryZones, setDeliveryZones] = useState<typeof DELIVERY_ZONES>(() => {
    const saved = localStorage.getItem('pipo_delivery_zones');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved delivery zones', e);
      }
    }
    return DELIVERY_ZONES;
  });

  const [storeInfo, setStoreInfo] = useState(() => {
    const saved = localStorage.getItem('pipo_store_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved store info', e);
      }
    }
    return {
      name: 'THE HOME PIPO Matriz',
      address: 'Av. de los Hornos #450, Col. Centro Histórico, Ciudad de México',
      phone: '55 6747 0079',
      schedule: 'Lunes a Domingo: 12:00 PM – 11:00 PM',
      tickerMessage: '¡MARTES Y JUEVES DE ORILLA DE QUESO GRATIS! Usa el código VOLCANICA para $25 OFF',
      ovenStatus: 'Horno de Gas sobre Piedra Volcánica encendido a 450°C',
    };
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('pipo_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved reviews', e);
      }
    }
    return REVIEWS;
  });

  // Theme Mode State ('system' | 'dark' | 'light')
  const [themeMode, setThemeMode] = useState<'system' | 'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('pipo_theme_mode');
      if (saved === 'system' || saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark');

  // OS Color Scheme Listener & Automatic Theme Application
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      const isOsDark = mediaQuery.matches;
      const activeTheme = themeMode === 'system' ? (isOsDark ? 'dark' : 'light') : themeMode;

      setEffectiveTheme(activeTheme);

      if (activeTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    };

    updateTheme();

    const handleChange = () => {
      if (themeMode === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const handleThemeModeChange = (mode: 'system' | 'dark' | 'light') => {
    setThemeMode(mode);
    try {
      localStorage.setItem('pipo_theme_mode', mode);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveMenuItems = (newItems: MenuItem[]) => {
    setMenuItems(newItems);
    localStorage.setItem('pipo_menu_items', JSON.stringify(newItems));
    syncToBackend({ menuItems: newItems });
  };

  const handleSaveToppings = (newToppings: Topping[]) => {
    setToppings(newToppings);
    localStorage.setItem('pipo_toppings', JSON.stringify(newToppings));
    syncToBackend({ toppings: newToppings });
  };

  const handleSavePromoCodes = (newPromos: PromoCode[]) => {
    setPromoCodes(newPromos);
    localStorage.setItem('pipo_promo_codes', JSON.stringify(newPromos));
    syncToBackend({ promoCodes: newPromos });
  };

  const handleSaveDeliveryZones = (newZones: typeof DELIVERY_ZONES) => {
    setDeliveryZones(newZones);
    localStorage.setItem('pipo_delivery_zones', JSON.stringify(newZones));
    syncToBackend({ deliveryZones: newZones });
  };

  const handleSaveStoreInfo = (newInfo: typeof storeInfo) => {
    setStoreInfo(newInfo);
    localStorage.setItem('pipo_store_info', JSON.stringify(newInfo));
    syncToBackend({ storeInfo: newInfo });
  };

  const handleSaveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('pipo_reviews', JSON.stringify(newReviews));
    syncToBackend({ reviews: newReviews });
  };

  const syncToBackend = (partialData: {
    menuItems?: MenuItem[];
    toppings?: Topping[];
    promoCodes?: PromoCode[];
    deliveryZones?: typeof DELIVERY_ZONES;
    storeInfo?: typeof storeInfo;
    reviews?: Review[];
  }) => {
    fetch('/api/store-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partialData),
    }).catch((err) => console.error('Error al sincronizar con el servidor:', err));
  };

  const handleResetAllData = () => {
    localStorage.removeItem('pipo_menu_items');
    localStorage.removeItem('pipo_toppings');
    localStorage.removeItem('pipo_promo_codes');
    localStorage.removeItem('pipo_delivery_zones');
    localStorage.removeItem('pipo_store_info');
    localStorage.removeItem('pipo_reviews');
    setMenuItems(MENU_ITEMS);
    setToppings(TOPPINGS);
    setPromoCodes(PROMO_CODES);
    setDeliveryZones(DELIVERY_ZONES);
    setReviews(REVIEWS);
    const defaultInfo = {
      name: 'THE HOME PIPO Matriz',
      address: 'Av. de los Hornos #450, Col. Centro Histórico, Ciudad de México',
      phone: '55 6747 0079',
      schedule: 'Lunes a Domingo: 12:00 PM – 11:00 PM',
      tickerMessage: '¡MARTES Y JUEVES DE ORILLA DE QUESO GRATIS! Usa el código VOLCANICA para $25 OFF',
      ovenStatus: 'Horno de Gas sobre Piedra Volcánica encendido a 450°C',
    };
    setStoreInfo(defaultInfo);
    fetch('/api/store-data/reset', { method: 'POST' }).catch((err) => console.error(err));
  };

  // Real-time synchronization effect across all connected clients & devices
  React.useEffect(() => {
    // 1. Initial fetch from server
    const startTime = Date.now();
    fetch('/api/store-data')
      .then((res) => res.json())
      .then((data) => {
        if (data.menuItems && Array.isArray(data.menuItems) && data.menuItems.length > 0) {
          setMenuItems(data.menuItems);
          localStorage.setItem('pipo_menu_items', JSON.stringify(data.menuItems));
        }
        if (data.toppings && Array.isArray(data.toppings) && data.toppings.length > 0) {
          setToppings(data.toppings);
          localStorage.setItem('pipo_toppings', JSON.stringify(data.toppings));
        }
        if (data.promoCodes && Array.isArray(data.promoCodes)) {
          setPromoCodes(data.promoCodes);
          localStorage.setItem('pipo_promo_codes', JSON.stringify(data.promoCodes));
        }
        if (data.deliveryZones && Array.isArray(data.deliveryZones)) {
          setDeliveryZones(data.deliveryZones);
          localStorage.setItem('pipo_delivery_zones', JSON.stringify(data.deliveryZones));
        }
        if (data.storeInfo) {
          setStoreInfo(data.storeInfo);
          localStorage.setItem('pipo_store_info', JSON.stringify(data.storeInfo));
        }
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          localStorage.setItem('pipo_reviews', JSON.stringify(data.reviews));
        }
      })
      .catch(() => console.log('Servidor en espera de datos remotos iniciales.'))
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 600 - elapsed);
        setTimeout(() => {
          setIsLoadingMenu(false);
        }, delay);
      });

    // 2. Real-time EventSource listener
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/store-data/stream');
      eventSource.onmessage = (event) => {
        try {
          if (!event.data) return;
          const data = JSON.parse(event.data);
          if (data.reset) {
            setMenuItems(MENU_ITEMS);
            setToppings(TOPPINGS);
            setPromoCodes(PROMO_CODES);
            setDeliveryZones(DELIVERY_ZONES);
            setReviews(REVIEWS);
            setStoreInfo({
              name: 'THE HOME PIPO Matriz',
              address: 'Av. de los Hornos #450, Col. Centro Histórico, Ciudad de México',
              phone: '55 6747 0079',
              schedule: 'Lunes a Domingo: 12:00 PM – 11:00 PM',
              tickerMessage: '¡MARTES Y JUEVES DE ORILLA DE QUESO GRATIS! Usa el código VOLCANICA para $25 OFF',
              ovenStatus: 'Horno de Gas sobre Piedra Volcánica encendido a 450°C',
            });
            localStorage.clear();
            return;
          }
          if (data.menuItems && Array.isArray(data.menuItems)) {
            setMenuItems(data.menuItems);
            localStorage.setItem('pipo_menu_items', JSON.stringify(data.menuItems));
          }
          if (data.toppings && Array.isArray(data.toppings)) {
            setToppings(data.toppings);
            localStorage.setItem('pipo_toppings', JSON.stringify(data.toppings));
          }
          if (data.promoCodes && Array.isArray(data.promoCodes)) {
            setPromoCodes(data.promoCodes);
            localStorage.setItem('pipo_promo_codes', JSON.stringify(data.promoCodes));
          }
          if (data.deliveryZones && Array.isArray(data.deliveryZones)) {
            setDeliveryZones(data.deliveryZones);
            localStorage.setItem('pipo_delivery_zones', JSON.stringify(data.deliveryZones));
          }
          if (data.storeInfo) {
            setStoreInfo(data.storeInfo);
            localStorage.setItem('pipo_store_info', JSON.stringify(data.storeInfo));
          }
          if (data.reviews && Array.isArray(data.reviews)) {
            setReviews(data.reviews);
            localStorage.setItem('pipo_reviews', JSON.stringify(data.reviews));
          }
        } catch (err) {
          console.error('Error procesando mensaje de sincronización SSE:', err);
        }
      };
    } catch (e) {
      console.error('Error al inicializar EventSource SSE:', e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItem | null>(null);

  const [activeSection, setActiveSection] = useState('menu');

  // Cart Management
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Check if identical item exists
      const existingIdx = prev.findIndex(
        (i) => i.title === item.title && i.detailsText === item.detailsText && i.specialInstructions === item.specialInstructions
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Order Placement
  const handlePlaceOrder = (orderData: Order) => {
    setActiveOrder(orderData);
    setCartItems([]);
    setIsCartOpen(false);
    setIsTrackerOpen(true);
  };

  // Simulation step for order status
  const handleSimulateNextStatus = () => {
    if (!activeOrder) return;
    const orderStatuses: OrderStatus[] = ['recibido', 'preparando', 'horneando', 'listo', 'entregado'];
    const currentIdx = orderStatuses.indexOf(activeOrder.status);
    const nextIdx = Math.min(orderStatuses.length - 1, currentIdx + 1);
    setActiveOrder({ ...activeOrder, status: orderStatuses[nextIdx] });
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0F0E0D] text-stone-900 dark:text-stone-100 font-sans antialiased selection:bg-orange-600 selection:text-white text-[15px] sm:text-base leading-relaxed">
      
      {/* Header */}
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        hasActiveOrder={!!activeOrder}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        storePhone={storeInfo.phone}
        tickerMessage={storeInfo.tickerMessage}
        themeMode={themeMode}
        effectiveTheme={effectiveTheme}
        onThemeModeChange={handleThemeModeChange}
      />

      {/* Hero Section */}
      <Hero
        onOrderNow={() => scrollToSection('menu')}
        onOpenBuilder={() => scrollToSection('builder')}
        ovenStatus={storeInfo.ovenStatus}
      />

      {/* Menu Section */}
      <MenuSection
        items={menuItems}
        isLoading={isLoadingMenu}
        onSelectItemForCustomization={(item) => setSelectedItemForCustomization(item)}
        onQuickAddToCart={handleAddToCart}
      />

      {/* Visual Pizza Builder */}
      <VisualPizzaBuilder onAddToCart={handleAddToCart} toppings={toppings} />

      {/* Pipo AI Sommelier */}
      <PipoAiSommelier onAddToCart={handleAddToCart} />

      {/* Branch Location Section (Pickup & Dine-In) */}
      <DeliveryChecker storeInfo={storeInfo} />

      {/* Reviews & Store Information */}
      <ReviewsAndContact
        storeInfo={storeInfo}
        reviews={reviews}
        onSaveReviews={handleSaveReviews}
        menuItems={menuItems}
      />

      {/* Footer */}
      <Footer />

      {/* Item Customizer Modal */}
      <PizzaCustomizerModal
        item={selectedItemForCustomization}
        onClose={() => setSelectedItemForCustomization(null)}
        onAddToCart={handleAddToCart}
        toppings={toppings}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
        promos={promoCodes}
        zones={deliveryZones}
      />

      {/* Order Status Tracker Modal */}
      {isTrackerOpen && (
        <OrderTrackerModal
          order={activeOrder}
          onClose={() => setIsTrackerOpen(false)}
          onSimulateNextStatus={handleSimulateNextStatus}
        />
      )}

      {/* Admin Panel Modal (Triggered by 3 taps on Logo) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
        onSaveMenuItems={handleSaveMenuItems}
        toppings={toppings}
        onSaveToppings={handleSaveToppings}
        promoCodes={promoCodes}
        onSavePromoCodes={handleSavePromoCodes}
        deliveryZones={deliveryZones}
        onSaveDeliveryZones={handleSaveDeliveryZones}
        storeInfo={storeInfo}
        onSaveStoreInfo={handleSaveStoreInfo}
        onResetAllData={handleResetAllData}
      />

    </div>
  );
}
