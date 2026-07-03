export type ListingStatus = 'draft' | 'pending_review' | 'published' | 'rejected';
export type Condition = 'new' | 'like_new' | 'good' | 'fair';
export type DeliveryMethod = 'pickup' | 'delivery_lapaz' | 'shipping_bo';

export type Category =
  | 'electronics'
  | 'fashion'
  | 'home'
  | 'sports'
  | 'vehicles'
  | 'other';

export interface CategoryInfo {
  id: Category;
  slug: string;
  name: string;
  image: string;
  description: string;
  faq: { q: string; a: string }[];
}

export interface Profile {
  id: string;
  displayName: string;
  email?: string;
  avatar?: string;
  verified: boolean;
  zone?: string;
  joinedAt: Date;
}

// Product is our public "Listing" shape (kept name for compatibility with existing code).
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;             // Precio en bolivianos (Bs)
  originalPrice?: number;
  category: Category;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerVerified?: boolean;
  createdAt: Date;
  publishedAt?: Date;
  location: string;          // Zona de La Paz
  condition: Condition;
  deliveryMethods: DeliveryMethod[];
  status: ListingStatus;
  freeShipping?: boolean;
}

export interface ListingFlag {
  id: string;
  listingId: string;
  reason: 'fraud' | 'prohibited' | 'spam' | 'other';
  note?: string;
  reporterId?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'electronics',
    slug: 'electronica',
    name: 'Electrónica',
    image: 'electronics',
    description: 'Celulares, laptops, consolas y accesorios de segunda mano y nuevos en La Paz.',
    faq: [
      { q: '¿Cómo verifico que un equipo funciona?', a: 'Coordina con el vendedor para probar el equipo en persona en un lugar público antes de pagar.' },
      { q: '¿Puedo pedir factura?', a: 'Sí, solicita al vendedor si ofrece boleta o factura antes de cerrar la compra.' },
      { q: '¿Aceptan cambios?', a: 'Cada vendedor define su política. Pregunta antes de confirmar la operación.' },
    ],
  },
  {
    id: 'fashion',
    slug: 'moda',
    name: 'Moda',
    image: 'fashion',
    description: 'Ropa, calzado y accesorios para hombre, mujer y niño en toda La Paz y El Alto.',
    faq: [
      { q: '¿Se pueden probar las prendas?', a: 'Coordina con el vendedor si permite probar antes de comprar.' },
      { q: '¿Cómo sé la talla?', a: 'Revisa las medidas indicadas y pide fotos adicionales al vendedor.' },
      { q: '¿Hacen delivery?', a: 'Muchos vendedores ofrecen delivery dentro de La Paz. Consulta el método de entrega en el anuncio.' },
    ],
  },
  {
    id: 'home',
    slug: 'hogar',
    name: 'Hogar',
    image: 'home',
    description: 'Muebles, electrodomésticos y decoración para tu casa o departamento.',
    faq: [
      { q: '¿Incluye el traslado?', a: 'Generalmente no. Coordina el traslado con el vendedor o contrata un servicio.' },
      { q: '¿Cómo evalúo el estado?', a: 'Pide fotos actuales, medidas y verifica en persona antes de pagar.' },
      { q: '¿Se puede negociar?', a: 'Muchos vendedores aceptan ofertas. Contacta al vendedor para negociar.' },
    ],
  },
  {
    id: 'sports',
    slug: 'deportes',
    name: 'Deportes',
    image: 'sports',
    description: 'Bicicletas, equipos de gimnasio, camping y outdoor para vivir la altura.',
    faq: [
      { q: '¿Puedo probar la bicicleta?', a: 'Sí, coordina una prueba corta en un lugar seguro.' },
      { q: '¿Traen garantía?', a: 'Los productos de segunda mano suelen no tener garantía. Confirma con el vendedor.' },
      { q: '¿Aceptan permutas?', a: 'Algunos vendedores sí. Pregunta antes de contactar.' },
    ],
  },
  {
    id: 'vehicles',
    slug: 'vehiculos',
    name: 'Vehículos',
    image: 'vehicles',
    description: 'Autos, motos y accesorios. Verifica siempre documentación y transferencia legal.',
    faq: [
      { q: '¿Cómo verifico los papeles?', a: 'Solicita RUAT, revisión técnica y verifica que no tenga gravámenes.' },
      { q: '¿Dónde se hace la transferencia?', a: 'En un notario habilitado. Nunca pagues sin firmar la minuta.' },
      { q: '¿Aceptan crédito?', a: 'Depende del vendedor. Algunos aceptan financiamiento bancario.' },
    ],
  },
  {
    id: 'other',
    slug: 'otros',
    name: 'Otros',
    image: 'other',
    description: 'Libros, instrumentos, servicios y todo lo que no entra en otras categorías.',
    faq: [
      { q: '¿Qué puedo publicar aquí?', a: 'Cualquier producto legal que no encaje en las demás categorías.' },
      { q: '¿Puedo publicar servicios?', a: 'Sí, siempre que cumplan las políticas de la plataforma.' },
      { q: '¿Puedo publicar mascotas?', a: 'No. La venta de animales está prohibida en Chuquiago Market.' },
    ],
  },
];
