#!/bin/bash

# Build script for Netlify
# This script builds the project and copies necessary files to dist/

echo "🚀 Starting build process..."

# Clean previous build
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Copy _redirects to dist/
echo "📋 Copying redirect rules..."
if [ -f "public/_redirects" ]; then
  cp public/_redirects dist/_redirects
  echo "✅ Copied public/_redirects to dist/"
fi

if [ -f "_redirects" ]; then
  cp _redirects dist/_redirects
  echo "✅ Copied _redirects to dist/"
fi

# Copy 404.html to dist/
if [ -f "public/404.html" ]; then
  cp public/404.html dist/404.html
  echo "✅ Copied public/404.html to dist/"
fi

# Verify build output
echo "🔍 Verifying build output..."
if [ -f "dist/index.html" ]; then
  echo "✅ dist/index.html exists"
else
  echo "❌ dist/index.html NOT found!"
  exit 1
fi

if [ -f "dist/_redirects" ]; then
  echo "✅ dist/_redirects exists"
else
  echo "⚠️  dist/_redirects NOT found (creating from netlify.toml)"
  echo "/*    /index.html   200" > dist/_redirects
fi

echo "✅ Build completed successfully!"
echo "📂 Build output:"
ls -la dist/
