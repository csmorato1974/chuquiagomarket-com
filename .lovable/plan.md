## Plan: Aviso de inicio de sesión para contactar al vendedor

### Contexto
Actualmente en la ficha de producto (`/producto/:id`) el botón "Contactar por WhatsApp" funciona para usuarios anónimos: abre WhatsApp directamente. Se solicita añadir un aviso que indique que se debe iniciar sesión para contactar al vendedor.

### Cambios propuestos

1. **Ficha de producto (`src/pages/ProductDetail.tsx`)**
   - Cuando el usuario no ha iniciado sesión, el botón principal cambiará a "Inicia sesión para contactar".
   - Al hacer clic, redirigirá a `/auth` enviando como destino de retorno la URL actual del producto (`/producto/:id`).
   - Se añadirá un aviso inline debajo del botón con el texto: "Debes iniciar sesión para contactar al vendedor por WhatsApp." y un enlace a iniciar sesión.
   - Para usuarios logueados se conserva el comportamiento actual: abre el enlace de WhatsApp del vendedor.

2. **Página de autenticación (`src/pages/Auth.tsx`)**
   - Se verifica que el flujo de redirección post-login utilice el valor `state.from` enviado desde la ficha de producto, para devolver al usuario al anuncio tras autenticarse.
   - Si no existe destino previo, se mantiene el comportamiento actual (`/perfil`).

3. **Verificación**
   - Comprobación de build sin errores.
   - Navegación manual en preview: usuario anónimo → ficha de producto → clic en contactar → login → retorno al producto y botón de WhatsApp funcional.

### Notas técnicas
- No se toca lógica de negocio, pagos ni backend.
- Se usan componentes existentes (`Button`, `Alert`) y estilos del proyecto.
- Se respeta la regla mobile-first: aviso inline siempre visible, no tooltip.
