#!/usr/bin/env bash
#
# Fork build-time patch: pin Commons FileUpload 2 to a released artifact.
#
# Upstream depends on the unreleased snapshot org.apache.commons:
# commons-fileupload2-jakarta:2.0.0-SNAPSHOT (resolved from the Apache snapshots
# repo). Snapshots are mutable and get garbage-collected, so the build is not
# reproducible and can break without warning. The released Jakarta Servlet 5
# artifact commons-fileupload2-jakarta-servlet5:2.0.0-M5 (on Maven Central)
# provides the same JakartaServletFileUpload under the
# org.apache.commons.fileupload2.jakarta.servlet5 package.
#
# Like the other fork patches this is applied to the working tree at build time,
# NOT committed, so the tracked source stays byte-for-byte upstream. Idempotent;
# FAILS LOUDLY if the upstream coordinates/import move so we never silently build
# against the snapshot again.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POM="$ROOT/pom.xml"
KTRL="$ROOT/src/main/java/io/bastillion/manage/control/UploadAndPushKtrl.java"

for f in "$POM" "$KTRL"; do
  [[ -f "$f" ]] || { echo "pin-fileupload: ERROR: $f not found" >&2; exit 1; }
done

if grep -q 'commons-fileupload2-jakarta-servlet5' "$POM" \
   && grep -q 'fileupload2.jakarta.servlet5.JakartaServletFileUpload' "$KTRL"; then
  echo "pin-fileupload: already applied, nothing to do"
  exit 0
fi

# --- pom.xml: swap the artifact and version to the released Servlet 5 build ---
if ! grep -q '<artifactId>commons-fileupload2-jakarta</artifactId>' "$POM" \
   || ! grep -q '2.0.0-SNAPSHOT' "$POM"; then
  echo "pin-fileupload: ERROR: expected commons-fileupload2-jakarta:2.0.0-SNAPSHOT not found in pom.xml" >&2
  echo "  Upstream likely changed the FileUpload dependency; review and update this patch." >&2
  exit 1
fi
sed -i 's#<artifactId>commons-fileupload2-jakarta</artifactId>#<artifactId>commons-fileupload2-jakarta-servlet5</artifactId>#' "$POM"
sed -i 's#2.0.0-SNAPSHOT#2.0.0-M5#' "$POM"

# --- UploadAndPushKtrl.java: point the import at the servlet5 package ---
if ! grep -q 'import org.apache.commons.fileupload2.jakarta.JakartaServletFileUpload;' "$KTRL"; then
  echo "pin-fileupload: ERROR: expected JakartaServletFileUpload import not found in UploadAndPushKtrl.java" >&2
  exit 1
fi
sed -i 's#import org.apache.commons.fileupload2.jakarta.JakartaServletFileUpload;#import org.apache.commons.fileupload2.jakarta.servlet5.JakartaServletFileUpload;#' "$KTRL"

# --- verify ---
grep -q 'commons-fileupload2-jakarta-servlet5' "$POM" \
  && grep -q '<version>2.0.0-M5</version>' "$POM" \
  && grep -q 'fileupload2.jakarta.servlet5.JakartaServletFileUpload' "$KTRL" \
  || { echo "pin-fileupload: ERROR: substitution failed" >&2; exit 1; }

echo "pin-fileupload: applied — pinned commons-fileupload2-jakarta-servlet5:2.0.0-M5"
