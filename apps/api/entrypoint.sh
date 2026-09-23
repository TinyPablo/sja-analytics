#!/bin/sh
set -e

mkdir -p "$(dirname "${SQLITE_FILE:-/app/data/sja.db}")"

echo "[entrypoint] applying migrations..."
alembic upgrade head

echo "[entrypoint] starting api: $*"
exec "$@"
