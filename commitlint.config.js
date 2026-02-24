// @ts-check

/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Types permitidos alineados con Conventional Commits
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Correccion de bug
        'docs', // Solo documentacion
        'style', // Formato, sin cambio de logica
        'refactor', // Refactoreo sin cambio funcional
        'perf', // Mejora de rendimiento
        'test', // Agregar o corregir tests
        'build', // Build system o dependencias externas
        'ci', // Configuracion CI/CD
        'chore', // Mantenimiento general
        'revert', // Revertir commit anterior
      ],
    ],
    // Scopes permitidos alineados con Constantes Maestras del proyecto
    'scope-enum': [
      2,
      'always',
      [
        // Core domains
        'auth',
        'avatar',
        'tasks',
        'vectors',
        'economy',
        'ui',
        'db',
        'api',
        // 6 Vectores
        'aura',
        'jawline',
        'wealth',
        'physique',
        'social',
        'env',
        // Features
        'tools',
        'inngest',
        'payments',
        'images',
        'notifications',
        'store',
        'levels',
        'health',
        // Services
        'redis',
        'stripe',
        'gemini',
        'posthog',
        'sentry',
        'supabase',
        // Infrastructure
        'git',
        'lint',
        'ci',
        'dx',
        'scaffold',
        'design',
        'tokens',
        'security',
        'deps',
        'config',
        'test',
        'format',
        'init',
      ],
    ],
    'scope-empty': [1, 'never'], // Warning si no hay scope (no error)
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],
  },
};

module.exports = config;
