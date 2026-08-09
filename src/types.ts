export type PizzaSize = 'chica' | 'mediana' | 'grande' | 'familiar';

export interface SizeOption {
  id: PizzaSize;
  name: string;
  slices: number;
  cm: number;
  serves: string;
  priceMultiplier: number; // e.g. 1, 1.4, 1.8, 2.3
}

export type CrustType = 'tradicional' | 'delgada' | 'orilla_queso' | 'orilla_hierbas';

export interface CrustOption {
  id: CrustType;
  name: string;
  description: string;
  extraCost: number;
}

export type SauceType = 'tomate_clasico' | 'alfredo' | 'bbq_pipo' | 'pesto_fresco' | 'salsa_diabla';

export interface SauceOption {
  id: SauceType;
  name: string;
  color: string;
}

export type ToppingCoverage = 'full' | 'left' | 'right';

export interface Topping {
  id: string;
  name: string;
  category: 'carne' | 'vegetal' | 'queso' | 'especial';
  price: number;
  color: string;
  iconName?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'especiales' | 'clasicas' | 'entradas' | 'bebidas' | 'postres' | 'combos';
  description: string;
  basePrice: number; // Price for Chica/Base
  image: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  ingredients: string[];
  customizable?: boolean;
}

export interface CustomPizzaConfig {
  size: PizzaSize;
  crust: CrustType;
  sauce: SauceType;
  cheeseLevel: 'ligero' | 'normal' | 'extra';
  toppings: Array<{
    toppingId: string;
    coverage: ToppingCoverage;
  }>;
}

export interface CartItem {
  cartItemId: string;
  menuItem?: MenuItem;
  customPizza?: CustomPizzaConfig;
  title: string;
  detailsText: string;
  sizeName?: string;
  crustName?: string;
  unitPrice: number;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'recibido' | 'preparando' | 'horneando' | 'en_camino' | 'entregado';

export interface Order {
  id: string;
  items: CartItem[];
  orderType: 'delivery' | 'pickup';
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  neighborhood?: string;
  paymentMethod: 'efectivo' | 'tarjeta_entrega' | 'transferencia';
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tip: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  discountFixed?: number;
  description: string;
  minSpend?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  pizzaName?: string;
}

export interface AiRecommendationResponse {
  recommendationTitle: string;
  summaryReason: string;
  pizzas: Array<{
    name: string;
    description: string;
    suggestedSize: string;
    estimatedPrice: number;
    ingredients: string[];
  }>;
  totalEstimated: number;
  tipFromChef: string;
}
