# METAMEN100 - Convenciones de Branching

## Formato de nombres de ramas

```
{type}/{caja}-{subcaja}/{description}
```

### Componentes

| Componente | Descripcion | Ejemplo |
| --- | --- | --- |
| `type` | Tipo de cambio (alineado con commitlint) | `feat`, `fix`, `refactor` |
| `caja` | Numero de caja principal (`##`) | `02`, `03`, `04` |
| `subcaja` | Numero de subcaja (`#`) | `1`, `2`, `3` |
| `description` | Descripcion corta en kebab-case | `inngest-setup`, `vector-clamp` |

### Ejemplos

| Rama | Descripcion |
| --- | --- |
| `feat/02.6/inngest-setup` | Setup de Inngest (Caja 02, subcaja 6) |
| `fix/04.1/vector-clamp-boundaries` | Fix de vectores (Caja 04, subcaja 1) |
| `chore/02.4/ci-lighthouse-config` | Config CI (Caja 02, subcaja 4) |
| `feat/03.1/supabase-schema` | Schema de Supabase (Caja 03, subcaja 1) |
| `refactor/05.2/economy-btc-calc` | Refactor de economia BTC (Caja 05, subcaja 2) |
| `test/02.3/git-hooks-verify` | Tests de git hooks (Caja 02, subcaja 3) |
| `docs/02.3/branch-naming` | Documentacion de branching (Caja 02, subcaja 3) |

## Types permitidos

Alineados con `commitlint.config.js`:

| Type | Proposito | Ejemplo de rama |
| --- | --- | --- |
| `feat` | Nuevas funcionalidades | `feat/04.2/task-creation-flow` |
| `fix` | Correccion de bugs | `fix/05.1/hp-negative-overflow` |
| `docs` | Solo documentacion | `docs/02.3/branch-naming` |
| `style` | Formato sin cambio de logica | `style/06.1/button-spacing` |
| `refactor` | Mejora de codigo sin cambio funcional | `refactor/04.3/vector-utils` |
| `perf` | Mejoras de rendimiento | `perf/07.1/image-lazy-load` |
| `test` | Agregar o corregir tests | `test/03.2/auth-unit-tests` |
| `build` | Build system o deps | `build/02.1/turbopack-config` |
| `ci` | Configuracion CI/CD | `ci/02.4/github-actions` |
| `chore` | Mantenimiento general | `chore/02.3/husky-hooks` |
| `revert` | Revertir commit anterior | `revert/04.1/vector-calc-rollback` |

## Formato de commits

```
<type>(<scope>): <description>
```

- `type`: Uno de los types de la tabla anterior (obligatorio)
- `scope`: Uno de los scopes definidos en `commitlint.config.js` (recomendado)
- `description`: Descripcion corta en minusculas (obligatorio, max 100 caracteres)

### Ejemplos de commits

```
feat(auth): add Supabase login with magic link
fix(vectors): clamp values to 0-50 range
docs(git): add branch naming conventions
chore(deps): update @supabase/supabase-js to 2.49
test(economy): add BTC calculation unit tests
refactor(avatar): extract death logic to separate module
```

## Ramas protegidas

| Rama | Proteccion |
| --- | --- |
| `main` | Requiere PR aprobado, no push directo, status checks deben pasar |
| `develop` | Requiere PR aprobado, status checks deben pasar |

### Reglas de proteccion de `main`

- No se permite push directo
- Requiere pull request con al menos 1 aprobacion
- Status checks requeridos: `lint`, `type-check`, `build`
- Requiere que la rama este actualizada antes de merge
- No se permite force push
- No se permite eliminar la rama

### Reglas de proteccion de `develop`

- No se permite push directo
- Requiere pull request
- Status checks requeridos: `lint`, `type-check`
- Se permite force push solo para admins

## Flujo de trabajo

```
main (produccion)
  └── develop (integracion)
       └── feat/XX.Y/description (feature branches)
```

1. Crear rama desde `develop` siguiendo el formato
2. Desarrollar y hacer commits siguiendo convenciones
3. Crear PR hacia `develop`
4. Una vez aprobado, merge a `develop`
5. Para releases: PR de `develop` -> `main`

## Nota sobre fase actual

Durante la **Caja 02 (Setup)**, se trabaja directamente en `main` porque aun no hay features de producto. El flujo con `develop` se activara a partir de la **Caja 03** cuando comience el desarrollo de funcionalidades.
