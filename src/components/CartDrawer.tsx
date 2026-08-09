import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, Bike, Store, Check, ArrowRight, DollarSign, Loader2 } from 'lucide-react';
import { CartItem, Order, PromoCode } from '../types';
import { PROMO_CODES, DELIVERY_ZONES } from '../data/menu';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onPlaceOrder: (order: Order) => void;
  promos?: PromoCode[];
  zones?: Array<{ name: string; fee: number; estimatedTime: string; available: boolean }>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  promos,
  zones,
}) => {
  if (!isOpen) return null;

  const currentPromos = promos || PROMO_CODES;
  const currentZones = zones || DELIVERY_ZONES;

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedZoneName, setSelectedZoneName] = useState<string>(currentZones[0]?.name || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta_entrega' | 'transferencia'>('efectivo');

  // Coupon code
  const [couponInput, setCouponInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Tip
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedZone = currentZones.find((z) => z.name === selectedZoneName) || currentZones[0] || { name: 'Centro', fee: 0 };
  const deliveryFee = orderType === 'delivery' ? selectedZone.fee : 0;

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
  const total = Math.max(0, subtotal - discount + deliveryFee + tip);

  const handleApplyCoupon = () => {
    setCouponError(null);
    const found = currentPromos.find((p) => p.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (!found) {
      setCouponError('Código no válido.');
      return;
    }
    if (found.minSpend && subtotal < found.minSpend) {
      setCouponError(`Compra mínima para este cupón: $${found.minSpend}`);
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
    if (orderType === 'delivery' && !customerAddress.trim()) {
      alert('Por favor ingresa la dirección de entrega.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: `PIPO-${Math.floor(100000 + Math.random() * 900000)}`,
        items: cartItems,
        orderType,
        customerName,
        customerPhone,
        customerAddress: orderType === 'delivery' ? customerAddress : undefined,
        neighborhood: orderType === 'delivery' ? selectedZoneName : undefined,
        paymentMethod,
        subtotal,
        discount,
        deliveryFee,
        tip,
        total,
        status: 'recibido',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedMinutes: orderType === 'delivery' ? 35 : 20,
      };

      onPlaceOrder(newOrder);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#181614] border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-600/20 text-orange-400 rounded-xl border border-red-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black font-serif text-white">Tu Pedido Pipo</h2>
                <p className="text-xs text-stone-400">{cartItems.length} artículos en el carrito</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-900 flex items-center justify-center text-stone-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white font-serif">Tu carrito está vacío</h3>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Agrega deliciosas pizzas, alitas o crea la tuya desde el menú.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xs rounded-xl"
                >
                  Ir al Menú
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    1. Resumen de Artículos
                  </span>

                  {cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{item.detailsText}</p>
                        
                        {item.specialInstructions && (
                          <p className="text-[10px] text-orange-400 italic mt-1">
                            Nota: "{item.specialInstructions}"
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-2 bg-stone-950 px-2 py-0.5 rounded-lg border border-stone-800 text-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                              className="text-stone-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-white text-xs">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-stone-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-black text-amber-400">
                            ${item.unitPrice * item.quantity}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery vs Pickup Toggle */}
                <div className="space-y-3 pt-2 border-t border-stone-800">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    2. Modalidad de Entrega
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        orderType === 'delivery'
                          ? 'bg-gradient-to-r from-red-950 to-orange-950 border-orange-500 text-white shadow'
                          : 'bg-stone-900 border-stone-800 text-stone-400'
                      }`}
                    >
                      <Bike className="w-4 h-4 text-orange-400" />
                      <span>Domicilio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        orderType === 'pickup'
                          ? 'bg-gradient-to-r from-red-950 to-orange-950 border-orange-500 text-white shadow'
                          : 'bg-stone-900 border-stone-800 text-stone-400'
                      }`}
                    >
                      <Store className="w-4 h-4 text-amber-400" />
                      <span>Recoger</span>
                    </button>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] text-stone-400 block font-semibold">
                        Selecciona tu Colonia / Zona
                      </label>
                      <select
                        value={selectedZoneName}
                        onChange={(e) => setSelectedZoneName(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {currentZones.map((zone) => (
                          <option key={zone.name} value={zone.name}>
                            {zone.name} ({zone.fee > 0 ? `+$${zone.fee} envío` : 'ENVÍO GRATIS'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Customer Information */}
                <div className="space-y-3 pt-2 border-t border-stone-800">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    3. Datos del Cliente
                  </span>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Tu Nombre Completo *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />

                    <input
                      type="tel"
                      placeholder="Teléfono de Contacto (WhatsApp) *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />

                    {orderType === 'delivery' && (
                      <input
                        type="text"
                        placeholder="Calle, Número Exterior e Interior, Referencias *"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2 pt-2 border-t border-stone-800">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    4. Método de Pago
                  </span>

                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    {[
                      { id: 'efectivo', label: 'Efectivo' },
                      { id: 'tarjeta_entrega', label: 'Tarjeta' },
                      { id: 'transferencia', label: 'Transferencia' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`py-2 px-2 rounded-xl border font-bold text-center transition-all ${
                          paymentMethod === p.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-stone-900 border-stone-800 text-stone-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="pt-2 border-t border-stone-800 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código promocional (ej: PIPO20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold rounded-xl border border-stone-700"
                    >
                      Aplicar
                    </button>
                  </div>

                  {appliedPromo && (
                    <div className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-lg flex items-center justify-between">
                      <span>✓ Cupón {appliedPromo.code}: {appliedPromo.description}</span>
                      <button onClick={() => setAppliedPromo(null)} className="text-stone-400 hover:text-white">✕</button>
                    </div>
                  )}

                  {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
                </div>

                {/* Tip Selector */}
                <div className="pt-2 border-t border-stone-800 space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-300">
                    <span>Propina para el Repartidor:</span>
                    <span className="font-bold text-amber-300">${tip}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setTipPercent(pct)}
                        className={`py-1 rounded-lg border text-xs font-bold ${
                          tipPercent === pct
                            ? 'bg-amber-400 text-stone-950 border-amber-400'
                            : 'bg-stone-900 border-stone-800 text-stone-400'
                        }`}
                      >
                        {pct === 0 ? 'Sin propina' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Totals Summary */}
                <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-2 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-white">${subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Descuento Promocional:</span>
                      <span className="font-semibold">-${discount}</span>
                    </div>
                  )}

                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Envío ({selectedZoneName}):</span>
                      <span className="font-semibold text-white">
                        {deliveryFee > 0 ? `$${deliveryFee}` : 'GRATIS'}
                      </span>
                    </div>
                  )}

                  {tip > 0 && (
                    <div className="flex justify-between">
                      <span>Propina Repartidor:</span>
                      <span className="font-semibold text-white">${tip}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-800 flex justify-between text-base font-black text-amber-400">
                    <span>Total a Pagar:</span>
                    <span>${total}</span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Checkout Action Button */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-stone-900 border-t border-stone-800">
              <button
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-red-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
                    <span>Procesando tu pedido...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar y Enviar Pedido (${total})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
