# Política de Seguridad

## Sección 1: Política de Triage de Vulnerabilidades

| Severidad | Acción | SLA | Bloquea Merge |
| --- | --- | --- | --- |
| **Critical** | Fix inmediato + notificar al equipo | 24 horas | ✅ SÍ |
| **High** | Crear issue con label `security` | 7 días | ⚠️ Warning (no bloquea) |
| **Medium** | Agregar al backlog | Próximo sprint | ❌ NO |
| **Low** | Documentar y evaluar | Backlog | ❌ NO |

## Sección 2: Proceso de Respuesta

1. El workflow `security.yml` detecta la vulnerabilidad.
2. Si es Critical: el PR NO puede mergearse hasta que se resuelva.
3. Si es High: se crea un issue automático (o manual) con label `security` y SLA de 7 días.
4. Medium/Low: se documentan en el backlog sin bloquear desarrollo.

## Sección 3: Reportar Vulnerabilidades

```markdown
## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad, por favor:

1. **NO** abras un issue público
2. Envía un email a: [security@metamen100.com](mailto:security@metamen100.com)
3. Incluye:
    - Descripción de la vulnerabilidad
    - Pasos para reproducir
    - Impacto potencial
    - Sugerencia de fix (si la tienes)

Responderemos en un máximo de 48 horas.
```

## Sección 4: Herramientas de Auditoría

- **pnpm audit**: Vulnerabilidades en dependencias npm.
- **Snyk**: Vulnerabilidades en dependencias + código (análisis más profundo).
- **CodeQL**: Análisis estático de código (XSS, SQL injection, etc.).
- **Gitleaks**: Secretos y credenciales hardcodeadas en el repositorio.
