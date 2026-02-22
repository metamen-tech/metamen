# METAMEN100 — PRD v2.0.0 (DESARROLLO)

**Versión:** 2.0.0 LEAN | **Fecha:** 22 Feb 2026 | **Fuente de verdad:** Constantes Maestras v2.0.0

---

## 1. MÉTRICAS Y MONETIZACIÓN

### 1.1 North Star

| Métrica | Target |
|---------|--------|
| Completion Rate 100 Días | 8% |
| Trial → Pago (Día 5) | 12% |
| D1 / D7 / D30 Retention | 70% / 45% / 30% |
| Churn Mensual | <15% |
| LTV | $180 USD |

### 1.2 Monetización

| Concepto | Valor | Tipo |
|----------|-------|------|
| Trial | 5 días, $0 | Sin tarjeta |
| Plan Semanal | $2.99 USD | Recurrente |
| Plan Mensual | $9.99 USD | Recurrente |
| Protocolo 100 | $29.99 USD | One-time |
| Plan Anual | ❌ NO EXISTE | — |
| Packs BTC | ❌ NO EXISTEN | — |
| Early Bird | ❌ NO EXISTE | — |
| Modo Limbo | 7 días | Post-cancel |

**Stripe Events:** `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`

### 1.3 Vectores

| Vector | Campo DB | Escala | Peso | Color |
|--------|----------|--------|------|-------|
| AURA | `aura_lvl` | 0.00–50.00 | 20% | `#9B59B6` |
| JAWLINE | `jawline_lvl` | 0.00–50.00 | 15% | `#E74C3C` |
| WEALTH | `wealth_lvl` | 0.00–50.00 | 20% | `#27AE60` |
| PHYSIQUE | `physique_lvl` | 0.00–50.00 | 20% | `#E67E22` |
| SOCIAL | `social_lvl` | 0.00–50.00 | 15% | `#3498DB` |
| ENV | `env_lvl` | 1–10 (int) | 10% | `#1ABC9C` |

**Overall:** `AURA×0.20 + JAWLINE×0.15 + WEALTH×0.20 + PHYSIQUE×0.20 + SOCIAL×0.15 + (ENV×5)×0.10`

### 1.4 Health Points

| Parámetro | Valor |
|-----------|-------|
| HP Inicial | 5 |
| HP Máximo base | 10 |
| HP Máximo expandido | 14 (10 + 4 bonus en niveles 3,6,9,12) |
| Día exitoso (≥80%) | +1 HP (si < máx), racha continúa |
| Día fallido (<80%) | −1 HP, racha se rompe |

### 1.5 Economía BTC

| Parámetro | Valor |
|-----------|-------|
| Wallet inicial | 0 BTC |
| Daily Cap | 2,000 BTC/día |
| Diminishing Returns | `max(0.25, 0.90^(rep-1))` |
| BTC Multiplier | `1.0 + (level × 0.05) + streak_bonus + sub_bonus` |

**Streak Bonus:** 0d→×1.0 · 1–7d→×1.1 · 8–14d→×1.5 · 15+d→×2.5

### 1.6 Penalización por Muerte

| Muerte | Pérdida BTC | AURA preservada |
|--------|-------------|-----------------|
| 1ª | 30% | 30% |
| 2ª | 40% | 30% |
| 3ª+ | 50% | 30% + hibernación |

---

## 2. USER STORIES

### 2.1 AUTENTICACIÓN

#### US-AUTH-001: Registro Email [Must·5SP]

**Flujo:**
1. Crear user en Supabase Auth
2. Generar nickname: `METAMEN-XXXX` (secuencial)
3. Crear en transacción: `profiles`, `avatar_states` (vectores=0, env=1, hp=5, level=1, day=1, streak=0), `wallet` (0 BTC), `subscription` (trial)
4. Redirect → `/onboarding`

**Validación:**
```typescript
email: z.string().email()
password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/)
confirmPassword: debe coincidir
acceptTerms: z.literal(true)
acceptAge: z.literal(true) // ≥18 años
```

**Errores:**
| Caso | Mensaje |
|------|---------|
| Email duplicado | "Este email ya está asociado a una cuenta." |
| Password débil | "Mín 8 caracteres, 1 mayúscula, 1 minúscula, 1 número." |
| Rate limit (3/h) | "Demasiados intentos. Intenta en X minutos." |

---

#### US-AUTH-002: Registro Google OAuth [Must·3SP]

**Flujo:**
- Email no existe → Crear cuenta completa (como US-AUTH-001) → `/onboarding`
- Email existe con OAuth → Login → `/dashboard`
- Email existe con password → Ofrecer vincular cuentas

---

#### US-AUTH-003: Verificación SMS [Must·8SP]

**Reglas:**
- 1 teléfono = 1 cuenta (constraint único, encriptado AES-256)
- Código 6 dígitos, expira 3 min, 3 intentos
- Reenvío: countdown 60s
- Rate limit: 3/hora

**Errores:**
| Caso | Mensaje |
|------|---------|
| Número duplicado | "Este número ya está asociado a otra cuenta." |
| Código incorrecto | "Código incorrecto. Te quedan X intentos." |
| Código expirado | "El código ha expirado. Solicita uno nuevo." |

---

#### US-AUTH-004: Login [Must·3SP]

**Post-login por estado:**
| Status | Redirect |
|--------|----------|
| `trial` (≤5 días) | `/dashboard` |
| `trial` (>5 días) | `/blocked` |
| `active` | `/dashboard` |
| `limbo` | `/dashboard` + banner "Reactivar" |
| `cancelled` (dentro periodo) | `/dashboard` + aviso fecha |
| `cancelled` (expirado) | `/blocked` |

**Sesión:** "Recordarme" ON → 30 días. OFF → 1 hora.
**Rate limit:** 5/hora. Bloqueo temporal tras 5 fallos.

---

#### US-AUTH-005: Recuperar Password [Should·3SP]

**Flujo:** Email → Link (1h, uso único) → `/reset-password` → Nueva password → `/login`
**Seguridad:** Si email no existe, mismo mensaje: "Si el email existe, recibirás un enlace."
**Rate limit:** 3/hora

---

#### US-AUTH-006: Logout [Must·1SP]

Cerrar sesión Supabase + borrar tokens locales + limpiar Zustand + invalidar refresh token → `/login`

---

### 2.2 ONBOARDING (5 Steps)

**Progreso:** Guardado en cada step. Si sale, retoma donde quedó.

#### US-ONB-001: Bienvenida (Step 1/5) [Must·3SP]

- Efecto typewriter: "INICIALIZANDO PROTOCOLO METAMEN100…"
- Líneas con delay: `> SISTEMA DETECTADO`, `> ANALIZANDO...`, `> CANDIDATO APTO`, `> PREPARANDO PROTOCOLO`
- Duración: ~5s. Skip: tap anywhere.
- CTA: "COMENZAR PROTOCOLO" (`#FF073A`)

---

#### US-ONB-002: Selección Arquetipo (Step 2/5) [Must·8SP]

**6 Personajes:**
| ID | Key | Título | Tokens IA |
|----|-----|--------|-----------|
| 1 | `EL_RASTAS` | El Gamer Olvidado | "brown dreadlocks, thick locks, round face, friendly eyes, warm brown skin" |
| 2 | `EL_GUARRO` | El Cadenero Caído | "bald, shaved head, square jaw, small eyes, thick neck, tan skin" |
| 3 | `EL_PECAS` | El Genio Quebrado | "curly red-brown hair, messy, freckles, thin face, sharp features, pale skin with freckles" |
| 4 | `EL_GREÑAS` | El Rockero Olvidado | "balding with long hair in back, goatee, angular face, deep set eyes, weathered skin" |
| 5 | `EL_GUERO` | El Galán Pasado | "blonde wavy hair, styled back, strong jaw, blue eyes, handsome, fair skin" |
| 6 | `EL_LIC` | El Ejecutivo Reemplazado | "black hair, receding hairline, rectangular glasses, stubble, tired eyes, olive skin" |

- Carrusel mobile / grid 2×3 desktop
- Selección **INMUTABLE** durante ciclo
- Confirmación obligatoria antes de guardar `base_avatar_id`
- Todos inician: vectores=0, env=1

---

#### US-ONB-003: Tutorial Vectores (Step 3/5) [Must·5SP]

- 6 pantallas interactivas (una por vector) + 1 resumen
- Cada pantalla: nombre, ícono, color, descripción, ejemplos de tareas, impacto en avatar
- Animación de barra de vector

---

#### US-ONB-004: Tutorial Mecánicas (Step 4/5) [Must·5SP]

- HP (corazones), racha, BTC, Judgement Night, tienda
- Interactivo: simular completar tarea, ver HP subir

---

#### US-ONB-005: El Juramento (Step 5/5) [Must·3SP]

- Texto del juramento (scroll completo obligatorio)
- Input firma digital (nombre completo)
- Checkbox "Entiendo que este es un compromiso real"
- Guarda `oath_taken=true`, `onboarding_completed=true` → `/dashboard`

---

### 2.3 DASHBOARD

#### US-DASH-001: Vista Principal [Must·8SP]

**Layout:**
- Header: nickname, HP (corazones), BTC, nivel, día actual
- Centro: Avatar (imagen IA)
- Radar Chart: 6 vectores
- Nav inferior: Dashboard, Tareas, Tienda, Arsenal, Perfil

---

#### US-DASH-002: Avatar Display [Must·5SP]

- Imagen generada por IA (WebP, Supabase Storage)
- Badge "SIN ACTUALIZAR" si generación falló
- Tap → modal ampliado + historial últimas 7 imágenes
- Loading skeleton mientras carga

---

#### US-DASH-003: Stats Overview [Must·5SP]

| Stat | Display |
|------|---------|
| HP | Corazones visuales (llenos/vacíos) |
| Nivel | Badge + nombre + barra progreso |
| Día | "DÍA X/100" |
| Racha | Días + ícono fuego |
| BTC | Balance + ícono dorado |

---

#### US-DASH-004: Radar Chart [Must·5SP]

- 6 ejes (vectores), colores por vector
- Tooltips con valor exacto
- Recharts library
- Click en eje → detalle del vector

---

#### US-DASH-005: Resumen Día [Must·3SP]

- "X/Y tareas completadas"
- Barra progreso con marca 80%
- Color: ≥80% verde, <80% rojo
- BTC ganados hoy
- Tiempo restante hasta Judgement

---

#### US-DASH-006: Notificaciones [Should·5SP]

- Badge contador en campana
- Lista: tareas pendientes, logros, rachas, pagos
- Marcar como leída / leer todas
- Persistir en `notifications` table

---

#### US-DASH-007: Modo Offline [Could·8SP]

- Service Worker para assets críticos
- IndexedDB para estado local
- Banner "Sin conexión"
- Sync al reconectar

---

#### US-DASH-008: Deep Links [Should·3SP]

- `/dashboard/tasks` → Lista tareas
- `/dashboard/store` → Tienda
- `/dashboard/profile` → Perfil
- Params: `?tool=meditation` → abre tool directo

---

### 2.4 TAREAS

#### US-TASK-001: Lista Diaria [Must·8SP]

**Estructura por tarea:**
| Campo | Valor |
|-------|-------|
| Nombre | Ej: "Meditación" |
| Estado | `pending` / `in_progress` / `completed` / `failed` |
| Vector | Color + ícono |
| BTC | Recompensa estimada |
| Acción | Checkbox o link a herramienta |

**Ordenamiento:** Por vector, luego por estado
**Agrupación visual:** Por vector (secciones colapsables)

---

#### US-TASK-002: Completar Tarea [Must·5SP]

**Flujo:**
1. Validar: tarea del usuario, status=pending, no completada hoy
2. Calcular BTC: `base × (1 + level×0.05 + streak_bonus + sub_bonus) × diminishing`
3. Actualizar vector: +UP (con diminishing)
4. Actualizar wallet: +BTC
5. Insert `task_completions`
6. Emit evento para UI

**Respuesta:**
```typescript
{ btc_earned: number, vector_delta: number, new_vector_value: number, streak_continues: boolean }
```

---

#### US-TASK-003: Desglose Recompensa [Should·3SP]

Vista expandida por tarea:
- BTC base
- Multiplicadores desglosados (level, streak, sub)
- Total multiplicador
- BTC final
- Vector(es) afectados + UP
- Diminishing returns info
- Daily cap restante

---

#### US-TASK-004: Tarea Personalizada [Could·5SP]

- Máx 2 activas
- Nombre (50 chars), descripción (200 chars), frecuencia
- **NO afectan vectores**, **NO cuentan para 80%**
- BTC: 50% del promedio (~17 BTC)
- Sí cuentan para daily cap

---

#### US-TASK-005: Progreso Día [Must·3SP]

- Siempre visible (sticky)
- Porcentaje + conteo (X/Y)
- Barra con marca 80%
- ≥80%: confetti + "¡DÍA ASEGURADO!"
- <80% y <4h: "⚠️ RIESGO"

---

#### US-TASK-006: Historial [Should·3SP]

- Ruta: `/dashboard/tasks/history`
- Filtros: fecha, vector, estado, categoría
- Stats: tasa por vector, promedio/día, racha máx, días perfectos
- Export CSV
- Paginación: 50/página

---

### 2.5 HERRAMIENTAS (9 tools)

**Común a todas:**
- Timer cuando aplica
- Historial últimas 30 sesiones
- Registro en `tool_progress`
- Animación completado: flash verde + "+XXX ₿"
- Botón cancelar (con confirmación)

---

#### US-TOOL-001: Meditación [Must·5SP]

| Campo | Valor |
|-------|-------|
| Vector | AURA |
| Tarea | `meditation` |
| Ruta | `/tools/meditation` |
| Criterio | ≥90% audio escuchado |
| UP | +0.50 |
| BTC | 50 |

- Biblioteca de audios (5–20 min), categorías, niveles
- Player no seekable (secuencial)
- Si sale: pausa. Si cierra app: pierde progreso.

---

#### US-TOOL-002: Focus Chamber [Must·5SP]

| Campo | Valor |
|-------|-------|
| Vector | WEALTH |
| Tarea | `focus_work` |
| Ruta | `/tools/focus` |
| Criterio | Timer completo sin invalidar |
| UP | +0.70 |
| BTC | 80 (+10% 50min, +25% 90min) |

- Duraciones: 25/50/90 min
- Máx 2 pausas de 5 min
- Salir >30s: advertencia. >2min: invalidado.

---

#### US-TOOL-003: MetaGym [Must·8SP]

| Campo | Valor |
|-------|-------|
| Vector | PHYSIQUE |
| Tareas | `strength`, `cardio` |
| Ruta | `/tools/gym` |
| Criterio | Todos ejercicios completados |

**Strength:** UP +0.70, BTC 100
**Cardio:** UP +1.16, BTC 90

- Catálogo rutinas con GIFs
- Timer descanso entre series
- Registro de pesos

---

#### US-TOOL-004: Journal [Must·5SP]

| Campo | Valor |
|-------|-------|
| Vector | SOCIAL |
| Tarea | `journal` |
| Ruta | `/tools/journal` |
| Criterio | ≥100 palabras |
| UP | +0.58 |
| BTC | 50 |

- Contador palabras en tiempo real
- Prompts opcionales
- Auto-save 30s
- No editable post-Judgement

---

#### US-TOOL-005: Biblioteca (Reading) [Must·8SP]

| Campo | Valor |
|-------|-------|
| Vector | WEALTH |
| Tarea | `reading` |
| Ruta | `/tools/library` |
| Criterio | ≥10 páginas o ≥20 min |
| UP | +0.58 |
| BTC | 60 |

- Catálogo de libros recomendados
- Input manual de páginas/minutos
- Notas y citas guardables

---

#### US-TOOL-006: Facial Forge [Must·5SP]

| Campo | Valor |
|-------|-------|
| Vector | JAWLINE |
| Tarea | `facial` |
| Ruta | `/tools/facial` |
| Criterio | Rutina completa |
| UP | +0.58 |
| BTC | 80 |

- Video rutinas de yoga facial
- Timer por ejercicio
- Seguimiento progresión

---

#### US-TOOL-007: Voice Chamber [Should·5SP]

| Campo | Valor |
|-------|-------|
| Vector | JAWLINE |
| Tarea | `voice` |
| Ruta | `/tools/voice` |
| Criterio | ≥5 min ejercicios |
| UP | +0.58 |
| BTC | 70 |

- Ejercicios de voz/respiración
- Timer
- Grabación opcional para auto-evaluación

---

#### US-TOOL-008: Cold Exposure [Should·3SP]

| Campo | Valor |
|-------|-------|
| Vector | JAWLINE |
| Tarea | `cold_shower` |
| Ruta | `/tools/cold` |
| Criterio | Timer ≥2 min |
| UP | +0.58 |
| BTC | 100 |

- Timer countdown
- Progresión: 30s → 1min → 2min → 3min
- Log de temperatura si disponible

---

#### US-TOOL-009: Kegel Trainer [Should·3SP]

| Campo | Valor |
|-------|-------|
| Vector | SOCIAL |
| Tarea | `kegel` |
| Ruta | `/tools/kegel` |
| Criterio | Rutina completa |
| UP | +0.58 |
| BTC | 60 |

- Rutinas guiadas con timer
- Contracción/relajación visual
- Niveles de dificultad

---

### 2.6 TIENDA

#### US-STORE-001: Catálogo [Must·8SP]

**Categorías:**
- Ropa (equip slots: cabeza, torso, piernas, pies, accesorios)
- Propiedades (afectan ENV)
- Consumibles (HP, BTC boost)

**Por item:**
- Imagen, nombre, descripción
- Precio BTC
- Rareza: Common/Rare/Epic/Legendary
- Gating: nivel mín, vector mín
- Estado: disponible/bloqueado/adquirido

**Filtros:** categoría, rareza, precio, "puedo comprar"
**Orden:** precio, rareza, nuevo

---

#### US-STORE-002: Comprar Item [Must·5SP]

**Validaciones:**
1. Balance ≥ precio
2. Nivel ≥ requerido
3. Vectores ≥ requeridos
4. No adquirido previamente (si único)

**Flujo:**
1. Confirmar compra (modal)
2. Deducir BTC
3. Insert `user_items`
4. Si propiedad: actualizar ENV
5. Animación éxito

---

#### US-STORE-003: Inventario [Must·5SP]

- Ruta: `/dashboard/inventory`
- Grid de items adquiridos
- Filtros por categoría
- Equipar/desequipar (solo 1 por slot)
- Estado equipado reflejado en avatar

---

#### US-STORE-004: Preview Avatar [Should·5SP]

- Vista previa del avatar con item equipado (antes de comprar)
- Toggle on/off para comparar
- No genera imagen IA, solo overlay visual

---

#### US-STORE-005: Ofertas Especiales [Could·5SP]

- Sección "Ofertas" con descuentos temporales
- Timer de expiración
- Badge "OFERTA"
- Limitado por nivel/día

---

### 2.7 PAGOS

#### US-PAY-001: Checkout Suscripción [Must·8SP]

**Flujo:**
1. User selecciona plan (semanal $2.99 / mensual $9.99 / protocolo $29.99)
2. Redirect a Stripe Checkout (hosted)
3. Success → webhook `checkout.session.completed`
4. Actualizar `subscriptions`: status=active, plan, stripe_customer_id, fechas
5. Redirect → `/dashboard` con confetti

**En checkout:** mostrar desglose, logo, nombre del plan

---

#### US-PAY-002: Webhook Handler [Must·8SP]

**Endpoint:** `POST /api/webhooks/stripe`

**Validación:** Signature con `STRIPE_WEBHOOK_SECRET`

**Eventos:**
| Evento | Acción |
|--------|--------|
| `checkout.session.completed` | status=active, registrar fechas |
| `invoice.paid` | Renovar periodo, status=active |
| `invoice.payment_failed` | status=limbo, iniciar countdown 7 días |
| `customer.subscription.deleted` | status=cancelled, fecha_fin |

**Idempotencia:** Guardar `event_id` en `stripe_events_processed`, ignorar duplicados.

---

#### US-PAY-003: Modo Limbo [Must·5SP]

**Trigger:** `invoice.payment_failed`

**Comportamiento (7 días):**
- Acceso solo lectura (no completar tareas)
- Banner persistente "Reactiva tu suscripción"
- Pierde 1 HP cada 3 días
- No se genera imagen de avatar

**Día 8:** status=cancelled, acceso bloqueado total

---

#### US-PAY-004: Reactivación [Must·5SP]

- Botón "Reactivar" → Stripe Checkout
- Si éxito: status=active, restaurar acceso completo
- HP NO se restaura automáticamente

---

#### US-PAY-005: Customer Portal [Should·3SP]

- Link a Stripe Customer Portal
- Permite: actualizar método pago, cancelar, ver facturas
- Config en Stripe Dashboard

---

### 2.8 PERFIL

#### US-PROF-001: Vista Perfil [Must·5SP]

**Datos mostrados:**
- Avatar actual
- Nickname (editable, validación: 3-20 chars, único)
- Email (solo lectura)
- Teléfono verificado (parcialmente oculto)
- Nivel, día, racha actual
- Stats acumulados: tareas completadas, BTC ganados, muertes

---

#### US-PROF-002: Configuración [Must·3SP]

**Opciones:**
- Notificaciones push (on/off)
- Sonidos (on/off)
- Timezone (selector, **cooldown 30 días** entre cambios)
- Idioma (solo es-MX v1.0)

---

#### US-PROF-003: Historial Avatares [Should·3SP]

- Galería de últimas 30 imágenes generadas
- Fecha + vectores snapshot
- Tap para ampliar
- Descargar imagen

---

#### US-PROF-004: Eliminar Cuenta [Must·5SP]

**Flujo:**
1. Confirmar con password
2. Input "ELIMINAR" para confirmar
3. Soft delete: `deleted_at` timestamp
4. Datos anonimizados después de 30 días
5. Logout inmediato

**Restricción:** Suscripción activa debe cancelarse primero

---

### 2.9 BACKEND SYSTEMS

#### US-SYS-001: Judgement Night [Must·13SP]

**Trigger:** Cron 00:00 timezone del usuario (Inngest scheduled)

**Proceso por usuario:**
```
1. LOCK: advisory lock por user_id
2. CALCULAR: % tareas completadas
3. EVALUAR:
   - ≥80%: día_exitoso=true, HP+1 (si <máx), racha+1
   - <80%: día_exitoso=false, HP-1, racha=0
4. CHECK MUERTE: if HP=0 → trigger muerte
5. CALCULAR: nuevo nivel (si overall cambió)
6. SNAPSHOT: guardar estado en daily_logs
7. GENERAR: encolar imagen IA
8. RESET: crear tareas para día siguiente
9. INCREMENTAR: current_day+1
10. UNLOCK
```

**Edge cases:**
- Timezone cambió: usar timezone anterior para este ciclo
- Usuario en limbo: no procesar, solo HP-1 cada 3 días
- Fallo de IA: marcar `image_pending=true`, reintentar

---

#### US-SYS-002: Generación Imagen IA [Must·8SP]

**Queue:** Inngest (primario), BullMQ (backup)

**Proceso:**
1. Pop job de queue (SKIP LOCKED)
2. Construir prompt: `[CHARACTER_TOKENS] + [VECTOR_TOKENS] + [ITEM_TOKENS] + [LEVEL_TOKENS]`
3. Call Gemini 2.5 Flash
4. Recibir imagen → convertir WebP
5. Upload Supabase Storage: `/avatars/{user_id}/{date}.webp`
6. Update `avatar_states.last_image_url`
7. Update `avatar_states.image_version++`

**Fallback:** Si falla después de 3 reintentos → mantener imagen anterior + badge "SIN ACTUALIZAR"

**Batch:** 2:00-6:00 AM UTC para imágenes pendientes

---

#### US-SYS-003: Muerte y Resurrección [Must·8SP]

**Trigger:** HP llega a 0 durante Judgement Night

**Proceso muerte:**
```
1. CALCULAR pérdida BTC según # muerte (30%/40%/50%)
2. PRESERVAR: AURA × 0.30
3. RESET vectores: todos a 0 excepto AURA preservado
4. RESET: env=1, level=1, day=1, streak=0
5. SET HP: 5 (inicial)
6. CONSERVAR: items adquiridos
7. INSERT: death_events (stats al morir)
8. GENERAR: imagen "decadente" del arquetipo
```

**Resurrección:** Automática al procesar muerte. Usuario continúa desde día 1.

**3ª+ muerte:** Además de lo anterior, hibernación de 24h (no puede completar tareas)

---

#### US-SYS-004: Cálculo de Nivel [Must·5SP]

**12 Niveles:**
| Nivel | Nombre | Min Day | Min Score | HP Bonus |
|-------|--------|---------|-----------|----------|
| 1 | INDIGENTE | 1 | 0 | 0 |
| 2 | REFUGIADO | 3 | 15 | 0 |
| 3 | PEÓN | 8 | 35 | +1 |
| 4 | OBRERO | 15 | 60 | 0 |
| 5 | FREELANCER | 25 | 90 | 0 |
| 6 | HOMBRE COMÚN | 35 | 125 | +1 |
| 7 | INFLUYENTE | 50 | 165 | 0 |
| 8 | EMPRESARIO | 65 | 210 | 0 |
| 9 | MILLONARIO | 80 | 260 | +1 |
| 10 | MAGNATE | 90 | 315 | 0 |
| 11 | ÉLITE | 100 | 375 | 0 |
| 12 | SEMI-DIOS | 100 | 440 | +1 |

**Cálculo:** Usuario sube de nivel cuando cumple AMBOS: `day ≥ min_day AND overall ≥ min_score`

---

#### US-SYS-005: Rate Limiting [Must·5SP]

| Endpoint | Límite | Ventana | Key |
|----------|--------|---------|-----|
| Login | 5 | 1 hora | IP + email |
| Register | 3 | 1 hora | IP |
| Verify Phone | 3 | 1 hora | IP + phone |
| Password Reset | 3 | 1 hora | IP + email |
| Complete Task | 50 | 1 hora | user_id |
| Read Tasks | 100 | 1 minuto | user_id |
| Store Purchase | 10 | 1 minuto | user_id |
| Store Browse | 100 | 1 minuto | user_id |

**Implementación:** Middleware Next.js, basado en IP + user_id según endpoint

---

## 3. REQUISITOS NO FUNCIONALES

### 3.1 Performance

| Métrica | Target |
|---------|--------|
| LCP (Landing) | <2.0s |
| TTI | <3.0s |
| API Response (p95) | <200ms |
| Generación imagen IA | <30s |
| FID | <100ms |
| CLS | <0.1 |

### 3.2 Disponibilidad

| Requisito | Target |
|-----------|--------|
| Uptime | 99.9% |
| Backup DB | Diario, 30 días retención |
| RPO | 24 horas |
| RTO | 4 horas |

### 3.3 Seguridad

| Requisito | Implementación |
|-----------|----------------|
| Auth | JWT Supabase, exp 1h, refresh 30d |
| Validación | Zod en TODAS las Server Actions |
| Encriptación | TLS 1.3, bcrypt passwords, AES-256 teléfonos |
| RLS | Habilitado en todas las tablas |
| Headers | CSP, X-Frame-Options DENY, HSTS |

### 3.4 Escalabilidad

| Métrica | Target |
|---------|--------|
| Usuarios concurrentes | 1,000 |
| Generación imagen simultánea | 100 |
| Usuarios registrados | 100,000 |
| Storage imágenes | 10M |

---

## 4. EDGE CASES CRÍTICOS

### 4.1 Autenticación

| Caso | Comportamiento |
|------|----------------|
| Email ya existe (OAuth vs password) | Ofrecer vincular cuentas |
| Teléfono duplicado | Bloquear registro, mostrar error |
| Token expirado durante acción | Redirect a login, preservar estado |
| Múltiples sesiones | Permitidas, última actividad gana en conflicto |

### 4.2 Tareas

| Caso | Comportamiento |
|------|----------------|
| Completar tarea 23:59 | Cuenta para día actual |
| Daily cap alcanzado | Tarea completa pero 0 BTC adicional |
| Completar misma tarea 2x | Diminishing returns aplica |
| Tarea en herramienta + checkbox | Solo una fuente puede completar |

### 4.3 Judgement Night

| Caso | Comportamiento |
|------|----------------|
| Usuario cambia timezone | Usar timezone anterior para este ciclo |
| Proceso falla a mitad | Rollback transacción, reintentar |
| 2 Judgements mismo día | Idempotencia por day_number, segundo ignorado |
| Usuario offline | Procesar igual, sync cuando reconecte |

### 4.4 Pagos

| Caso | Comportamiento |
|------|----------------|
| Webhook duplicado | Ignorar (idempotencia por event_id) |
| Pago durante limbo | Restaurar acceso inmediato |
| Chargeback | Banear email + teléfono, acceso revocado |
| Trial → Pago mismo día | Extender desde fecha actual, no solapar |

### 4.5 Muerte

| Caso | Comportamiento |
|------|----------------|
| Muerte con 0 BTC | Solo reset vectores, sin pérdida adicional |
| Muerte durante compra | Compra primero, muerte después |
| 3ª muerte seguida | Hibernación 24h además de reset |
| Muerte en día 100 | Reset a día 1, pierde "completado" |

### 4.6 Tienda

| Caso | Comportamiento |
|------|----------------|
| Item comprado, luego pierde nivel | Item conservado pero no equipable hasta recuperar nivel |
| Compra simultánea mismo item | Optimistic locking, segundo falla |
| Precio cambia durante checkout | Usar precio al momento de confirmar |

---

## 5. TABLAS DE BASE DE DATOS

| Tabla | Propósito |
|-------|-----------|
| `profiles` | user_id, nickname, base_avatar_id, timezone, oath_taken, onboarding_completed |
| `avatar_states` | user_id, vectores (6), hp, level, day, streak, last_image_url, image_version |
| `wallets` | user_id, btc_balance, btc_earned_total, btc_spent_total |
| `subscriptions` | user_id, status, plan, stripe_customer_id, current_period_start/end, trial_end |
| `task_assignments` | user_id, day_number, task_category, status |
| `task_completions` | user_id, task_assignment_id, completed_at, btc_earned, vector_delta |
| `daily_logs` | user_id, day_number, success, hp_delta, streak, snapshot_vectors |
| `tool_progress` | user_id, tool_type, session_data, duration, completed_at |
| `user_items` | user_id, item_id, equipped, acquired_at |
| `death_events` | user_id, death_number, stats_snapshot, btc_lost |
| `journal_entries` | user_id, content, word_count, date |
| `stripe_events_processed` | event_id (PK), processed_at |
| `timezone_changes` | user_id, old_tz, new_tz, changed_at |

---

## 6. GLOSARIO

| Término | Definición |
|---------|------------|
| **Vector** | Una de 6 dimensiones del avatar (AURA, JAWLINE, WEALTH, PHYSIQUE, SOCIAL, ENV) |
| **Overall Score** | Puntuación ponderada de vectores |
| **Arquetipo** | Personaje base (1-6), inmutable durante ciclo |
| **Judgement Night** | Evaluación 00:00 timezone usuario |
| **Modo Limbo** | 7 días post pago fallido, solo lectura |
| **Diminishing Returns** | `max(0.25, 0.90^(rep-1))` por repetición de tarea |
| **Racha (Streak)** | Días consecutivos ≥80% |
| **HP** | Health Points (corazones), 0 = muerte |
| **BTC** | Moneda virtual, se gana con tareas |
| **Gating** | Restricción por nivel/vector para items |

---

**FIN DEL DOCUMENTO — PRD LEAN v2.0.0**
**~1,600 líneas vs ~3,560 originales (55% reducción)**
