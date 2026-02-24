import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Punto de entrada del proyecto
  entry: ['src/app/**/*.{ts,tsx}', 'src/app/**/layout.{ts,tsx}', 'src/app/**/page.{ts,tsx}'],

  // Archivos del proyecto a analizar
  project: ['src/**/*.{ts,tsx}'],

  // Ignorar patrones específicos
  ignore: [
    // Generated types (Supabase)
    'src/types/database.types.ts',

    // Test helpers
    'tests/helpers/',

    // Scripts directory
    'scripts/',
  ],

  // Ignorar dependencias que se usan implícitamente
  ignoreDependencies: [
    // Prettier plugin se referencia en .prettierrc
    'prettier-plugin-tailwindcss',

    // ESLint plugins referenciados en eslint.config.mjs
    'eslint-config-prettier',
    '@eslint/eslintrc',
    'eslint-import-resolver-typescript',

    // Tailwind plugins referenciados en tailwind.config.ts
    '@tailwindcss/typography',
    '@tailwindcss/forms',
    'tailwindcss-animate',
  ],

  // Configuración por plugin de Knip
  next: {
    entry: [
      'next.config.{js,ts,mjs}',
      'src/app/**/layout.{ts,tsx}',
      'src/app/**/page.{ts,tsx}',
      'src/app/**/route.{ts,tsx}',
      'src/middleware.{ts,tsx}',
    ],
  },
};

export default config;
