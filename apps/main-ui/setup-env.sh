#!/bin/bash

# EasyCode Platform - Environment Variables Setup Script (Bash)
# This script helps set up environment variables for Cloudflare Workers

# Check if environment parameter is provided
if [ $# -eq 0 ]; then
    echo "❌ Error: Environment parameter is required"
    echo "Usage: $0 [development|staging|production]"
    exit 1
fi

ENVIRONMENT=$1

# Validate environment parameter
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    echo "❌ Error: Invalid environment. Must be development, staging, or production"
    exit 1
fi

echo "🔧 Setting up environment variables for $ENVIRONMENT environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the apps/main-ui directory."
    exit 1
fi

# Function to read environment file
read_env_file() {
    local file_path=$1
    local env_vars=()
    
    if [ -f "$file_path" ]; then
        while IFS= read -r line; do
            # Skip comments and empty lines
            if [[ ! "$line" =~ ^[[:space:]]*# ]] && [[ -n "$line" ]]; then
                if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
                    local key="${BASH_REMATCH[1]}"
                    local value="${BASH_REMATCH[2]}"
                    env_vars+=("$key=$value")
                fi
            fi
        done < "$file_path"
    fi
    
    echo "${env_vars[@]}"
}

# Function to set environment variable
set_cloudflare_env_var() {
    local key=$1
    local value=$2
    local is_secret=$3
    
    if [ "$is_secret" = "true" ]; then
        echo "🔐 Setting secret: $key"
        echo "$value" | wrangler secret put "$key"
    else
        echo "📝 Setting variable: $key = $value"
        echo "$value" | wrangler secret put "$key"
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully set $key"
    else
        echo "❌ Failed to set $key"
    fi
}

# Read environment file based on environment
env_file="env.$ENVIRONMENT"
env_vars=($(read_env_file "$env_file"))

if [ ${#env_vars[@]} -eq 0 ]; then
    echo "❌ Error: Environment file '$env_file' not found or empty."
    exit 1
fi

echo "📋 Found ${#env_vars[@]} environment variables to set"

# Set environment variables
for env_var in "${env_vars[@]}"; do
    key="${env_var%%=*}"
    value="${env_var#*=}"
    
    # Check if this should be a secret
    if [[ "$key" =~ SECRET|KEY|PASSWORD|TOKEN ]]; then
        echo "🔐 Setting secret: $key"
        echo "Please enter the value for $key:"
        read -s secret_value
        echo "$secret_value" | wrangler secret put "$key"
        
        if [ $? -eq 0 ]; then
            echo "✅ Successfully set secret $key"
        else
            echo "❌ Failed to set secret $key"
        fi
    else
        set_cloudflare_env_var "$key" "$value" "false"
    fi
done

echo "🎉 Environment variables setup completed for $ENVIRONMENT environment!"
echo "📝 You can verify the variables in the Cloudflare Workers dashboard." 