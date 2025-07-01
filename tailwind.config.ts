import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'], // Habilita el modo oscuro basado en la clase 'dark'
  content: [
    './frontend/pages/**/*.{js,ts,jsx,tsx,mdx}', // Incluye archivos en el directorio pages
    './frontend/components/**/*.{js,ts,jsx,tsx,mdx}', // Incluye archivos en el directorio components
    './frontend/app/**/*.{js,ts,jsx,tsx,mdx}', // Incluye archivos en el directorio app
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Alegreya', 'serif'], // Fuente para el cuerpo del texto
        headline: ['Belleza', 'sans-serif'], // Fuente para titulares
        code: ['monospace'], // Fuente monoespaciada para código
      },
      colors: {
        background: 'hsl(var(--background))', // Color de fondo
        foreground: 'hsl(var(--foreground))', // Color de primer plano
        card: {
          DEFAULT: 'hsl(var(--card))', // Color de fondo de tarjeta
          foreground: 'hsl(var(--card-foreground))', // Color de texto de tarjeta
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))', // Color de fondo de popover
          foreground: 'hsl(var(--popover-foreground))', // Color de texto de popover
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))', // Color primario
          foreground: 'hsl(var(--primary-foreground))', // Color de texto primario
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))', // Color secundario
          foreground: 'hsl(var(--secondary-foreground))', // Color de texto secundario
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))', // Color de texto atenuado
          foreground: 'hsl(var(--muted-foreground))', // Color de texto de primer plano atenuado
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', // Color de acento
          foreground: 'hsl(var(--accent-foreground))', // Color de texto de acento
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))', // Color destructivo (para errores o acciones peligrosas)
          foreground: 'hsl(var(--destructive-foreground))', // Color de texto destructivo
        },
        border: 'hsl(var(--border))', // Color de borde
        input: 'hsl(var(--input))', // Color de entrada
        ring: 'hsl(var(--ring))', // Color de anillo (para estados de enfoque)
        chart: {
          '1': 'hsl(var(--chart-1))', // Colores para gráficos
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))', // Color de fondo de la barra lateral
          foreground: 'hsl(var(--sidebar-foreground))', // Color de texto de la barra lateral
          primary: 'hsl(var(--sidebar-primary))', // Color primario de la barra lateral
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))', // Color de texto primario de la barra lateral
          accent: 'hsl(var(--sidebar-accent))', // Color de acento de la barra lateral
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))', // Color de texto de acento de la barra lateral
          border: 'hsl(var(--sidebar-border))', // Color de borde de la barra lateral
          ring: 'hsl(var(--sidebar-ring))', // Color de anillo de la barra lateral
        },
      },
      borderRadius: {
        lg: 'var(--radius)', // Radio de borde grande
        md: 'calc(var(--radius) - 2px)', // Radio de borde medio
        sm: 'calc(var(--radius) - 4px)', // Radio de borde pequeño
      },
      keyframes: {
        'accordion-down': { // Keyframe para animación de acordeón hacia abajo
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': { // Keyframe para animación de acordeón hacia arriba
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out', // Animación de acordeón hacia abajo
        'accordion-up': 'accordion-up 0.2s ease-out', // Animación de acordeón hacia arriba
      },
    },
  },
  plugins: [require('tailwindcss-animate')], // Habilita el plugin tailwindcss-animate
} satisfies Config;
