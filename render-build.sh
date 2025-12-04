# Render Build Script
#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Setting up RAG database..."
npm run setup:rag

echo "Building Next.js application..."
npm run build

echo "Build complete!"
