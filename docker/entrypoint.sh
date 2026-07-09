#!/bin/sh
# Bastillion runs as a self-contained jar (embedded Jetty 11) — configuration
# comes from environment variables read natively by the app (see Dockerfile),
# so no config templating is needed here.
set -e

echo "***************************************************"
echo ""
echo "              Starting Bastillion"
echo ""
echo "***************************************************"

# GEN_DB_PASS: with no DB_PASSWORD set, the app would prompt for one on stdin —
# generate a random one instead so unattended first-run works. User JAVA_OPTS
# comes later so it can still override.
exec java -DGEN_DB_PASS=true ${JAVA_OPTS} -jar /opt/bastillion/bastillion.jar "$@"
