## Objetivo

En el campo de teléfono WhatsApp del perfil (`/perfil`), reemplazar el `Input` plano por un selector de código internacional con bandera + el número nacional.

## Cambios

### 1. Nuevo componente `src/components/PhoneInput.tsx`

- Combo controlado: `<CountrySelect />` a la izquierda (bandera emoji + código, ej. 🇧🇴 +591) + `<Input />` a la derecha para el número nacional.
- Dropdown basado en `Popover` + `Command` de shadcn (ya usados en el proyecto) para permitir búsqueda por nombre de país o código.
- Bandera renderizada como emoji derivado del ISO alpha-2 (`String.fromCodePoint(0x1F1E6 + …)`), sin dependencias extra.
- Emite el valor como string internacional solo dígitos (`dialCode + national`), compatible con el formato que ya guarda `profiles.whatsapp_phone` y con `normalizePhone` / `isValidPhone` existentes.
- Valor por defecto: Bolivia (`BO`, `+591`).
- Al recibir un valor inicial (ej. teléfono guardado), detecta el país por prefijo comparando contra la lista y separa código/nacional.

### 2. Lista de países `src/lib/countries.ts`

Array estático con `{ iso2, name, dialCode }` cubriendo LATAM completo + destinos frecuentes (US, ES, IT, DE, FR, UK, BR, AR, CL, PE, EC, CO, MX, PY, UY, VE, BO, y ~40 más). Sin librería externa para mantener el bundle liviano.

### 3. Integrar en `src/pages/Profile.tsx`

Reemplazar el `<Input id="wa" … />` actual por `<PhoneInput value={phone} onChange={setPhone} />`. `savePhone` sigue igual porque el valor entregado ya está en el mismo formato (solo dígitos internacionales). El texto de ayuda se actualiza para reflejar la nueva UX.

## Fuera de alcance

- Otros formularios (publicar, editar anuncio) no piden teléfono; no se tocan.
- No se cambia el esquema de la base de datos ni RLS.
- No se añade dependencia npm; se usa solo shadcn + emojis.
