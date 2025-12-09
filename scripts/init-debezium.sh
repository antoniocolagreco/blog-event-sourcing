#!/bin/sh


if curl -sf http://localhost:8083/connectors/blog-events-connector > /dev/null 2>&1; then
    echo "🧹 Connector already exists, deleting..."
    curl -X DELETE http://localhost:8083/connectors/blog-events-connector
    sleep 2
fi

echo "⏳ Waiting for Debezium to be ready..."

until curl -f http://localhost:8083 > /dev/null 2>&1; do
    echo " Still waiting..."
    sleep 2
done

echo "✅ Debezium is ready!"
echo ""
echo "📝 Registering connector..."

curl -X POST http://localhost:8083/connectors -H "Content-Type: application/json" -d @debezium-connector.json

echo ""
echo ""
echo "⏳ Waiting for connector to initialize..."

# Aspetta che il connector sia RUNNING
MAX_RETRIES=30
RETRY_COUNT=0

until [ "$(curl -s http://localhost:8083/connectors/blog-events-connector/status | grep -o '"state":"RUNNING"')" = '"state":"RUNNING"' ]; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Connector non si è avviato dopo ${MAX_RETRIES} tentativi"
        break
    fi
    echo " Still initializing... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

echo ""
echo "✅ Connector registered!"
echo ""
echo "📊 Connector status:"
curl -s http://localhost:8083/connectors/blog-events-connector/status | json_pp 2>/dev/null || \
curl -s http://localhost:8083/connectors/blog-events-connector/status

echo ""
