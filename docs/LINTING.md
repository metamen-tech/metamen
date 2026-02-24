# METAMEN100 — Guia de Linting y Formateo

## Herramientas

| Herramienta      | Comando             | Proposito                                  |
| ---------------- | ------------------- | ------------------------------------------ |
| ESLint 9         | `pnpm lint`         | Calidad de codigo, seguridad, import order |
| Prettier         | `pnpm format`       | Formateo automatico                        |
| Prettier (check) | `pnpm format:check` | Verificar formateo sin modificar           |
| Knip             | `pnpm knip`         | Detectar dead code y deps no usadas        |

## Configuracion

- **ESLint**: `eslint.config.mjs` (flat config ESLint 9)
- **Prettier**: `.prettierrc` + `.prettierignore`
- **Knip**: `knip.config.ts`
- **EditorConfig**: `.editorconfig`

## Plugins ESLint activos

| Plugin                     | Proposito                                           |
| -------------------------- | --------------------------------------------------- |
| `typescript-eslint/strict` | TypeScript type-safe rules                          |
| `eslint-plugin-security`   | Detecta patrones inseguros (eval, object injection) |
| `eslint-plugin-import-x`   | Orden de imports en 6 grupos                        |
| `eslint-config-prettier`   | Desactiva reglas que conflictuan con Prettier       |
| `@next/eslint-plugin-next` | Reglas especificas de Next.js                       |

## Import Order (6 grupos)

Los imports deben estar ordenados en estos grupos, separados por linea vacia:

1. **React**: `react`, `react-dom`
2. **Librerias externas**: `next`, `framer-motion`, `zustand`, `stripe`, `inngest`, `@supabase`, `@upstash`, `@google/generative-ai`
3. **Componentes internos**: `@/components/**`
4. **Hooks internos**: `@/hooks/**`
5. **Core logic**: `@/lib/**`, `@/core/**`
6. **Tipos**: `@/types/**`

Dentro de cada grupo: orden alfabetico.

### Ejemplo correcto

```tsx
import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { create } from 'zustand';

import { Button } from '@/components/ui/Button';

import { useGameState } from '@/hooks/useGameState';

import { calculateBTC } from '@/lib/core/btc';

import type { GameVector } from '@/types/vectors';
```

## Errores comunes y soluciones

### `@typescript-eslint/no-explicit-any`

**Error**: `Unexpected any. Specify a different type.`

**Solucion**: Usar `unknown` en lugar de `any`, o definir un tipo especifico.

```tsx
// Incorrecto
const data: any = fetchData();

// Correcto
const data: unknown = fetchData();
// o mejor:
const data: GameVector = fetchData();
```

### `security/detect-eval-with-expression`

**Error**: `eval can be harmful`

**Solucion**: Nunca usar `eval()`. Usar alternativas seguras:

```tsx
// Incorrecto
eval(userInput);

// Correcto
JSON.parse(userInput); // si es JSON
new Function('...'); // solo si es absolutamente necesario y el input es sanitizado
```

### `security/detect-object-injection`

**Error**: `Variable used as key in object injection`

**Solucion**: Validar la key antes de usarla:

```tsx
// Incorrecto
obj[userKey] = value;

// Correcto
const ALLOWED_KEYS = ['aura', 'jawline', 'wealth'] as const;
if (ALLOWED_KEYS.includes(userKey)) {
  obj[userKey] = value;
}
```

### `import-x/order`

**Error**: `... should occur before ...`

**Solucion**: Reordenar imports segun los 6 grupos. Ejecutar `pnpm lint --fix` para auto-fix.

### Prettier formatting

**Error**: Archivo no formateado correctamente

**Solucion**: `pnpm format` formatea todos los archivos automaticamente.

### Knip: falsos positivos

**Error**: Knip reporta exports/deps que si se usan

**Solucion**: Agregar a `ignore` o `ignoreDependencies` en `knip.config.ts`.

## Pipeline recomendado pre-commit

```bash
pnpm format        # 1. Formatear
pnpm lint          # 2. Lint
pnpm type-check    # 3. TypeScript
pnpm knip          # 4. Dead code (opcional, puede tener findings esperados)
```

## Notas del entorno

- `pnpm lint` usa `next lint` internamente, que invoca ESLint con la flat config.
- `next lint` verifica la presencia de `@next/eslint-plugin-next` al inicio. No ignorar `eslint.config.mjs` en la seccion de ignores de ESLint.
- En Windows con WSL como bash default, usar Git Bash para scripts que requieren bash nativo.
