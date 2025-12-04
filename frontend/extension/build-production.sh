#!/bin/bash

# Build script for XDynamic Extension Production
# This script builds the extension ready for distribution

set -e  # Exit on error

echo "🚀 Building XDynamic Extension for Production..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if .env.production exists
echo -e "${BLUE}[1/5]${NC} Checking environment configuration..."
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  .env.production not found!${NC}"
    echo "Creating .env.production from .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.production
        echo -e "${YELLOW}⚠️  Please update .env.production with your production settings:${NC}"
        echo "   - VITE_API_BASE_URL=https://app.xdynamic.cloud"
        echo "   - VITE_GOOGLE_CLIENT_ID=your-production-client-id"
        echo ""
        echo "After updating .env.production, run this script again."
        exit 1
    else
        echo -e "${YELLOW}⚠️  .env.example not found. Creating template...${NC}"
        cat > .env.production << EOF
VITE_API_BASE_URL=https://app.xdynamic.cloud
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id
VITE_ENV=production
VITE_ADMIN_DASHBOARD_URL=https://admin.xdynamic.cloud
EOF
        echo -e "${YELLOW}⚠️  Please update .env.production with your production settings${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} .env.production found"
fi

# Step 2: Check Node modules
echo -e "${BLUE}[2/5]${NC} Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo -e "${GREEN}✓${NC} Dependencies already installed"
fi

# Step 3: Clean previous build
echo -e "${BLUE}[3/5]${NC} Cleaning previous build..."
if [ -d "dist" ]; then
    rm -rf dist
    echo -e "${GREEN}✓${NC} Cleaned dist directory"
fi

if [ -f "../xdynamic-extension.zip" ]; then
    rm -f ../xdynamic-extension.zip
    echo -e "${GREEN}✓${NC} Removed old ZIP file"
fi

# Step 4: Build extension
echo -e "${BLUE}[4/5]${NC} Building extension..."
npm run build:production

if [ ! -d "dist" ]; then
    echo -e "${YELLOW}❌ Build failed! dist directory not created${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Build completed successfully"

# Step 5: Create ZIP file
echo -e "${BLUE}[5/5]${NC} Creating distribution package..."
cd dist
zip -r ../xdynamic-extension.zip . -x "*.map"
cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Build Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "📦 Distribution files:"
echo -e "   ${BLUE}dist/${NC}                    - Unpacked extension"
echo -e "   ${BLUE}xdynamic-extension.zip${NC}   - Ready for distribution"
echo ""
echo -e "📋 Next steps:"
echo -e "   1. Test the extension locally:"
echo -e "      - Open Chrome: ${BLUE}chrome://extensions/${NC}"
echo -e "      - Enable 'Developer mode'"
echo -e "      - Click 'Load unpacked' and select the ${BLUE}dist/${NC} folder"
echo ""
echo -e "   2. Distribute to users:"
echo -e "      - Send them ${BLUE}xdynamic-extension.zip${NC}"
echo -e "      - They unzip and load it in Chrome"
echo ""
echo -e "   3. Or publish to Chrome Web Store:"
echo -e "      - Upload ${BLUE}xdynamic-extension.zip${NC}"
echo -e "      - Visit: ${BLUE}https://chrome.google.com/webstore/devconsole${NC}"
echo ""
echo -e "🌐 Backend API: ${BLUE}$(grep VITE_API_BASE_URL .env.production | cut -d '=' -f2)${NC}"
echo ""
