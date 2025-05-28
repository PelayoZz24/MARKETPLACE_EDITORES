import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          cliente: '#2563eb', // azul royal
          editor: '#7c3aed', // violeta
        },
        secondary: '#f1f5f9', // gris claro
        accent: {
          cliente: '#38bdf8', // celeste
          editor: '#f472b6', // rosa
        },
        success: '#22c55e', // verde
        warning: '#facc15', // amarillo
        neutral: {
          100: '#f8fafc', // fondo blanco azulado
          200: '#e2e8f0', // bordes
          300: '#cbd5e1', // deshabilitado
          400: '#64748b', // texto secundario
          900: '#0f172a', // texto principal
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Nunito Sans', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
