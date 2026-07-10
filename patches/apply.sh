#!/usr/bin/env bash
#
# Apply all fork build-time patches to the working tree before `mvn package`.
# Each patch keeps the tracked upstream source pristine (so upstream syncs never
# conflict) and is idempotent + self-verifying. See the individual scripts and
# README's "License & Commercial Use" section for rationale.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$DIR/lift-system-cap.sh"
"$DIR/pin-fileupload.sh"
