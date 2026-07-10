#!/usr/bin/env bash
#
# Verify every `uses: owner/repo[/subpath]@ref` in .github/workflows resolves to
# a real remote tag or branch.
#
# Why this exists: the publish job (build-and-push in docker-image.yml) only runs
# on push to `main`, so a bad action pin in it is never resolved by PR CI and
# only fails after merge — which is exactly how `trivy-action@0.36.0` (should be
# v0.36.0) and `anchore/scan-action@v7` (no moving v7 tag) shipped broken. This
# check runs on PRs and catches that class of failure before merge.
#
# Uses the GitHub API via `gh` (authenticated in CI through GITHUB_TOKEN) so it
# doesn't hit the anonymous rate limits that make bare `git ls-remote` flaky.
# Local `./...` uses and 40-char commit-SHA pins are skipped.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WF_DIR="$ROOT/.github/workflows"

fail=0
declare -A seen

# Only match genuine `uses:` mapping keys (optionally list items), never `uses:`
# appearing inside comment prose — anchor to start-of-line + optional "- ".
mapfile -t refs < <(
  grep -rhE '^[[:space:]]*(-[[:space:]]+)?uses:[[:space:]]' "$WF_DIR"/*.yml \
    | sed -E 's/^[[:space:]]*(-[[:space:]]+)?uses:[[:space:]]+//' \
    | sed -E 's/[[:space:]]*#.*$//' \
    | tr -d '"'"'"'' \
    | sort -u
)

for ref in "${refs[@]}"; do
  [[ -z "$ref" ]] && continue
  [[ "$ref" == ./* ]] && continue            # local composite action
  [[ "$ref" != *@* ]] && continue            # docker://… or malformed; skip
  [[ -n "${seen[$ref]:-}" ]] && continue
  seen[$ref]=1

  action="${ref%@*}"
  tag="${ref##*@}"
  repo="$(cut -d/ -f1,2 <<<"$action")"

  if [[ "$tag" =~ ^[0-9a-f]{40}$ ]]; then
    echo "SKIP  $ref  (SHA pin)"
    continue
  fi

  if gh api "repos/$repo/git/ref/tags/$tag" >/dev/null 2>&1 \
     || gh api "repos/$repo/git/ref/heads/$tag" >/dev/null 2>&1; then
    echo "OK    $ref"
  else
    echo "FAIL  $ref  (no tag or branch '$tag' in $repo)"
    fail=1
  fi
done

if [[ "$fail" -ne 0 ]]; then
  echo ""
  echo "One or more action pins do not resolve to a real tag/branch. Fix the pin"
  echo "(check the action's releases for the exact tag, incl. any 'v' prefix)."
  exit 1
fi
echo ""
echo "All action pins resolve."
