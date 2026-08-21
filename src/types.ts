export type PizzaCategory = 
  | 'carnes'
  | 'marina'
  | 'carne_fria'
  | 'quesos'
  | 'vegetales'
  | 'adicionales_bebidas'
  | 'especiales'
  | 'clasicas'
  | 'entradas'
  | 'bebidas'
  | 'postres'
  | 'combos';

export type PizzaSize = 'unica' | 'chica' | 'mediana' | 'grande' | 'familiar';

export interface SizeOption {
  id: PizzaSize;
  name: string;
  slices: number;
  cm: number;
  serves: string;
  priceMultiplier: number;
}

export type CrustType = 'tradicional' | 'doble' | 'delgada' | 'orilla_queso' | 'orilla_hierbas';

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
  category: 'carne' | 'vegetal' | 'queso' | 'marina' | 'especial';
  price: number;
  color: string;
  iconName?: string;
  available?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: PizzaCategory;
  description: string;
  basePrice: number; // Precio en MXN (Medida única artesanal)
  image: string;
  available?: boolean;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  ingredients: string[];
  customizable?: boolean;
  sizeLabel?: string;
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

export type PizzaDoneness = 'poco_hecha' | 'normal' | 'muy_dorada';

export interface CartItem {
  cartItemId: string;
  menuItem?: MenuItem;
  customPizza?: CustomPizzaConfig;
  title: string;
  detailsText: string;
  sizeName?: string;
  crustName?: string;
  doneness?: PizzaDoneness;
  excludedIngredients?: string[];
  unitPrice: number;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'recibido' | 'preparando' | 'horneando' | 'listo' | 'entregado';

export interface Order {
  id: string;
  items: CartItem[];
  orderType: 'pickup' | 'dine_in';
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  notes?: string;
  paymentMethod: 'efectivo' | 'tarjeta_sucursal' | 'transferencia';
  subtotal: number;
  discount: number;
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
