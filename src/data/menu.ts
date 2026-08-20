import { MenuItem, SizeOption, CrustOption, SauceOption, Topping, PromoCode, Review } from '../types';

import heroPizzaImg from '../assets/images/pipo_hero_pizza_1786284977229.jpg';
import specialPizzaImg from '../assets/images/pipo_special_pizza_1786284990569.jpg';

// En THE HOME PIPO las pizzas son de una sola medida artesanal (~30 cm / 8 rebanadas)
export const PIZZA_SIZES: SizeOption[] = [
  { 
    id: 'unica', 
    name: 'Medida Única Artesanal', 
    slices: 8, 
    cm: 30, 
    serves: '2-3 Personas', 
    priceMultiplier: 1.0 
  },
];

// Opciones de masa: Masa Tradicional y Masa Doble ($30 MXN)
export const CRUST_OPTIONS: CrustOption[] = [
  { 
    id: 'tradicional', 
    name: 'Masa Tradicional Artesanal', 
    description: 'Estirado a mano, cocción directa sobre piedra volcánica', 
    extraCost: 0 
  },
  { 
    id: 'doble', 
    name: 'Masa Doble (+ $30 MXN)', 
    description: 'Masa artesanal de doble grosor para mayor cuerpo y esponjosidad', 
    extraCost: 30 
  },
];

export const SAUCE_OPTIONS: SauceOption[] = [
  { id: 'tomate_clasico', name: 'Salsa Pomodoro de la Casa', color: '#DC2626' },
  { id: 'salsa_diabla', name: 'Salsa Diabla Picante Pipo 🌶️', color: '#991B1B' },
  { id: 'pesto_fresco', name: 'Salsa Pesto con Albahaca', color: '#15803D' },
];

export const TOPPINGS: Topping[] = [
  // Carnes y Marina (Ingrediente Extra: $30 MXN)
  { id: 'pastor', name: 'Pastor', category: 'carne', price: 30, color: '#EA580C', available: true },
  { id: 'chorizo', name: 'Chorizo', category: 'carne', price: 30, color: '#DC2626', available: true },
  { id: 'chorizo_arg', name: 'Chorizo Argentino', category: 'carne', price: 30, color: '#B91C1C', available: true },
  { id: 'pepperoni', name: 'Pepperoni', category: 'carne', price: 30, color: '#C2410C', available: true },
  { id: 'salami', name: 'Salami', category: 'carne', price: 30, color: '#991B1B', available: true },
  { id: 'jamon', name: 'Jamón', category: 'carne', price: 30, color: '#FB7185', available: true },
  { id: 'tocino', name: 'Tocino', category: 'carne', price: 30, color: '#9A3412', available: true },
  { id: 'pollo', name: 'Pollo', category: 'carne', price: 30, color: '#D97706', available: true },
  { id: 'carne', name: 'Carne', category: 'carne', price: 30, color: '#78350F', available: true },
  { id: 'camarones', name: 'Camarones', category: 'marina', price: 30, color: '#F97316', available: true },

  // Quesos ($30 MXN)
  { id: 'mozzarella', name: 'Extra Mozzarella', category: 'queso', price: 30, color: '#FEF08A', available: true },
  { id: 'queso_crema', name: 'Queso Crema', category: 'queso', price: 30, color: '#FFFFFF', available: true },
  { id: 'roquefort', name: 'Roquefort', category: 'queso', price: 30, color: '#94A3B8', available: true },
  { id: 'parmesano', name: 'Parmesano', category: 'queso', price: 30, color: '#FDE047', available: true },

  // Vegetales ($30 MXN)
  { id: 'champinones', name: 'Champiñones', category: 'vegetal', price: 30, color: '#A16207', available: true },
  { id: 'pimiento', name: 'Pimiento', category: 'vegetal', price: 30, color: '#16A34A', available: true },
  { id: 'cebolla', name: 'Cebolla', category: 'vegetal', price: 30, color: '#A855F7', available: true },
  { id: 'pina', name: 'Piña', category: 'vegetal', price: 30, color: '#EAB308', available: true },
  { id: 'aceitunas_negras', name: 'Aceitunas Negras', category: 'vegetal', price: 30, color: '#1F2937', available: true },
  { id: 'jalapeno', name: 'Jalapeño 🌶️', category: 'vegetal', price: 30, color: '#15803D', available: true },
  { id: 'cilantro', name: 'Cilantro', category: 'vegetal', price: 30, color: '#22C55E', available: true },
  { id: 'tomate', name: 'Tomate', category: 'vegetal', price: 30, color: '#EF4444', available: true },
  { id: 'albahaca', name: 'Albahaca Deshidratada', category: 'vegetal', price: 30, color: '#15803D', available: true },
];

/**
 * MENÚ OFICIAL DE "THE HOME PIPO - PIZZAS ARTESANALES"
 * Cocinadas sobre piedra volcánica en horno de gas. Medida única artesanal.
 */
export const MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // CARNES (Página 1)
  // ==========================================
  {
    id: 'pipo_poderosa',
    name: 'Poderosa',
    category: 'carnes',
    description: 'Nuestra especialidad suprema: carnes, pastor, pollo, chorizo, pepperoni, cebolla y cilantro.',
    basePrice: 220,
    image: heroPizzaImg,
    popular: true,
    ingredients: ['Carnes', 'Pastor', 'Pollo', 'Chorizo', 'Pepperoni', 'Cebolla', 'Cilantro'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_pastorella',
    name: 'Pastorella',
    category: 'carnes',
    description: 'Sabor tradicional mexicano: pastor marinado, chorizo, piña dulce, cilantro fresco y cebolla.',
    basePrice: 170,
    image: specialPizzaImg,
    popular: true,
    ingredients: ['Pastor', 'Chorizo', 'Piña', 'Cilantro', 'Cebolla'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_ibiza',
    name: 'Ibiza',
    category: 'carnes',
    description: 'Combinación mediterránea con chorizo artesanal, piña, cebolla y un suave toque de queso crema.',
    basePrice: 170,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Chorizo', 'Piña', 'Cebolla', 'Queso Crema'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_mexicana',
    name: 'Mexicana',
    category: 'carnes',
    description: 'Auténtico toque mexicano: chorizo, pimiento fresco, jalapeño y cebolla sobre base crujiente.',
    basePrice: 150,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    spicy: true,
    ingredients: ['Chorizo', 'Pimiento', 'Jalapeño', 'Cebolla'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_campechana',
    name: 'Campechana',
    category: 'carnes',
    description: 'Sabrosa combinación de carne de res sazonada, chorizo, cilantro fresco y cebolla.',
    basePrice: 150,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Carne', 'Chorizo', 'Cilantro', 'Cebolla'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_madagascar',
    name: 'Madagascar',
    category: 'carnes',
    description: 'Pechuga de pollo jugosa, pimiento, cebolla y la cremosidad inigualable del queso crema.',
    basePrice: 150,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Pollo', 'Pimiento', 'Cebolla', 'Queso Crema'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_siciliana',
    name: 'Siciliana',
    category: 'carnes',
    description: 'Exquisito chorizo argentino, champiñones frescos y tiras de pimiento.',
    basePrice: 130,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Chorizo Argentino', 'Champiñones', 'Pimiento'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },

  // ==========================================
  // MARINA (Página 1)
  // ==========================================
  {
    id: 'pipo_venecia',
    name: 'Venecia',
    category: 'marina',
    description: 'Camarones seleccionados, champiñones frescos y queso crema suave y fundente.',
    basePrice: 170,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Camarones', 'Champiñones', 'Queso Crema'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_maremonti',
    name: 'Maremonti',
    category: 'marina',
    description: 'La unión perfecta de mar y tierra: camarón tierno con champiñones frescos de temporada.',
    basePrice: 160,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Camarón', 'Champiñones'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },

  // ==========================================
  // CARNE FRIA (Página 2)
  // ==========================================
  {
    id: 'pipo_carnes_frias',
    name: 'Carnes Frías',
    category: 'carne_fria',
    description: 'Festín de charcutería: salami italiano, pepperoni dorado, jamón de pierna y tocino crujiente.',
    basePrice: 160,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Salami', 'Pepperoni', 'Jamón', 'Tocino'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_monaco',
    name: 'Monaco',
    category: 'carne_fria',
    description: 'Sabor gourmet europeo: tocino ahumado, queso roquefort añejo y aceitunas negras.',
    basePrice: 140,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Tocino', 'Roquefort', 'Aceitunas'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_malta',
    name: 'Malta',
    category: 'carne_fria',
    description: 'Jamón horneado, champiñones frescos y pimiento dulce sobre queso fundido.',
    basePrice: 130,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Jamón', 'Champiñones', 'Pimiento'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_honolulu',
    name: 'Honolulu',
    category: 'carne_fria',
    description: 'Tocino dorado y crujiente, piña agridulce y abundante queso crema.',
    basePrice: 130,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Tocino', 'Piña', 'Queso Crema'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_noruega',
    name: 'Noruega',
    category: 'carne_fria',
    description: 'La combinación favorita: pepperoni crujiente de primera calidad con champiñones frescos.',
    basePrice: 120,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Pepperoni', 'Champiñones'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_hawaiana',
    name: 'Hawaiana',
    category: 'carne_fria',
    description: 'La clásica consentida: rebanadas de jamón de primera y trozos de piña miel horneada.',
    basePrice: 120,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Jamón', 'Piña'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_verona',
    name: 'Verona',
    category: 'carne_fria',
    description: 'El toque dulce y especiado: abundante pepperoni con trozos de piña.',
    basePrice: 120,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Pepperoni', 'Piña'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_firence',
    name: 'Firence',
    category: 'carne_fria',
    description: 'Sabor del norte de Italia: salami italiano curado con champiñones frescos laminados.',
    basePrice: 120,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Salami', 'Champiñones'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_bicho_rojo',
    name: 'Bicho Rojo',
    category: 'carne_fria',
    description: 'Sencilla, deliciosa y económica: rodajas generosas de pepperoni y extra queso mozzarella.',
    basePrice: 99,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Pepperoni', 'Mozzarella'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_moana',
    name: 'Moana',
    category: 'carne_fria',
    description: 'Sabor clásico familiar al mejor precio: jamón selecto con queso mozzarella fundido.',
    basePrice: 99,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Jamón', 'Mozzarella'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },

  // ==========================================
  // QUESOS (Página 3)
  // ==========================================
  {
    id: 'pipo_holanda',
    name: 'Holanda',
    category: 'quesos',
    description: 'Cuarteto de quesos finos: mozzarella fundente, roquefort especiado, parmesano y queso crema.',
    basePrice: 160,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    vegetarian: true,
    popular: true,
    ingredients: ['Mozzarella', 'Roquefort', 'Parmesano', 'Queso Crema'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_taipei',
    name: 'Taipei',
    category: 'quesos',
    description: 'Intensidad total: tocino ahumado, mozzarella, roquefort, parmesano y queso crema.',
    basePrice: 180,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    popular: true,
    ingredients: ['Tocino', 'Mozzarella', 'Roquefort', 'Parmesano', 'Queso Crema'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_catania',
    name: 'Catania',
    category: 'quesos',
    description: 'Aceitunas negras mediterráneas, roquefort, parmesano, mozzarella y suave queso crema.',
    basePrice: 180,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    vegetarian: true,
    ingredients: ['Aceitunas Negras', 'Roquefort', 'Parmesano', 'Mozzarella', 'Queso Crema'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_miami',
    name: 'Miami',
    category: 'quesos',
    description: 'Salami italiano curado, mozzarella, parmesano dorado, roquefort y queso crema.',
    basePrice: 180,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Salami', 'Mozzarella', 'Parmesano', 'Roquefort', 'Queso Crema'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },

  // ==========================================
  // VEGETALES (Página 3)
  // ==========================================
  {
    id: 'pipo_vegetariana',
    name: 'Vegetariana',
    category: 'vegetales',
    description: 'Frescura del huerto: champiñones frescos, cebolla morada, pimiento, tomate y aceitunas negras.',
    basePrice: 160,
    image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=800&q=80',
    vegetarian: true,
    popular: true,
    ingredients: ['Champiñones', 'Cebolla', 'Pimiento', 'Tomate', 'Aceitunas'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_grecia',
    name: 'Grecia',
    category: 'vegetales',
    description: 'Sencilla y deliciosa: champiñones frescos de temporada con abundante queso mozzarella.',
    basePrice: 99,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    vegetarian: true,
    ingredients: ['Champiñones', 'Mozzarella'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_margarita',
    name: 'Margarita',
    category: 'vegetales',
    description: 'El clásico italiano tradicional: rebanadas de tomate fresco y albahaca deshidratada aromática.',
    basePrice: 99,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    vegetarian: true,
    popular: true,
    ingredients: ['Tomate', 'Albahaca Deshidratada'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },
  {
    id: 'pipo_avandaro',
    name: 'Avandaro',
    category: 'vegetales',
    description: 'Equilibrio perfecto: champiñón, pimiento, cebolla, piña dulce y jamón sobre piedra volcánica.',
    basePrice: 160,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Champiñón', 'Pimiento', 'Cebolla', 'Piña', 'Jamón'],
    customizable: true,
    sizeLabel: 'Medida Única (30 cm - 8 rebanadas)',
  },

  // ==========================================
  // ADICIONALES & BEBIDAS (Página 2)
  // ==========================================
  {
    id: 'pipo_masa_doble_item',
    name: 'Masa Doble',
    category: 'adicionales_bebidas',
    description: 'Masa artesanal con el doble de grosor para quienes prefieren una base más esponjosa y robusta.',
    basePrice: 30,
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Masa Doble Artesanal'],
    customizable: false,
  },
  {
    id: 'pipo_ingrediente_extra_item',
    name: 'Ingrediente Extra',
    category: 'adicionales_bebidas',
    description: 'Porción adicional generosa de cualquier ingrediente de nuestra barra para tu pizza favorita.',
    basePrice: 30,
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Porción Extra a Elegir'],
    customizable: false,
  },
  {
    id: 'pipo_refresco_sabor_item',
    name: 'Refresco de Sabor',
    category: 'adicionales_bebidas',
    description: 'Refresco bien frío de sabor (Manzana, Toronja, Naranja, Limón o Cola).',
    basePrice: 20,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Refresco Individual Frío'],
    customizable: false,
  },
];

export const PROMO_CODES: PromoCode[] = [
  { code: 'PIPO10', discountPercent: 10, description: '10% de descuento en tu pedido online', minSpend: 150 },
  { code: 'VOLCANICA', discountFixed: 25, description: '$25 MXN de descuento en pedidos mayores a $200', minSpend: 200 },
];

export const DELIVERY_ZONES = [
  { name: 'Zona Centro / Alrededores Pizzería', fee: 0, estimatedTime: '15-20 min', available: true },
  { name: 'Zona Urbana / Colonias Cercanas', fee: 20, estimatedTime: '20-30 min', available: true },
  { name: 'Zona Periférica / Entregas Especiales', fee: 35, estimatedTime: '30-40 min', available: true },
];

export const REVIEWS: Review[] = [
  {
    id: 'rev_1',
    author: 'Carlos Mendoza',
    rating: 5,
    comment: '¡La mejor pizza de la zona! La cocción en piedra volcánica en horno de gas le da una base crujiente perfecta sin quemar la masa. La Poderosa y la Pastorella son otro nivel.',
    date: 'Hace 2 días',
    pizzaName: 'Poderosa',
  },
  {
    id: 'rev_2',
    author: 'Valeria Gómez',
    rating: 5,
    comment: 'El tamaño de la pizza es ideal para compartir, masa fresca y el queso crema en la Venecia y la Ibiza queda espectacular. Servicio rápido para recoger.',
    date: 'Hace 4 días',
    pizzaName: 'Venecia',
  },
  {
    id: 'rev_3',
    author: 'Mariano Ruiz',
    rating: 5,
    comment: 'Pizzas artesanales de verdad a un precio súper justo. La Bicho Rojo de $99 y la Holanda de 4 quesos están deliciosas.',
    date: 'Hace 1 semana',
    pizzaName: 'Holanda',
  },
];
