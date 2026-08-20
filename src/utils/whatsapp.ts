import { Order } from '../types';

export const PIPO_WHATSAPP_NUMBER = '525567470079';
export const PIPO_FORMATTED_PHONE = '55 6747 0079';

export const buildWhatsAppOrderUrl = (
  order: Order,
  whatsappNumber: string = PIPO_WHATSAPP_NUMBER
): string => {
  const serviceType =
    order.orderType === 'dine_in'
      ? `🍽️ *COMER EN LOCAL* ${order.tableNumber ? `(Mesa #${order.tableNumber})` : ''}`
      : '🛍️ *PARA RECOGER EN SUCURSAL*';

  const paymentText =
    {
      efectivo: '💵 Efectivo al recibir',
      tarjeta_sucursal: '💳 Tarjeta en sucursal',
      transferencia: '📱 Transferencia bancaria',
    }[order.paymentMethod] || order.paymentMethod;

  const itemsList = order.items
    .map((item, idx) => {
      let itemStr = `*${idx + 1}. ${item.quantity}x ${item.title}* — $${item.unitPrice * item.quantity} MXN\n   • ${item.detailsText}`;
      if (item.specialInstructions) {
        itemStr += `\n   • 📝 Nota: _"${item.specialInstructions}"_`;
      }
      return itemStr;
    })
    .join('\n\n');

  let text = `🍕 *¡NUEVO PEDIDO CONFIRMADO! - THE HOME PIPO*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🆔 *Folio:* #${order.id}\n`;
  text += `👤 *Cliente:* ${order.customerName}\n`;
  text += `📞 *Teléfono:* ${order.customerPhone}\n`;
  text += `📍 *Modalidad:* ${serviceType}\n`;
  text += `💳 *Método de Pago:* ${paymentText}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📋 *PRODUCTOS:* \n\n${itemsList}\n\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *Subtotal:* $${order.subtotal} MXN\n`;
  if (order.discount && order.discount > 0) {
    text += `🏷️ *Descuento Aplicado:* -$${order.discount} MXN\n`;
  }
  if (order.tip && order.tip > 0) {
    text += `🤝 *Propina al Equipo:* +$${order.tip} MXN\n`;
  }
  text += `💵 *TOTAL A PAGAR:* *$${order.total} MXN*\n`;
  if (order.notes) {
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📝 *Instrucciones:* ${order.notes}\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🔥 _Horno de Gas sobre Piedras Volcánicas a 450°C_`;

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
};
