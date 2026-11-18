#!/usr/bin/env bash
# Prepara PostgreSQL local para desarrollo (requiere acceso de superusuario `postgres`).
# Crea el rol, las bases `alexandria` y `alexandria_test` y las extensiones necesarias.
set -euo pipefail
DB_USER="${DB_USER:-alexandria}"
DB_PASSWORD="${DB_PASSWORD:-alexandria_dev}"

run_sql() { if [ "$(id -u)" = "0" ]; then su postgres -c "psql -v ON_ERROR_STOP=1 -q $1"; else sudo -u postgres psql -v ON_ERROR_STOP=1 -q $1; fi; }

echo "SELECT 'CREATE ROLE $DB_USER LOGIN PASSWORD ''$DB_PASSWORD''' WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER')\gexec" | run_sql ""
for DB in alexandria alexandria_test; do
  echo "SELECT 'CREATE DATABASE $DB OWNER $DB_USER' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB')\gexec" | run_sql ""
  echo "CREATE EXTENSION IF NOT EXISTS pg_trgm; CREATE EXTENSION IF NOT EXISTS unaccent; CREATE EXTENSION IF NOT EXISTS vector;" | run_sql "-d $DB"
done
echo "✓ Bases de datos listas. Ejecuta: npm run db:migrate && npm run db:seed"
