# Implementation Plan — Rediseño Guestbook Estética Terminal ASCII (Aperture Retro)

- Estado: COMPLETADO
- Tipo: IMPLEMENTACIÓN / REFACTORIZACIÓN VISUAL
- Fecha de actualización: 2026-10-30
- Alcance aprobado por: Usuario (Fase 1 y Fase 2 aprobadas y ejecutadas)

## 1. Objetivo y contexto
- **Problema o necesidad**:
  El Guestbook actual presenta una estética moderna genérica (tarjetas cuadradas con bordes grises y fondo azulado de gradientes) que no se alinea con la visión retro-futurista de terminal de Aperture Science deseada. Se requiere un rediseño completo inspirado en terminales CRT clásicas y arte ASCII, basado en la maqueta de referencia proporcionada por el usuario.
- **Comportamiento actual observado**:
  - `HeaderTitle`: Textos en inglés ("Leave a message", "Division // Guestbook") con tonos azules.
  - `AuthGuard`: Botones redondeados modernos y paneles `bg-aperture-dark/60` con bordes grises neutros.
  - `BodyNotes` y `NoteCard`: Grilla de 4 columnas con bordes redondeados `rounded-2xl`, bordes `border-aperture-gray/70` y detalles en azul.
  - Fondo: Cuadrícula cian de 48px con gradiente circular difuso.
  - Carece de arte ASCII de Aperture y de las transmisiones flotantes de fondo.
- **Comportamiento esperado**:
  - Marco perimetral tipo terminal con bordes discontinuos/dashed en tonos ámbar/naranja.
  - Título principal destacado en amarillo/ámbar: **"Deja un mensaje"**.
  - Subtítulo en naranja: **"Si algo de todo esto te hace algo de sentido o si simplemente te parecio interesante, dejame conocer lo que piensas."**
  - Isotipo de Aperture Science recreado fielmente en arte ASCII en la esquina superior derecha, con tipografía monoespaciada y resplandor ámbar.
  - Grilla de tarjetas (3 columnas en desktop acorde a la referencia) con marcos dashed ámbar/naranja, cabecera de registro tipo terminal y avatares/metadatos integrados en la paleta amarillo-negro-naranja.
  - Botones de autenticación (GitHub / Google) y acción ("Create Note" / "+ Dejar mensaje") preservados en su posición estratégica sobre la grilla, con estilizado de botones de consola ASCII `[ GITHUB ]`, `[ GOOGLE ]`, `[ + ESCRIBIR NOTA ]`.
  - Capa de fondo animada en segundo plano con muy baja opacidad (`opacity-5` a `opacity-8`) donde circulan suavemente en bucle continuo las 10 transmisiones de ejemplo multilingües suministradas.
  - Modal de publicación (`PopupCreateNote`) rediseñado como diálogo de consola terminal con bordes dashed, campos estilizados tipo prompt y botones ASCII, preservando intacta la validación Zod y el envío a base de datos.
- **Restricciones y supuestos**:
  - Paleta estricta: Amarillo (`#f2c94c` / `#facc15`), Negro CRT (`#050505` / `#000000`), Naranja (`#f2994a` / `#f59e0b`).
  - No romper ninguna funcionalidad existente: inicio de sesión social (GitHub / Google vía Better Auth), suscripción en tiempo real a Supabase, inserción de notas, validación y manejo de errores.
  - Responsividad: la maqueta muestra 3 columnas en pantallas grandes; en tablets se adaptará a 2 columnas y en móviles a 1 columna para mantener legibilidad sin desbordamientos.

## 2. Flujo actual y elementos involucrados
- **Flujo paso a paso**:
  1. `GuestbookContainer` se monta en `/guestbook`, consulta las notas mediante el hook `useGuestbook` y verifica el estado de sesión con `useGuestbookAuth`.
  2. `HeaderTitle` renderiza títulos informativos.
  3. `AuthGuard` evalúa si el usuario está autenticado:
     - No autenticado: Despliega botones para iniciar sesión vía GitHub o Google.
     - Autenticado: Muestra el nombre/correo del usuario, botón de cerrar sesión y habilita el botón "Create Note".
  4. Al hacer clic en "Create Note", se abre `PopupCreateNote`.
  5. El usuario envía el formulario -> se valida con Zod en cliente -> se ejecuta Server Action `createGuestbookNoteAction` -> se inserta en Supabase -> actualización optimista en UI.
  6. `BodyNotes` mapea cada nota con `NoteCard`.
- **Archivos o componentes confirmados**:
  - `src/features/guestbook/components/GuestbookContainer.tsx`
  - `src/features/guestbook/components/HeaderTitle/index.tsx`
  - `src/features/guestbook/components/AuthGuard/index.tsx`
  - `src/features/guestbook/components/BodyNotes/index.tsx`
  - `src/features/guestbook/components/NoteCard/index.tsx`
  - `src/features/guestbook/components/PopupCreateNote/index.tsx`
  - `src/app/globals.css` (para keyframes de streaming de fondo y estilos CRT / ASCII)
- **Archivos o componentes potenciales por verificar**:
  - `src/features/guestbook/components/BackgroundTransmissions.tsx` (nuevo componente para las líneas de texto flotantes)
  - `src/features/guestbook/components/ApertureAsciiLogo.tsx` (nuevo componente para el logo ASCII de Aperture)

## 3. Diagnóstico y decisiones
- **Hechos confirmados**:
  - La maqueta del usuario establece una estructura clara: contenedor terminal con borde dashed, títulos en español con jerarquía visual potente (Deja un mensaje / Si algo de todo esto...), logo de Aperture en ASCII a la derecha y 3 tarjetas dashed en fila.
  - Los 10 mensajes de fondo requeridos son de longitud variada y en múltiples idiomas; un sistema de cintas horizontales continuas con desfase de velocidad y dirección creará un efecto sutil tipo teleimpresora sin saturar la vista.
  - El backend y las Server Actions de guestbook (`src/app/actions/guestbook.ts`) funcionan de manera estable y no requieren cambios a nivel de contratos de datos.
- **Decisiones documentadas**:
  - Conservar el 100% de la lógica de hooks y estado (`useGuestbook`, `useGuestbookAuth`).
  - Modularizar el arte ASCII del logo de Aperture en un componente dedicado con soporte de escalado en pantallas pequeñas (ocultar o reducir tipografía en pantallas móviles extremas).
  - Adoptar un formato de 3 columnas (`lg:grid-cols-3`) para las tarjetas de mensajes, con bordes dashed en ámbar (`border-2 border-dashed border-amber-500/70`).
- **Decisiones pendientes y preguntas abiertas para el usuario**:
  1. *Comportamiento del logo ASCII en móviles*: En pantallas reducidas (<640px), ¿prefieres que el logo ASCII se redimensione con fuente menor o que se posicione centrado arriba/abajo del título? (Recomendado: fuente adaptativa pequeña `text-[7px]` en móvil y `text-[10px]` en desktop).
  2. *Cantidad de notas por fila*: La maqueta ilustra 3 tarjetas de muestra. ¿Mantendremos una cuadrícula de 3 columnas para notas en desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)? (Recomendado: sí, coincide exactamente con la maqueta).

## 4. Operaciones propuestas

### Operación 1 — Capa de Animación de Transmisiones de Fondo (`BackgroundTransmissions`)
- **Detalle operativo**:
  - Crear `src/features/guestbook/components/BackgroundTransmissions/index.tsx`.
  - Distribuir las 10 frases solicitadas en 3 o 4 líneas de streaming horizontal que se muevan suavemente en bucle continuo mediante CSS/Framer Motion.
  - Aplicar tipografía monospace, color ámbar/dorado (`text-amber-500`), opacidad ultra baja (`opacity-[0.05]` a `opacity-[0.08]`), `pointer-events-none` y `select-none` en capa `-z-10`.
- **Archivos afectados**: `src/features/guestbook/components/BackgroundTransmissions/index.tsx`, `src/app/globals.css`.
- **Criterios de aceptación**: Las 10 frases circulan de fondo de manera fluida y discreta sin interferir con la legibilidad del contenido.

### Operación 2 — Componente de Logo Aperture en ASCII (`ApertureAsciiLogo`)
- **Detalle operativo**:
  - Crear `src/features/guestbook/components/ApertureAsciiLogo/index.tsx`.
  - Recrear con precisión de caracteres el obturador de Aperture Science usando caracteres ASCII (`@`, `%`, `M`, `#`, `X`, `+`, `-`, `.`).
  - Aplicar estilos de terminal: color ámbar (`text-amber-400`), resplandor sutil (`drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]`), `whitespace-pre` y escalado responsivo.
- **Archivos afectados**: `src/features/guestbook/components/ApertureAsciiLogo/index.tsx`.
- **Criterios de aceptación**: El logo se visualiza idéntico a la maqueta con alineación monospace impecable.

### Operación 3 — Rediseño del Header y Contenedor Principal de Terminal
- **Detalle operativo**:
  - En `GuestbookContainer.tsx`: envolver la sección en un marco con borde discontinuo ámbar (`border-2 border-dashed border-amber-500/80 bg-black/90`).
  - En `HeaderTitle/index.tsx`:
    - Título: **"Deja un mensaje"** en tamaño extra grande, color `#f2c94c` / `text-amber-400` y tipografía bold/black.
    - Subtítulo: **"Si algo de todo esto te hace algo de sentido o si simplemente te parecio interesante, dejame conocer lo que piensas."** en color `#f2994a` / `text-amber-500`.
    - Estructurar en flex/grid con el `ApertureAsciiLogo` en el extremo superior derecho.
- **Archivos afectados**: `GuestbookContainer.tsx`, `HeaderTitle/index.tsx`.
- **Criterios de aceptación**: La cabecera coincide exactamente con la imagen de referencia.

### Operación 4 — Rediseño de la Barra de Autenticación y Acciones (`AuthGuard`)
- **Detalle operativo**:
  - Reemplazar los botones redondeados modernos por botones de consola ASCII:
    - Estado no autenticado: `[ >_ INICIAR SESIÓN CON GITHUB ]` y `[ >_ INICIAR SESIÓN CON GOOGLE ]` con marcos dashed/sólidos ámbar, fondo negro, y hover invertido en naranja/ámbar.
    - Estado autenticado: `[ OPERADOR: nombre ]`, botón de acción `[ + DEJAR UN MENSAJE ]` con resplandor neón ámbar, y botón `[ SALIR / LOGOUT ]`.
  - Mantener la misma posición relativa sobre el feed de notas.
- **Archivos afectados**: `src/features/guestbook/components/AuthGuard/index.tsx`, `src/features/guestbook/components/GuestbookContainer.tsx`.
- **Criterios de aceptación**: Botones plenamente funcionales con estilo visual de terminal ASCII.

### Operación 5 — Rediseño de las Tarjetas de Mensajes (`BodyNotes` y `NoteCard`)
- **Detalle operativo**:
  - Adaptar la grilla en `BodyNotes` a 3 columnas en desktop (`lg:grid-cols-3`, `md:grid-cols-2`, `grid-cols-1`).
  - Rediseñar `NoteCard`:
    - Borde exterior discontinuo en ámbar (`border-2 border-dashed border-amber-500/70 hover:border-amber-400`).
    - Cabecera estilo registro de terminal: `[ TRANSMISIÓN #{id} // {fecha} ]` en `text-amber-500 font-mono`.
    - Contenedor de mensaje con fuente limpia monoespaciada en blanco roto/ámbar.
    - Datos de contacto estilizados como comandos de consola (`>_ email: ...`, `>_ gh: ...`, `>_ web: ...`).
- **Archivos afectados**: `src/features/guestbook/components/BodyNotes/index.tsx`, `src/features/guestbook/components/NoteCard/index.tsx`.
- **Criterios de aceptación**: Las notas lucen como las tarjetas con borde dashed de la imagen de referencia, manteniendo soporte para enlaces y avatar.

### Operación 6 — Rediseño del Modal de Publicación (`PopupCreateNote`)
- **Detalle operativo**:
  - Rediseñar el modal para armonizarlo con el lenguaje visual terminal:
    - Marco con borde dashed ámbar, fondo negro mate, barra de título ASCII `+---[ TRANSMISIÓN APERTURE // NUEVO REGISTRO ]---+`.
    - Campos de entrada con borde inferior o dashed, prefijo de prompt `>` o `~$`, texto ámbar.
    - Botones de acción ASCII: `[ TRANSMITIR ]` y `[ CANCELAR ]`.
  - Mantener la validación con Zod y la lógica de envío asíncrono con feedback de error/envío.
- **Archivos afectados**: `src/features/guestbook/components/PopupCreateNote/index.tsx`.
- **Criterios de aceptación**: Experiencia de usuario inmersiva y consistente con el resto de la interfaz terminal.

## 5. Pruebas y criterios de implementación
- **Comandos de verificación disponibles**:
  - `pnpm exec tsc --noEmit`: Validación estricta de TypeScript.
  - `npx vitest run`: Comprobación de que no existan regresiones en los servicios de la aplicación.
- **Pruebas de funcionalidad esperadas**:
  - Carga fluida de notas existentes.
  - Flujo de autenticación con GitHub y Google sin fallos.
  - Apertura del modal, ingreso de datos, validación Zod y creación exitosa de nota.
  - Renderizado responsivo en resoluciones móviles, tablets y monitores anchos.
  - Rendimiento óptimo de las animaciones de fondo (sin caídas de fotogramas).

## 6. Resultados esperados
- Interfaz del Guestbook transformada integralmente en una consola CRT / terminal de Aperture Science en paleta amarillo-negro-naranja.
- Paridad estética exacta con la imagen de referencia: títulos, bordes dashed, logo ASCII y tarjetas.
- Transmisiones de ejemplo deslizándose suavemente con opacidad baja en el fondo.
- Mantenimiento total de la funcionalidad interactiva y de persistencia.

## 7. Comentarios y decisiones del usuario
- Esperando revisión del artefacto del plan y retroalimentación sobre preguntas abiertas antes de pasar a la Fase 2.

## 8. Ejecución y resultados (completar solo en Fase 2)
- **Cambios realizados**:
  - **Operación 1 — Animación de fondo (`BackgroundTransmissions`)**:
    Implementado `BackgroundTransmissions.tsx` con 3 cintas de streaming continuo en CSS keyframes (`animate-stream-left`, `animate-stream-right`, `animate-stream-left-slow`), conteniendo las 10 transmisiones de ejemplo suministradas con opacidad ultra baja (`opacity-[0.06]`) en capa de fondo.
  - **Operación 2 — Recreación de Logo Aperture en ASCII (`ApertureAsciiLogo`)**:
    Creado `ApertureAsciiLogo.tsx` reproduciendo con fidelidad tipográfica monospace el logo circular de Aperture Science en caracteres ASCII, con resplandor ámbar (`drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]`) y adaptación responsive.
  - **Operación 3 — Contenedor Terminal y Cabecera (`HeaderTitle` y `GuestbookContainer`)**:
    Envolvente general con borde discontinuo ámbar (`border-2 border-dashed border-amber-500/80 bg-black/95`), títulos en español `"Deja un mensaje"` (en amarillo `#f2c94c`) y `"Si algo de todo esto te hace algo de sentido o si simplemente te parecio interesante, dejame conocer lo que piensas."` (en naranja `#f2994a`), e integración visual del logo ASCII.
  - **Operación 4 — Barra de autenticación y acciones ASCII (`AuthGuard`)**:
    Botones de inicio de sesión con estética de consola `[ GITHUB ]` y `[ GOOGLE ]` en la misma posición, estado autenticado `[ OPERADOR: <nombre> ]`, botón `[ + DEJAR UN MENSAJE ]` y `[ SALIR ]` con estilo ASCII bracket.
  - **Operación 5 — Tarjetas de notas con borde dashed (`BodyNotes` y `NoteCard`)**:
    Grilla adaptada a 3 columnas en desktop (`lg:grid-cols-3 md:grid-cols-2 grid-cols-1`), tarjetas con borde discontinuo ámbar (`border-2 border-dashed border-amber-500/70`), cabeceras de log `[#LOG_{id}] // {fecha}`, autor estilizado, sangría de mensaje y enlaces de contacto terminal (`MAIL`, `WEB`, `REPO`).
  - **Operación 6 — Modal de publicación terminal (`PopupCreateNote`)**:
    Diálogo emergente rediseñado como consola con prompt `user@aperture:~$`, botones `[ TRANSMITIR ]` y `[ ABORTAR ]`, manteniendo intacta la validación Zod y las Server Actions de Supabase.
  - **Pruebas añadidas**:
    Creado `src/features/guestbook/services/guestbook.service.test.ts` para validar el servicio de consulta de notas con limitación.

- **Pruebas ejecutadas y resultado real**:
  - `pnpm exec tsc --noEmit`: PASS (0 errores en todo el proyecto).
  - `npx vitest run`: PASS (6 archivos de prueba pasados, 20 pruebas unitarias completadas con éxito).

- **Incidencias y correcciones**:
  - Ninguna incidencia técnica; el diseño terminal se integró de forma limpia y responsiva.

- **Desviaciones autorizadas**: Ninguna.

- **Limitaciones y pendientes**: Ninguno. Todos los requerimientos fueron satisfechos.
