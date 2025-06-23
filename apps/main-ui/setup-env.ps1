# EasyCode Platform - Environment Variables Setup Script (PowerShell)
# This script helps set up environment variables for Cloudflare Workers

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("development", "staging", "production")]
    [string]$Environment
)

Write-Host "🔧 Setting up environment variables for $Environment environment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the apps/main-ui directory." -ForegroundColor Red
    exit 1
}

# Function to read environment file
function Read-EnvFile {
    param([string]$FilePath)
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath
        $envVars = @{}
        
        foreach ($line in $content) {
            if ($line -match '^([^#][^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                $envVars[$key] = $value
            }
        }
        
        return $envVars
    }
    
    return @{}
}

# Function to set environment variable
function Set-CloudflareEnvVar {
    param([string]$Key, [string]$Value, [bool]$IsSecret = $false)
    
    try {
        if ($IsSecret) {
            Write-Host "🔐 Setting secret: $Key" -ForegroundColor Yellow
            wrangler secret put $Key
        } else {
            Write-Host "📝 Setting variable: $Key = $Value" -ForegroundColor Yellow
            wrangler secret put $Key
        }
        Write-Host "✅ Successfully set $Key" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to set $Key : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Read environment file based on environment
$envFile = "env.$Environment"
$envVars = Read-EnvFile $envFile

if ($envVars.Count -eq 0) {
    Write-Host "❌ Error: Environment file '$envFile' not found or empty." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Found $($envVars.Count) environment variables to set" -ForegroundColor Cyan

# Set environment variables
foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    
    # Check if this should be a secret
    $isSecret = $key -match "SECRET|KEY|PASSWORD|TOKEN"
    
    if ($isSecret) {
        Write-Host "🔐 Setting secret: $key" -ForegroundColor Yellow
        Write-Host "Please enter the value for $key (input will be hidden):" -ForegroundColor Cyan
        $secretValue = Read-Host -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretValue)
        $secretValue = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        
        try {
            echo $secretValue | wrangler secret put $key
            Write-Host "✅ Successfully set secret $key" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Failed to set secret $key : $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Set-CloudflareEnvVar -Key $key -Value $value
    }
}

Write-Host "🎉 Environment variables setup completed for $Environment environment!" -ForegroundColor Green
Write-Host "📝 You can verify the variables in the Cloudflare Workers dashboard." -ForegroundColor Cyan 