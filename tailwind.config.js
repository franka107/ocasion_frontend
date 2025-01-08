const animate = require('tailwindcss-animate')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./design-system/**/*.{js,jsx,ts,tsx,vue}'],
  safelist: [
    'dark',
    'text-disabled-500',
    'bg-[#EFF6FF]',
    'text-[#2563EB]', // Azul para EVENTO
    'bg-[#E0F2FE]',
    'text-yellow-500',
    'text-green-500',
    'text-blue-500',
    'text-[#0284C7]', // Azul claro para ABONO y PAYMENT
    'bg-[#FDF2F8]',
    'text-[#DB2777]', // Rosa para OFERTA
    'bg-[#FDE68A]',
    'text-[#D97706]', // Amarillo para FINANZAS
    'bg-gray-100',
    'text-gray-500', // Gris predeterminado para GENERAL
    'bg-[#FEF3F2]',
    'text-[#B91C1C]', // Rojo claro para SUSTENTO
    'bg-[#F0FDF4]',
    'text-[#16A34A]', // Verde para SUSTENTO DE ENTREGA
  ],
  prefix: '',

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        bgtheme: '#F1F5F9',
        foreground: 'hsl(var(--foreground))',
        reminder: {
          600: '#2463EB',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          700: '#225B82',
          600: '#2872A1',
          950: '#152A3C',
          100: '#E6F0F8',
          400: '#5DA9D3',
          50: '#F3F8FC',
        },
        blue: {
          DEFAULT: '#2563EB',
        },
        orange: {
          DEFAULT: '#EA580C',
        },
        purple: {
          DEFAULT: '#D946EF',
        },
        brown: {
          DEFAULT: '#78716C',
        },
        disabled: {
          DEFAULT: '#a1a1a3',
          500: '#a1a1a3',
        },

        green: {
          DEFAULT: '#16A34A',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        borderPrimaryDark: '#0B3859',
        bluePrimary: '#20445E',
        gray: {
          100: '#E6E6E7',
          200: '#e5e7eb',
          300: '#E5E7EB',
          400: '#D1D5DB',
          500: '#68686C',
          600: '#6B7280',
          700: '#4B5563',
          800: '#374151',
          900: '#1F2937',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        btn: '8px',
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'], // Añadir la fuente Roboto
      },
      fontWeight: {
        regular: 400,
        semibold: 500, // Añadir peso semibold
        bold: 700,
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        twinkleShadow: {
          from: { 'box-shadow': '0px 0px 4px 0px #9e2126' },
          to: { 'box-shadow': '0px 0px 4px 0px #FFFFFF' },
        },
        twinkleBorder: {
          '0%': { 'border-color': '#da5560' },
          '100%': { 'border-color': '#FFFFFF' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'twinkle-shadow': 'twinkleShadow .5s infinite alternate',
        'twinkle-border': 'twinkleBorder 0.5s infinite alternate',
      },
    },
  },
  plugins: [animate],
}
