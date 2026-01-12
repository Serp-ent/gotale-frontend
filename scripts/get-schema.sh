#!/bin/bash
curl localhost:8000/api/schema/ > backend-schema.yml
echo "✅ Schema fetched to backend-schema.yml"
