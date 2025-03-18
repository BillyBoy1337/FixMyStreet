#!/bin/bash

# Define URLs
PROD_URL="http://20.39.248.149/api/auth/login"  #production URL
LOCAL_URL="http://localhost:8080/api/auth/login"   #local URL

# Choose the URL based on argument
if [ "$1" == "1" ]; then
    LOGIN_URL="$PROD_URL"
    echo "Using production URL: $LOGIN_URL"
else
    LOGIN_URL="$LOCAL_URL"
    echo "Using local URL: $LOGIN_URL"
fi

# User credentials
EMAIL="Ak1@dev.com" 
PASSWORD="Ak@123"

# Make the login request
RESPONSE=$(curl -s -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

# Extract the token using jq (ensure jq is installed)
TOKEN=$(echo "$RESPONSE" | jq -r '.token')

# Check if token is extracted successfully
if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo "Failed to extract token. Response: $RESPONSE"
    exit 1
fi

# Log the extracted token
echo "Token: $TOKEN"
