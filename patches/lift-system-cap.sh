#!/usr/bin/env bash
#
# Fork build-time patch: lift the free-tier managed-system cap.
#
# Upstream Bastillion (v5+) caps unlicensed instances at
# LicenseUtil.FREE_TIER_MAX_SYSTEMS (= 5) managed systems and lifts the cap
# only with a paid commercial LICENSE_KEY. This fork is a NONCOMMERCIAL,
# self-hosted repackaging; under Bastillion's Prosperity Public License 3.0.0
# noncommercial users may modify the software freely, so we lift the cap here.
#
# COMMERCIAL USE IS NOT PERMITTED THROUGH THIS FORK. Commercial users must
# obtain a license from https://www.bastillion.io/ instead of using this image.
# See the "License & Commercial Use" section of README.md.
#
# The change is applied to the working tree at build time (before `mvn package`)
# rather than committed, so the tracked source stays byte-for-byte identical to
# upstream and `git merge upstream/main` never conflicts on it. The script is
# idempotent and FAILS LOUDLY if the target line disappears upstream — better a
# broken build than silently shipping the cap back.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="$ROOT/src/main/java/io/bastillion/manage/util/LicenseUtil.java"

if [[ ! -f "$FILE" ]]; then
  echo "lift-system-cap: ERROR: $FILE not found" >&2
  exit 1
fi

if grep -q 'FREE_TIER_MAX_SYSTEMS = Integer.MAX_VALUE;' "$FILE"; then
  echo "lift-system-cap: already applied, nothing to do"
  exit 0
fi

if ! grep -q 'FREE_TIER_MAX_SYSTEMS = 5;' "$FILE"; then
  echo "lift-system-cap: ERROR: expected 'FREE_TIER_MAX_SYSTEMS = 5;' not found in" >&2
  echo "  $FILE" >&2
  echo "  Upstream likely changed the license cap; review and update this patch." >&2
  exit 1
fi

sed -i 's/FREE_TIER_MAX_SYSTEMS = 5;/FREE_TIER_MAX_SYSTEMS = Integer.MAX_VALUE;/' "$FILE"

# Confirm the substitution took effect.
grep -q 'FREE_TIER_MAX_SYSTEMS = Integer.MAX_VALUE;' "$FILE" \
  || { echo "lift-system-cap: ERROR: substitution failed" >&2; exit 1; }

echo "lift-system-cap: applied — free-tier managed-system cap lifted"
