import { MenuItem, SizeOption, CrustOption, SauceOption, Topping, PromoCode, Review } from '../types';

import heroPizzaImg from '../assets/images/pipo_hero_pizza_1786284977229.jpg';
import specialPizzaImg from '../assets/images/pipo_special_pizza_1786284990569.jpg';
import wingsComboImg from '../assets/images/pipo_wings_combo_1786285004349.jpg';

export const PIZZA_SIZES: SizeOption[] = [
  { id: 'chica', name: 'Chica', slices: 4, cm: 25, serves: '1 Persona', priceMultiplier: 1.0 },
  { id: 'mediana', name: 'Mediana', slices: 6, cm: 30, serves: '2 Personas', priceMultiplier: 1.35 },
  { id: 'grande', name: 'Grande', slices: 8, cm: 35, serves: '3-4 Personas', priceMultiplier: 1.75 },
  { id: 'familiar', name: 'Familiar', slices: 12, cm: 40, serves: '4-6 Personas', priceMultiplier: 2.25 },
];

export const CRUST_OPTIONS: CrustOption[] = [
  { id: 'tradicional', name: 'Masa Tradicional Pipo', description: 'Grosor mediano, crujiente por fuera y suave por dentro', extraCost: 0 },
  { id: 'delgada', name: 'Delgada Italiana', description: 'Masa ultra fina estilo romano bien dorada', extraCost: 0 },
  { id: 'orilla_queso', name: 'Orilla Rellena de Queso', description: 'Borde abundante con mezcla de queso Mozzarella horneado', extraCost: 35 },
  { id: 'orilla_hierbas', name: 'Orilla Ajo & Hierbas Italianas', description: 'Sazonada con mantequilla de ajo, orégano y parmesano', extraCost: 20 },
];

export const SAUCE_OPTIONS: SauceOption[] = [
  { id: 'tomate_clasico', name: 'Salsa de Tomate Pomodoro', color: '#DC2626' },
  { id: 'alfredo', name: 'Salsa Cremosa Alfredo', color: '#FEF08A' },
  { id: 'bbq_pipo', name: 'Salsa BBQ Dulce Ahumada', color: '#7C2D12' },
  { id: 'pesto_fresco', name: 'Salsa Pesto de Albahaca', color: '#15803D' },
  { id: 'salsa_diabla', name: 'Salsa Diabla Picante Pipo 🌶️', color: '#991B1B' },
];

export const TOPPINGS: Topping[] = [
  // Carnes
  { id: 'pepperoni', name: 'Pepperoni Crujiente', category: 'carne', price: 20, color: '#C2410C' },
  { id: 'jamon', name: 'Jamón Ahumado', category: 'carne', price: 18, color: '#F87171' },
  { id: 'tocino', name: 'Tocino Dorado', category: 'carne', price: 22, color: '#B91C1C' },
  { id: 'salchicha', name: 'Salchicha Italiana', category: 'carne', price: 20, color: '#78350F' },
  { id: 'pollo_bbq', name: 'Pollo Desmenuzado BBQ', category: 'carne', price: 22, color: '#D97706' },
  { id: 'carne_molida', name: 'Carne de Res Sazonada', category: 'carne', price: 22, color: '#451A03' },
  
  // Vegetales
  { id: 'champinones', name: 'Champiñones Frescos', category: 'vegetal', price: 15, color: '#A16207' },
  { id: 'pimientos', name: 'Pimientos Verdes y Rojos', category: 'vegetal', price: 14, color: '#16A34A' },
  { id: 'aceitunas', name: 'Aceitunas Negras', category: 'vegetal', price: 14, color: '#1F2937' },
  { id: 'pina', name: 'Piña Dulce Glaseada', category: 'vegetal', price: 15, color: '#EAB308' },
  { id: 'cebolla_morada', name: 'Cebolla Morada', category: 'vegetal', price: 12, color: '#A855F7' },
  { id: 'jalapenos', name: 'Jalapeños en Rodajas 🌶️', category: 'vegetal', price: 12, color: '#15803D' },
  { id: 'albahaca', name: 'Albahaca Fresca', category: 'vegetal', price: 12, color: '#22C55E' },
  { id: 'jitomate', name: 'Jitomate Cherry', category: 'vegetal', price: 14, color: '#EF4444' },

  // Quesos y Especiales
  { id: 'extra_mozzarella', name: 'Extra Queso Mozzarella', category: 'queso', price: 25, color: '#FEF08A' },
  { id: 'queso_azul', name: 'Queso Gorgonzola', category: 'queso', price: 25, color: '#E2E8F0' },
  { id: 'parmesano', name: 'Lajas de Parmesano', category: 'queso', price: 22, color: '#FEF3C7' },
];

export const MENU_ITEMS: MenuItem[] = [
  // ESPECIALES PIPO
  {
    id: 'pipo_supreme',
    name: 'Pizza Pipo Suprema',
    category: 'especiales',
    description: 'Nuestra especialidad insignia con pepperoni crujiente, jamón, tocino, salchicha italiana, champiñones, pimientos y aceitunas sobre salsa pomodoro.',
    basePrice: 169,
    image: heroPizzaImg,
    popular: true,
    ingredients: ['Pepperoni', 'Jamón', 'Tocino', 'Salchicha Italiana', 'Champiñones', 'Pimientos', 'Aceitunas Negras'],
    customizable: true,
  },
  {
    id: 'pipo_prosciutto_burrata',
    name: 'Pipo Prosciutto & Burrata Premium',
    category: 'especiales',
    description: 'Especialidad gourmet sobre masa delgada: prosciutto italiano curado, bola de burrata cremosa fresca, jitomate cherry, arugula y reducción de balsámico.',
    basePrice: 219,
    image: specialPizzaImg,
    popular: true,
    ingredients: ['Prosciutto', 'Burrata Fresca', 'Jitomate Cherry', 'Arugula', 'Glace de Balsámico'],
    customizable: true,
  },
  {
    id: 'pipo_diabla',
    name: 'Pipo la Diabla 🌶️',
    category: 'especiales',
    description: 'Para amantes del picante: salsa diabla especial Pipo, pepperoni doble, carne molida especiada, jalapeños, cebolla morada y gotas de habanero ahumado.',
    basePrice: 179,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    spicy: true,
    ingredients: ['Salsa Diabla', 'Double Pepperoni', 'Carne Molida', 'Jalapeños', 'Cebolla Morada'],
    customizable: true,
  },
  {
    id: 'pipo_cuatro_quesos',
    name: 'Pipo 4 Quesos Artesanales',
    category: 'especiales',
    description: 'Combinación cremosa y decadente de Queso Mozzarella, Gorgonzola ahumado, Gouda especiado y Parmesano Reggiano de larga maduración.',
    basePrice: 185,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    vegetarian: true,
    ingredients: ['Mozzarella', 'Gorgonzola', 'Gouda', 'Parmesano'],
    customizable: true,
  },
  {
    id: 'pipo_bbq_chicken',
    name: 'Pipo BBQ Ranch Pollo & Tocino',
    category: 'especiales',
    description: 'Salsa BBQ artesanal, tiras de pechuga de pollo marinada, tocino ahumado frito, cebolla morada y un espiral cremoso de aderezo ranch.',
    basePrice: 175,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Salsa BBQ Pipo', 'Pollo Marinado', 'Tocino', 'Cebolla Morada', 'Aderezo Ranch'],
    customizable: true,
  },

  // CLASICAS
  {
    id: 'pipo_pepperoni_clasica',
    name: 'Clásica Pepperoni Lovers',
    category: 'clasicas',
    description: 'El clásico atemporal: abundantes rodajas de pepperoni de primera calidad horneadas hasta quedar doradas y crujientes sobre queso fundido.',
    basePrice: 139,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Pepperoni Doble', 'Queso Mozzarella', 'Salsa Pomodoro'],
    customizable: true,
  },
  {
    id: 'pipo_hawaiiana',
    name: 'Clásica Hawaiana Pipo',
    category: 'clasicas',
    description: 'Equilibrio agridulce perfecto entre trozos de piña miel horneada, jamón ahumado tierno y extra queso mozzarella fundido.',
    basePrice: 145,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Jamón Ahumado', 'Piña Miel', 'Queso Mozzarella'],
    customizable: true,
  },
  {
    id: 'pipo_margherita',
    name: 'Margherita Napolitana',
    category: 'clasicas',
    description: 'Masa fina con salsa de tomate San Marzano, rodajas de jitomate fresco, mozzarella de búfala, hojas de albahaca fresca y chorrito de aceite de oliva extra virgen.',
    basePrice: 149,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    vegetarian: true,
    ingredients: ['Tomate San Marzano', 'Mozzarella', 'Albahaca Fresca', 'Aceite de Oliva EV'],
    customizable: true,
  },
  {
    id: 'pipo_veggie_garden',
    name: 'Veggie Garden Verde',
    category: 'clasicas',
    description: 'Champiñones frescos, pimientos tricolores, cebolla morada, aceitunas negras, jitomate y maíz dulce con un toque de hierbas provenzales.',
    basePrice: 149,
    image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=800&q=80',
    vegetarian: true,
    ingredients: ['Champiñones', 'Pimientos', 'Cebolla Morada', 'Aceitunas', 'Jitomate'],
    customizable: true,
  },

  // ENTRADAS & ACOMPAÑAMIENTOS
  {
    id: 'pipo_wings_combo',
    name: 'Alitas & Boneless Pipo (12 pzs)',
    category: 'entradas',
    description: 'Crujientes alitas y boneless de pollo bañados en tu salsa favorita (BBQ Ahumada, Buffalo Picante o Mango Habanero) con aderezo Ranch y varitas de apio.',
    basePrice: 149,
    image: wingsComboImg,
    popular: true,
    ingredients: ['Pollo Crujiente', 'Salsa a Elección', 'Aderezo Ranch', 'Apio y Zanahoria'],
  },
  {
    id: 'pipo_garlic_knots',
    name: 'Nudos de Ajo con Parmesano (8 pzs)',
    category: 'entradas',
    description: 'Suaves nudos de masa artesanal horneada, sazonados con mantequilla de ajo, perejil fresco y queso parmesano rallado. Incluye dip pomodoro.',
    basePrice: 79,
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Mantequilla de Ajo', 'Parmesano', 'Perejil', 'Dip Pomodoro'],
  },
  {
    id: 'pipo_cheese_sticks',
    name: 'Bastones Rellenos de Queso Mozzarella',
    category: 'entradas',
    description: 'Bastones de masa crocante rellenos de abundante queso mozzarella derretido con especias italianas. Servidos con dip de ajo o marinara.',
    basePrice: 89,
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Queso Mozzarella', 'Hierbas Italianas', 'Salsa Marinara'],
  },

  // BEBIDAS & POSTRES
  {
    id: 'pipo_refresco_2l',
    name: 'Refresco Familiar 2 Litros',
    category: 'bebidas',
    description: 'Coca-Cola, Coca-Cola Sin Azúcar, Sprite, Fanta o Mundet frío de 2 litros.',
    basePrice: 45,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    ingredients: ['2 Litros', 'Frío de Refrigerador'],
  },
  {
    id: 'pipo_calzone_nutella',
    name: 'Calzone de Nutella & Fresa',
    category: 'postres',
    description: 'Empanada horneada de masa dulce rellena de auténtica Nutella derretida, láminas de fresa fresca y espolvoreada con azúcar glass.',
    basePrice: 95,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Nutella', 'Fresas Frescas', 'Azúcar Glass'],
  },

  // COMBOS PIPO
  {
    id: 'pipo_combo_pareja',
    name: 'Combo Pareja Pipo',
    category: 'combos',
    description: '1 Pizza Grande de 2 Ingredientes a elegir + 1 Orden de Nudos de Ajo (8 pzs) + 2 Refrescos individuales de 600ml.',
    basePrice: 289,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['1 Pizza Grande', '1 Nudos de Ajo', '2 Refrescos 600ml'],
  },
  {
    id: 'pipo_combo_familiar_party',
    name: 'Combo Fiesta Familiar Pipo',
    category: 'combos',
    description: '2 Pizzas Familiares (Cualquier especialidad o clásicas) + 1 Orden de Alitas/Boneless (12 pzs) + 1 Refresco de 2L.',
    basePrice: 499,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['2 Pizzas Familiares', 'Alitas/Boneless 12 pzs', '1 Refresco 2L'],
  },
];

export const PROMO_CODES: PromoCode[] = [
  { code: 'PIPO20', discountPercent: 20, description: '20% de descuento en tu primer pedido', minSpend: 200 },
  { code: 'ENVIOFREE', discountFixed: 35, description: 'Envío gratis en compras mayores a $250', minSpend: 250 },
  { code: 'PIPOPARTY', discountPercent: 15, description: '15% de descuento adicional en la sección de Combos', minSpend: 400 },
];

export const DELIVERY_ZONES = [
  { name: 'Zona Centro / Histórico', fee: 0, estimatedTime: '25-35 min', available: true },
  { name: 'Colonia Roma / Condesa', fee: 25, estimatedTime: '30-40 min', available: true },
  { name: 'Polanco / Anzures', fee: 35, estimatedTime: '35-45 min', available: true },
  { name: 'Santa Fe / Interlomas', fee: 45, estimatedTime: '40-50 min', available: true },
  { name: 'Del Valle / Narvarte', fee: 25, estimatedTime: '30-40 min', available: true },
  { name: 'Coyoacán / San Ángel', fee: 35, estimatedTime: '35-45 min', available: true },
];

export const REVIEWS: Review[] = [
  {
    id: 'rev_1',
    author: 'Carlos Mendoza',
    rating: 5,
    comment: '¡La mejor pizza de la ciudad sin duda alguna! La orilla de queso con la salsa diabla es una combinación celestial. El pedido llegó súper rápido y humeante.',
    date: 'Hace 2 días',
    pizzaName: 'Pizza Pipo Suprema',
  },
  {
    id: 'rev_2',
    author: 'Valeria Gómez',
    rating: 5,
    comment: 'El creador visual de pizzas en la web está genial. Mi pizza Prosciutto & Burrata venía recién horneada, con insumos súper frescos. ¡Pipo nunca falla!',
    date: 'Hace 4 días',
    pizzaName: 'Pipo Prosciutto & Burrata',
  },
  {
    id: 'rev_3',
    author: 'Mariano Ruiz',
    rating: 5,
    comment: 'Usé el recomendador Pipo AI Chef para una reunión de 6 amigos y nos armó el combo perfecto. Las alitas BBQ y los nudos de ajo estaban deliciosos.',
    date: 'Hace 1 semana',
    pizzaName: 'Combo Fiesta Familiar Pipo',
  },
];
