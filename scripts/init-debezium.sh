#!/bin/bash

# Carica variabili di ambiente dal file .env
set -a
source .env
set +a

echo "🔧 Configurazione Debezium Connector..."

# Crea il JSON del connector sostituendo le variabili
CONNECTOR_CONFIG=$(cat <<EOF
{
  "name": "blog-events-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "event-store",
    "database.port": "5432",
    "database.user": "${EVENT_STORE_USER}",
    "database.password": "${EVENT_STORE_PASSWORD}",
    "database.dbname": "${EVENT_STORE_DATABASE}",
    "database.server.name": "blog",
    "table.include.list": "public.events",
    "plugin.name": "pgoutput",
    "publication.autocreate.mode": "filtered",
    "topic.prefix": "blog"
  }
}
EOF
)

# Attendi che Debezium sia pronto
echo "⏳ Attendo che Debezium sia pronto..."
until curl -s http://localhost:8083/ > /dev/null; do
  echo "   Debezium non ancora pronto, attendo 2s..."
  sleep 2
done

echo "✅ Debezium è pronto!"

# Registra il connector
echo "📡 Registro il connector..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d "$CONNECTOR_CONFIG")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 409 ]; then
  echo "✅ Connector registrato con successo!"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  echo "❌ Errore nella registrazione del connector (HTTP $HTTP_CODE)"
  echo "$BODY"
  exit 1
fi

echo ""
echo "🎉 Setup completato!"
echo "Verifica lo stato con: curl http://localhost:8083/connectors/blog-events-connector/status"
