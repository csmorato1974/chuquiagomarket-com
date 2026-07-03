# Plan: Beta lanzable — Marketplace local La Paz

Objetivo: dejar el proyecto listo como beta usable centrada en La Paz, con moneda Bs, señales de confianza, flujo de publicación con estados y páginas legales mínimas. Sin rediseño global — se refina lo existente.

Nota: se trabaja con datos mock tipados (sin backend en esta fase). Si más adelante quieres persistencia real, activamos Lovable Cloud y migramos los tipos ya diseñados.

---

## 1. Localización a Bolivianos (Bs)

- Crear helper `src/lib/format.ts` con `formatBs(n)` → `Bs 1.234`.
- Reemplazar todos los `€` y `toLocaleString('es-BO')` sueltos en:
  - `ProductCard.tsx`, `ProductDetail.tsx`, `Products.tsx`, `Publish.tsx` (label del input), y cualquier lugar que muestre precio.
- Ajustar textos: "Precio (€)" → "Precio (Bs)".

## 2. Home reescrita con propuesta local

`HeroSection.tsx` (sin cambiar la imagen actual de La Paz):
- H1 sobrepuesto: "Compra y vende en La Paz, fácil y seguro".
- Subtítulo: "Publica gratis en minutos. Encuentra cerca de ti."
- 2 CTAs: "Explorar productos" / "Publicar anuncio".

`Index.tsx`:
- Sustituir "Ofertas del día" → "Publicaciones recientes en La Paz".
- Sustituir "Lo más buscado" → "Cerca de ti".
- Nueva sección **"Cómo funciona"**: 3 pasos (Publica → Contacta → Entrega en La Paz).
- Nueva sección **"Compra con confianza"**: 3 tarjetas (Vendedores verificados, Reglas claras, Reporta anuncios).

## 3. Datos mock preparados para estructura real

Ampliar `src/types/marketplace.ts` con tipos que reflejen la BD futura:

```ts
type ListingStatus = 'draft' | 'pending_review' | 'published' | 'rejected';
type Condition = 'new' | 'like_new' | 'good' | 'fair';
type DeliveryMethod = 'pickup' | 'delivery_lapaz' | 'shipping_bo';

interface Profile { id; displayName; verified: boolean; joinedAt; zone?: string; }
interface Listing {
  id; title; description; priceBs; category;
  condition: Condition;
  zone: string;                  // Zona de La Paz (Sopocachi, Miraflores…)
  deliveryMethods: DeliveryMethod[];
  status: ListingStatus;
  publishedAt?: Date; createdAt;
  sellerId; images: string[];
}
interface ListingFlag { id; listingId; reason; reporterId?; createdAt; }
interface Category { id; slug; name; description; }
```

- `mockProducts.ts` → `mockListings.ts` con datos ambientados en La Paz (zonas reales, vendedores locales, todos con `status: 'published'` salvo 1-2 de ejemplo por estado).
- `mockProfiles.ts` con vendedores verificados/no verificados.

## 4. ProductCard y ficha con datos de confianza

`ProductCard.tsx` añade fila compacta:
- 📍 Zona · 🏷️ Estado · 🕒 "hace 2 días" (`date-fns` ya disponible).
- Badge "Vendedor verificado" si aplica.

`ProductDetail.tsx` añade bloque "Detalles del anuncio":
- Ubicación (zona de La Paz), estado del producto, fecha de publicación, método(s) de entrega.
- Bloque vendedor: avatar/inicial, nombre, badge verificado, miembro desde.
- Botón **"Reportar anuncio"** → abre `Dialog` con motivos (Fraude, Producto prohibido, Spam, Otro) + textarea; guarda en estado local + toast.
- Aviso de seguridad: "Nunca pagues por adelantado. Encuéntrate en lugar público."

## 5. Flujo de publicación con estados

`Publish.tsx`:
- Añadir campos: **Zona de La Paz** (select con zonas), **Estado del producto** (Nuevo/Como nuevo/Bueno/Aceptable), **Método de entrega** (checkboxes).
- Al enviar: crear listing con `status: 'pending_review'` (mock) + toast "Tu anuncio está en revisión".
- Botón "Guardar como borrador" → `status: 'draft'`.
- Panel de reglas visibles antes del submit ("Prohibido…", "Publica fotos reales…").

`Profile.tsx`: pestañas **Mis anuncios** con filtros por estado (Borrador / En revisión / Publicados / Rechazados) usando badges de color. Acción "Editar" y "Eliminar" (mock).

## 6. Páginas legales mínimas

Nuevas rutas en `App.tsx` + páginas simples con Layout, título, breadcrumb y contenido redactado localmente:
- `/ayuda` — Ayuda (FAQ básica).
- `/contacto` — Contacto (form básico mock + email).
- `/privacidad` — Política de privacidad.
- `/cookies` — Política de cookies.
- `/acuerdo` — Acuerdo de usuario.
- `/politicas` — Políticas de publicación (qué se puede/no publicar).

Actualizar `Footer.tsx` para enlazar correctamente estas rutas.

## 7. Página de categoría con SEO

Reforzar `Products.tsx` (o nueva `/categoria/:slug`):
- Breadcrumbs (`Inicio / Categoría`).
- H1 claro por categoría ("Electrónica en La Paz").
- Párrafo introductorio breve (2 líneas).
- Bloque **FAQ** (accordion existente): 3 preguntas por categoría genérica.
- `<Helmet>` con `title`/`description` por categoría (instalar `react-helmet-async`, provider en `main.tsx`).

## 8. Señales de confianza globales

- Badge "Vendedor verificado" reutilizable (`src/components/trust/VerifiedBadge.tsx`).
- Banner discreto en home: "Chuquiago Market · Beta · Marketplace local de La Paz".
- Aviso de seguridad reutilizable en ficha y home.

## 9. Metadatos base

- `index.html`: `<title>` y `<meta description>` reales orientados a La Paz + og tags.
- Sin `og:image` custom (usa la del hosting) salvo que pases una URL.

---

## Resumen de rutas nuevas
`/ayuda`, `/contacto`, `/privacidad`, `/cookies`, `/acuerdo`, `/politicas`.

## Fuera de alcance (para siguiente iteración)
- Autenticación real, base de datos, subida real de imágenes, moderación real, chat comprador↔vendedor, pagos. Todo queda tipado y con UI preparada para conectarse a Lovable Cloud cuando lo pidas.

¿Apruebas este plan para implementarlo?