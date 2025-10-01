#!/bin/bash

echo "🧪 Testing frontend build locally..."

cd builder-orbit-lab-main

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️  Building client..."
npm run build:client

echo "🏗️  Building server..."
npm run build:server

echo "✅ Build completed!"
echo "📁 Checking output files..."
ls -la dist/
ls -la dist/server/

echo "🚀 Testing server start..."
node dist/server/node-build.mjs &
SERVER_PID=$!

sleep 3

echo "🔍 Testing server response..."
curl -f http://localhost:3000/api/ping || echo "❌ Server not responding"

echo "🛑 Stopping server..."
kill $SERVER_PID

echo "✅ Test completed!"
