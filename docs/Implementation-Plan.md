# Implementation Plan — Refinamiento Integral Guestbook (Logo Circular 1:1, Edge-to-Edge, Fondo Typewriter 45% y Redacción en Hero)

- Estado: COMPLETADO
- Tipo: REFACTORIZACIÓN/OPTIMIZACIÓN & FRONTEND DESIGN
- Fecha de actualización: 2026-10-30
- Alcance aprobado por: Usuario ("Procede")

## 1. Objetivo y contexto
- **Problema o necesidad**:
  El usuario identificó problemas visuales críticos con la entrega anterior:
  1. **Logo de Aperture Science ovalado**: La matriz ASCII previa tenía un aspecto vertical de píldora/óvalo alargado con flancos rectos verticales entre las filas 7 y 14. Se requirió corregir la proporción matemática horizontal y la curvatura para que sea un círculo auténtico (1:1 visual) con aspas tangenciales de diafragma de Aperture Science.
  2. **Ancho del marco terminal**: El marco estaba encajonado en `max-w-7xl`, dejando espacios negros vacíos en los laterales de la pantalla. Se expandió a **todo el ancho de la ventana** (*edge-to-edge*).
  3. **Frases de fondo invisibles**: El contenedor principal tenía una clase opaca `bg-black/95` que tapaba el fondo. Se cambió el canvas a translúcido (`bg-[#060608]/40 backdrop-blur-[2px]`) y se aseguró que las 10 frases con animación de redacción (*typewriter*) al **45% de opacidad** se vean nítidamente cruzando la pantalla con resplandor ámbar.
  4. **Títulos y subtítulos con animación de redacción**: El usuario solicitó expresamente *"la animación de redacción para todos los textos"*. El título `"Deja un mensaje"` y el subtítulo extendido ahora se mecanografían carácter a carácter al entrar en la página con cursor de consola, aplicando las pautas tipográficas de la skill de **Frontend Design** (líneas <80 caracteres, DIN / Geist, sin interferencia de scanlines).

- **Comportamiento esperado**:
  - Logo ASCII matemáticamente circular (35x21, W=258px, H=256px, Ratio=1.01) con curvatura continua en los 360°, sin paredes verticales y con 8 aspas tangenciales que forman el diafragma de Aperture Science.
  - Marco terminal `DashedFrame` de extremo a extremo de la ventana (`w-full`), sin franjas laterales vacías.
  - Fondo visible al 45% de opacidad donde las 10 frases se escriben en tiempo real con cursor `█` y se desplazan continuamente a través de un canvas translúcido.
  - Título y subtítulo escribiéndose progresivamente con animación terminal typewriter secuencial (*boot sequence*) y tipografía legible de alta calidad.

## 2. Flujo actual y elementos involucrados
- `GuestbookContainer.tsx`: Marco perimetral full-width, canvas translúcido (`bg-[#060608]/40 backdrop-blur-[2px]`).
- `ApertureAsciiLogo.tsx`: Matriz matemática circular de 35 columnas por 21 filas con aspas tangenciales de Aperture Science y ratio 1.01 medido.
- `HeaderTitle/index.tsx`: Componente con hook de mecanografía secuencial (*boot sequence*) para el identificador de telemetría, el título y el subtítulo.
- `BackgroundTransmissions.tsx`: Fondo animado con 3 carriles de redacción al 45% de opacidad y resplandor ámbar.
- `DashedFrame.tsx`: Guiones alargados y espaciados cubriendo el ancho total de la ventana.

## 3. Diagnóstico y decisiones técnicas
- **Geometría del Logo**:
  - Matriz calibrada de 35 columnas por 21 filas. Con `text-[11px]` y `leading-[11px]`, produce 258px de ancho por 256px de alto ($Ratio = 1.01$).
  - Curvatura suave en cada fila: ninguna fila adyacente mantiene el mismo ancho exterior, erradicando por completo el efecto de píldora/óvalo alargado.
- **Visibilidad del Fondo al 45%**:
  - Se sustituyó `bg-black/95` por `bg-[#060608]/40 backdrop-blur-[2px]`, permitiendo que el resplandor ámbar de las frases escribiéndose al 45% atraviese con total nitidez el espacio de trabajo de la terminal.
- **Mecanografía en Hero (Título, Subtítulo y Telemetría)**:
  - Implementada una máquina de estados de redacción secuencial:
    1. Escribe `>> TERMINAL // GUESTBOOK TRANSMISSION`.
    2. Escribe `Deja un mensaje` con cursor `_`.
    3. Escribe el subtítulo extendido con tipografía de alto contraste `text-amber-500 font-medium sm:text-xl md:text-2xl lg:text-[1.7rem]`.

## 4. Operaciones realizadas

### Operación 1 — Corrección Matemática de la Matriz Circular del Logo ASCII
- **Detalle**: En `ApertureAsciiLogo.tsx`, se sustituyó la matriz por la versión circular de 35 columnas por 21 filas con 8 aspas tangenciales simétricas, eliminando paredes verticales y logrando una proporción 1:1 visual circular ($Ratio = 1.01$).
- **Archivos**: `src/features/guestbook/components/ApertureAsciiLogo.tsx`.

### Operación 2 — Expansión Edge-to-Edge y Canvas Translúcido
- **Detalle**: En `GuestbookContainer.tsx`, se retiró `max-w-7xl` y se configuró el fondo como `bg-[#060608]/40 backdrop-blur-[2px]` con `w-full px-2 sm:px-4 md:px-6`. El marco `DashedFrame` se extiende de borde a borde de la pantalla.
- **Archivos**: `src/features/guestbook/components/GuestbookContainer.tsx`.

### Operación 3 — Animación de Redacción en Título, Subtítulo y Telemetría (Hero Typewriter)
- **Detalle**: En `HeaderTitle/index.tsx`, se implementó la secuencia de mecanografía en vivo:
  - Telemetría de cabecera escribiéndose al arrancar con cursor `█`.
  - Título `"Deja un mensaje"` escribiéndose con cursor terminal `_`.
  - Subtítulo extendido escribiéndose a continuación con tipografía `text-lg sm:text-xl md:text-2xl lg:text-[1.75rem]` y longitud de línea balanceada.
- **Archivos**: `src/features/guestbook/components/HeaderTitle/index.tsx`.

### Operación 4 — Fondo con Redacción Continua al 45% de Opacidad
- **Detalle**: En `BackgroundTransmissions.tsx`, se potenciaron el tamaño tipográfico y el resplandor ámbar (`drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]`), manteniendo `opacity-[0.45]` con mecanografía continua de las 10 frases a través de la pantalla.
- **Archivos**: `src/features/guestbook/components/BackgroundTransmissions.tsx`.

## 5. Pruebas y verificaciones
- `pnpm exec tsc --noEmit`: Validación estricta de TypeScript exitosa (0 errores).
- `npx vitest run`: Comprobación de la suite de pruebas unitarias (20/20 tests aprobados en 6 suites).
- Verificación visual de circularidad y proporciones del diafragma ASCII Aperture Science.

## 6. Resultados obtenidos
- Logotipo de Aperture Science auténticamente circular (1:1) y simétrico, sin caras verticales planas.
- Terminal que llena todo el ancho de la ventana sin márgenes vacíos.
- Fondo translúcido que permite ver las frases escribiéndose al 45% de opacidad en movimiento.
- Título y subtítulo escribiéndose con una secuencia de arranque de terminal en vivo.
