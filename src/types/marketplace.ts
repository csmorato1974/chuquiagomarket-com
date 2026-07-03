export type ListingStatus =
  | 'draft' | 'pending_review' | 'published' | 'paused' | 'rejected' | 'sold' | 'archived';
export type Condition = 'new' | 'like_new' | 'good' | 'fair';
export type DeliveryMethod = 'pickup' | 'delivery_lapaz' | 'shipping_bo';

// Category is a slug string matching the DB categories.slug column.
export type Category = string;

export interface CategoryInfo {
  id: string;   // slug (matches DB)
  slug: string;
  name: string;
  image: string;
  description: string;
  faq: { q: string; a: string }[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;             // Bs
  originalPrice?: number;
  category: string;          // slug
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerVerified?: boolean;
  createdAt: Date;
  publishedAt?: Date;
  location: string;
  condition: Condition;
  deliveryMethods: DeliveryMethod[];
  status: ListingStatus;
  rejectionReason?: string;
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

// Static UI catalog. Slugs MUST match rows seeded in public.categories.
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'electronica', slug: 'electronica', name: 'Electrónica', image: 'electronics',
    description: 'Celulares, laptops, consolas y accesorios en La Paz.',
    faq: [
      { q: '¿Cómo verifico que un equipo funciona?', a: 'Coordina con el vendedor para probarlo en persona en un lugar público antes de pagar.' },
      { q: '¿Puedo pedir factura?', a: 'Sí, pregúntale al vendedor si ofrece boleta o factura.' },
      { q: '¿Aceptan cambios?', a: 'Cada vendedor define su política. Pregunta antes de cerrar.' },
    ],
  },
  {
    id: 'moda', slug: 'moda', name: 'Moda', image: 'fashion',
    description: 'Ropa, calzado y accesorios en La Paz y El Alto.',
    faq: [
      { q: '¿Se pueden probar las prendas?', a: 'Coordina con el vendedor.' },
      { q: '¿Cómo sé la talla?', a: 'Pide medidas y fotos adicionales.' },
      { q: '¿Hacen delivery?', a: 'Consulta el método de entrega en el anuncio.' },
    ],
  },
  {
    id: 'hogar', slug: 'hogar', name: 'Hogar', image: 'home',
    description: 'Muebles, electrodomésticos y decoración.',
    faq: [
      { q: '¿Incluye el traslado?', a: 'Generalmente no. Coordínalo con el vendedor.' },
      { q: '¿Cómo evalúo el estado?', a: 'Pide fotos actuales y verifica en persona.' },
      { q: '¿Se puede negociar?', a: 'Muchos vendedores aceptan ofertas.' },
    ],
  },
  {
    id: 'deportes', slug: 'deportes', name: 'Deportes', image: 'sports',
    description: 'Bicicletas, equipos de gimnasio, camping y outdoor.',
    faq: [
      { q: '¿Puedo probar la bici?', a: 'Sí, coordina una prueba en un lugar seguro.' },
      { q: '¿Traen garantía?', a: 'Segunda mano suele no tener garantía.' },
      { q: '¿Aceptan permutas?', a: 'Depende del vendedor.' },
    ],
  },
  {
    id: 'vehiculos', slug: 'vehiculos', name: 'Vehículos', image: 'vehicles',
    description: 'Autos, motos y accesorios. Verifica documentación siempre.',
    faq: [
      { q: '¿Cómo verifico papeles?', a: 'RUAT, revisión técnica y sin gravámenes.' },
      { q: '¿Dónde se transfiere?', a: 'En notario habilitado.' },
      { q: '¿Aceptan crédito?', a: 'Depende del vendedor.' },
    ],
  },
  {
    id: 'otros', slug: 'otros', name: 'Otros', image: 'other',
    description: 'Libros, instrumentos, servicios y más.',
    faq: [
      { q: '¿Qué puedo publicar aquí?', a: 'Cualquier producto legal.' },
      { q: '¿Puedo publicar servicios?', a: 'Sí, siempre que cumplan las políticas.' },
      { q: '¿Mascotas?', a: 'No. Está prohibido.' },
    ],
  },
];
