#!/bin/bash

# XDynamic Extension - Quick Start Script
# This script helps you quickly setup and run both backend and extension

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}XDynamic Extension - Quick Start${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "BOT_DETECTED_DANGEROUS" ] || [ ! -d "Demo-DyXtension" ]; then
    echo -e "${RED}Error: Please run this script from XDynamic_Extension root directory${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists python3; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found${NC}"

if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found${NC}"

echo ""

# Ask user what to do
echo "What would you like to do?"
echo "1) Setup Backend"
echo "2) Setup Extension"
echo "3) Setup Both"
echo "4) Run Backend"
echo "5) Build Extension"
echo "6) Run Both (Backend + Build Extension)"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo -e "${YELLOW}Setting up Backend...${NC}"
        cd BOT_DETECTED_DANGEROUS
        
        # Create virtual environment if not exists
        if [ ! -d "venv" ]; then
            echo "Creating virtual environment..."
            python3 -m venv venv
        fi
        
        # Activate virtual environment
        echo "Activating virtual environment..."
        source venv/bin/activate
        
        # Install dependencies
        echo "Installing dependencies..."
        pip install -r requirements.txt
        
        # Create .env if not exists
        if [ ! -f ".env" ]; then
            echo "Creating .env file..."
            cat > .env << EOL
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
APP_NAME="Dangerous Object Detection API"
APP_VERSION="1.0.0"
DEBUG=True
EOL
            echo -e "${GREEN}✓ .env file created${NC}"
        fi
        
        echo -e "${GREEN}✓ Backend setup complete!${NC}"
        echo -e "${YELLOW}To run backend: cd BOT_DETECTED_DANGEROUS && source venv/bin/activate && python run.py${NC}"
        ;;
        
    2)
        echo -e "${YELLOW}Setting up Extension...${NC}"
        cd Demo-DyXtension/extension
        
        # Install dependencies
        echo "Installing dependencies..."
        npm install
        
        # Create .env if not exists
        if [ ! -f ".env" ]; then
            echo "Creating .env file..."
            cat > .env << EOL
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_ENV=development
EOL
            echo -e "${GREEN}✓ .env file created${NC}"
        fi
        
        echo -e "${GREEN}✓ Extension setup complete!${NC}"
        echo -e "${YELLOW}To build: cd Demo-DyXtension/extension && npm run build${NC}"
        ;;
        
    3)
        echo -e "${YELLOW}Setting up both Backend and Extension...${NC}"
        
        # Setup Backend
        echo -e "\n${YELLOW}[1/2] Setting up Backend...${NC}"
        cd BOT_DETECTED_DANGEROUS
        
        if [ ! -d "venv" ]; then
            python3 -m venv venv
        fi
        
        source venv/bin/activate
        pip install -r requirements.txt
        
        if [ ! -f ".env" ]; then
            cat > .env << EOL
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
APP_NAME="Dangerous Object Detection API"
APP_VERSION="1.0.0"
DEBUG=True
EOL
        fi
        
        echo -e "${GREEN}✓ Backend setup complete!${NC}"
        
        # Setup Extension
        cd ../Demo-DyXtension/extension
        echo -e "\n${YELLOW}[2/2] Setting up Extension...${NC}"
        
        npm install
        
        if [ ! -f ".env" ]; then
            cat > .env << EOL
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_ENV=development
EOL
        fi
        
        echo -e "${GREEN}✓ Extension setup complete!${NC}"
        echo -e "\n${GREEN}========================================${NC}"
        echo -e "${GREEN}Setup Complete! Next steps:${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo -e "1. Start backend: ${YELLOW}cd BOT_DETECTED_DANGEROUS && source venv/bin/activate && python run.py${NC}"
        echo -e "2. Build extension: ${YELLOW}cd Demo-DyXtension/extension && npm run build${NC}"
        echo -e "3. Load extension in Chrome: ${YELLOW}chrome://extensions${NC} → Load unpacked → select dist/"
        ;;
        
    4)
        echo -e "${YELLOW}Starting Backend...${NC}"
        cd BOT_DETECTED_DANGEROUS
        
        if [ ! -d "venv" ]; then
            echo -e "${RED}Backend not setup. Please run setup first (option 1 or 3)${NC}"
            exit 1
        fi
        
        source venv/bin/activate
        echo -e "${GREEN}Starting backend on http://localhost:8000${NC}"
        echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
        python run.py
        ;;
        
    5)
        echo -e "${YELLOW}Building Extension...${NC}"
        cd Demo-DyXtension/extension
        
        if [ ! -d "node_modules" ]; then
            echo -e "${RED}Extension not setup. Please run setup first (option 2 or 3)${NC}"
            exit 1
        fi
        
        npm run build
        
        echo -e "${GREEN}✓ Extension built successfully!${NC}"
        echo -e "${YELLOW}Load extension in Chrome:${NC}"
        echo -e "1. Go to chrome://extensions"
        echo -e "2. Enable 'Developer mode'"
        echo -e "3. Click 'Load unpacked'"
        echo -e "4. Select: $(pwd)/dist"
        ;;
        
    6)
        echo -e "${YELLOW}Starting Backend and Building Extension...${NC}"
        
        # Build Extension first
        cd Demo-DyXtension/extension
        
        if [ ! -d "node_modules" ]; then
            echo -e "${RED}Extension not setup. Running setup...${NC}"
            npm install
        fi
        
        echo -e "${YELLOW}Building extension...${NC}"
        npm run build
        echo -e "${GREEN}✓ Extension built!${NC}"
        
        # Start Backend
        cd ../../BOT_DETECTED_DANGEROUS
        
        if [ ! -d "venv" ]; then
            echo -e "${RED}Backend not setup. Running setup...${NC}"
            python3 -m venv venv
            source venv/bin/activate
            pip install -r requirements.txt
        else
            source venv/bin/activate
        fi
        
        echo -e "${GREEN}Starting backend on http://localhost:8000${NC}"
        echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
        echo ""
        echo -e "${GREEN}Don't forget to load extension in Chrome:${NC}"
        echo -e "chrome://extensions → Load unpacked → select Demo-DyXtension/extension/dist"
        echo ""
        python run.py
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac
