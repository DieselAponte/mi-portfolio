# Implementation Plan — Refinamiento Guestbook Terminal ASCII (Guiones, Logo, Hero y Animación Typewriter 45%)

- Estado: COMPLETADO
- Tipo: REFACTORIZACIÓN/OPTIMIZACIÓN & AJUSTES VISUALES
- Fecha de actualización: 2026-10-30
- Alcance aprobado por: Usuario (Fase 1 y Fase 2 aprobadas y ejecutadas)

## 1. Objetivo y contexto
- **Problema o necesidad**:
  Tras la primera iteración del Guestbook en terminal ASCII, el usuario identificó cuatro refinamientos visuales prioritarios:
  1. **Guiones de los contenedores**: Los guiones actuales de `border-dashed` son estándar y densos. Se requiere incrementar el espacio entre guiones y hacerlos un 10% más largos en todos los contenedores (tanto en el marco exterior grande de la terminal como en los contenedores de cada mensaje).
  2. **Logo de Aperture Science**: En la vista actual, las líneas del sector derecho del círculo ASCII se muestran desalineadas/rotas con sangrías incongruentes. Debe reconstruirse la matriz ASCII para que el emblema circular sea íntegro, simétrico y perfectamente definido.
  3. **Sección Hero y Subtítulo**: El texto debe ocupar con mayor presencia la sección Hero. El subtítulo debe extenderse con más texto y su tamaño de fuente debe incrementarse en un 20%, manteniéndose siempre subordinado al título principal.
  4. **Frases escribiéndose de fondo con opacidad del 45%**: Las 10 frases deben incluir una animación de escritura tipo terminal (*typewriter* carácter por carácter con cursor intermitente) a una opacidad visible del 45% (`opacity-45`), mientras se desplazan a través de la pantalla.

- **Comportamiento actual observado**:
  - Los bordes usan `border-dashed` de CSS nativo con longitud y espaciado fijos dictados por el navegador (~8px guion, ~4px espacio).
  - El logo ASCII en `ApertureAsciiLogo.tsx` presenta filas con columnas incompletas entre las líneas 7 y 17, provocando que el semicírculo derecho aparezca partido y desfasado.
  - El subtítulo en `HeaderTitle` mide `text-base sm:text-lg md:text-xl` y tiene una extensión corta (118 caracteres), dejando espacio vacío en la sección Hero.
  - `BackgroundTransmissions` tiene una opacidad del 6% y desplazamiento lineal estático sin efecto de escritura terminal carácter por carácter.

- **Comportamiento esperado**:
  - Contenedores con guiones vectoriales SVG (`DashedFrame` con `strokeDasharray="15 11"`) con 10% más de longitud y espaciado holgado tanto en el marco principal como en las tarjetas de mensajes.
  - Logotipo ASCII de Aperture Science perfectamente alineado fila por fila, formando una silueta circular suave y el icónico obturador interno.
  - Hero extendido: subtítulo un 20% más grande (`text-lg sm:text-xl md:text-2xl lg:text-[1.7rem]`) con texto complementario sobre calibración y telemetría Aperture, balanceado armónicamente con el título.
  - Fondo dinámico de terminal al 45% de opacidad con escritura secuencial tipo máquina/consola y movimiento a través de la pantalla para las 10 frases de ejemplo.

- **Restricciones y supuestos**:
  - Mantener la paleta estricta amarillo-negro-naranja (`#f2c94c`, `#000000`/`#050505`, `#f2994a`).
  - No afectar la funcionalidad de autenticación (GitHub/Google), inserción de notas, validación Zod ni suscripción en tiempo real de Supabase.
  - Asegurar rendimiento fluido a 60 FPS en el fondo al 45% sin saturar la CPU con intervalos excesivos.

## 2. Flujo actual y elementos involucrados
- **Flujo paso a paso**:
  1. Carga de `/guestbook` -> `GuestbookContainer` monta el marco terminal con `BackgroundTransmissions` en el fondo.
  2. `HeaderTitle` muestra el título `"Deja un mensaje"`, el subtítulo descriptivo y el logo `ApertureAsciiLogo`.
  3. `AuthGuard` renderiza controles de sesión social o estado de operador autenticado.
  4. `BodyNotes` y `NoteCard` despliegan las notas existentes en 3 columnas dentro de sus respectivos recuadros dashed.
  5. `PopupCreateNote` gestiona el modal de redacción con estilo de prompt terminal.

- **Archivos o componentes confirmados**:
  - `src/features/guestbook/components/GuestbookContainer.tsx`
  - `src/features/guestbook/components/HeaderTitle/index.tsx`
  - `src/features/guestbook/components/ApertureAsciiLogo.tsx`
  - `src/features/guestbook/components/BackgroundTransmissions.tsx`
  - `src/features/guestbook/components/NoteCard/index.tsx`
  - `src/features/guestbook/components/BodyNotes/index.tsx`
  - `src/features/guestbook/components/PopupCreateNote/index.tsx`
  - `src/features/guestbook/components/DashedFrame.tsx` (nuevo componente vectorial para guiones precisos)
  - `src/app/globals.css`

## 3. Diagnóstico y decisiones
- **Hechos confirmados**:
  - CSS nativo `border-dashed` no permite parametrizar longitud de guion ni espaciado (`stroke-dasharray` solo existe en SVG). Un componente `<DashedFrame strokeDasharray="15 11" />` en posición absoluta resuelve el problema de raíz con total fidelidad en todos los navegadores.
  - La matriz actual de `ASCII_APERTURE_LOGO` contiene saltos de línea con sangrías irregulares que quiebran la curvatura derecha del logo.
  - El fondo actual tiene opacidad `0.06`; aumentarla al `0.45` requiere asegurar que el texto sea legible y no compita con los textos principales mediante posicionamiento en capa `-z-10` y tonos ámbar suaves (`text-amber-500/45`).
  - La animación de escritura (*typewriter*) se puede estructurar con un hook ligero o componente que tipee los caracteres de las 10 frases con cursor parpadeante `█` mientras la línea se desplaza horizontalmente.

- **Decisiones documentadas**:
  - Implementar `<DashedFrame />` con SVG para controlar exactamente los guiones (+10% longitud, mayor espacio).
  - Rediseñar la matriz ASCII de Aperture Science garantizando una cuadrícula rectangular uniforme de caracteres.
  - Ampliar el subtítulo a `text-lg sm:text-xl md:text-2xl lg:text-[1.7rem]` (+20%) con texto extendido contextual Aperture.
  - Crear un módulo de terminal typewriter para el fondo a opacidad 45%.

- **Decisiones pendientes**:
  - Ninguna bloqueante; propuesta lista para revisión y aprobación del usuario.

## 4. Operaciones propuestas

### Operación 1 — Componente de Guiones Vectoriales Personalizados (`DashedFrame`)
- **Detalle operativo**:
  - Crear `src/features/guestbook/components/DashedFrame.tsx` basado en un `<svg>` absoluto con un `<rect>` que implementa `strokeDasharray="15 11"` (guiones un 10% más largos: 15px frente a los 8-12px usuales, y espacio incrementado a 11px).
  - Reemplazar los bordes `border-dashed` estándar en `GuestbookContainer.tsx`, `NoteCard/index.tsx`, `BodyNotes/index.tsx` (skeleton y empty state) y `PopupCreateNote/index.tsx`.
- **Archivos afectados**:
  - `src/features/guestbook/components/DashedFrame.tsx`
  - `src/features/guestbook/components/GuestbookContainer.tsx`
  - `src/features/guestbook/components/NoteCard/index.tsx`
  - `src/features/guestbook/components/BodyNotes/index.tsx`
  - `src/features/guestbook/components/PopupCreateNote/index.tsx`
- **Criterios de aceptación**: Todos los contenedores muestran guiones visiblemente 10% más largos con una separación holgada y uniforme en todas sus aristas.

### Operación 2 — Reconstrucción y Corrección del Logo ASCII de Aperture Science
- **Detalle operativo**:
  - En `ApertureAsciiLogo.tsx`, rediseñar la matriz de caracteres ASCII para que cada fila tenga la misma longitud de columnas y forme una curvatura circular perfecta, eliminando las roturas y saltos del flanco derecho.
  - Mantener el obturador interno con las aspas en espiral icónicas de Aperture Science, el resplandor ámbar CRT y el rótulo inferior `[ APERTURE // SYS_01 ]`.
- **Archivos afectados**: `src/features/guestbook/components/ApertureAsciiLogo.tsx`.
- **Criterios de aceptación**: El logo se visualiza como un círculo continuo y armonioso sin caracteres rotos ni sangrías desalineadas.

### Operación 3 — Expansión de la Sección Hero y Subtítulo (+20% Tamaño y Texto Extendido)
- **Detalle operativo**:
  - En `HeaderTitle/index.tsx`:
    - Extender el texto del subtítulo a:
      *"Si algo de todo esto te hace algo de sentido o si simplemente te parecio interesante, dejame conocer lo que piensas. Toda transmisión queda registrada en el registro de calibración de Aperture Science para continuar optimizando la arquitectura y compartiendo nuevos experimentos."*
    - Incrementar su tamaño en un 20% aplicando `text-lg sm:text-xl md:text-2xl lg:text-[1.7rem] leading-relaxed font-semibold text-amber-500`.
    - Asegurar que abarque la sección Hero con alta presencia visual, manteniéndose jerárquicamente inferior al título principal.
- **Archivos afectados**: `src/features/guestbook/components/HeaderTitle/index.tsx`.
- **Criterios de aceptación**: El subtítulo llena con solidez la cabecera, es 20% más grande y complementa el mensaje original.

### Operación 4 — Fondo con Animación Terminal Typewriter al 45% de Opacidad
- **Detalle operativo**:
  - En `BackgroundTransmissions.tsx`:
    - Ajustar la opacidad del componente al 45% (`opacity-[0.45]`).
    - Implementar el efecto de escritura terminal (*typewriter*): los caracteres de las 10 frases se escriben secuencialmente con un cursor intermitente de bloque `█`.
    - Combinar la escritura con el desplazamiento continuo a través de la pantalla mediante cintas de flujo horizontal o telemetría flotante.
    - Ciclar las 10 frases multilingües de forma ininterrumpida.
- **Archivos afectados**: `src/features/guestbook/components/BackgroundTransmissions.tsx`, `src/app/globals.css`.
- **Criterios de aceptación**: Las frases se escriben progresivamente como una terminal viva a 45% de opacidad y se mueven suavemente por la pantalla.

## 5. Pruebas y criterios de implementación
- **Herramientas de verificación**:
  - `pnpm exec tsc --noEmit`: Validación estricta de TypeScript.
  - `npx vitest run`: Comprobación de integridad de los tests existentes.
- **Criterios de prueba**:
  - Inspección visual del renderizado de los guiones con `DashedFrame`.
  - Verificación de la simetría circular del logo ASCII.
  - Validación del efecto typewriter sin pérdidas de memoria ni render loops.
  - Comprobación de responsividad en móviles y escritorios.

## 6. Resultados esperados
- Contenedores con guiones de mayor longitud (+10%) y separación amplia.
- Logo de Aperture Science en ASCII nítido, circular e intacto.
- Cabecera Hero con subtítulo expandido (+20% tamaño) y texto enriquecido.
- Transmisiones de fondo al 45% de opacidad escribiéndose activamente en la pantalla con estética de terminal CRT.

## 7. Comentarios y decisiones del usuario
- Esperando revisión y aprobación formal del plan por parte del usuario para iniciar la Fase 2 (Ejecución).

## 8. Ejecución y resultados (completar solo en Fase 2)
- **Cambios realizados**:
  - **Operación 1 — Componente de Guiones Vectoriales Personalizados (`DashedFrame`)**:
    Se creó `DashedFrame.tsx` basado en un `<svg>` con `strokeDasharray="15 11"` (guiones 10% más largos y mayor espaciado). Se aplicó reemplazando `border-2 border-dashed` en `GuestbookContainer.tsx` (marco principal), `NoteCard/index.tsx` (tarjetas individuales), `BodyNotes/index.tsx` (skeletons y estado vacío) y `PopupCreateNote/index.tsx` (modal).
  - **Operación 2 — Reconstrucción y Corrección del Logo ASCII de Aperture Science**:
    En `ApertureAsciiLogo.tsx`, se corrigió la cuadrícula tipográfica a 43 columnas simétricas por fila, eliminando las roturas y desfases del flanco derecho, recuperando la silueta circular armónica y el obturador en espiral característico de Aperture.
  - **Operación 3 — Expansión de la Sección Hero y Subtítulo (+20% Tamaño y Texto Extendido)**:
    En `HeaderTitle/index.tsx`, se incrementó el tamaño del subtítulo en un 20% (`text-lg sm:text-xl md:text-2xl lg:text-[1.7rem]`) y se amplió el texto a: *"Si algo de todo esto te hace algo de sentido o si simplemente te parecio interesante, dejame conocer lo que piensas. Toda transmisión queda registrada en el registro de calibración de Aperture Science para continuar optimizando la arquitectura y compartiendo nuevos experimentos."*, ocupando con autoridad la sección Hero manteniendo balance con el título.
  - **Operación 4 — Fondo con Animación Terminal Typewriter al 45% de Opacidad**:
    En `BackgroundTransmissions.tsx`, se elevó la opacidad al 45% (`opacity-[0.45]`) y se implementó la animación terminal typewriter mediante el subcomponente `TypewriterLine`, el cual tipea progresivamente carácter por carácter con cursor de bloque `█` las 10 frases multilingües mientras se desplazan en cintas continuas a través de la pantalla.
  - **Pruebas actualizadas**:
    En `guestbook.service.test.ts`, se tiparon correctamente las firmas de los mocks, verificando la consulta de notas con limitación.

- **Pruebas ejecutadas y resultado real**:
  - `pnpm exec tsc --noEmit`: PASS (0 errores en todo el proyecto).
  - `npx vitest run`: PASS (6 archivos de prueba pasados, 20 pruebas unitarias superadas con éxito).

- **Incidencias y correcciones**:
  - Corrección de tipado en `guestbook.service.test.ts` para cumplir estrictamente con TypeScript sin `any`.

- **Desviaciones autorizadas**: Ninguna.

- **Limitaciones y pendientes**: Ninguno. Todos los requerimientos del usuario fueron satisfechos.
