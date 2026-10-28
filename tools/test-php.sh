#!/usr/bin/env bash
# Усі PHP-тести входу одним запуском:   bash tools/test-php.sh
#
# На цій машині PHP стоїть без php.ini, тож pdo_sqlite, openssl і mbstring
# лежать у ext/, але не ввімкнені. Вмикаємо їх лише на час тестів — системний
# PHP не чіпаємо. Де php.ini є (сервер, CI), прапорці нічого не ламають.
set -u
PHP_BIN="${PHP:-php}"
EXT="$(dirname "$(command -v "$PHP_BIN")")/ext"
FLAGS=()
if [ -d "$EXT" ]; then
  FLAGS=(-d "extension_dir=$EXT")
  for x in pdo_sqlite openssl mbstring; do
    "$PHP_BIN" -m 2>/dev/null | grep -qi "^$x$" || FLAGS+=(-d "extension=$x")
  done
fi
cd "$(dirname "$0")/.." || exit 1
fail=0
for t in test-auth test-google test-secret-box test-admin-totp test-google-settings; do
  out="$("$PHP_BIN" "${FLAGS[@]}" "tools/$t.php" 2>&1)"
  if printf '%s' "$out" | tail -1 | grep -q '^ALL .* PASSED$'; then
    printf '✔ %-22s %s перевірок\n' "$t" "$(printf '%s\n' "$out" | grep -c '^PASS ')"
  else
    printf '✖ %s\n%s\n' "$t" "$(printf '%s\n' "$out" | tail -6)"; fail=1
  fi
done
exit $fail
