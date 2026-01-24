#!/bin/bash

SERVER="${SERVER_ADDRESS:-localhost:8000}"
curl "${SERVER}/api/schema/" > backend-schema.yml
echo "Schema fetched from ${SERVER} to backend-schema.yml"
