import { OrderStatus } from '../types';

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export interface NotificationPreferences {
  enabled: boolean;
  orderUpdates: boolean;
  specialPromos: boolean;
  ovenAlerts: boolean;
  soundAlerts: boolean;
}

const STORAGE_KEY = 'the_home_pipo_notification_prefs_v1';

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  orderUpdates: true,
  specialPromos: true,
  ovenAlerts: true,
  soundAlerts: true,
};

export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveNotificationPreferences(prefs: Partial<NotificationPreferences>): NotificationPreferences {
  const current = getNotificationPreferences();
  const updated = { ...current, ...prefs };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('pipo-notification-prefs-changed', { detail: updated }));
    } catch (e) {
      console.warn('Error guardando preferencias de notificaciones:', e);
    }
  }
  return updated;
}

export const BRAND_NOTIFICATION_ICON = '/icon-192.svg';
export const BRAND_NOTIFICATION_BADGE = '/icon-192.svg';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

export function getNotificationPermission(): NotificationPermissionState {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      saveNotificationPreferences({ enabled: true });
      // Send a welcome test notification through the Service Worker with brand icon
      await sendNotificationViaServiceWorker('🔥 ¡Bienvenido a THE HOME PIPO!', {
        body: 'Te avisaremos cuando tus pizzas entren al horno de piedra a 450°C, estén listas y tengamos cupones exclusivos.',
        tag: 'pipo-welcome-notification',
        url: '/#menu',
        icon: BRAND_NOTIFICATION_ICON,
        badge: BRAND_NOTIFICATION_BADGE,
      });
    }
    return permission as NotificationPermissionState;
  } catch (error) {
    console.warn('Error solicitando permisos de notificación:', error);
    return 'denied';
  }
}

export async function unsubscribeNotifications(): Promise<boolean> {
  saveNotificationPreferences({ enabled: false });
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
    }
    return true;
  } catch (e) {
    console.warn('Error cancelando suscripción push:', e);
    return true; // Local preference is still saved as disabled
  }
}

export interface CustomNotificationOptions {
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  url?: string;
  data?: Record<string, any>;
  vibrate?: number[];
  actions?: Array<{ action: string; title: string }>;
  renotify?: boolean;
}

export async function sendNotificationViaServiceWorker(
  title: string,
  options: CustomNotificationOptions
): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.log('[Notifications] Notificaciones no soportadas en este navegador');
    return false;
  }

  const prefs = getNotificationPreferences();
  if (!prefs.enabled) {
    console.log('[Notifications] Notificaciones desactivadas por preferencia del usuario');
    return false;
  }

  if (Notification.permission !== 'granted') {
    console.log('[Notifications] Permiso no otorgado en el navegador:', Notification.permission);
    return false;
  }

  const notificationOptions: any = {
    body: options.body,
    icon: options.icon || BRAND_NOTIFICATION_ICON,
    badge: options.badge || BRAND_NOTIFICATION_BADGE,
    image: options.image,
    tag: options.tag || 'pipo-notification',
    renotify: options.renotify !== false,
    vibrate: options.vibrate || [200, 100, 200, 100, 300],
    data: {
      url: options.url || '/',
      brand: 'THE HOME PIPO',
      ...options.data,
    },
    actions: options.actions || [
      { action: 'open_app', title: '🍕 Ver en la App' },
      { action: 'dismiss', title: 'Cerrar' },
    ],
  };

  try {
    // 1. Prefer Service Worker Registration showNotification (works in background & PWA)
    const registration = await navigator.serviceWorker.ready;
    if (registration && typeof registration.showNotification === 'function') {
      await registration.showNotification(title, notificationOptions);
      return true;
    }
  } catch (err) {
    console.warn('[Notifications] Error al invocar showNotification vía SW:', err);
  }

  try {
    // 2. Post message to active SW controller as fallback
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: {
          title,
          options: notificationOptions,
        },
      });
      return true;
    }
  } catch (err) {
    console.warn('[Notifications] Error enviando postMessage al SW:', err);
  }

  try {
    // 3. Fallback to standard window Notification
    new Notification(title, notificationOptions);
    return true;
  } catch (err) {
    console.warn('[Notifications] Fallback Notification falló:', err);
    return false;
  }
}

// ==========================================
// ORDER STATUS NOTIFICATIONS
// ==========================================

export async function notifyOrderStatus(
  orderId: string,
  status: OrderStatus,
  details?: {
    orderType?: 'pickup' | 'dine_in' | 'delivery';
    tableNumber?: string;
    total?: number;
    itemsCount?: number;
  }
): Promise<boolean> {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled || !prefs.orderUpdates) {
    return false;
  }

  if (status === 'horneando' && !prefs.ovenAlerts) {
    return false;
  }

  const isDineIn = details?.orderType === 'dine_in';
  const tableText = details?.tableNumber ? ` (Mesa #${details.tableNumber})` : '';

  let title = `THE HOME PIPO 🔥 Orden #${orderId}`;
  let body = '';
  const tag = `pipo-order-${orderId}`;

  switch (status) {
    case 'recibido':
      title = `📋 ¡Pedido #${orderId} Recibido!`;
      body = isDineIn
        ? `Tu orden está en cocina y comanda abierta${tableText}. ¡Enseguida comenzamos a preparar!`
        : `Tu orden está confirmada en mostrador. Enseguida comenzamos el amasado artesanal.`;
      break;

    case 'preparando':
      title = `👨‍🍳 Amasando tu Orden #${orderId}`;
      body = `Estirando la masa fresca e integrando salsa de la casa, queso mozzarella e ingredientes selectos.`;
      break;

    case 'horneando':
      title = `🔥 ¡Orden #${orderId} en Horno de Piedra!`;
      body = `Tu pizza se está horneando a 450°C sobre piedra volcánica para lograr la orilla crujiente perfecta.`;
      break;

    case 'listo':
      title = isDineIn
        ? `🍽️ ¡Sirviendo tu Orden #${orderId}!${tableText}`
        : `🍕 ¡Tu Orden #${orderId} está Lista para Recoger!`;
      body = isDineIn
        ? `Llevando tu pizza recién salida del horno caliente directo a tu mesa${tableText}.`
        : `Tu pedido está empacado y caliente en mostrador de sucursal. ¡Pasa por él cuando gustes!`;
      break;

    case 'entregado':
      title = `✨ ¡Orden #${orderId} Completada!`;
      body = `¡Gracias por elegir THE HOME PIPO! Esperamos que disfrutes cada rebanada artesanal.`;
      break;

    default:
      body = `Actualización de estado en tu pedido #${orderId}.`;
  }

  return sendNotificationViaServiceWorker(title, {
    body,
    tag,
    url: '/#tracker',
    icon: BRAND_NOTIFICATION_ICON,
    badge: BRAND_NOTIFICATION_BADGE,
    data: { orderId, status },
  });
}

// ==========================================
// PROMOTIONS & ANNOUNCEMENTS NOTIFICATIONS
// ==========================================

export async function notifyPromo(promo: {
  code: string;
  discountPercent?: number;
  description?: string;
  minSpend?: number;
}): Promise<boolean> {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled || !prefs.specialPromos) {
    return false;
  }

  const discountText = promo.discountPercent ? `${promo.discountPercent}% DE DESCUENTO` : 'DESCUENTO ESPECIAL';
  const title = `🎁 ¡Cupón Exclusivo: ${promo.code}!`;
  const body = promo.description
    ? `${promo.description} • Usa el código ${promo.code} en tu carrito y obtén ${discountText}.`
    : `¡Aprovecha ${discountText} en pizzas artesanales con el código ${promo.code}!`;

  return sendNotificationViaServiceWorker(title, {
    body,
    tag: `pipo-promo-${promo.code}`,
    url: '/#menu',
    icon: BRAND_NOTIFICATION_ICON,
    badge: BRAND_NOTIFICATION_BADGE,
    data: { promoCode: promo.code },
  });
}

export async function notifyCustomAnnouncement(
  title: string,
  message: string,
  url = '/#menu'
): Promise<boolean> {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled) {
    return false;
  }

  return sendNotificationViaServiceWorker(title, {
    body: message,
    tag: `pipo-announcement-${Date.now()}`,
    url,
    icon: BRAND_NOTIFICATION_ICON,
    badge: BRAND_NOTIFICATION_BADGE,
  });
}

