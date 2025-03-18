#!/bin/bash

# Define variables
FRONTEND_IMAGE="fixmystreet-frontend"
BACKEND_IMAGE="fixmystreet-backend"
FRONTEND_CONTAINER="fixmystreet_frontend"
BACKEND_CONTAINER="fixmystreet_backend"
ENV_FILE=".env"

# Determine API_BASE_URL based on the argument
if [ "$1" == "1" ]; then
    API_BASE_URL="http://20.39.248.149"  # Production
elif [ -n "$1" ]; then
    API_BASE_URL="$1"  # Custom URL from argument
else
    API_BASE_URL="http://localhost:8080"  # Default to local
fi

# Write API_BASE_URL to .env
echo "🔧 Setting API_BASE_URL to $API_BASE_URL..."
echo "VITE_API_BASE_URL=$API_BASE_URL" > "$ENV_FILE"

echo "🚀 Pulling latest changes..."
git fetch origin
git reset --hard origin/main

echo "🛠️ Building frontend image..."
docker build -t $FRONTEND_IMAGE .

echo "🛠️ Building backend image..."
docker build -t $BACKEND_IMAGE ./server

echo "🛑 Stopping existing containers..."
docker stop $FRONTEND_CONTAINER $BACKEND_CONTAINER || true
docker rm $FRONTEND_CONTAINER $BACKEND_CONTAINER || true

echo "🐳 Running frontend container..."
docker run -d --name $FRONTEND_CONTAINER -p 3000:3000 --restart unless-stopped $FRONTEND_IMAGE

echo "🐳 Running backend container..."
docker run -d --name $BACKEND_CONTAINER -p 8080:8080 --restart unless-stopped $BACKEND_IMAGE

echo "📜 Tailing logs..."
docker logs -f $FRONTEND_CONTAINER &
docker logs -f $BACKEND_CONTAINER
