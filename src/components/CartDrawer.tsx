import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, Store, UtensilsCrossed, ArrowRight, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { CartItem, Order, PromoCode } from '../types';
import { PROMO_CODES } from '../data/menu';
import { soundService } from '../utils/audio';
import { buildWhatsAppOrderUrl, PIPO_FORMATTED_PHONE } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onPlaceOrder: (order: Order) => void;
  promos?: PromoCode[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  promos,
}) => {
  if (!isOpen) return null;

  const currentPromos = promos || PROMO_CODES;

  const [orderType, setOrderType] = useState<'pickup' | 'dine_in'>('pickup');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta_sucursal' | 'transferencia'>('efectivo');

  // Coupon code
  const [couponInput, setCouponInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Tip
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.discountFixed) {
      discount = appliedPromo.discountFixed;
    }
  }

  const tip = Math.round((subtotal * tipPercent) / 100);
  const total = Math.max(0, subtotal - discount + tip);

  const handleApplyCoupon = () => {
    setCouponError(null);
    const found = currentPromos.find((p) => p.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (!found) {
      setCouponError('Código promocional no válido.');
      return;
    }
    if (found.minSpend && subtotal < found.minSpend) {
      setCouponError(`Compra mínima para este cupón: $${found.minSpend} MXN`);
      return;
    }
    setAppliedPromo(found);
    setCouponInput('');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor ingresa tu nombre y número de teléfono.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: `PIPO-${Math.floor(100000 + Math.random() * 900000)}`,
        items: cartItems,
        orderType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        tableNumber: orderType === 'dine_in' && tableNumber.trim() ? tableNumber.trim() : undefined,
        notes: specialNotes.trim() || undefined,
        paymentMethod,
        subtotal,
        discount,
        tip,
        total,
        status: 'recibido',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedMinutes: 15,
      };

      // Generate WhatsApp order message and URL for 55 6747 0079
      const whatsappUrl = buildWhatsAppOrderUrl(newOrder);
      
      // Open WhatsApp in new tab/window for the customer
      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('Error opening WhatsApp', err);
      }

      // Play subtle pleasant sound notification on successful order placement
      soundService.playOrderSuccessSound();
      onPlaceOrder(newOrder);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 dark:bg-black/80 backdrop-blur-sm"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <motion.div
          initial={{ opacity: 0, x: '100%', scale: 0.98 }}
          animate={{ opacity: 1, x: '0%', scale: 1 }}
          exit={{ opacity: 0, x: '100%', scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          className="w-screen max-w-md bg-white dark:bg-[#181614] border-l border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 flex flex-col shadow-2xl transition-colors"
        >
          
          {/* Header */}
          <div className="p-5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-orange-400 rounded-xl border border-red-200 dark:border-red-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black font-serif text-stone-900 dark:text-white">Tu Pedido - THE HOME PIPO</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">{cartItems.length} artículos en el carrito</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-800 dark:hover:text-white rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400 dark:text-stone-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white font-serif">Tu carrito está vacío</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                  Agrega deliciosas pizzas cocinadas sobre piedra volcánica en horno de gas, entradas o crea la tuya personalizada.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Ver Menú Pipo
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                    1. Resumen de Artículos
                  </span>

                  {cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-stone-50 dark:bg-stone-900/90 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white truncate">{item.title}</h4>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-snug">{item.detailsText}</p>
                        
                        {item.specialInstructions && (
                          <p className="text-[10px] text-orange-700 dark:text-orange-400 italic mt-1">
                            Nota: "{item.specialInstructions}"
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-2 bg-white dark:bg-stone-950 px-2 py-0.5 rounded-lg border border-stone-200 dark:border-stone-800 text-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                              className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-stone-900 dark:text-white text-xs">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-black text-amber-700 dark:text-amber-400">
                            ${item.unitPrice * item.quantity} MXN
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Eliminar artículo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pickup vs Dine-in Mode */}
                <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                    2. Modalidad de Servicio
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        orderType === 'pickup'
                          ? 'bg-amber-100 dark:bg-gradient-to-r dark:from-red-950 dark:to-orange-950 border-amber-400 dark:border-orange-500 text-stone-900 dark:text-white shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Para Recoger</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('dine_in')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        orderType === 'dine_in'
                          ? 'bg-orange-100 dark:bg-gradient-to-r dark:from-red-950 dark:to-orange-950 border-orange-400 dark:border-orange-500 text-stone-900 dark:text-white shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <UtensilsCrossed className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span>Comer en Local</span>
                    </button>
                  </div>

                  {orderType === 'pickup' ? (
                    <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300">
                      📍 <strong>Recogida en mostrador:</strong> Tu pedido estará recién salido del horno en aprox. 15-20 minutos en nuestra sucursal.
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] text-stone-700 dark:text-stone-300 block font-bold">
                        Número de Mesa (Opcional si ya estás sentado)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Mesa 4, Barra, Terraza..."
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                {/* Customer Information */}
                <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                    3. Datos del Cliente
                  </span>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Tu Nombre Completo *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />

                    <input
                      type="tel"
                      placeholder="Teléfono / WhatsApp (para aviso de horneado) *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />

                    <input
                      type="text"
                      placeholder="Notas especiales (ej: partir en 8 pedazos, orilla bien doradita)"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                    4. Método de Pago en Sucursal
                  </span>

                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    {[
                      { id: 'efectivo', label: 'Efectivo' },
                      { id: 'tarjeta_sucursal', label: 'Tarjeta' },
                      { id: 'transferencia', label: 'Transferencia' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`py-2 px-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                          paymentMethod === p.id
                            ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-400 text-amber-900 dark:text-amber-300'
                            : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código de descuento (ej: PIPO20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-amber-500 uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-amber-300 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>

                  {appliedPromo && (
                    <div className="text-xs text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 p-2 rounded-lg flex items-center justify-between">
                      <span>✓ Cupón {appliedPromo.code}: {appliedPromo.description}</span>
                      <button onClick={() => setAppliedPromo(null)} className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">✕</button>
                    </div>
                  )}

                  {couponError && <p className="text-[11px] text-red-600 dark:text-red-400">{couponError}</p>}
                </div>

                {/* Tip Selector */}
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-700 dark:text-stone-300">
                    <span>Propina para el Equipo del Horno:</span>
                    <span className="font-bold text-amber-800 dark:text-amber-300">${tip} MXN</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setTipPercent(pct)}
                        className={`py-1 rounded-lg border text-xs font-bold cursor-pointer ${
                          tipPercent === pct
                            ? 'bg-amber-400 text-stone-950 border-amber-400 font-black'
                            : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                        }`}
                      >
                        {pct === 0 ? 'Sin propina' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Totals Summary */}
                <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs text-stone-700 dark:text-stone-300 shadow-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-stone-900 dark:text-white">${subtotal} MXN</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                      <span>Descuento Promocional:</span>
                      <span className="font-semibold">-${discount} MXN</span>
                    </div>
                  )}

                  {tip > 0 && (
                    <div className="flex justify-between">
                      <span>Propina Maestros Pizzeros:</span>
                      <span className="font-semibold text-stone-900 dark:text-white">${tip} MXN</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-base font-black text-amber-800 dark:text-amber-400">
                    <span>Total a Pagar en Caja:</span>
                    <span>${total} MXN</span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Checkout Action Button */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 space-y-2">
              <button
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-500 text-white font-black text-sm rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
                    <span>Enviando comanda a WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>Confirmar y Enviar por WhatsApp (${total} MXN)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold text-center">
                <span>📱 Envío directo a WhatsApp de la sucursal:</span>
                <strong className="font-extrabold">{PIPO_FORMATTED_PHONE}</strong>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </motion.div>
  );
};
