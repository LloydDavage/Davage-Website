#!/usr/bin/env bash
# Deploy dist/ to davage.co.uk over FTPS (explicit TLS on port 21).
#
# - Uploads every file in dist/ to the web root, creating folders as needed.
# - Only adds/overwrites files; never deletes anything on the server.
# - The FTP login (lloyd@davage.co.uk) already lands in the web root
#   (public_html), so files go to "/" — NOT to "public_html/".
# - Connects to cp16.uk.netnerd.com: the same server as ftp.davage.co.uk, but
#   its TLS certificate is issued for that name, so encryption verifies properly.
#
# Credentials are read from ~/.netrc (never stored in this repo):
#   machine ftp.davage.co.uk login lloyd@davage.co.uk password YOUR_PASSWORD
# (chmod 600 ~/.netrc)
#
# Usage: npm run deploy   (builds first, then runs this script)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST="$SCRIPT_DIR/../dist"
FTP_HOST="cp16.uk.netnerd.com"
NETRC_HOST="ftp.davage.co.uk"
BASE="ftp://$FTP_HOST:21"

if [ ! -f "$HOME/.netrc" ] || ! grep -q "machine $NETRC_HOST" "$HOME/.netrc"; then
  echo "No FTP login found. Add this line to ~/.netrc and run: chmod 600 ~/.netrc" >&2
  echo "  machine $NETRC_HOST login lloyd@davage.co.uk password YOUR_PASSWORD" >&2
  exit 1
fi

if [ ! -f "$DIST/index.html" ]; then
  echo "dist/ is empty; run 'npm run build' first (or use 'npm run deploy')." >&2
  exit 1
fi

# Temporary netrc mapping the login to the certificate's hostname.
NETRC_TMP="$(mktemp)"
chmod 600 "$NETRC_TMP"
trap 'rm -f "$NETRC_TMP"' EXIT
sed "s/${NETRC_HOST//./\\.}/$FTP_HOST/" "$HOME/.netrc" > "$NETRC_TMP"

opts=(--netrc-file "$NETRC_TMP" --ssl-reqd --ftp-create-dirs --silent --show-error --fail)

cd "$DIST"
count=0
while IFS= read -r -d '' f; do
  rel="${f#./}"
  case "$(basename "$rel")" in .*) continue ;; esac
  echo "uploading $rel"
  curl "${opts[@]}" -T "$rel" "$BASE/$rel"
  count=$((count + 1))
done < <(find . -type f -print0 | sort -z)

echo "Done: $count files uploaded to https://www.davage.co.uk/"
