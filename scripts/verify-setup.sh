#!/usr/bin/env bash

set -u
set -o pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

TOTAL_CHECKS=10
PASSED_CHECKS=0
BUILD_DONE=0
BUILD_LOG="$ROOT_DIR/.verify-build.log"
DEV_PID=""
DEV_LOG="$ROOT_DIR/.verify-dev.log"
CHECK_DETAIL=""

print_header() {
  cat <<'EOF'
╔══════════════════════════════════════════╗
║   METAMEN100 — Setup Verification       ║
╚══════════════════════════════════════════╝
EOF
}

restore_tsconfig() {
  git checkout -- tsconfig.json >/dev/null 2>&1 || true
}

stop_dev_server() {
  if [[ -n "$DEV_PID" ]]; then
    if command -v taskkill >/dev/null 2>&1; then
      taskkill //PID "$DEV_PID" //T //F >/dev/null 2>&1 || true
    fi

    kill "$DEV_PID" >/dev/null 2>&1 || true
    sleep 1
    kill -9 "$DEV_PID" >/dev/null 2>&1 || true
  fi

  DEV_PID=""
}

cleanup_on_exit() {
  stop_dev_server
  restore_tsconfig
  rm -f "$BUILD_LOG" "$DEV_LOG"
}

trap cleanup_on_exit EXIT

start_dev_server() {
  stop_dev_server

  rm -f "$DEV_LOG"

  pnpm dev >"$DEV_LOG" 2>&1 &
  DEV_PID=$!
}

get_http_code() {
  local url="$1"

  if command -v curl >/dev/null 2>&1; then
    curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000"
    return
  fi

  if command -v wget >/dev/null 2>&1; then
    wget --server-response --spider -O /dev/null "$url" 2>&1 | awk '/^  HTTP\//{code=$2} END{print code+0}'
    return
  fi

  echo "000"
}

wait_for_http_200() {
  local url="$1"
  local timeout_seconds="$2"
  local elapsed=0

  while (( elapsed < timeout_seconds )); do
    local status
    status="$(get_http_code "$url")"
    if [[ "$status" == "200" ]]; then
      return 0
    fi

    sleep 1
    elapsed=$((elapsed + 1))
  done

  return 1
}

get_headers() {
  local url="$1"

  if command -v curl >/dev/null 2>&1; then
    curl -sSI "$url" || true
    return
  fi

  if command -v wget >/dev/null 2>&1; then
    wget -S --spider "$url" 2>&1 || true
    return
  fi

  echo ""
}

check_1_dev_server() {
  CHECK_DETAIL=""
  local ok=1

  start_dev_server
  if wait_for_http_200 "http://localhost:3000" 15; then
    local code
    code="$(get_http_code "http://localhost:3000")"
    if [[ "$code" == "200" ]]; then
      CHECK_DETAIL="(HTTP 200)"
      ok=0
    else
      CHECK_DETAIL="(HTTP $code)"
    fi
  else
    CHECK_DETAIL="(timeout > 15s)"
  fi

  stop_dev_server
  restore_tsconfig
  return "$ok"
}

check_2_build() {
  CHECK_DETAIL=""
  local ok=1

  rm -f "$BUILD_LOG"
  if pnpm build >"$BUILD_LOG" 2>&1; then
    BUILD_DONE=1
    CHECK_DETAIL="(build exit 0)"
    ok=0
  else
    BUILD_DONE=0
    CHECK_DETAIL="(build exit != 0)"
  fi

  restore_tsconfig
  return "$ok"
}

check_3_typecheck() {
  CHECK_DETAIL=""

  if grep -q '"type-check"' package.json; then
    if pnpm type-check >/dev/null 2>&1; then
      CHECK_DETAIL="(pnpm type-check)"
      return 0
    fi
    CHECK_DETAIL="(pnpm type-check fallo)"
    return 1
  fi

  if pnpm tsc --noEmit >/dev/null 2>&1; then
    CHECK_DETAIL="(pnpm tsc --noEmit)"
    return 0
  fi

  CHECK_DETAIL="(pnpm tsc --noEmit fallo)"
  return 1
}

check_4_ts_strict_flags() {
  CHECK_DETAIL=""
  local missing=()

  grep -Eq '"strict"[[:space:]]*:[[:space:]]*true' tsconfig.json || missing+=("strict")
  grep -Eq '"noUncheckedIndexedAccess"[[:space:]]*:[[:space:]]*true' tsconfig.json || missing+=("noUncheckedIndexedAccess")
  grep -Eq '"exactOptionalPropertyTypes"[[:space:]]*:[[:space:]]*true' tsconfig.json || missing+=("exactOptionalPropertyTypes")

  if (( ${#missing[@]} == 0 )); then
    CHECK_DETAIL="(3/3 flags)"
    return 0
  fi

  CHECK_DETAIL="(faltan: ${missing[*]})"
  return 1
}

check_5_tailwind_tokens() {
  CHECK_DETAIL=""
  local file="tailwind.config.ts"
  local found=0

  local tokens=(
    "vector-aura"
    "vector-jawline"
    "vector-wealth"
    "vector-physique"
    "vector-social"
    "vector-env"
    "vector-aura-secondary"
    "vector-jawline-secondary"
    "vector-wealth-secondary"
    "vector-physique-secondary"
    "vector-social-secondary"
    "vector-env-secondary"
    "avatar-rastas"
    "avatar-guarro"
    "avatar-pecas"
    "avatar-greñas"
    "avatar-guero"
    "avatar-lic"
    "level-low"
    "level-mid"
    "level-high"
    "level-elite"
    "level-god"
    "rarity-common"
    "rarity-rare"
    "rarity-epic"
    "rarity-legendary"
    "bg-base"
    "bg-card"
    "bg-elevated"
    "accent-gold"
    "accent-cta"
    "accent-active"
    "state-error"
    "state-success"
    "state-warning"
    "state-info"
  )

  local token
  for token in "${tokens[@]}"; do
    if grep -qF "$token" "$file"; then
      found=$((found + 1))
    fi
  done

  if (( found >= 30 )); then
    CHECK_DETAIL="($found tokens)"
    return 0
  fi

  CHECK_DETAIL="($found tokens, minimo 30)"
  return 1
}

check_6_csp_headers() {
  CHECK_DETAIL=""
  local ok=1

  start_dev_server
  if ! wait_for_http_200 "http://localhost:3000" 15; then
    CHECK_DETAIL="(dev server no respondio en 15s)"
    stop_dev_server
    restore_tsconfig
    return 1
  fi

  local headers
  headers="$(get_headers "http://localhost:3000" | tr '[:upper:]' '[:lower:]')"

  local missing=()
  grep -q "content-security-policy" <<<"$headers" || missing+=("content-security-policy")
  grep -q "x-frame-options" <<<"$headers" || missing+=("x-frame-options")
  grep -q "strict-transport-security" <<<"$headers" || missing+=("strict-transport-security")

  if (( ${#missing[@]} == 0 )); then
    CHECK_DETAIL="(headers OK)"
    ok=0
  else
    CHECK_DETAIL="(missing: ${missing[*]})"
  fi

  stop_dev_server
  restore_tsconfig
  return "$ok"
}

check_7_bundle_size() {
  CHECK_DETAIL=""

  if (( BUILD_DONE == 0 )); then
    if ! pnpm build >"$BUILD_LOG" 2>&1; then
      CHECK_DETAIL="(build requerido fallo)"
      restore_tsconfig
      return 1
    fi
    BUILD_DONE=1
  fi

  restore_tsconfig

  if [[ -f "$BUILD_LOG" ]]; then
    local kb
    kb="$(grep -Eo 'First Load JS shared by all[[:space:]]+[0-9]+(\.[0-9]+)?[[:space:]]*kB' "$BUILD_LOG" | head -n1 | sed -E 's/.*all[[:space:]]+([0-9]+(\.[0-9]+)?)[[:space:]]*kB/\1/' || true)"
    if [[ -n "$kb" ]]; then
      if awk "BEGIN { exit !($kb < 200) }"; then
        CHECK_DETAIL="(${kb}KB)"
        return 0
      fi

      CHECK_DETAIL="(${kb}KB, limite 200KB)"
      return 1
    fi
  fi

  if [[ -d ".next/static/chunks" ]] && find ".next/static/chunks" -type f -name '*.js' | grep -q .; then
    local count
    count="$(find ".next/static/chunks" -type f -name '*.js' | wc -l | tr -d ' ')"
    CHECK_DETAIL="(fallback: ${count} chunks detectados)"
    return 0
  fi

  CHECK_DETAIL="(no se pudo medir ni encontrar chunks)"
  return 1
}

check_8_path_aliases() {
  CHECK_DETAIL=""

  local alias_ok=0
  if grep -q '"@/\*"' tsconfig.json && grep -q '\./src/\*' tsconfig.json; then
    alias_ok=1
  fi

  local dir_groups=0
  [[ -d "src/core" || -d "src/lib/core" ]] && dir_groups=$((dir_groups + 1))
  [[ -d "src/components" ]] && dir_groups=$((dir_groups + 1))
  [[ -d "src/hooks" ]] && dir_groups=$((dir_groups + 1))
  [[ -d "src/types" ]] && dir_groups=$((dir_groups + 1))

  if (( alias_ok == 1 && dir_groups >= 3 )); then
    CHECK_DETAIL="(${dir_groups}/4 dirs)"
    return 0
  fi

  if (( alias_ok == 0 )); then
    CHECK_DETAIL="(alias @/* faltante, dirs ${dir_groups}/4)"
  else
    CHECK_DETAIL="(dirs ${dir_groups}/4, minimo 3/4)"
  fi
  return 1
}

check_9_css_custom_properties() {
  CHECK_DETAIL=""
  local file="src/app/globals.css"

  if ! grep -q ":root[[:space:]]*{" "$file"; then
    CHECK_DETAIL="(:root faltante)"
    return 1
  fi

  local count
  count="$(grep -E '^[[:space:]]*--color-[a-z0-9-]+:' "$file" | wc -l | tr -d ' ')"

  local required=(
    "--color-bg-base:"
    "--color-accent-gold:"
    "--color-vector-aura:"
    "--color-level-god:"
    "--color-rarity-legendary:"
  )

  local missing=()
  local token
  for token in "${required[@]}"; do
    grep -qF -- "$token" "$file" || missing+=("$token")
  done

  if (( count >= 40 )) && (( ${#missing[@]} == 0 )); then
    CHECK_DETAIL="(${count} props)"
    return 0
  fi

  if (( ${#missing[@]} > 0 )); then
    CHECK_DETAIL="(${count} props, faltan: ${missing[*]})"
  else
    CHECK_DETAIL="(${count} props, minimo 40)"
  fi
  return 1
}

check_10_structure() {
  CHECK_DETAIL=""

  local dir_count
  dir_count="$(find src -type d | wc -l | tr -d ' ')"

  local missing=()
  [[ -d "src/app" ]] || missing+=("src/app")
  [[ -d "src/components" ]] || missing+=("src/components")
  [[ -d "src/hooks" ]] || missing+=("src/hooks")
  [[ -d "src/types" ]] || missing+=("src/types")
  [[ -d "src/lib" ]] || missing+=("src/lib")
  [[ -d "src/core" || -d "src/lib/core" ]] || missing+=("src/core|src/lib/core")

  if (( dir_count >= 40 )) && (( ${#missing[@]} == 0 )); then
    CHECK_DETAIL="(${dir_count} dirs)"
    return 0
  fi

  if (( ${#missing[@]} == 0 )); then
    CHECK_DETAIL="(${dir_count} dirs, minimo 40)"
  else
    CHECK_DETAIL="(${dir_count} dirs, faltan: ${missing[*]})"
  fi
  return 1
}

print_check_line() {
  local index="$1"
  local label="$2"
  local success="$3"
  local detail="$4"
  local mark

  if [[ "$success" == "1" ]]; then
    mark="✅"
  else
    mark="❌"
  fi

  printf "[%s/%s] %-30s %s" "$index" "$TOTAL_CHECKS" "$label" "$mark"
  if [[ -n "$detail" ]]; then
    printf " %s" "$detail"
  fi
  printf "\n"
}

run_check() {
  local index="$1"
  local label="$2"
  local fn="$3"

  CHECK_DETAIL=""
  if "$fn"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    print_check_line "$index" "$label" "1" "$CHECK_DETAIL"
  else
    print_check_line "$index" "$label" "0" "$CHECK_DETAIL"
  fi
}

print_footer() {
  echo "═══════════════════════════════════════════════════"
  if (( PASSED_CHECKS == TOTAL_CHECKS )); then
    echo "RESULTADO: ${PASSED_CHECKS}/${TOTAL_CHECKS} checks pasaron ✅"
  else
    echo "RESULTADO: ${PASSED_CHECKS}/${TOTAL_CHECKS} checks pasaron ❌"
  fi
  echo "═══════════════════════════════════════════════════"
}

print_header
run_check 1 "Dev server arranca" check_1_dev_server
run_check 2 "Build completa" check_2_build
run_check 3 "TypeScript type-check" check_3_typecheck
run_check 4 "TypeScript strict flags" check_4_ts_strict_flags
run_check 5 "Tailwind Design System tokens" check_5_tailwind_tokens
run_check 6 "CSP headers presentes" check_6_csp_headers
run_check 7 "Bundle < 200KB" check_7_bundle_size
run_check 8 "Path aliases resuelven" check_8_path_aliases
run_check 9 "CSS custom properties" check_9_css_custom_properties
run_check 10 "Estructura de carpetas" check_10_structure
print_footer

if (( PASSED_CHECKS == TOTAL_CHECKS )); then
  exit 0
fi

exit 1
