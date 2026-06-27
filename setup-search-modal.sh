#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Search Modal - Automated Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if we're in the right directory
if [ ! -f "pnpm-workspace.yaml" ]; then
    echo -e "${RED}❌ Error: pnpm-workspace.yaml not found${NC}"
    echo -e "${YELLOW}Please run this script from the root of our_sunnah_web repo${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Running from correct directory${NC}\n"

# Create search directory if it doesn't exist
echo -e "${BLUE}Creating search directory...${NC}"
mkdir -p apps/web/src/components/search
echo -e "${GREEN}✓ Directory created${NC}\n"

# Copy SearchModal.tsx
echo -e "${BLUE}Copying SearchModal.tsx...${NC}"
if [ -f "SearchModal.tsx" ]; then
    cp SearchModal.tsx apps/web/src/components/search/
    echo -e "${GREEN}✓ SearchModal.tsx copied${NC}"
else
    echo -e "${RED}❌ SearchModal.tsx not found in current directory${NC}"
    exit 1
fi

# Copy uiSlice.ts (backup original first)
echo -e "${BLUE}Updating uiSlice.ts...${NC}"
if [ -f "uiSlice.ts" ]; then
    cp apps/web/src/lib/redux/slices/uiSlice.ts apps/web/src/lib/redux/slices/uiSlice.ts.backup
    cp uiSlice.ts apps/web/src/lib/redux/slices/
    echo -e "${GREEN}✓ uiSlice.ts updated (backup saved as .backup)${NC}"
else
    echo -e "${RED}❌ uiSlice.ts not found in current directory${NC}"
    exit 1
fi

# Copy Navbar.tsx (backup original first)
echo -e "${BLUE}Updating Navbar.tsx...${NC}"
if [ -f "Navbar.tsx" ]; then
    cp apps/web/src/components/Navbar.tsx apps/web/src/components/Navbar.tsx.backup
    cp Navbar.tsx apps/web/src/components/
    echo -e "${GREEN}✓ Navbar.tsx updated (backup saved as .backup)${NC}"
else
    echo -e "${RED}❌ Navbar.tsx not found in current directory${NC}"
    exit 1
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  Files Installed Successfully!${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Show what was done
echo -e "${GREEN}✓ SearchModal.tsx${NC} → apps/web/src/components/search/"
echo -e "${GREEN}✓ uiSlice.ts${NC} → apps/web/src/lib/redux/slices/"
echo -e "${GREEN}✓ Navbar.tsx${NC} → apps/web/src/components/"
echo -e "\n"

# Ask if user wants to commit and push
read -p "Do you want to commit and push to development branch? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}Setting up Git...${NC}\n"
    
    # Configure git if needed
    git config user.email "dev@oursunnah.com" 2>/dev/null || true
    git config user.name "Our Sunnah Dev" 2>/dev/null || true
    
    # Make sure we're on development branch
    echo -e "${BLUE}Checking out development branch...${NC}"
    git checkout development
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to checkout development branch${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ On development branch${NC}\n"
    
    # Add files
    echo -e "${BLUE}Staging files...${NC}"
    git add apps/web/src/components/search/SearchModal.tsx
    git add apps/web/src/lib/redux/slices/uiSlice.ts
    git add apps/web/src/components/Navbar.tsx
    echo -e "${GREEN}✓ Files staged${NC}\n"
    
    # Create commit message
    COMMIT_MSG="feat: add full-width search modal with real-time product search

- Add SearchModal component with debounced search
- Update uiSlice with search modal state management
- Integrate search button in Navbar (desktop & mobile)
- Display 20 product results with category filters
- Support product and category navigation from results
- Add keyboard support (Escape to close)
- Add backdrop click to close modal
- Real-time search with 300ms debounce
- Category filter pills extracted from results
- Mobile responsive design"

    # Commit
    echo -e "${BLUE}Creating commit...${NC}"
    git commit -m "$COMMIT_MSG"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to create commit${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Commit created${NC}\n"
    
    # Push
    echo -e "${BLUE}Pushing to development branch...${NC}"
    git push origin development
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to push${NC}"
        echo -e "${YELLOW}Try pushing manually: git push origin development${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Pushed to development branch${NC}\n"
    
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}✓ Successfully committed and pushed!${NC}"
    echo -e "${BLUE}========================================${NC}\n"
    
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "1. Go to GitHub: https://github.com/oursunnah/our_sunnah_web"
    echo -e "2. Create a Pull Request from development → main"
    echo -e "3. Run the dev server to test:"
    echo -e "   ${BLUE}cd apps/web && pnpm dev${NC}\n"
    
else
    echo -e "\n${YELLOW}⚠ Skipped git operations${NC}\n"
    echo -e "${YELLOW}To push manually, run:${NC}"
    echo -e "${BLUE}git add apps/web/src/components/search/SearchModal.tsx${NC}"
    echo -e "${BLUE}git add apps/web/src/lib/redux/slices/uiSlice.ts${NC}"
    echo -e "${BLUE}git add apps/web/src/components/Navbar.tsx${NC}"
    echo -e "${BLUE}git commit -m 'feat: add full-width search modal'${NC}"
    echo -e "${BLUE}git push origin development${NC}\n"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Installation Complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${YELLOW}To test the search modal:${NC}\n"
echo -e "1. ${BLUE}cd apps/web${NC}"
echo -e "2. ${BLUE}pnpm dev${NC}"
echo -e "3. Open http://localhost:3000"
echo -e "4. Click the Search icon in navbar"
echo -e "5. Type a product name\n"

echo -e "${GREEN}Happy searching! 🔍${NC}\n"
