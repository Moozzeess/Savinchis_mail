# Sistema de Diseño Savinchis Mail

## Paleta de Colores

### Tema Claro
- **Fondo**: `hsl(161, 67%, 93%)` (Verde claro)
- **Texto Principal**: `hsl(160, 10%, 20%)` (Gris oscuro)
- **Primario**: `hsl(159, 35%, 72%)` (Verde suave)
- **Secundario**: `hsl(159, 30%, 85%)` (Verde muy claro)
- **Acento**: `hsl(159, 29%, 58%)` (Verde esmeralda)
- **Destructivo**: `hsl(0, 84%, 60%)` (Rojo)
- **Bordes**: `hsl(159, 30%, 80%)`
- **Entradas**: `hsl(159, 40%, 88%)`

### Tema Oscuro
- **Fondo**: `hsl(220, 15%, 13%)` (Azul oscuro)
- **Texto Principal**: `hsl(0, 0%, 98%)` (Blanco roto)
- **Primario**: `hsl(158, 64%, 52%)` (Verde esmeralda brillante)
- **Secundario**: `hsl(215, 25%, 27%)` (Azul grisáceo)
- **Acento**: `hsl(158, 64%, 45%)` (Verde esmeralda más oscuro)
- **Destructivo**: `hsl(0, 84%, 60%)` (Rojo)
- **Bordes**: `hsl(215, 27%, 20%)`
- **Entradas**: `hsl(215, 25%, 20%)`

### Colores para Gráficos
- **Chart 1**: `hsl(12, 76%, 61%)` (Naranja)
- **Chart 2**: `hsl(173, 58%, 39%)` (Verde azulado)
- **Chart 3**: `hsl(197, 37%, 24%)` (Azul oscuro)
- **Chart 4**: `hsl(43, 74%, 66%)` (Amarillo mostaza)
- **Chart 5**: `hsl(27, 87%, 67%)` (Naranja dorado)

## Tipografía

### Familias de Fuentes
- **Cuerpo**: `Alegreya`, serif
- **Títulos**: `Belleza`, sans-serif
- **Código**: `monospace`
- **Interfaz**: `Arial, Helvetica, sans-serif`

### Tamaños Base
- **Radio de borde**: `0.75rem` (base)
  - Grande: `var(--radius)`
  - Mediano: `calc(var(--radius) - 2px)`
  - Pequeño: `calc(var(--radius) - 4px)`

## Componentes

### Tarjetas (Cards)
- **Borde redondeado**: `xl` (equivalente a 0.75rem)
- **Sombra**: Pequeña por defecto, crece al hacer hover
- **Transición**: Suave en todas las propiedades (300ms)
- **Efecto hover**:
  - Sombra más pronunciada
  - Borde con 20% de opacidad del color primario
  - Fondo ligeramente más oscuro (95% de opacidad)

### Botones de Icono
- **Tamaño**: 1.75rem × 1.75rem (h-7 w-7)
- **Forma**: Bordes redondeados (esquina redondeada media)
- **Efecto hover**:
  - Fondo con 10% de opacidad del color primario
  - Texto cambia al color primario

### Barra Lateral (Sidebar)
- **Colores (usar variables CSS proporcionadas)**:
  - Fondo
  - Texto
  - Elementos primarios
  - Acentos
  - Bordes
- **Transiciones**: Suaves para cambios de tema

## Animaciones

### Transiciones
- **Duración estándar**: 300ms
- **Función de temporización**: ease-in-out
- **Propiedades animadas**: Todas las propiedades con soporte para transición

### Efectos
1. **Fade In**
   - **Comportamiento**: Transición suave de opacidad de invisible a visible
   - **Duración**: 300ms
   - **Uso típico**: Aparecer elementos modales o notificaciones

2. **Fade Up**
   - **Comportamiento**: Aparecer deslizándose ligeramente desde abajo (10px) mientras se desvanece
   - **Duración**: 400ms
   - **Uso típico**: Elementos que entran en la vista, como tarjetas o secciones

3. **Zoom In**
   - **Comportamiento**: Escala sutil desde 95% a 100% de tamaño
   - **Duración**: 300ms
   - **Uso típico**: Destacar interacciones o elementos al hacer hover

## Clases de Utilidad
- `.animate-fade-in`: Aplica animación de desvanecimiento
- `.animate-fade-up`: Aplica animación de desvanecimiento hacia arriba
- `.animate-zoom-in`: Aplica animación de zoom suave

## Estados
- **Hover**: Efectos sutiles en tarjetas y botones
- **Focus**: Anillo con color primario
- **Disabled**: Opacidad reducida

## Modo Oscuro
El modo oscuro se activa con la clase `dark` en el elemento `html` y ajusta automáticamente todos los colores para mantener el contraste y la legibilidad.

## Variables CSS Personalizadas
Todas las variables están definidas en `:root` y se modifican según el tema activo (claro/oscuro). Las variables principales son:
- `--background`
- `--foreground`
- `--primary`
- `--secondary`
- `--accent`
- `--destructive`
- `--border`
- `--input`
- `--ring`

## Responsive
El diseño utiliza las clases de Tailwind para ser completamente responsivo en todos los dispositivos.