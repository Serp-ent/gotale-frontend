#!/bin/bash

if [ ! -f "package.json" ]; then
    echo "Run from project root"
    exit 1
fi

if [ ! -f "backend-schema.yml" ]; then
    echo "backend-schema.yml not found. Run scripts/get-schema.sh first."
    exit 1
fi

# Clean and generate
rm -rf src/lib/api_client
mkdir -p src/lib/api_client

echo "Generating TypeScript client..."
npx @openapitools/openapi-generator-cli generate \
    -i backend-schema.yml \
    -g typescript-axios \
    -o src/lib/api_client \
    -c scripts/openapi-config.json

echo "Done! Client generated in src/lib/api_client"

