Plan para arreglar el botón de contacto sin cambiar el diseño general:

1. **Corregir la causa principal en el backend**
   - El botón queda inactivo para usuarios no logueados porque la app no puede leer el WhatsApp público del vendedor en modo anónimo.
   - Crear una migración mínima para permitir a `anon` leer solo la vista pública `seller_public` y ejecutar la función pública necesaria `get_seller_public()`.
   - No abrir acceso directo a tablas privadas de perfil ni cambiar permisos de publicar, editar, favoritos, reportes o perfil.

2. **Evitar errores visibles por verificaciones públicas**
   - Ajustar la hidratación de vendedores para usar `seller_public.verified` en lugar de consultar `seller_verifications` por separado en vistas públicas.
   - Así se evita el error 401 de `seller_verifications` para anónimos sin conceder más permisos de los necesarios.

3. **Revisar la función de contacto**
   - Mantener el botón activo cuando exista WhatsApp, aunque no haya sesión.
   - Abrir WhatsApp directamente.
   - Registrar `lead_events` con `user_id: null` para anónimos y hacerlo en modo no bloqueante: si falla el registro, WhatsApp igual se abre.

4. **Mantener el texto de apoyo existente**
   - Conservar el texto pequeño bajo el botón sobre WhatsApp y recomendaciones de seguridad.
   - No cambiar estilos generales ni el resto de reglas de autenticación.