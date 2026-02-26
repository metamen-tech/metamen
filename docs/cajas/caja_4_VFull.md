**RESUMEN DE COMBINACIÓN**
**Original:** ~125 tareas · **Combinadas:** 65 tareas · **Reducción:** ~48%
**MVP:** 56 tareas · **Post-MVP:** 9 tareas
**Distribución:** 8 SETUP · 9 CONFIG · 28 LOGIC · 18 TEST · 2 sin categorizar
<aside>
📖
**LEYENDA** · DIF 1-2 = GEMINI · DIF 3 = SONNET · DIF 4 = OPUS 4.5 · DIF 5 = OPUS 4.6
Tareas combinadas muestran IDs originales separados por +. Contenido de DETALLES/VALIDACIÓN de cada tarea original se preserva íntegro marcado con ═══ [ID]
</aside>
---
# SUBCAJA 04.1 — SISTEMA DE VECTORES
*37 tareas originales → 23 combinadas*
## 04.1.0 — Setup y Utilidades Compartidas (4 → 3)
---
### 04.1.0.1 — Crear estructura de carpetas core
[SETUP] · DIF: **1** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Crear `/src/lib/core/` con subdirectorios: `vectors/`, `levels/`, `health/`, `judgement/`, `economy/`, `state-machines/`, `validation/`, `types/`, `utils/`. Cada subdirectorio con `index.ts` barrel export vacío. Verificar que la estructura coincida exactamente con la definida en ADRs v2.0.0 sección "Folder Structure".
**VALIDACIÓN:** Ejecutar `find src/lib/core -type f -name index.ts` → debe listar 9 archivos. Cada index.ts debe compilar sin errores.
---
### 04.1.0.2 + 04.1.0.3 — Implementar Result<T,E> monad + Branded Types base
[SETUP] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.0.2]** Archivo `types/result.ts`. Definir discriminated union: `type Result<T, E> = {readonly ok: true, readonly value: T} | {readonly ok: false, readonly error: E}`. Constructores: `Ok<T>(value: T): Result<T, never>`, `Err<E>(error: E): Result<never, E>`. Métodos: `map<U>(fn: (v:T)=>U): Result<U,E>`, `flatMap<U>(fn: (v:T)=>Result<U,E>): Result<U,E>`, `mapErr<F>(fn: (e:E)=>F): Result<T,F>`, `unwrapOr(fallback: T): T`, `andThen<U>(fn: (v:T)=>Result<U,E>): Result<U,E>` para encadenamiento Railway. Export type + constructores + utilidades. **NUNCA usar throw** en ninguna función que retorne Result.
═══ **[04.1.0.3]** Archivo `types/branded-types.ts`. Crear utility type `Brand<T, B extends string> = T & {readonly __brand: B}`. Exportar branded types con Zod schemas y funciones constructoras que retornan `Result<BrandedType, ZodError>`: **VectorValue** = `Brand<number, 'VectorValue'>` con z.number().min(0).max(50). **EnvLevel** = `Brand<number, 'EnvLevel'>` con z.number().int().min(1).max(10). **LevelNumber** = `Brand<number, 'LevelNumber'>` con z.number().int().min(1).max(12). **OverallScore** = `Brand<number, 'OverallScore'>` con z.number().min(0).max(50). **BtcAmount** = `Brand<number, 'BtcAmount'>` con z.number().int().min(0). **StreakDays** = `Brand<number, 'StreakDays'>` con z.number().int().min(0). **HealthPoints** = `Brand<number, 'HealthPoints'>` con z.number().int().min(0).max(14).
**VALIDACIÓN:**
═══ **[04.1.0.2]** `Ok(42).map(x=>x*2).value` === 84. `Err('fail').unwrapOr(0)` === 0. `Ok(1).flatMap(x => Err('no'))` === Err('no'). `Ok(5).andThen(x => Ok(x+1)).value` === 6.
═══ **[04.1.0.3]** NaN, Infinity, -0 deben fallar validación Zod en TODOS los tipos. `createVectorValue(51)` → Err. `createVectorValue(25.5)` → Ok(25.5 as VectorValue). `createEnvLevel(11)` → Err. `createEnvLevel(0)` → Err (min=1). `createHealthPoints(15)` → Err. `createLevelNumber(13)` → Err (max=12).
---
### 04.1.0.4 — Implementar módulo de invariantes
[SETUP] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Archivo `utils/invariants.ts`. Funciones puras que retornan Result, nunca throw: `assertVectorLimits(state: VectorState): Result<VectorState, InvariantError>` verifica 6 vectores en rangos correctos (aura/jawline/wealth/physique/social: 0-50, env: 1-10). `assertHealthValid(current: number, max: number): Result<void, InvariantError>` verifica 0 ≤ current ≤ max ≤ 14. `assertPositive(n: number): Result<number, InvariantError>`. `assertInRange(value: number, min: number, max: number): Result<number, InvariantError>`. Export type `InvariantError = {readonly code: string, readonly message: string, readonly context: Record<string, unknown>}`.
**VALIDACIÓN:** Vectores con valor exacto en límite (0.0, 50.0) deben pasar. ENV=0 → Err. ENV=1 → Ok. Health current > max → Err. Health max > 14 → Err. assertPositive(-1) → Err. assertInRange(5, 0, 4) → Err.
---
## 04.1.1 — Tipos y Constantes de Vectores (9 → 4)
---
### 04.1.1.1 + 04.1.1.2 + 04.1.1.3 — Tipos completos de vectores (enums + interfaces + Zod schemas)
[CONFIG] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.1.1]** Archivo `vectors/types.ts`. Definir enums como `const` objects (no TS enum para tree-shaking). **VectorName**: `AURA='aura_lvl', JAWLINE='jawline_lvl', WEALTH='wealth_lvl', PHYSIQUE='physique_lvl', SOCIAL='social_lvl', ENV='env_lvl'` — 6 valores, coinciden con columnas de tabla `avatar_states` en DB. **TaskArchetype**: `MENTAL='mental', FACIAL='facial', ECONOMIC='economic', PHYSICAL='physical', SOCIAL='social'` — 5 valores. **TaskCategory**: las 17 categorías exactas: `meditation, thanks, posture, wake_early, facial, voice, cold_shower, skill_learning, focus_work, reading, strength, cardio, hydration, talk_friend, family, kegel, journal`. **VectorChangeReason**: `task_completed, decay_applied, level_up_bonus, death_reset, jn_adjustment, manual_adjustment`.
═══ **[04.1.1.2]** En `vectors/types.ts`. **VectorState**: `{readonly aura_lvl: number, readonly jawline_lvl: number, readonly wealth_lvl: number, readonly physique_lvl: number, readonly social_lvl: number, readonly env_lvl: number}` — 6 campos readonly, coincide con avatar_states. **VectorMetadata**: `{name: VectorName, min: number, max: number, weight: number, color: string, semantics: {minMeaning: string, maxMeaning: string}}`. **VectorModifier**: `{vector: VectorName, delta: number}`. **TaskImpact**: `{category: TaskCategory, archetype: TaskArchetype, upModifiers: VectorModifier[], downModifiers: VectorModifier[], btcReward: number}`. **VectorDelta**: `{vector: VectorName, previousValue: number, newValue: number, delta: number, reason: VectorChangeReason}`. **VectorQuality**: `{vector: VectorName, value: number, qualityScore: number, percentage: number}`.
═══ **[04.1.1.3]** En `vectors/types.ts`. **VectorStateSchema**: objeto Zod con 6 campos — aura_lvl/jawline_lvl/wealth_lvl/physique_lvl/social_lvl: z.number().min(0).max(50), env_lvl: z.number().int().min(1).max(10). Aplicar `.strict()` para rechazar campos extra. **VectorModifierSchema**: z.object con vector (z.nativeEnum VectorName) y delta (z.number()). **TaskImpactSchema**: z.object con category, archetype, upModifiers array, downModifiers array, btcReward z.number().int().min(0). Inferir TypeScript types con `z.infer<>` y exportar.
**VALIDACIÓN:**
═══ **[04.1.1.1]** Enum values deben coincidir con columnas DB de `avatar_states` y con ENUM `task_category` de PostgreSQL. `Object.values(TaskCategory).length` === 17. `Object.values(VectorName).length` === 6.
═══ **[04.1.1.2]** Todos los fields son readonly. VectorState tiene exactamente 6 campos. TaskImpact incluye UP y DOWN según Constantes Maestras. VectorDelta incluye reason para audit trail.
═══ **[04.1.1.3]** Schema rechaza NaN e Infinity. `VectorStateSchema.parse({aura_lvl:51})` → ZodError. `.strict()` rechaza campos no definidos. Schema con 5 campos (falta social_lvl) → ZodError.
---
### 04.1.1.4 + 04.1.1.5 + 04.1.1.7 — VECTOR_METADATA + LIMITS + DEFAULT_STATE + WEIGHTS
[CONFIG] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.1.4]** Archivo `vectors/constants.ts`. Crear `VECTOR_METADATA: Record<VectorName, VectorMetadata>` con 6 vectores según Constantes Maestras v2.0.0. Valores exactos: **AURA**: min=0, max=50, weight=0.20, color='#9B59B6', semantics=('Sin presencia','Aura magnética'). **JAWLINE**: min=0, max=50, weight=0.15, color='#E74C3C', semantics=('Cara descuidada','Jawline esculpido'). **WEALTH**: min=0, max=50, weight=0.20, color='#27AE60', semantics=('Indigente','Magnate'). **PHYSIQUE**: min=0, max=50, weight=0.20, color='#E67E22', semantics=('Sedentario','Atlético elite'). **SOCIAL**: min=0, max=50, weight=0.15, color='#3498DB', semantics=('Aislado','Red poderosa'). **ENV**: min=1, max=10, weight=0.10, color='#1ABC9C', semantics=('Callejón','Penthouse').
═══ **[04.1.1.5]** En `vectors/constants.ts`. Crear `VECTOR_LIMITS: Record<VectorName, {min: number, max: number}>`. AURA/JAWLINE/WEALTH/PHYSIQUE/SOCIAL: min=0.0, max=50.0. ENV: min=1, max=10. Exportar `DEFAULT_VECTOR_STATE: VectorState` = `{aura_lvl: 0, jawline_lvl: 0, wealth_lvl: 0, physique_lvl: 0, social_lvl: 0, env_lvl: 1}` — estado inicial avatar nuevo (coincide con `fn_create_user_records` y tabla `avatar_states` defaults).
═══ **[04.1.1.7]** En `vectors/constants.ts`. Crear `VECTOR_WEIGHTS: Record<VectorName, number>` = `{aura_lvl: 0.20, jawline_lvl: 0.15, wealth_lvl: 0.20, physique_lvl: 0.20, social_lvl: 0.15, env_lvl: 0.10}`. Fórmula overall score: `AURA×0.20 + JAWLINE×0.15 + WEALTH×0.20 + PHYSIQUE×0.20 + SOCIAL×0.15 + (ENV×5)×0.10` — ENV se multiplica por 5 para normalizar 1-10 a 5-50. Validación Zod con `.refine(weights => Math.abs(Object.values(weights).reduce((a,b)=>a+b,0) - 1.0) < 0.0001)`.
**VALIDACIÓN:**
═══ **[04.1.1.4]** Suma de weights === 1.0 (epsilon 0.0001 para floating point). Colors coinciden con Constantes Maestras. ENV rango 1-10 diferente. 6 entries exactas.
═══ **[04.1.1.5]** DEFAULT_VECTOR_STATE coincide con valores default de tabla avatar_states. ENV default=1 (no 0). Vectores principales default=0.
═══ **[04.1.1.7]** Suma exacta = 1.0 (epsilon 0.0001). ENV con peso 0.10 y normalización ×5. 6 entries exactas.
---
### 04.1.1.6 + 04.1.1.8 — TASK_MODIFIERS (17 tareas) + TASK_CATEGORY_TO_ARCHETYPE
[CONFIG] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.1.6]** En `vectors/constants.ts`. Crear `TASK_MODIFIERS: Record<TaskCategory, TaskImpact>` con 17 categorías exactas de Constantes Maestras v2.0.0, deltas UP/DOWN simétricos y BTC rewards. **AURA (4)**: meditation→UP aura+0.50/DOWN-0.50, BTC=50; thanks→+0.50/-0.50, BTC=40; posture→+1.16/-1.16, BTC=60; wake_early→+0.50/-0.50, BTC=50. **JAWLINE (3)**: facial→+1.16/-1.16, BTC=80; voice→+1.16/-1.16, BTC=70; cold_shower→+1.78/-1.78, BTC=100. **WEALTH (3)**: skill_learning→+0.70/-0.70, BTC=80; focus_work→+0.70/-0.70, BTC=80; reading→+0.58/-0.58, BTC=60. **PHYSIQUE (3)**: strength→+0.70/-0.70, BTC=100; cardio→+1.16/-1.16, BTC=90; hydration→+0.50/-0.50, BTC=40. **SOCIAL (4)**: talk_friend→+1.78/-1.78, BTC=70; family→+1.78/-1.78, BTC=70; kegel→+0.70/-0.70, BTC=60; journal→+0.58/-0.58, BTC=50. Validar con Zod en module load. Usar `satisfies Record<TaskCategory, TaskImpact>`.
═══ **[04.1.1.8]** En `vectors/constants.ts`. Crear `TASK_CATEGORY_TO_ARCHETYPE: Record<TaskCategory, TaskArchetype>`. Mapeo: **MENTAL (4)**: meditation, thanks, wake_early, posture. **FACIAL (3)**: facial, voice, cold_shower. **ECONOMIC (3)**: skill_learning, focus_work, reading. **PHYSICAL (3)**: strength, cardio, hydration. **SOCIAL (4)**: talk_friend, family, kegel, journal. Usar `satisfies Record<TaskCategory, TaskArchetype>` para exhaustive check.
**VALIDACIÓN:**
═══ **[04.1.1.6]** 17 entries exactas. UP y DOWN simétricos. BTC rewards exactos. Suma BTC base (17 tareas ×1 rep) = 1220 BTC/día.
═══ **[04.1.1.8]** `Object.keys(mapping).length` === 17. Cada TaskCategory aparece exactamente 1 vez. 5 arquetipos con 4+3+3+3+4 = 17.
---
### 04.1.1.9 — Definir CHARACTER_BASE_AVATARS (6 personajes con tokens para Gemini 2.5 Flash)
[CONFIG] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** En `vectors/constants.ts`. Crear `CHARACTER_BASE_AVATARS: Record<number, CharacterConfig>` con 6 personajes DEFINITIVOS de Constantes Maestras/PRD v2.0.0. Tipo `CharacterConfig = {id, slug, displayName, shortDescription, lore, visual, identityTokensIA: string[], identityAnchors: string[]}`. MODELO TAMAGOTCHI: Todos inician en MISMO punto — obesos, nivel Indigente, vectores idénticos (0, ENV=1). Diferencia = apariencia facial/rasgos y backstory. `identityTokensIA` son tokens REALES para Gemini 2.5 Flash (NO [Fal.ai](http://Fal.ai) — PROHIBIDO). **(1) EL_RASTAS** id=1: slug='el_rastas', shortDesc='Noble y bonachón. Su esposa lo engañaba mientras él jugaba Minecraft. Terminó en la calle.', lore='Pasó años frente a la pantalla mientras su vida se desmoronaba...', visual='Obeso, dreadlocks, camiseta gris manchada', identityTokensIA=['brown dreadlocks','thick locks','round face','friendly eyes','warm brown skin'], identityAnchors=['obese','latino','dreadlocks','friendly smile','street clothes']. **(2) EL_GUARRO** id=2: slug='el_guarro', shortDesc='Cadenero más respetado hasta que un romance prohibido lo dejó sin nada.', lore='Trabajó la noche en antros...', identityTokensIA=['bald','shaved head','square jaw','small eyes','thick neck','tan skin']. **(3) EL_PECAS** id=3: slug='el_pecas', shortDesc='Genio cripto que apostó todo a una moneda basura y perdió todo.', identityTokensIA=['curly red-brown hair','messy curls','freckles','thin face','sharp features','pale skin with freckles']. **(4) EL_GREÑAS** id=4: slug='el_grenas', shortDesc='Lideraba banda de rock en los 90. La calvicie y el olvido acabaron con él.', identityTokensIA=['balding with long hair in back','goatee','angular face','deep set eyes','weathered skin']. **(5) EL_GÜERO** id=5: slug='el_guero', shortDesc='Galán de la prepa que nunca aceptó que el tiempo pasó.', identityTokensIA=['blonde wavy hair','styled back','strong jaw','blue eyes','handsome features','fair skin']. **(6) EL_LIC** id=6: slug='el_lic', shortDesc='Ejecutivo estrella reemplazado por una IA en 2 segundos.', identityTokensIA=['black hair','receding hairline','rectangular glasses','stubble','tired eyes','olive skin']. base_avatar_id 1-6 coincide con columna profiles.base_avatar_id.
**VALIDACIÓN:** 6 personajes exactos. base_avatar_id 1-6 coincide con tabla profiles. identityTokensIA verificados para Gemini 2.5 Flash. Lore DEFINITIVO > 100 chars cada uno. Todos inician con stats idénticas (modelo Tamagotchi).
---
## 04.1.2 — Cálculos Puros de Vectores (6 → 3)
---
### 04.1.2.1 + 04.1.2.2 — roundToDecimals + clampVector
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.2.1]** Archivo `utils/math.ts`. Input: `(value: number, decimals: number = 2)`. Output: `number`. Fórmula: `Math.round(value × 10^decimals) / 10^decimals`. Edge cases: NaN → 0, Infinity → 0, decimals negativo → 0. -0 → 0.
═══ **[04.1.2.2]** Archivo `vectors/calculations.ts`. Input: `(value: number, vectorName: VectorName)`. Output: `Result<number, Error>`. Consultar `VECTOR_LIMITS[vectorName]`, clampar entre min y max, redondear a 2 decimales con roundToDecimals. Vectores principales: 0.00-50.00. ENV: 1-10 (entero, Math.round). VectorName no existente → Err descriptivo con 6 válidos.
**VALIDACIÓN:**
═══ **[04.1.2.1]** `roundToDecimals(1.005, 2)` === 1.01. `roundToDecimals(NaN)` === 0. `roundToDecimals(-0, 2)` === 0. `roundToDecimals(Infinity)` === 0.
═══ **[04.1.2.2]** `clampVector(55, AURA)` → Ok(50.00). `clampVector(-1, ENV)` → Ok(1). `clampVector(25.456, PHYSIQUE)` → Ok(25.46). `clampVector(0, 'invalid')` → Err. Valores exactos en límite (0.0, 50.0) → Ok.
---
### 04.1.2.3 — calculateOverallScore
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Input: `(vectors: VectorState)`. Output: `Result<OverallScore, Error>`. Fórmula exacta Constantes Maestras: `overallScore = AURA×0.20 + JAWLINE×0.15 + WEALTH×0.20 + PHYSIQUE×0.20 + SOCIAL×0.15 + (ENV×5)×0.10`. ENV se multiplica por 5 para normalizar 1-10 a 5-50. Score escala 0.0-50.0. Redondear a 2 decimales. Validar input con VectorStateSchema.
**VALIDACIÓN:** Todos en 0 (ENV=1) → 0.50. Todos en max (50, ENV=10) → 50.00. Solo AURA=50 resto 0 (ENV=1) → 10.50. ENV=10 resto 0 → 5.00. AURA=25, JAWLINE=25, WEALTH=25, PHYSIQUE=25, SOCIAL=25, ENV=5.5 → ≈25.25.
---
### 04.1.2.4 + 04.1.2.5 + 04.1.2.6 — Vector quality pipeline (interpret + normalize + radar)
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.2.4]** Input: `(vectorName: VectorName, value: number)`. Output: `{displayValue: number, qualityScore: number}`. Todos ASCENDING. quality = `(value - min) / (max - min)`. Vectores 0-50: quality = value/50. ENV 1-10: quality = (value-1)/9. displayValue = value redondeado a 2 decimales.
═══ **[04.1.2.5]** Input: `(vectors: VectorState)`. Output: `Record<VectorName, VectorQuality>`. Para cada uno de los 6 vectores: llamar interpretVectorValue y construir VectorQuality con value (raw), qualityScore (0-1), percentage (0-100, 1 decimal). Record con exactamente 6 entries.
═══ **[04.1.2.6]** Input: `(vectors: VectorState)`. Output: `RadarDataPoint[]` (6 objetos con `{label, value, percentage, color}`). Usar normalizeVectorQuality → mapear a formato Recharts radar. Colors Constantes Maestras: AURA=#9B59B6, JAWLINE=#E74C3C, WEALTH=#27AE60, PHYSIQUE=#E67E22, SOCIAL=#3498DB, ENV=#1ABC9C. Orden fijo. Labels user-friendly: 'Aura','Jawline','Wealth','Physique','Social','Entorno'.
**VALIDACIÓN:**
═══ **[04.1.2.4]** PHYSIQUE=0→quality=0.0. PHYSIQUE=50→1.0. ENV=1→0.0. ENV=10→1.0. SOCIAL=25→0.5. ENV=5.5→0.5.
═══ **[04.1.2.5]** Siempre 6 entries. percentage = qualityScore × 100. VectorQuality.value === input sin modificar.
═══ **[04.1.2.6]** Siempre 6 data points en orden fijo. Colors coinciden con Constantes Maestras. Labels no slugs técnicos. Array length === 6.
---
## 04.1.3 — Impacto de Tareas en Vectores (5 → 3)
---
### 04.1.3.1 + 04.1.3.2 — getTaskImpact + calculateDiminishingReturns
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.3.1]** Input: `(category: TaskCategory)`. Output: `Result<TaskImpact, Error>`. Lookup en `TASK_MODIFIERS[category]`. Si categoría no existe/undefined/null → Err con categoría inválida y 17 válidas como lista. Retornar TaskImpact completo: upModifiers[], downModifiers[] y btcReward.
═══ **[04.1.3.2]** Input: `(baseDelta: number, repetitionToday: number)`. Output: `number`. Fórmula Constantes Maestras: `baseDelta × max(0.25, 0.90^(repetitionToday - 1))`. Piso mínimo 25%. rep=0 o negativo → rep=1. baseDelta=0 → 0.
**VALIDACIÓN:**
═══ **[04.1.3.1]** `getTaskImpact('meditation')` → Ok({category:'meditation', archetype:'mental', upModifiers:[{vector:'aura_lvl', delta:0.50}], downModifiers:[{vector:'aura_lvl', delta:-0.50}], btcReward:50}). `getTaskImpact('invalid')` → Err con 17 válidas. null/'' → Err.
═══ **[04.1.3.2]** rep=1→100%. rep=2→90%. rep=3→81%. rep=5→65.6%. rep=10→38.7%. rep=15→25% (piso). rep=20→25%. rep=0→100%. rep=-5→100%. baseDelta=0→0.
---
### 04.1.3.3 + 04.1.3.4 — applyTaskToVectors + applyMultipleTasksToVectors
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.3.3]** Input: `(vectors: VectorState, category: TaskCategory, repetitionToday: number)`. Output: `Result<{newVectors: VectorState, deltas: VectorDelta[]}, Error>`. Pipeline: (1) getTaskImpact → si Err, propagar. (2) Para cada upModifier: effectiveDelta = calculateDiminishingReturns(delta, repetitionToday). (3) newValue = clampVector(currentValue + effectiveDelta, vectorName). (4) VectorDelta con previousValue, newValue, delta real (puede ser menor si clamp), reason='task_completed'. (5) Retornar VectorState inmutable (object spread). **No mutar** input.
═══ **[04.1.3.4]** Input: `(vectors: VectorState, tasks: {category: TaskCategory, repetition: number}[])`. Output: `Result<{newVectors: VectorState, allDeltas: VectorDelta[]}, Error>`. Aplicar secuencialmente (pipeline fold). Acumular deltas. Si tarea falla → Err inmediato con índice + categoría + error. Array vacío → vectors sin cambio y deltas vacíos.
**VALIDACIÓN:**
═══ **[04.1.3.3]** Vector en 50 + delta positivo → newValue=50, delta=0. rep=1 meditation: aura+0.50. rep=3 meditation: aura+0.405. ENV en 1 + tarea que no afecta ENV → ENV=1. Input no mutado (Object.freeze).
═══ **[04.1.3.4]** 3 tareas secuenciales: estado final refleja las 3. Array vacío → Ok original. Error en tarea 2 → Err con index=1, no aplica tarea 3. 17 tareas distintas → 17 deltas.
---
### 04.1.3.5 — validateVectorState
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Input: `(vectors: VectorState)`. Output: `Result<VectorState, ValidationError[]>`. (1) Parsear con VectorStateSchema Zod — si falla, Err con errores Zod formateados. (2) Warnings semánticos (no bloqueantes): physique_lvl < 5 → 'sedentario_critico'. social_lvl < 5 → 'aislamiento_social'. env_lvl < 3 → 'entorno_precario'. Todos principales en 0 → 'estado_indigente'. Warnings en metadata del Ok, no en Err.
**VALIDACIÓN:** Todos en 0 válido (Indigente) → Ok con warnings. aura_lvl=51 → Err. 5 campos (falta social_lvl) → Err strict. NaN → Err. Todos en 50 ENV=10 → Ok sin warnings.
---
## 04.1.4 — Decay / Degradación por Inactividad (3 → 2)
---
### 04.1.4.1 + 04.1.4.3 — shouldApplyDecay + calculateDecayProtection + DECAY_THRESHOLDS
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.4.1]** Input: `(vectorName: VectorName, lastActivityDate: Date, currentDate: Date)`. Output: `boolean`. Thresholds: AURA=1 día, PHYSIQUE=2, SOCIAL=3, JAWLINE=7, WEALTH y ENV=NUNCA (false siempre). daysSinceActivity = floor((currentDate - lastActivityDate) / 86400000). Si > threshold → true. Crear `DECAY_THRESHOLDS: Record<VectorName, number | null> = {aura_lvl: 1, physique_lvl: 2, social_lvl: 3, jawline_lvl: 7, wealth_lvl: null, env_lvl: null}`.
═══ **[04.1.4.3]** Input: `(envLevel: number)`. Output: `number` (0.0-0.20). ENV > 5 da protección contra decay. Si envLevel ≤ 5 → 0.0. Si > 5 → `(envLevel - 5) × 0.04`. Máximo: ENV=10 → 0.20 (20%).
**VALIDACIÓN:**
═══ **[04.1.4.1]** AURA 2+ días sin actividad → true. AURA ayer → false. PHYSIQUE 3+ → true. WEALTH 365 días → false. ENV 365 → false. Fecha futura → false. Misma fecha → false.
═══ **[04.1.4.3]** ENV=1→0.0. ENV=5→0.0. ENV=6→0.04. ENV=7→0.08. ENV=8→0.12. ENV=9→0.16. ENV=10→0.20. ENV>10→clampar a 0.20.
---
### 04.1.4.2 — applyDecay
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Input: `(vectors: VectorState, lastActivityDates: Record<VectorName, Date>, currentDate: Date)`. Output: `Result<{newVectors: VectorState, decayDeltas: VectorDelta[]}, Error>`. Para cada vector con decay (AURA, PHYSIQUE, SOCIAL, JAWLINE): (1) shouldApplyDecay() → si false, skip. (2) daysSinceThreshold = daysSinceActivity - threshold. (3) decayRate = 0.01 × daysSinceThreshold. (4) decayProtection = calculateDecayProtection(vectors.env_lvl). (5) effectiveDecay = decayRate × (1 - decayProtection). (6) newValue = clampVector(currentValue × (1 - effectiveDecay), vectorName). (7) VectorDelta con reason='decay_applied'. WEALTH y ENV nunca decaen.
**VALIDACIÓN:** AURA=40, 3 días sin actividad, threshold=1, daysSinceThreshold=2, decayRate=0.02, ENV=1 → newAura=40×0.98=39.20. AURA=40, ENV=7 (20% protection) → effectiveDecay=0.02×0.80=0.016 → newAura=40×0.984=39.36. WEALTH=30, 100 días → 30 (no decay).
---
## 04.1.5 — Gating / Requisitos de Vectores (3 → 2)
---
### 04.1.5.1 + 04.1.5.2 — checkVectorRequirements + checkItemUnlockRequirements
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.5.1]** Input: `(currentVectors: VectorState, requirements: Partial<Record<VectorName, number>>)`. Output: `Result<{met: boolean, gaps: Record<VectorName, number>}, Error>`. Para cada vector en requirements: comparar >= requirement. Si no cumple: gap = requirement - current. met = true solo si TODOS gaps son 0. gaps solo incluye los que no cumplen. Vacío → met=true, gaps={}.
═══ **[04.1.5.2]** Input: `(itemRequirements: {level?, vectors?}, userState: {level, vectors})`. Output: `Result<{unlocked, levelGap, vectorGaps}, Error>`. (1) level requirement: userState.level < requirement → levelGap. (2) vectors → checkVectorRequirements(). (3) unlocked = levelGap===0 AND vectorGaps vacío.
**VALIDACIÓN:**
═══ **[04.1.5.1]** requirements={aura:30,physique:20}, vectors={aura:25,physique:25} → met=false, gaps={aura:5}. Vacío → met=true. Todos cumplidos → met=true.
═══ **[04.1.5.2]** Requiere level=5, aura=20. User level=3, aura=25 → unlocked=false, levelGap=2, vectorGaps={}. User level=6, aura=15 → unlocked=false, levelGap=0, vectorGaps={aura:5}.
---
### 04.1.5.3 — suggestTasksToMeetRequirements
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **-** · MANUAL: N/A
**DETALLES:** Input: `(gaps: Record<VectorName, number>, currentStreak, currentLevel)`. Output: `{vector, tasks: {category, repetitions, estimatedDays}[]}[]`. Para cada vector con gap > 0: (1) Encontrar TaskCategories que afectan ese vector. (2) Calcular repeticiones con diminishing returns iterativo. (3) Días = ceil(repeticiones / 3). (4) Ordenar por eficiencia (menos días primero).
**VALIDACIÓN:** gap={aura:5}. meditation delta=0.50 → ~10 reps → ~4 días. posture delta=1.16 → ~5 reps → ~2 días. Ordenado: posture primero.
---
## 04.1.6 — Tests de Vectores (7 → 6)
---
### 04.1.6.1 — Tests de cálculos básicos
[TEST] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Archivo `vectors/calculations.test.ts`. Suite Vitest: (1) clampVector rangos 0-50 y 1-10 (ENV), límites exactos, negativos, excedidos, vectorName inválido. (2) calculateOverallScore 6 vectores: todos cero→0.50, max→50.00, solo AURA=50→10.50, solo ENV=10→5.00, mixtos. (3) interpretVectorValue 6 vectores ASCENDING, quality boundaries. (4) normalizeVectorQuality exactamente 6 entries. (5) calculateVectorRadarData 6 data points con colors y orden fijo.
**VALIDACIÓN:** Mínimo 25 test cases. Cada vector individualmente. Boundary (0.0, 50.0, 1, 10). Colors hex verificados.
---
### 04.1.6.2 — Tests de impacto de tareas
[TEST] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Archivo `vectors/task-impact.test.ts`. (1) getTaskImpact 17 categorías — upModifiers, downModifiers, btcReward. (2) Categoría inválida → Err con 17 válidas. (3) calculateDiminishingReturns: rep=1→100%, rep=2→90%, rep=15→25% (piso). (4) applyTaskToVectors: meditation aura=0→0.50. (5) applyMultipleTasksToVectors 3 secuenciales. (6) Vector 49.80 + 0.50 → clamp 50.00, delta=0.20. (7) Input no mutado (Object.freeze).
**VALIDACIÓN:** 17 categorías exhaustivas. Diminishing converge al piso 25%. Clamp en boundary. Inmutabilidad con freeze.
---
### 04.1.6.3 — Tests de decay
[TEST] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Archivo `vectors/decay.test.ts`. (1) shouldApplyDecay para AURA(1d), PHYSIQUE(2d), SOCIAL(3d), JAWLINE(7d) — exacto en threshold y 1 día después. (2) WEALTH y ENV 365 días → false. (3) applyDecay: AURA 3 días + ENV=1 → full decay. (4) ENV>5 reduce decay (math exacto calculateDecayProtection). (5) Decay no baja de 0. (6) Fecha futura → no decay. (7) Misma fecha → no decay.
**VALIDACIÓN:** Mínimo 15 test cases. ENV protection exacta (ENV=6→4%, ENV=10→20%). WEALTH/ENV sin decay 365 días.
---
### 04.1.6.4 — Tests de gating
[TEST] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Archivo `vectors/gating.test.ts`. (1) checkVectorRequirements 6 vectores — cumple y no cumple, gaps correctos. (2) checkItemUnlockRequirements level + vector gate separados y combinados. (3) suggestTasksToMeetRequirements categorías correctas, reps con diminishing, días. (4) Requirements vacíos → Ok. (5) ENV → suggestedTasks vacío.
**VALIDACIÓN:** Gaps redondeados 2 decimales. Sugerencias ordenadas eficiencia. ENV sin tareas directas manejado.
---
### 04.1.6.5 — Property-based tests de vectores
[TEST] · DIF: **4** · AGENTE: **OPUS 4.5** · MVP: **-** · MANUAL: N/A
**DETALLES:** Archivo `vectors/vectors.property.test.ts`. Usar **fast-check** para property-based testing. Propiedades invariantes: (1) `clampVector(x, v)` siempre retorna valor en rango [min, max] del vector — para cualquier number x y cualquier VectorName v. (2) `applyTaskToVectors` nunca produce vector fuera de límites 0-50 (ENV 1-10) — para cualquier VectorState y cualquier TaskCategory. (3) `calculateOverallScore` siempre retorna valor en rango 0-50 — para cualquier VectorState válido. (4) `calculateDiminishingReturns(delta, rep)` nunca retorna negativo y nunca excede delta — para cualquier delta≥0 y cualquier rep≥0. (5) `normalizeVectorQuality` siempre retorna exactamente 6 entries — para cualquier VectorState. (6) `applyDecay` nunca produce vector debajo de min — para cualquier VectorState y cualquier dates. Configurar fast-check con `numRuns: 200` por propiedad.
**VALIDACIÓN:** fast-check genera 200+ casos aleatorios por propiedad (6 propiedades × 200 = 1200+ runs mínimo). Todas las propiedades deben pasar en 100% de runs. Shrinking habilitado para encontrar minimal failing case si falla.
---
### 04.1.6.6 + 04.1.6.7 — Tests de CHARACTER_BASE_AVATARS + constantes y validaciones
[TEST] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.1.6.6]** En `vectors/constants.test.ts`. Suite: **(1)** CHARACTER_BASE_AVATARS tiene exactamente 6 entries con IDs 1-6 (no 0, no 7). **(2)** Cada personaje tiene displayName, shortDescription, lore, visual, identityAnchors, identityTokensIA no vacíos. **(3)** Slugs exactos: el_rastas, el_guarro, el_pecas, el_grenas, el_guero, el_lic. **(4)** identityTokensIA arrays con ≥ 3 entries. **(5)** identityTokensIA EXACTOS verificados para Gemini 2.5 Flash: EL_RASTAS→'brown dreadlocks'+'warm brown skin'. EL_GUARRO→'bald'+'square jaw'. EL_PECAS→'curly red-brown hair'+'freckles'. EL_GREÑAS→'balding with long hair in back'+'goatee'. EL_GÜERO→'blonde wavy hair'+'blue eyes'. EL_LIC→'rectangular glasses'+'receding hairline'. **(6)** identityAnchors arrays con ≥ 3 entries. **(7)** displayNames únicos. **(8)** Slugs únicos. **(9)** Lore > 100 chars. **(10)** shortDescription > 30 chars y distinta del lore. **(11)** visual no vacío. **(12)** base_avatar_id coincide con key en Record.
═══ **[04.1.6.7]** En `vectors/constants.test.ts`. Suite adicional: (1) VECTOR_WEIGHTS suma exactamente 1.0 (epsilon 0.0001). (2) TASK_MODIFIERS 17 entries exactas. (3) Cada entry tiene btcReward > 0, upModifiers ≥ 1, downModifiers simétrico. (4) TASK_CATEGORY_TO_ARCHETYPE 17 entries, cada categoría 1 vez. (5) DECAY_THRESHOLDS: solo AURA/PHYSIQUE/SOCIAL/JAWLINE numéricos, WEALTH y ENV null. (6) VECTOR_LIMITS: 5 vectores max=50, ENV max=10. (7) DEFAULT_VECTOR_STATE: ENV=1, resto=0. (8) VECTOR_METADATA colors coinciden con Constantes Maestras hex.
**VALIDACIÓN:**
═══ **[04.1.6.6]** 12 test cases. 6 personajes verificados. identityTokensIA para Gemini verificados por token exacto. Nombres y slugs DEFINITIVOS sin duplicados. Lore REAL > 100 chars.
═══ **[04.1.6.7]** Validaciones de constantes ejecutadas en import time. Cualquier inconsistencia detectada inmediatamente. Colors hex verificados.
---
# SUBCAJA 04.2 — SISTEMA DE NIVELES
*13 tareas originales → 6 combinadas*
## 04.2.0 + 04.2.1 — Setup + Configuración de 12 Niveles (4 → 2)
---
### 04.2.0.1 + 04.2.1.1 — Estructura levels/ + tipos de nivel
[SETUP] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.2.0.1]** Crear `/src/lib/core/levels/` con: `types.ts`, `constants.ts`, `calculations.ts`, `levels.test.ts`, `index.ts`. El index.ts debe ser barrel export de la API pública: types (LevelConfig, LevelTransition, LevelProgress), constantes (LEVELS, LEVEL_MULTIPLIER_FORMULA), funciones (calculateLevel, getLevelConfig, canLevelUp, processLevelUp, calculateLevelMultiplier, calculateProgressToNextLevel). No exportar helpers internos.
═══ **[04.2.1.1]** Archivo `levels/types.ts`. **LevelConfig**: `{readonly levelNumber: LevelNumber, readonly name: string, readonly slug: string, readonly minDay: number, readonly minOverallScore: number, readonly specificVectors: Partial<Record<VectorName, number>> | null, readonly btcBonus: number, readonly healthBonus: number, readonly phase: 'protocolo' | 'post_game', readonly unlockedFeatures: string[]}`. Score en escala 0-50. **LevelTransition**: `{readonly previousLevel: LevelNumber, readonly newLevel: LevelNumber, readonly didLevelUp: boolean, readonly rewards: {btcBonus: number, healthBonus: number, levelsSkipped: number, unlockedFeatures: string[]}}`. **LevelProgress**: `{readonly currentLevel: LevelNumber, readonly progress: number, readonly daysRemaining: number, readonly scoreGap: number, readonly nextLevelName: string | null}`.
**VALIDACIÓN:**
═══ **[04.2.0.1]** 5 archivos creados. Barrel export funciona sin circular dependencies. `import { calculateLevel } from '@/lib/core/levels'` compila sin errores.
═══ **[04.2.1.1]** minOverallScore en escala 0-50. LevelNumber es 1-12. Phase indica si es Protocolo 100 o Post-Game.
---
### 04.2.1.2 + 04.2.1.3 — LEVELS (12 niveles) + LEVEL_MULTIPLIER_FORMULA
[CONFIG] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.2.1.2]** Archivo `levels/constants.ts`. Array `LEVELS: LevelConfig[]` con 12 niveles exactos de Constantes Maestras v2.0.0. Valores CORREGIDOS: **1-INDIGENTE**: minDay=1, minScore=0.0, specificVectors=null, btcBonus=0, healthBonus=0, phase='protocolo', features=['dashboard_basico']. **2-REFUGIADO**: minDay=3, minScore=4.0, specificVectors=null, btcBonus=200, healthBonus=0, phase='protocolo', features=['tienda_basica']. **3-MANTENIDO**: minDay=6, minScore=10.0, specificVectors={physique:5, aura:5}, btcBonus=500, healthBonus=+1, phase='protocolo', features=['custom_tasks']. **4-ALUCÍN**: minDay=10, minScore=15.0, specificVectors={physique:8, aura:8, wealth:5}, btcBonus=1000, healthBonus=0, phase='protocolo', features=['item_crafting_basico']. **5-PEÓN**: minDay=15, minScore=20.0, specificVectors={physique:12, aura:12, wealth:10, jawline:8}, btcBonus=1500, healthBonus=0, phase='protocolo', features=['streak_shield_unlock']. **6-HOMBRE COMÚN**: minDay=25, minScore=25.0, specificVectors={physique:15, aura:15, wealth:15, jawline:12, social:10}, btcBonus=2000, healthBonus=+1, phase='protocolo', features=['radar_chart_completo']. **7-INFLUYENTE**: minDay=35, minScore=30.0, specificVectors={physique:20, aura:20, wealth:20, jawline:15, social:15}, btcBonus=2500, healthBonus=0, phase='protocolo', features=['item_trading']. **8-PUDIENTE**: minDay=50, minScore=35.0, specificVectors={physique:25, aura:25, wealth:25, jawline:20, social:18, env:5}, btcBonus=3500, healthBonus=0, phase='protocolo', features=['avatar_animations']. **9-MILLONARIO**: minDay=70, minScore=40.0, specificVectors={physique:30, aura:30, wealth:30, jawline:25, social:22, env:6}, btcBonus=5000, healthBonus=+1, phase='protocolo', features=['leaderboard_access']. **10-MAGNATE**: minDay=100, minScore=45.0, specificVectors={physique:38, aura:38, wealth:38, jawline:32, social:28, env:7}, btcBonus=10000, healthBonus=0, phase='protocolo', features=['premium_items']. **11-ÉLITE**: minDay=150, minScore=47.0, specificVectors={physique:42, aura:42, wealth:42, jawline:38, social:35, env:8}, btcBonus=25000, healthBonus=0, phase='post_game', features=['prestige_preview']. **12-SEMI-DIOS**: minDay=200, minScore=49.0, specificVectors={physique:46, aura:46, wealth:46, jawline:42, social:40, env:9}, btcBonus=50000, healthBonus=+1, phase='post_game', features=['prestige_full', 'title_semidios']. Validar con Zod en module load: scores estrictamente crecientes, días estrictamente crecientes, healthBonus solo en niveles 3/6/9/12.
═══ **[04.2.1.3]** En `levels/constants.ts`. Crear `LEVEL_MULTIPLIER_FORMULA = {base: 1, perLevel: 0.05} as const`. Multiplicador de nivel para BTC rewards: `base + level × perLevel` = `1 + level × 0.05`. Referencia: Level 1=×1.05, Level 3=×1.15, Level 5=×1.25, Level 7=×1.35, Level 10=×1.50, Level 12=×1.60. Exportar para uso en módulo de economía (04.5).
**VALIDACIÓN:**
═══ **[04.2.1.2]** 12 niveles (NO 13). Nombres exactos de Constantes Maestras. Scores: 0<4<10<15<20<25<30<35<40<45<47<49. Días: 1<3<6<10<15<25<35<50<70<100<150<200. healthBonus=+1 SOLO en niveles 3,6,9,12 (4 bonuses = max 14 HP). specificVectors progresivos. Niveles 8+ incluyen ENV.
═══ **[04.2.1.3]** Level 1→×1.05. Level 5→×1.25. Level 10→×1.50. Level 12→×1.60. Siempre > 1.0 para nivel válido (1-12). Fórmula lineal.
---
## 04.2.2 — Cálculos de Nivel (6 → 2)
---
### 04.2.2.1 + 04.2.2.2 + 04.2.2.6 — calculateLevel + getLevelConfig + calculateLevelMultiplier
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.2.2.1]** Input: `(overallScore: number, currentDay: number)`. Output: `LevelNumber`. Búsqueda descendente desde nivel 12 hasta 1. Para cada nivel: verificar `currentDay >= minDay AND overallScore >= minOverallScore`. Retornar primer match (nivel más alto posible). Fallback = 1 (Indigente).
═══ **[04.2.2.2]** Input: `(level: LevelNumber)`. Output: `Result<LevelConfig, Error>`. Lookup O(1) en array LEVELS por index `level - 1`. Si nivel < 1 o > 12 → Err con rango válido 1-12. Si nivel no es entero → Err.
═══ **[04.2.2.6]** Input: `(level: LevelNumber)`. Output: `number`. Fórmula: `LEVEL_MULTIPLIER_FORMULA.base + level × LEVEL_MULTIPLIER_FORMULA.perLevel` = `1 + level × 0.05`. Level 0 o negativo → tratar como level 1. Level > 12 → tratar como level 12. Redondear a 2 decimales.
**VALIDACIÓN:**
═══ **[04.2.2.1]** Day 1 score 0 → nivel 1. Day 6 score 10 → nivel 3. Day 200 score 0 → nivel 1. Day 1 score 50 → nivel 1. Day 200 score 49 → nivel 12. Score exacto en threshold (score=25, day=25) → nivel 6.
═══ **[04.2.2.2]** `getLevelConfig(1)` → Ok(INDIGENTE). `getLevelConfig(12)` → Ok(SEMI-DIOS). `getLevelConfig(0)` → Err. `getLevelConfig(13)` → Err. `getLevelConfig(5.5)` → Err.
═══ **[04.2.2.6]** Level 1→1.05. Level 2→1.10. Level 5→1.25. Level 10→1.50. Level 12→1.60. Level 0→1.05 (fallback). Level 13→1.60 (clamped).
---
### 04.2.2.3 + 04.2.2.4 + 04.2.2.5 — calculateProgress + canLevelUp + processLevelUp
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.2.2.3]** Input: `(currentLevel: LevelNumber, currentScore: number, currentDay: number)`. Output: `LevelProgress`. Si currentLevel = 12 → progress=100, daysRemaining=0, scoreGap=0, nextLevelName=null. Si no: nextLevel = LEVELS[currentLevel]. dayProgress = min(1.0, currentDay / nextLevel.minDay). scoreProgress = min(1.0, (currentScore - LEVELS[currentLevel-1].minOverallScore) / (nextLevel.minOverallScore - LEVELS[currentLevel-1].minOverallScore)). progress = round((dayProgress + scoreProgress) / 2 × 100). daysRemaining = max(0, nextLevel.minDay - currentDay). scoreGap = max(0, roundToDecimals(nextLevel.minOverallScore - currentScore, 2)). nextLevelName = [nextLevel.name](http://nextLevel.name).
═══ **[04.2.2.4]** Input: `(currentLevel: LevelNumber, overallScore: number, currentDay: number, vectors: VectorState)`. Output: `boolean`. (1) newLevel = calculateLevel(overallScore, currentDay). (2) Si newLevel ≤ currentLevel → false. (3) Si siguiente nivel tiene specificVectors, verificar con checkVectorRequirements. (4) true solo si TODAS las condiciones se cumplen. No se puede bajar de nivel.
═══ **[04.2.2.5]** Input: `(previousLevel: LevelNumber, newLevel: LevelNumber)`. Output: `LevelTransition`. Si newLevel ≤ previousLevel → didLevelUp=false, rewards vacíos. Si sube: acumular rewards de TODOS los niveles entre previousLevel+1 y newLevel inclusive. levelsSkipped = newLevel - previousLevel - 1. btcBonus = suma. healthBonus = suma. unlockedFeatures = concat.
**VALIDACIÓN:**
═══ **[04.2.2.3]** Nivel 12 → progress=100, nextLevelName=null. Nivel 1 día 1 score 0 → progress ~0%. Nivel 5 exactamente en threshold de nivel 6 → progress=100%.
═══ **[04.2.2.4]** Score/días suficientes pero vectores insuficientes → false. Todo ok → true. Nivel 12 → siempre false.
═══ **[04.2.2.5]** 3→5: btcBonus=2500, healthBonus=0. 1→12: btcBonus=101,200, healthBonus=4. 5→6: healthBonus=1. healthBonus solo en niveles 3,6,9,12.
---
## 04.2.3 — Tests de Niveles (3 → 2)
---
### 04.2.3.1 — Tests de cálculo de nivel y config
[TEST] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Archivo `levels/levels.test.ts`. Suite: (1) calculateLevel — Day 1 score 0→nivel 1. Day 6 score 10→nivel 3. Day 25 score 25→nivel 6. Day 100 score 45→nivel 10. Day 200 score 49→nivel 12. Day altísimo con score bajo→nivel 1. Score exacto en threshold para cada uno de los 12 niveles. (2) getLevelConfig — niveles 1-12 retornan Ok, nivel 0 y 13 Err, nivel 5.5 Err. (3) calculateProgressToNextLevel — nivel 12→100% y nextLevelName=null. (4) calculateLevelMultiplier — verificar `1+level×0.05` para los 12 niveles: 1→1.05, 2→1.10, …, 12→1.60.
**VALIDACIÓN:** Mínimo 25 test cases cubriendo los 12 niveles exhaustivamente. Multiplier verificado para todos los niveles.
---
### 04.2.3.2 + 04.2.3.3 — Tests level up + specificVectors
[TEST] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.2.3.2]** Suite: (1) canLevelUp score/día suficiente → true. (2) canLevelUp nivel 12 → siempre false. (3) processLevelUp sin cambio → didLevelUp=false. (4) processLevelUp 3→5 → btcBonus=2500, healthBonus=0, levelsSkipped=1. (5) processLevelUp 1→12 → btcBonus=101,200, healthBonus=4. (6) processLevelUp 5→6 → healthBonus=1. (7) healthBonus solo en niveles 3,6,9,12.
═══ **[04.2.3.3]** Suite specificVectors: (1) Niveles 1-2 tienen specificVectors=null. (2) Niveles 3+ progresivos. (3) Nivel 8+ incluye ENV requirement. (4) canLevelUp probado con vector exacto en requisito de cada nivel (boundary).
**VALIDACIÓN:**
═══ **[04.2.3.2]** Rewards acumulados correctos en saltos. Health bonuses exactamente en 4 niveles (3,6,9,12). btcBonus 1→12 = 101,200.
═══ **[04.2.3.3]** 12 niveles verificados individualmente. Boundary: vector exacto en requisito → pasa. Vector -0.01 bajo requisito → falla.
---
# SUBCAJA 04.3 — SISTEMA DE SALUD
*19 tareas originales → 9 combinadas*
## 04.3.0 + 04.3.1 — Setup + Constantes de Salud (5 → 2)
---
### 04.3.0.1 + 04.3.1.1 + 04.3.1.2 — Estructura health/ + HEALTH_CONFIG + JN_HEALTH_THRESHOLDS
[SETUP] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.3.0.1]** Crear `/src/lib/core/health/` con: `types.ts`, `constants.ts`, `calculations.ts`, `death.ts`, `health.test.ts`, `index.ts`. El index.ts exporta: types (HealthState, JNTier, DeathResult, HibernationStatus), constantes (HEALTH_CONFIG, JN_HEALTH_THRESHOLDS, DEATH_PENALTIES, HIBERNATION_CONFIG), funciones (assessJNTier, calculateJNHealthChange, shouldApplyHealthPenalty, calculateHealthPenalty, calculateLimboHealthLoss, shouldTriggerDeath, calculateDeathPenalties, processDeath, processHibernation).
═══ **[04.3.1.1]** Archivo `health/constants.ts`. Constantes exactas de Constantes Maestras y PRD v2.0.0: `STARTING_HEARTS = 5`, `MAX_HEARTS_BASE = 10`, `MAX_HEARTS_EXPANDED = 14` (10 base + 4 de level ups en niveles 3/6/9/12), `CRITICAL_HEALTH_THRESHOLD = 3` (health < 3 → penalty ×0.5), `HEALTH_LEVEL_UP_REWARDS: Record<number, number> = {3: 1, 6: 1, 9: 1, 12: 1}`, `SUCCESS_THRESHOLD = 0.80` (≥80% = éxito según PRD).
═══ **[04.3.1.2]** En `health/constants.ts`. Crear type `JNTier = 'SUCCESS' | 'FAILED'` y constante `JN_HEALTH_THRESHOLDS: Record<JNTier, {minRate: number, healthDelta: number, streakAction: 'increment' | 'reset', displayName: string}>`. **SUCCESS**: minRate=0.80, healthDelta=+1, streakAction='increment', displayName='Día Exitoso'. **FAILED**: minRate=0.00, healthDelta=-1, streakAction='reset', displayName='Día Fallido'. Sistema binario PRD: ≥80% = éxito, <80% = fallo.
**VALIDACIÓN:**
═══ **[04.3.0.1]** 6 archivos creados. Barrel exports completos sin circular dependencies.
═══ **[04.3.1.1]** Avatar nuevo = 5 hearts. Max expandido = 14 (NO 13). Threshold = 3 (< 3, no ≤ 3). Solo niveles 3,6,9,12 otorgan hearts. Éxito = ≥80%.
═══ **[04.3.1.2]** ≥80%→+1HP y racha continúa. <80%→-1HP y racha se rompe. Sistema binario según PRD v2.0.0.
---
### 04.3.1.3 + 04.3.1.4 — DEATH_PENALTIES + HIBERNATION_CONFIG
[CONFIG] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.3.1.3]** En `health/constants.ts`. Crear `DEATH_PENALTIES = {btcLossRates: {1: 0.30, 2: 0.40, 3: 0.50}, auraPreservationRate: 0.30, vectorResets: {jawline_lvl: 0, wealth_lvl: 0, physique_lvl: 0, social_lvl: 0, env_lvl: 1}, itemAction: 'locked_by_death'}`. BTC loss según PRD: 1ra=30%, 2da=40%, 3ra+=50%. AURA preserva 30%. Resto vectores → 0. **ENV → 1** (no 0). Items equipados → locked_by_death. 3ra muerte → HIBERNACIÓN 24h.
═══ **[04.3.1.4]** En `health/constants.ts`. Crear `HIBERNATION_CONFIG = {triggerDeathCount: 3, cooldownHours: 24, btcPenaltyRate: 0.50, vectorResetComplete: true, requireSubscriptionToRevive: true, reviveState: {health: 5, level: 1, streak: 0}}`. Hibernación en 3ra+ muerte: avatar inactivo 24 horas. Después del cooldown + suscripción activa → resucitar con health=5, level=1, streak=0, vectores=DEFAULT_VECTOR_STATE.
**VALIDACIÓN:**
═══ **[04.3.1.3]** 1ra muerte: -30% BTC, AURA×0.30. 2da: -40%. 3ra+: -50% + hibernación 24h. ENV siempre resetea a 1 (nunca 0).
═══ **[04.3.1.4]** Solo se activa en death_count >= 3. Cooldown exacto 24 horas. Requiere suscripción activa.
---
## 04.3.2 — Cálculos de Salud (5 → 3)
---
### 04.3.2.1 + 04.3.2.2 — assessJNTier + calculateJNHealthChange
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.3.2.1]** Input: `(tasksCompleted: number, totalTasks: number)`. Output: `JNTier`. Sistema binario PRD: completionRate = tasksCompleted / totalTasks. rate >= 0.80 → 'SUCCESS'. rate < 0.80 → 'FAILED'. totalTasks=0 → 'FAILED'. tasksCompleted > totalTasks → clampar. tasksCompleted < 0 → tratar como 0.
═══ **[04.3.2.2]** Input: `(jnTier: JNTier, currentHealth: number, maxHealth: number)`. Output: `{newHealth: number, delta: number, reachedZero: boolean}`. Obtener healthDelta de JN_HEALTH_THRESHOLDS[jnTier]. rawNewHealth = currentHealth + healthDelta. Clampar: max(0, min(rawNewHealth, maxHealth)). Delta real = newHealth - currentHealth. reachedZero = newHealth === 0.
**VALIDACIÓN:**
═══ **[04.3.2.1]** 10/10→SUCCESS. 8/10→SUCCESS (0.80 exacto). 7/10→FAILED. 0/0→FAILED. 79.99%→FAILED.
═══ **[04.3.2.2]** Health=10(max=10)+SUCCESS→10 (delta=0). Health=5+SUCCESS→6. Health=1+FAILED→0 (reachedZero=true).
---
### 04.3.2.3 + 04.3.2.4 — shouldApplyHealthPenalty + calculateHealthPenalty
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.3.2.3]** Input: `(currentHealth: number)`. Output: `boolean`. `currentHealth < CRITICAL_HEALTH_THRESHOLD` (threshold=3). health < 3 → true. health=0 → true. health=3 → false (estricto: menor que).
═══ **[04.3.2.4]** Input: `(currentHealth: number, baseValue: number)`. Output: `number`. Si shouldApplyHealthPenalty → `roundToDecimals(baseValue × 0.5, 2)`. Si no → baseValue sin cambio. Aplica a BTC rewards y vector deltas cuando health < 3.
**VALIDACIÓN:**
═══ **[04.3.2.3]** Health=0→true. Health=1→true. Health=2→true. Health=3→**false**. Health=5→false.
═══ **[04.3.2.4]** Health=2, base=100→50. Health=5, base=100→100. Health=3, base=100→100.
---
### 04.3.2.5 — calculateLimboHealthLoss
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Input: `(daysInLimbo: number)`. Output: `{heartsLost: number, wouldTriggerDeath: (currentHealth: number) => boolean}`. Según PRD: heartsLost = `floor(daysInLimbo / 3)` (-1 heart cada 3 días en limbo). Limbo = 7 días post pago fallido. wouldTriggerDeath verifica si currentHealth - heartsLost ≤ 0.
**VALIDACIÓN:** 0 días→0 hearts. 3 días→1 heart. 6 días→2. 7 días→2.
---
## 04.3.3 — Muerte y Hibernación (4 → 2)
---
### 04.3.3.1 + 04.3.3.2 + 04.3.3.3 — Death pipeline (shouldTrigger + calculate + process)
[LOGIC] · DIF: **4** · AGENTE: **OPUS 4.5** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.3.3.1]** Input: `(currentHealth: number)`. Output: `boolean`. `currentHealth <= 0`. Health=0 → muerte. Negativo → muerte. Health=1 → NO muerte.
═══ **[04.3.3.2]** Input: `(currentVectors: VectorState, currentBtc: number, deathCount: number)`. Output: `{newVectors: VectorState, newBtc: number, btcLost: number, vectorsLost: Record<VectorName, number>}`. (1) btcLossRate: 0→0.30, 1→0.40, ≥2→0.50. (2) btcLost = round(currentBtc × rate). (3) newAura = max(0, roundToDecimals(aura_lvl × 0.30, 2)). (4) jawline, wealth, physique, social → 0. **ENV → 1**. (5) VectorState inmutable.
═══ **[04.3.3.3]** Input: `(state: {vectors, btc, health, maxHealth, streak, level, deathCount, equippedItems})`. Output: `Result<DeathResult, Error>`. Pipeline: (1) calculateDeathPenalties. (2) health = STARTING_HEARTS (5). (3) maxHealth se mantiene. (4) level = 1. (5) streak = 0. (6) deathCount + 1. (7) Items locked. (8) isHibernation = (deathCount + 1) >= 3. (9) Si isHibernation → cooldownHours=24.
**VALIDACIÓN:**
═══ **[04.3.3.1]** Health=0→true. Health=-2→true. Health=1→false.
═══ **[04.3.3.2]** 1ra muerte: BTC=10000→btcLost=3000. AURA=40→12.00. ENV→1. 2da:-40%. 3ra:-50%.
═══ **[04.3.3.3]** Post-muerte: health=5, level=1, streak=0, deathCount++. ENV→1. 3ra muerte: isHibernation=true, cooldown=24h.
---
### 04.3.3.4 — processHibernation
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Input: `(deathCount: number, deathDate: Date, currentDate: Date, subscriptionStatus: 'trial' | 'active' | 'limbo' | 'cancelled')`. Output: `Result<HibernationStatus, Error>`. Si deathCount < 3 → Err('NOT_IN_HIBERNATION'). Calcular hoursSinceDeath. Si < 24 → canRevive=false, hoursRemaining. Si >= 24 AND subscriptionStatus === 'active' → canRevive=true. Si subscriptionStatus !== 'active' → canRevive=false, reason='SUBSCRIPTION_REQUIRED'.
**VALIDACIÓN:** deathCount=2→Err. deathCount=3 hora 12→canRevive=false. deathCount=3 hora 25 sub='active'→canRevive=true. sub='trial'→canRevive=false.
---
## 04.3.4 — Tests de Salud (5 → 2)
---
### 04.3.4.1 + 04.3.4.2 — Tests JN health + penalty + limbo
[TEST] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.3.4.1]** Archivo `health/health.test.ts`. Suite: (1) assessJNTier: 10/10→SUCCESS, 8/10→SUCCESS (boundary 0.80), 7/10→FAILED, 0/10→FAILED, 0/0→FAILED. (2) calculateJNHealthChange por tier: SUCCESS +1HP, FAILED -1HP. Health en max + SUCCESS → delta=0. Health=1 + FAILED → reachedZero=true. (3) Boundary: 80% exacto → SUCCESS. 79.99% → FAILED.
═══ **[04.3.4.2]** Suite: (1) shouldApplyHealthPenalty: health<3→true, health=3→false. (2) calculateHealthPenalty. (3) calculateLimboHealthLoss: 3d→1, 6d→2, 7d→2.
**VALIDACIÓN:**
═══ **[04.3.4.1]** Sistema binario SUCCESS/FAILED verificado. Boundaries exactos.
═══ **[04.3.4.2]** Threshold exacto en 3. Limbo loss verificado.
---
### 04.3.4.3 + 04.3.4.4 + 04.3.4.5 — Tests muerte + hibernación + items
[TEST] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.3.4.3]** Suite: (1) shouldTriggerDeath. (2) calculateDeathPenalties: 1ra/2da/3ra muerte con rates correctos. (3) processDeath: health=5, level=1, streak=0, **ENV→1**. (4) Items equipados bloqueados. (5) 3ra muerte → isHibernation=true, cooldown=24h.
═══ **[04.3.4.4]** Suite: (1) processHibernation con deathCount<3 → Err. (2) Cooldown 24 horas. (3) Solo 'active' permite revival. (4) reviveState verificado.
═══ **[04.3.4.5]** Suite: (1) Items equipados → bloqueados. (2) Items en inventario → intactos. (3) itemsLocked es copia.
**VALIDACIÓN:**
═══ **[04.3.4.3]** ENV siempre resetea a 1. BTC loss escalado. Hibernación en 3ra muerte.
═══ **[04.3.4.4]** Cooldown 24h exacto. Solo subscription 'active' válida.
═══ **[04.3.4.5]** Separación equipados vs inventario clara.
---
# SUBCAJA 04.4 — JUDGEMENT NIGHT
*29 tareas originales → 16 combinadas*
## 04.4.0 — Setup y Tipos (3 → 2)
---
### 04.4.0.1 + 04.4.0.2 — Estructura judgement/ + tipos JudgementInput/Output/ImageQueueJob
[SETUP] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.0.1]** Crear `/src/lib/core/judgement/` con: `types.ts`, `pipeline.ts`, `streak.ts`, `timezone.ts`, `prompt-builder.ts`, `judgement.test.ts`, `prompt-builder.test.ts`, `simulation.test.ts`, `index.ts`. El index.ts exporta: types (JudgementInput, JudgementOutput, DailyLogEntry, ImageQueueJob), funciones (processJudgementNight, calculateStreakChange, shouldApplyStreakShield, calculateStreakMultiplier, buildAvatarPrompt, validateTimezoneChange, calculateNextJudgementTime, getTimezoneForUser).
═══ **[04.4.0.2]** Archivo `judgement/types.ts`. **JudgementInput**: `{readonly userId: string, readonly dayNumber: number, readonly tasksCompleted: {category: TaskCategory, repetition: number}[], readonly totalTasks: number, readonly currentState: {vectors: VectorState, health: number, maxHealth: number, streak: number, level: LevelNumber, btc: number, deathCount: number, baseAvatarId: 1|2|3|4|5|6, equippedItems: string[], subscriptionStatus: 'trial'|'active'|'limbo'|'cancelled'}, readonly lastActivity: Record<VectorName, Date>, readonly timezone: string, readonly idempotencyKey: string}`. **JudgementOutput**: `{readonly jnTier: JNTier, readonly newState: {...}, readonly vectorDeltas: VectorDelta[], readonly decayDeltas: VectorDelta[], readonly healthDelta: number, readonly streakDelta: number, readonly btcEarned: number, readonly btcFromTasks: number, readonly btcFromLevelUp: number, readonly levelTransition: LevelTransition|null, readonly deathResult: DeathResult|null, readonly imageJob: ImageQueueJob, readonly dailyLog: DailyLogEntry, readonly shieldConsumed: boolean}`. **ImageQueueJob**: `{userId, dayNumber, prompt, vectorsSnapshot, baseAvatarId, priority: 'urgent'|'normal'|'low', metadata}`.
**VALIDACIÓN:**
═══ **[04.4.0.1]** 9 archivos creados. Barrel exports solo de API pública.
═══ **[04.4.0.2]** subscriptionStatus usa valores de PRD: trial/active/limbo/cancelled. baseAvatarId 1-6.
---
### 04.4.0.3 — Definir IJudgementDependencies
[CONFIG] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Interfaz para dependency injection: `interface IJudgementDependencies { readonly applyMultipleTasksToVectors, readonly assessJNTier, readonly calculateJNHealthChange, readonly calculateLevel, readonly canLevelUp, readonly processLevelUp, readonly applyDecay, readonly calculateStreakChange, readonly calculateStreakMultiplier, readonly calculateTaskReward, readonly calculateLevelMultiplier, readonly shouldTriggerDeath, readonly processDeath, readonly buildAvatarPrompt, readonly calculateOverallScore, readonly calculateHealthPenalty }`. Crear `createDefaultDependencies(): IJudgementDependencies` con implementaciones reales.
**VALIDACIÓN:** Todas las dependencias inyectables (16 funciones). Tests pueden proveer stubs individuales.
---
## 04.4.1 — Lógica de Racha / Streak (3 → 1)
---
### 04.4.1.1 + 04.4.1.2 + 04.4.1.3 — calculateStreakChange + shouldApplyStreakShield + calculateStreakMultiplier
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.1.1]** Input: `(jnTier: JNTier, currentStreak: number, hasStreakShield: boolean)`. Output: `{newStreak: number, delta: number, shieldConsumed: boolean, milestoneReached: number|null}`. Según PRD: **SUCCESS** → streak +1, shield no se consume. **FAILED** → streak reset a 0 — SALVO que hasStreakShield=true, entonces maintain streak y consumir shield. Milestones cuando newStreak alcanza exactamente: 7, 14, 30, 50, 100 días.
═══ **[04.4.1.2]** Input: `(jnTier: JNTier, hasStreakShield: boolean)`. Output: `boolean`. Retornar true si y solo si `hasStreakShield === true AND jnTier === 'FAILED'`. Shield solo protege en días fallidos.
═══ **[04.4.1.3]** Input: `(streakDays: number)`. Output: `number`. Constantes Maestras: streak=0→×1.0. 1≤streak≤7→×1.1. 8≤streak≤14→×1.5. streak≥15→×2.5. Negativo → tratar como 0.
**VALIDACIÓN:**
═══ **[04.4.1.1]** SUCCESS streak=6→7 (milestone=7). FAILED sin shield streak=25→0. FAILED con shield streak=25→25, shieldConsumed=true.
═══ **[04.4.1.2]** FAILED + shield=true → true. SUCCESS + shield=true → false.
═══ **[04.4.1.3]** streak=0→1.0. streak=7→1.1. streak=8→1.5. streak=15→2.5. streak=100→2.5.
---
## 04.4.2 — Pipeline de Judgement Night (12 → 8)
---
### 04.4.2.1 + 04.4.2.9 — checkIdempotency + captureVectorsSnapshot
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.2.1]** Input: `(userId: string, dayNumber: number, idempotencyKey: string)`. Output: `Result<{isNew: boolean, expectedKey: string}, IdempotencyError>`. Generar expectedKey como `jn_${userId}_day${dayNumber}`. Verificar formato con regex `^jn_[a-f0-9-]+_day\\d+$`. Si no matchea → Err('INVALID_KEY_FORMAT'). Si idempotencyKey !== expectedKey → Err('KEY_MISMATCH'). Si matchea → Ok({isNew: true, expectedKey}).
═══ **[04.4.2.9]** Input: `(vectors: VectorState)`. Output: `Result<VectorState, Error>`. Serializar para JSONB. Redondear a 2 decimales. Validar con VectorStateSchema.
**VALIDACIÓN:**
═══ **[04.4.2.1]** Key válida 'jn_abc123_day5' con userId='abc123' dayNumber=5 → Ok. Key 'jn_abc123_day6' con dayNumber=5 → Err.
═══ **[04.4.2.9]** Snapshot con 6 campos. Copia independiente.
---
### 04.4.2.2 + 04.4.2.3 — processTaskImpacts + processDecay
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.2.2]** Input: `(vectors: VectorState, completedTasks: {category: TaskCategory, repetition: number}[], currentHealth: number, deps)`. Output: `Result<{newVectors: VectorState, allDeltas: VectorDelta[]}, Error>`. (1) Aplicar health penalty a los deltas si health < 3. (2) Usar deps.applyMultipleTasksToVectors. (3) Clampar vectores.
═══ **[04.4.2.3]** Input: `(vectors: VectorState, lastActivityDates: Record<VectorName, Date>, currentDate: Date, deps)`. Output: `Result<{newVectors: VectorState, decayDeltas: VectorDelta[]}, Error>`. Delegar a deps.applyDecay. Decay se aplica DESPUÉS de task impacts.
**VALIDACIÓN:**
═══ **[04.4.2.2]** Health=2: deltas reducidos 50%. Health=5: deltas normales.
═══ **[04.4.2.3]** Decay aplicado después de task impacts. decayDeltas separados.
---
### 04.4.2.4 + 04.4.2.5 — processHealthChange + processStreakChange
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.2.4]** Input: `(tasksCompleted: number, totalTasks: number, currentHealth: number, maxHealth: number, deps)`. Output: `{jnTier: JNTier, newHealth: number, healthDelta: number, reachedZero: boolean}`. (1) deps.assessJNTier. (2) deps.calculateJNHealthChange.
═══ **[04.4.2.5]** Input: `(jnTier: JNTier, currentStreak: number, hasStreakShield: boolean, deps)`. Output: `{newStreak: number, delta: number, shieldConsumed: boolean, milestoneReached: number|null}`.
**VALIDACIÓN:**
═══ **[04.4.2.4]** 8/10 → SUCCESS → +1HP. 5/10 → FAILED → -1HP.
═══ **[04.4.2.5]** SUCCESS → streak+1. FAILED sin shield → streak=0.
---
### 04.4.2.6 — calculateDayBtcEarnings
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Input: `(completedTasks, level: LevelNumber, streak: number, health: number, subscriptionStatus, deps)`. Output: `{totalBtc, breakdown[], cappedAmount, overflow, wasCapApplied}`. Para cada tarea: baseBtc × levelMult × streakMult × subMult × healthMult × diminishing. subMult = 'active' ? 1.2 : 1.0. healthMult = health<3 ? 0.5 : 1.0. Daily cap = **2,000 BTC** (Constantes Maestras).
**VALIDACIÓN:** meditation level=1 streak=0 sub='trial' health=5 rep=1 → 50×1.05×1.0×1.0×1.0×1.0 = 52.5 → 53 BTC. Daily cap **2,000** aplicado.
---
### 04.4.2.7 + 04.4.2.8 — processLevelTransition + processDeathIfNeeded
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.2.7]** Input: `(currentLevel, newOverallScore, currentDay, vectors, deps)`. Output: `Result<LevelTransition, Error>`.
═══ **[04.4.2.8]** Input: `(health, vectors, btc, deathCount, equippedItems, maxHealth, streak, level, deps)`. Output: `Result<DeathResult|null, Error>`.
**VALIDACIÓN:**
═══ **[04.4.2.7]** Level up con rewards acumulados. Nivel 12 → siempre didLevelUp=false.
═══ **[04.4.2.8]** Health=0 → muerte. Health=1 → Ok(null). ENV→1 en muerte.
---
### 04.4.2.10 + 04.4.2.11 — buildAvatarPrompt + enqueueImageGeneration (Gemini 2.5 Flash)
[LOGIC] · DIF: **4** · AGENTE: **OPUS 4.5** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.2.10]** Input: `(baseAvatarId: 1|2|3|4|5|6, vectors: VectorState, equippedItems: string[], level: LevelNumber)`. Output: `string` (prompt para **Gemini 2.5 Flash**, max 500 tokens). (1) Obtener CHARACTER_BASE_AVATARS[baseAvatarId] → identityTokensIA. (2) Prompt con capas: **STYLE_HEADER** = "cinematic portrait, hyper-detailed digital painting, dramatic lighting, dark moody atmosphere". **IDENTITY_TOKENS** = tokens del personaje. (3) **PHYSIQUE tokens por rango**: 0-10='morbidly obese, no muscle definition', 11-20='overweight, soft body', 21-30='average build, some definition', 31-40='athletic, visible muscle', 41-50='elite physique, ripped'. (4) **JAWLINE tokens**: 0-10='round puffy face, no definition', 11-20='soft jawline', 21-30='average jawline', 31-40='defined jawline', 41-50='razor sharp jawline, chiseled'. (5) **AURA tokens**: 0-10='dull eyes, defeated posture', 11-20='tired look', 21-30='neutral presence', 31-40='commanding presence, confident', 41-50='magnetic aura, intense gaze'. (6) **WEALTH tokens**: 0-10='torn dirty rags, homeless look', 11-20='worn cheap clothes', 21-30='average casual wear', 31-40='quality designer clothes', 41-50='bespoke suit, luxury accessories'. (7) **SOCIAL tokens**: 0-10='isolated, avoiding eye contact', 11-20='shy, withdrawn', 21-30='friendly demeanor', 31-40='charismatic, approachable', 41-50='celebrity energy, magnetic personality'. (8) **ENV tokens Constantes Maestras**: 1-2='dark alley, trash, graffiti', 3-4='cramped shared room, bare walls', 5-6='comfortable apartment, basic decor', 7-8='modern house, quality furniture', 9-10='luxury penthouse, city skyline view'. (9) Items equipados al final. **NO usar [Fal.ai](http://Fal.ai)** (PROHIBIDO según ADRs).
═══ **[04.4.2.11]** Input: `(userId, dayNumber, vectorsSnapshot, baseAvatarId, equippedItems, jnTier, level, health)`. Output: `ImageQueueJob`. (1) prompt = buildAvatarPrompt(...). Si health=0, append death tokens ("lifeless", "fallen", "grayscale filter"). (2) priority: SUCCESS→'normal', FAILED→'low'. health=0→'urgent'. (3) Construir ImageQueueJob con metadata.
**VALIDACIÓN:**
═══ **[04.4.2.10]** Prompt para Gemini 2.5 Flash. 6 personajes con identityTokensIA exactos del PRD. ENV tokens de Constantes Maestras. Tokens por rango de cada vector. Max 500 tokens.
═══ **[04.4.2.11]** FAILED → priority='low'. health=0 → 'urgent' + death tokens.
---
### 04.4.2.12 — processJudgementNight (Railway pipeline maestro)
[LOGIC] · DIF: **5** · AGENTE: **OPUS 4.6** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Input: `(input: JudgementInput, deps: IJudgementDependencies)`. Output: `Result<JudgementOutput, JNPipelineError>`. Pipeline Railway de 14 pasos: (1) IDEMPOTENCY. (2) TASK_IMPACTS. (3) DECAY. (4) HEALTH. (5) STREAK. (6) BTC_EARNINGS con cap **2,000**. (7) OVERALL_SCORE. (8) LEVEL_TRANSITION. (9) DEATH_CHECK. (10) APPLY_DEATH si necesario. (11) SNAPSHOT. (12) IMAGE_JOB. (13) DAILY_LOG. (14) OUTPUT. Si cualquier paso falla → Err con step y contexto.
**VALIDACIÓN:** Pipeline completo de 14 pasos. Cap 2,000 BTC. ENV→1 en muerte. Imagen para Gemini 2.5 Flash.
---
## 04.4.3 — Timezone Anti-Exploit (3 → 1)
---
### 04.4.3.1 + 04.4.3.2 + 04.4.3.3 — Timezone completo (validate + nextJudgement + getTimezone)
[LOGIC] · DIF: **2** · AGENTE: **GEMINI** · MVP: **-** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.3.1]** Input: `(previousTimezone, newTimezone, lastChangeDate, currentDate)`. Output: `Result<{allowed, reason}, Error>`. Regla según PRD: Cooldown de **30 días** entre cambios. Si mismo timezone → allowed=true. Si cambio hace < 30 días → allowed=false. Si ≥ 30 días y timezone IANA válido → allowed=true.
═══ **[04.4.3.2]** Input: `(timezone, currentDate)`. Output: `Result<{nextJudgement, formattedTime}, Error>`. Calcular próximas 23:59:59 en timezone del usuario. Manejar DST.
═══ **[04.4.3.3]** Input: `(userTimezone: string|null)`. Output: `Result<string, Error>`. Validar IANA. null → Err con sugerencia UTC.
**VALIDACIÓN:**
═══ **[04.4.3.1]** Cooldown 30 días. Timezone IANA válido requerido.
═══ **[04.4.3.2]** America/Mexico_City 14:00 → hoy 23:59:59. Post-medianoche → mañana.
═══ **[04.4.3.3]** 'America/Mexico_City' → Ok. null → Err.
---
## 04.4.4 — Tests de Judgement Night (8 → 6)
---
### 04.4.4.1 + 04.4.4.2 — Tests streak + day status y health
[TEST] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.4.1]** Suite: (1) calculateStreakChange con SUCCESS/FAILED. (2) Shield behavior: solo protege FAILED. (3) Milestones 7,14,30,50,100. (4) calculateStreakMultiplier: 0→1.0, 7→1.1, 8→1.5, 15→2.5.
═══ **[04.4.4.2]** Suite: (1) processHealthChange con diferentes completion rates. (2) Boundary 80% exacto = SUCCESS. (3) Health clamping a 0 y maxHealth. (4) reachedZero flag correcto.
**VALIDACIÓN:**
═══ **[04.4.4.1]** Sistema binario. Shield solo protege FAILED. 4 tiers de multiplicador.
═══ **[04.4.4.2]** Threshold 80% exacto verificado. Sistema binario.
---
### 04.4.4.3 — Tests de pipeline completo
[TEST] · DIF: **4** · AGENTE: **OPUS 4.5** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Suite: (1) Día exitoso con todos los pasos. (2) Día fallido. (3) Muerte (health→0). (4) Muerte con hibernación (3ra muerte, cooldown 24h). (5) Level up con rewards. (6) Daily cap **2,000** BTC verificado. (7) Health penalty (health<3 → ×0.5).
**VALIDACIÓN:** Pipeline end-to-end de 14 pasos. Cap 2,000 verificado. Hibernación 24h en 3ra muerte.
---
### 04.4.4.4 + 04.4.4.5 — Tests idempotencia + timezone
[TEST] · DIF: **2** · AGENTE: **GEMINI** · MVP: **-** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.4.4]** Suite: (1) Key válida acepta. (2) Key inválida rechaza. (3) Key mismatch rechaza.
═══ **[04.4.4.5]** Suite: (1) Cooldown 30 días verificado. (2) Timezones IANA válidos e inválidos. (3) DST handling en America/Mexico_City.
**VALIDACIÓN:**
═══ **[04.4.4.4]** Formato `jn_${userId}_day${dayNumber}` verificado.
═══ **[04.4.4.5]** Cooldown 30 días exacto.
---
### 04.4.4.6 — Simulación 100 días
[TEST] · DIF: **4** · AGENTE: **OPUS 4.5** · MVP: **-** · MANUAL: N/A
**DETALLES:** Escenario A: 100 días perfectos (100% completion). Verificar vectores ~50, nivel alto, streak=100, BTC con cap 2,000/día máx = 200,000 total máx de tareas (+ bonuses de level up sin cap). Escenario B: 100 días mixtos con 3 muertes. Verificar hibernación, reset de vectores, ENV→1 cada muerte.
**VALIDACIÓN:** Valores exactos verificados. Cap 2,000/día en tareas. Level up bonuses sin cap. 3ra muerte → hibernación 24h.
---
### 04.4.4.7 + 04.4.4.8 — Tests buildAvatarPrompt + BTC formula
[TEST] · DIF: **3** · AGENTE: **SONNET** · MVP: **-** · MANUAL: N/A
**DETALLES:**
═══ **[04.4.4.7]** Suite: (1) 6 personajes con identityTokensIA exactos del PRD: EL_RASTAS→'brown dreadlocks', EL_GUARRO→'bald', EL_PECAS→'curly red-brown hair', EL_GREÑAS→'balding with long hair in back', EL_GÜERO→'blonde wavy hair', EL_LIC→'rectangular glasses'. (2) Tokens de PHYSIQUE por rango: 0-10→'morbidly obese', 41-50→'elite physique'. (3) Tokens de ENV de Constantes Maestras: 1-2→'dark alley', 9-10→'luxury penthouse'. (4) Prompt ≤ 500 tokens verificado. (5) NO referencias a [Fal.ai](http://Fal.ai) en ningún lugar. (6) Death tokens agregados si health=0.
═══ **[04.4.4.8]** Suite: (1) Level multiplier `1 + level × 0.05` para niveles 1-12: level 1→×1.05, level 12→×1.60. (2) Streak multiplier 4 tiers. (3) Sub multiplier: 'active'→×1.2, otros→×1.0. (4) Health penalty: health<3→×0.5. (5) Daily cap **2,000** BTC para tareas. (6) Level up bonus NO sujeto al cap.
**VALIDACIÓN:**
═══ **[04.4.4.7]** 6 personajes con tokens EXACTOS. 5 rangos por vector. ENV tokens de Constantes Maestras. Prompt length verificado. Sin [Fal.ai](http://Fal.ai).
═══ **[04.4.4.8]** Fórmula completa verificada. Cap 2,000 para tareas. Bonuses sin cap.
---
# SUBCAJA 04.5 — ECONOMÍA BTC
*16 tareas originales → 6 combinadas*
## 04.5.0 + 04.5.1 — Setup + Constantes de Economía (5 → 2)
---
### 04.5.0.1 + 04.5.1.1 + 04.5.1.2 — Estructura economy/ + ECONOMY_CONFIG + STREAK_MULTIPLIER_TIERS
[SETUP] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.5.0.1]** Crear `/src/lib/core/economy/` con: `types.ts`, `constants.ts`, `calculations.ts`, `anti-exploit.ts`, `economy.test.ts`, `index.ts`. El index.ts exporta: types (BtcRewardBreakdown, DailyCap, ExploitCheck), constantes (ECONOMY_CONFIG, SUBSCRIPTION_MULTIPLIERS, STREAK_MULTIPLIER_TIERS, DAILY_BTC_CAP, EXPLOIT_THRESHOLDS), funciones (calculateTaskReward, calculateDayTotalBtc, checkExploitPatterns, validateDailyEarnings, calculateMilestoneBonus).
═══ **[04.5.1.1]** Archivo `economy/constants.ts`. Constantes exactas de Constantes Maestras v2.0.0: `DAILY_BTC_CAP = 2000` (**2,000 BTC/día**). `BTC_DECIMALS = 0` (BTC siempre entero). `MIN_BTC_PER_TASK = 1`. `SUBSCRIPTION_MULTIPLIERS = {trial: 1.0, active: 1.2, limbo: 1.0, cancelled: 1.0} as const` (solo 'active' da 20% bonus). `HEALTH_PENALTY_MULTIPLIER = 0.5`. `HEALTH_PENALTY_THRESHOLD = 3`. `DIMINISHING_BASE = 0.90`. `DIMINISHING_FLOOR = 0.25`.
═══ **[04.5.1.2]** En `economy/constants.ts`. Crear tiers según Constantes Maestras: `[{minStreak: 0, maxStreak: 0, multiplier: 1.0}, {minStreak: 1, maxStreak: 7, multiplier: 1.1}, {minStreak: 8, maxStreak: 14, multiplier: 1.5}, {minStreak: 15, maxStreak: Infinity, multiplier: 2.5}]`.
**VALIDACIÓN:**
═══ **[04.5.0.1]** 6 archivos creados. Barrel exports limpios.
═══ **[04.5.1.1]** Cap **2,000** (CORREGIDO de 3,500). Solo 'active' da ×1.2. Diminishing piso 25%.
═══ **[04.5.1.2]** 4 tiers. streak=0→1.0, 1-7→1.1, 8-14→1.5, 15+→2.5.
---
### 04.5.1.3 + 04.5.1.4 — EXPLOIT_THRESHOLDS + MILESTONE_BONUSES
[CONFIG] · DIF: **1** · AGENTE: **GEMINI** · MVP: **-** · MANUAL: N/A
**DETALLES:**
═══ **[04.5.1.3]** En `economy/constants.ts`. Crear `EXPLOIT_THRESHOLDS = {maxTasksPerDay: 50, maxRepeatsPerCategory: 10, maxBtcPerHour: 500, minTimeBetweenTasks: 30, suspiciousStreakJump: 20, vectorDeltaCeiling: 5.0, btcAnomalyThreshold: 3000} as const`. btcAnomalyThreshold = cap × 1.5 = **3,000** (ajustado para cap de 2,000).
═══ **[04.5.1.4]** En `economy/constants.ts`. Crear `MILESTONE_BONUSES: Record<number, number> = {7: 200, 14: 500, 30: 1500, 50: 3000, 100: 10000}`. Estos bonuses son ONE-TIME y se suman al daily total DESPUÉS del cap (igual que level up bonuses).
**VALIDACIÓN:**
═══ **[04.5.1.3]** Thresholds ajustados para cap 2,000.
═══ **[04.5.1.4]** 5 milestones con bonuses BTC. Sin cap.
---
## 04.5.2 — Cálculos de Economía (5 → 2)
---
### 04.5.2.1 + 04.5.2.2 + 04.5.2.5 — calculateTaskReward + calculateDayTotalBtc + calculateMilestoneBonus
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.5.2.1]** Input: `(category: TaskCategory, level: LevelNumber, streak: number, subscriptionStatus: 'trial'|'active'|'limbo'|'cancelled', health: number, repetition: number)`. Output: `Result<BtcRewardBreakdown, Error>`. Fórmula: baseBtc × levelMult (`1+level×0.05`) × streakMult × subMult × healthMult × diminishing.
═══ **[04.5.2.2]** Input: `(taskRewards[], levelUpBonus, milestoneBonus)`. Output: `{btcFromTasks, btcFromLevelUp, btcFromMilestone, totalBtc, cappedTaskBtc, overflow, wasCapApplied}`. Regla: cappedTaskBtc = min(btcFromTasks, **2000**). Level up y milestone bonuses NO sujetos al cap. totalBtc = cappedTaskBtc + btcFromLevelUp + btcFromMilestone.
═══ **[04.5.2.5]** Input: `(milestoneReached: number|null)`. Output: `number`. Lookup en MILESTONE_BONUSES. null o no encontrado → 0.
**VALIDACIÓN:**
═══ **[04.5.2.1]** meditation level=1 streak=0 sub='trial' health=5 rep=1 → ~53 BTC. cold_shower level=10 streak=15 sub='active' health=5 rep=1 → ~450 BTC.
═══ **[04.5.2.2]** Cap **2,000** solo para tareas. Bonuses sin cap.
═══ **[04.5.2.5]** milestone=7→200. milestone=100→10000. null→0. milestone=8→0 (not a milestone).
---
### 04.5.2.3 + 04.5.2.4 — checkExploitPatterns + validateDailyEarnings
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **-** · MANUAL: N/A
**DETALLES:**
═══ **[04.5.2.3]** Input: `(dailyActivity: {tasks, timestamps, btcEarned, vectorDeltas})`. Output: `{flags: ExploitFlag[], severity: 'none'|'warning'|'critical', shouldBlock: boolean}`. Reglas: TASK_FLOOD (>50 tasks/day) → warning. CATEGORY_SPAM (>10 same category) → warning. RAPID_FIRE (<30s between tasks) → warning. BTC_ANOMALY (>**3,000** daily) → critical. STREAK_JUMP (>20 in one day) → critical. VECTOR_SPIKE (>5.0 delta single task) → critical.
═══ **[04.5.2.4]** Input: `(btcFromTasks, btcFromLevelUp, levelUpExpected: boolean)`. Output: `Result<{valid, warnings[]}, Error>`. Regla: btcFromTasks debe ser ≤ **2,000**. Si btcFromLevelUp > 0 y !levelUpExpected → warning.
**VALIDACIÓN:**
═══ **[04.5.2.3]** BTC_ANOMALY threshold = 3,000 (cap 2,000 × 1.5). Critical → shouldBlock=true.
═══ **[04.5.2.4]** Cap 2,000 validado. Level up bonus sin cap pero verificado.
---
## 04.5.3 — Tests de Economía (3 → 2)
---
### 04.5.3.1 — Tests de rewards BTC (17 categorías + cap 2,000)
[TEST] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:** Suite: (1) 17 categorías con BTC base de Constantes Maestras verificados. (2) Level multiplier `1+level×0.05` correcto: level 1→×1.05, level 12→×1.60. (3) Streak multiplier 4 tiers. (4) Sub multiplier: 'active'→1.2, 'trial'/'limbo'/'cancelled'→1.0. (5) Health penalty: health<3→×0.5. (6) Diminishing returns con piso 25%. (7) calculateDayTotalBtc con cap **2,000** para tareas. (8) Milestone bonuses sin cap. (9) Level up bonuses sin cap.
**VALIDACIÓN:** 17 categorías verificadas. Cap **2,000** para tareas. Bonuses sin cap.
---
### 04.5.3.2 + 04.5.3.3 — Tests anti-exploit + validación
[TEST] · DIF: **2** · AGENTE: **GEMINI** · MVP: **-** · MANUAL: N/A
**DETALLES:**
═══ **[04.5.3.2]** Suite: (1) Sin anomalías → severity='none'. (2) 51 tareas → flag TASK_FLOOD. (3) BTC>3,000 → flag BTC_ANOMALY, severity='critical'. (4) Boundaries exactos: 50 tareas ok, 51 no. (5) Múltiples flags acumulados.
═══ **[04.5.3.3]** Suite: (1) btcFromTasks ≤ 2,000 → valid. (2) btcFromTasks = 2,001 → Err. (3) Level up bonus inesperado → warning.
**VALIDACIÓN:**
═══ **[04.5.3.2]** BTC anomaly threshold 3,000 (cap 2,000 × 1.5).
═══ **[04.5.3.3]** Cap 2,000 verificado estrictamente.
---
# SUBCAJA 04.6 — STATE MACHINES Y VALIDACIÓN CROSS-MODULE
*11 tareas originales → 5 combinadas*
## 04.6.0 — Setup (2 → 1)
---
### 04.6.0.1 + 04.6.0.2 — Estructura state-machines/ + tipos SM
[SETUP] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.6.0.1]** Crear `/src/lib/core/state-machines/` con: `types.ts`, `avatar-states.ts`, `task-states.ts`, `validations.ts`, `state-machines.test.ts`, `index.ts`.
═══ **[04.6.0.2]** Archivo `state-machines/types.ts`. **AvatarState**: `'ONBOARDING' | 'ACTIVE' | 'LIMBO' | 'DEAD' | 'HIBERNATING'`. **TaskState**: `'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'EXPIRED'`. **AvatarEvent** y **TaskEvent** con sus respectivos triggers. **TransitionError** con from, event, message.
**VALIDACIÓN:**
═══ **[04.6.0.1]** 6 archivos creados.
═══ **[04.6.0.2]** 5 estados de avatar según PRD. 5 estados de task.
---
## 04.6.1 — Definición de State Machines (2 → 1)
---
### 04.6.1.1 + 04.6.1.2 — AVATAR_STATE_MACHINE + TASK_STATE_MACHINE
[CONFIG] · DIF: **2** · AGENTE: **GEMINI** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.6.1.1]** Archivo `state-machines/avatar-states.ts`. State machine con estados de PRD: **ONBOARDING → ACTIVE → LIMBO → DEAD → HIBERNATING → ACTIVE**. Transiciones: `ONBOARDING→ACTIVE` (onboarding completo). `ACTIVE→LIMBO` (subscription payment_failed). `ACTIVE→DEAD` (health === 0). `LIMBO→ACTIVE` (pago recuperado). `LIMBO→DEAD` (7 días sin pagar). `DEAD→HIBERNATING` (deathCount >= 3). `DEAD→ACTIVE` (deathCount < 3, resurrect con penalties). `HIBERNATING→ACTIVE` (cooldown >= 24h AND subscription === 'active').
═══ **[04.6.1.2]** En `state-machines/task-states.ts`. States: `AVAILABLE → IN_PROGRESS → COMPLETED → VERIFIED → EXPIRED`. Transiciones según PRD. VERIFIED y EXPIRED son terminales.
**VALIDACIÓN:**
═══ **[04.6.1.1]** Estados coinciden con PRD: ONBOARDING, ACTIVE, LIMBO, DEAD, HIBERNATING. LIMBO = 7 días post payment_failed. Hibernación cooldown = 24h.
═══ **[04.6.1.2]** 5 transiciones válidas. VERIFIED y EXPIRED son terminales.
---
## 04.6.2 — Lógica de State Machines (4 → 2)
---
### 04.6.2.1 + 04.6.2.2 — transitionAvatarState + transitionTaskState
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.6.2.1]** Input: `(currentState: AvatarState, event: AvatarEvent, context: AvatarContext)`. Output: `Result<{newState: AvatarState, sideEffects: SideEffect[]}, TransitionError>`. AvatarContext incluye subscriptionStatus con valores PRD: 'trial'/'active'/'limbo'/'cancelled'. HIBERNATING→ACTIVE requiere cooldown >= 24h AND subscription === 'active'.
═══ **[04.6.2.2]** Input: `(currentState: TaskState, event: TaskEvent)`. Output: `Result<TaskState, TransitionError>`.
**VALIDACIÓN:**
═══ **[04.6.2.1]** Transiciones válidas según state machine. Side effects declarativos. Cooldown 24h para hibernación.
═══ **[04.6.2.2]** 5 transiciones. Terminales no aceptan eventos.
---
### 04.6.2.3 + 04.6.2.4 — validateProtocolTaskCreation + validateJudgementPreconditions
[LOGIC] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.6.2.3]** Input: `(task: {category: TaskCategory, repetition: number, dayNumber: number}, userState: {level: LevelNumber, health: number, avatarState: AvatarState, subscriptionStatus: 'trial'|'active'|'limbo'|'cancelled', deathCount: number})`. Output: `Result<{valid: boolean, warnings: string[]}, ValidationError[]>`. Validaciones exhaustivas (acumular TODOS los errores): (1) category en 17 válidas. (2) repetition 1-10. (3) avatarState === 'ACTIVE'. (4) health > 0. (5) level en rango 1-12. Warnings para rep>5 y health<3.
═══ **[04.6.2.4]** Input: `(input: JudgementInput)`. Output: `Result<true, ValidationError[]>`. Validaciones: health>0, dayNumber>=1, tasksCompleted.length≤totalTasks, totalTasks>0, categorías válidas, timezone IANA, baseAvatarId 1-6, subscriptionStatus válido ('trial'/'active'/'limbo'/'cancelled'), level 1-12, streak>=0, btc>=0, deathCount>=0. Acumular errores.
</tr>
**VALIDACIÓN:**
═══ **[04.6.2.3]** Acumular todos los errores. Warnings separados. Level rango 1-12.
═══ **[04.6.2.4]** level en rango 1-12 (no 13). subscriptionStatus con valores PRD. Acumular todos los errores.
---
## 04.6.3 — Tests de State Machines (2 → 1)
---
### 04.6.3.1 + 04.6.3.2 — Tests SM + validaciones cross-module
[TEST] · DIF: **3** · AGENTE: **SONNET** · MVP: **[X]** · MANUAL: N/A
**DETALLES:**
═══ **[04.6.3.1]** Suite: (1) Avatar: 8 transiciones válidas, transiciones inválidas, condiciones de contexto, ciclo completo ONBOARDING→ACTIVE→DEAD→HIBERNATING→ACTIVE. (2) Task: 5 transiciones, terminales. (3) HIBERNATING→ACTIVE requiere cooldown **24h** y subscription 'active'.
═══ **[04.6.3.2]** Suite: (1) validateProtocolTaskCreation con errores acumulados. (2) validateJudgementPreconditions con level max **12**. (3) Mensajes descriptivos. (4) subscriptionStatus con valores PRD verificados.
**VALIDACIÓN:**
═══ **[04.6.3.1]** LIMBO = 7 días. Hibernación cooldown = 24h. Solo 'active' permite revival.
═══ **[04.6.3.2]** level 1-12 verificado. subscriptionStatus PRD verificado. Errores acumulados.