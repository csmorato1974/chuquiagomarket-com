## Objetivo

Añadir mejoras funcionales de cuenta y autenticación sin cambios de diseño: avatar de perfil (Storage privado + signed URLs), toggle mostrar/ocultar contraseña, y flujo completo de recuperación de contraseña.

**Bucket `avatars` ya creado (privado) y policies RLS ya aplicadas** (SELECT abierto para `anon`+`authenticated` solo sobre `bucket_id='avatars'`; INSERT/UPDATE/DELETE restringidos al dueño por `{uid}/...`).

---

## 1. Avatar de perfil

### Storage y DB
- Bucket privado `avatars` (ya creado).
- `profiles.avatar_url` guarda **solo el path** (`{userId}/{timestamp}.{ext}`), nunca URL pública.
- Frontend firma con `createSignedUrl` (TTL 1h) al mostrar.

### Nuevo helper `src/lib/avatars.ts`
- `MAX_AVATAR_BYTES = 3MB`, `ACCEPTED_AVATAR_TYPES = ['image/png','image/jpeg','image/webp']`.
- `validateAvatarFile(file)`, `uploadAvatar(userId, file)`, `getAvatarSignedUrl(path)`, `removeAvatar(path)`.

### `src/pages/Profile.tsx`
- Nueva sección “Foto de perfil” encima de “Datos de contacto”, reutilizando `bg-card rounded-2xl border p-6`.
- Avatar circular (mismo estilo actual). Botones: “Cambiar foto”, “Quitar foto”.
- `<input type="file" hidden>` con validación de tipo y tamaño.
- Preview inmediata con `URL.createObjectURL` antes de subir.
- Al subir: `uploadAvatar` → `update profiles set avatar_url = path` → refresca signed URL.
- Al quitar: `removeAvatar` + `avatar_url = null`.

### `src/pages/SellerProfile.tsx` y `src/lib/listings.ts`
- `fetchSellerPublic` devuelve el path crudo; `SellerProfile` firma con `getAvatarSignedUrl` antes de renderizar. Sin cambios visuales.

---

## 2. Mostrar/ocultar contraseña

En `src/pages/Auth.tsx`:
- Botón `type="button"` dentro del input password, a la derecha, con `Eye` / `EyeOff` de `lucide-react`.
- Estado local `showPassword` alterna `type` entre `password`/`text`.
- `aria-label` dinámico, `aria-pressed`, área táctil 40×40. Sin cambios de layout.
- Mismo toggle en `ResetPassword.tsx`.

---

## 3. Recuperación de contraseña

### Enlace en login
- En `Auth.tsx` (modo login) enlace “¿Olvidaste tu contraseña?” → `/recuperar`.

### Nueva ruta pública `/recuperar` → `src/pages/ForgotPassword.tsx`
- Input email + botón. Llama a `supabase.auth.resetPasswordForEmail(email, { redirectTo: \`${window.location.origin}/restablecer\` })`.
- Mensaje neutral tras enviar (“Si el email existe, te enviamos un enlace”).

### Nueva ruta pública `/restablecer` → `src/pages/ResetPassword.tsx`
- Escucha `onAuthStateChange` para evento `PASSWORD_RECOVERY` (Supabase JS parsea el hash automáticamente).
- Dos inputs (nueva contraseña + confirmar) con toggle mostrar/ocultar.
- Validación: ≥ 8 caracteres y coincidencia.
- `supabase.auth.updateUser({ password })` → `signOut()` → redirect a `/auth`.
- Estado “enlace inválido/expirado” con botón para volver a `/recuperar`.

### Rutas en `App.tsx`
- `/recuperar` y `/restablecer` como rutas públicas.

### Configuración en el backend (Cloud → Auth → URL Configuration)
Añadir a **Redirect URLs**:
- `https://chuquiagomarket-com.lovable.app/restablecer`
- `https://id-preview--55ffa42a-5007-4578-9075-71ad9f25ab3d.lovable.app/restablecer`
- `http://localhost:8080/restablecer`

**Site URL** debe apuntar al dominio de producción.

---

## Archivos

**Nuevos:**
- `src/lib/avatars.ts`
- `src/pages/ForgotPassword.tsx`
- `src/pages/ResetPassword.tsx`

**Modificados:**
- `src/pages/Profile.tsx` (sección avatar)
- `src/pages/Auth.tsx` (toggle password + enlace “¿Olvidaste tu contraseña?”)
- `src/pages/SellerProfile.tsx` (firmar avatar path)
- `src/App.tsx` (2 rutas nuevas)

---

## Fuera de alcance
- No cambios de diseño.
- No dependencias nuevas.
- No buckets públicos.
- Solo lectura anon sobre `storage.objects` para el bucket `avatars` (ya aplicada).
