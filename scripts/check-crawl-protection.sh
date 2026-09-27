#!/usr/bin/env bash
# Status check: verifies the published site's crawler protection.
#   - robots.txt must be fetchable by Google (200, no noindex header)
#   - all other pages must stay blocked for bots (403) and noindexed for browsers
# Usage: bash scripts/check-crawl-protection.sh [base-url]
set -u

BASE="${1:-https://westernunionapp.com}"
BROWSER_UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
GOOGLEBOT_UA="Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

PASS=0
FAIL=0

check() {
  local label="$1" expected="$2" actual="$3"
  if [ "$actual" = "$expected" ]; then
    echo "PASS  $label (got $actual)"
    PASS=$((PASS + 1))
  else
    echo "FAIL  $label (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

status() { curl -s -o /dev/null -w "%{http_code}" -A "$2" "$BASE$1"; }
header() { curl -s -D - -o /dev/null -A "$2" "$BASE$1" | grep -i "^x-robots-tag:" | tr -d '\r'; }

echo "Checking $BASE"
echo

# 1. robots.txt readable by Google
check "robots.txt status for Googlebot" "200" "$(status /robots.txt "$GOOGLEBOT_UA")"
check "robots.txt status for browsers" "200" "$(status /robots.txt "$BROWSER_UA")"
check "robots.txt has no X-Robots-Tag" "" "$(header /robots.txt "$GOOGLEBOT_UA")"
BODY=$(curl -s -A "$GOOGLEBOT_UA" "$BASE/robots.txt")
echo "$BODY" | grep -q "Disallow: /" && check "robots.txt still disallows all pages" "yes" "yes" || check "robots.txt still disallows all pages" "yes" "no"
echo "$BODY" | grep -q "Allow: /robots.txt" && check "robots.txt allows itself" "yes" "yes" || check "robots.txt allows itself" "yes" "no"

# 2. Pages blocked for bots, noindexed for browsers
for path in / /track-transfer /ecoencypt/admin/login; do
  check "Googlebot blocked on $path" "403" "$(status "$path" "$GOOGLEBOT_UA")"
  check "browser OK on $path" "200" "$(status "$path" "$BROWSER_UA")"
  TAG=$(header "$path" "$BROWSER_UA")
  case "$TAG" in
    *noindex*nofollow*) check "noindex header on $path" "yes" "yes" ;;
    *) check "noindex header on $path" "yes" "no" ;;
  esac
done

# 3. No sitemap
check "/sitemap.xml is not exposed" "404" "$(status /sitemap.xml "$BROWSER_UA")"

echo
echo "Result: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
