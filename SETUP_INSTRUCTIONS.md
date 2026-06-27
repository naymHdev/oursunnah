# 🚀 Automated Setup Instructions

## How to Use the Setup Script

### Step 1: Download Files

Download these 5 files from the outputs:
1. ✅ `setup-search-modal.sh` (the script)
2. ✅ `SearchModal.tsx`
3. ✅ `uiSlice.ts`
4. ✅ `Navbar.tsx`
5. ✅ `QUICK_START.md` (reference)

### Step 2: Place Files in Your Project Root

```bash
# Navigate to your project root (where pnpm-workspace.yaml is)
cd path/to/our_sunnah_web

# Place all 4 files here:
# - setup-search-modal.sh
# - SearchModal.tsx
# - uiSlice.ts
# - Navbar.tsx

# Your directory should look like:
# our_sunnah_web/
# ├── setup-search-modal.sh      ← HERE
# ├── SearchModal.tsx             ← HERE
# ├── uiSlice.ts                  ← HERE
# ├── Navbar.tsx                  ← HERE
# ├── pnpm-workspace.yaml
# ├── package.json
# ├── apps/
# ├── packages/
# └── ...
```

### Step 3: Make Script Executable

```bash
chmod +x setup-search-modal.sh
```

### Step 4: Run the Script

```bash
./setup-search-modal.sh
```

**The script will:**
1. ✅ Check you're in the right directory
2. ✅ Create `apps/web/src/components/search/` directory
3. ✅ Copy `SearchModal.tsx` to correct location
4. ✅ Backup and update `uiSlice.ts`
5. ✅ Backup and update `Navbar.tsx`
6. ✅ Ask if you want to commit & push to GitHub

### Step 5: When Asked "Do you want to commit and push?"

```
Do you want to commit and push to development branch? (y/n) y
```

Type **`y`** to automatically:
- Checkout `development` branch
- Stage the 3 updated files
- Create a meaningful commit message
- Push to GitHub `development` branch

**OR** type **`n`** to skip git operations and do it manually.

### Step 6: Verify Installation

```bash
cd apps/web
pnpm dev
```

Then:
1. Open http://localhost:3000
2. Click the Search icon (magnifying glass) in navbar
3. Type "hijab" or any product name
4. See results appear in real-time
5. Click product → product page opens
6. Modal closes automatically ✨

## What the Script Does

### File Copying
```
SearchModal.tsx → apps/web/src/components/search/SearchModal.tsx
uiSlice.ts → apps/web/src/lib/redux/slices/uiSlice.ts (backed up)
Navbar.tsx → apps/web/src/components/Navbar.tsx (backed up)
```

### Git Operations (Optional)
```
1. Checkout development branch
2. Stage the 3 modified files
3. Create commit with detailed message
4. Push to origin/development
```

### Backups
Original files are backed up with `.backup` extension:
- `uiSlice.ts.backup`
- `Navbar.tsx.backup`

## Troubleshooting

### "pnpm-workspace.yaml not found"
**Issue:** Script is not in the repo root directory

**Fix:**
```bash
cd /path/to/our_sunnah_web  # Go to repo root
./setup-search-modal.sh      # Run from there
```

### "SearchModal.tsx not found"
**Issue:** File is not in the same directory as script

**Fix:**
```bash
# Make sure all 4 files are in the repo root
ls -la setup-search-modal.sh SearchModal.tsx uiSlice.ts Navbar.tsx
# Should show all 4 files

# Then run again
./setup-search-modal.sh
```

### Git push fails with auth error
**Issue:** GitHub token not configured

**Fix:** The script uses HTTPS. If you get auth errors:

```bash
# Option 1: Use git credential helper
git config --global credential.helper store

# Option 2: Set token manually in script
# (Not recommended - use option 1 instead)

# Option 3: Push manually later
git push origin development
```

### "Failed to checkout development branch"
**Issue:** development branch doesn't exist or not synced

**Fix:**
```bash
git fetch origin
git checkout development
```

## Manual Setup (If Script Fails)

If the script doesn't work, do it manually:

```bash
# 1. Create directory
mkdir -p apps/web/src/components/search

# 2. Copy files
cp SearchModal.tsx apps/web/src/components/search/
cp uiSlice.ts apps/web/src/lib/redux/slices/
cp Navbar.tsx apps/web/src/components/

# 3. Commit
git add apps/web/src/components/search/SearchModal.tsx
git add apps/web/src/lib/redux/slices/uiSlice.ts
git add apps/web/src/components/Navbar.tsx

git commit -m "feat: add full-width search modal with real-time product search"

# 4. Push
git push origin development
```

## Verify Push Worked

Check on GitHub:
```
1. Go to https://github.com/oursunnah/our_sunnah_web
2. Click "development" branch dropdown
3. Should see your commit at the top
4. Check Files Changed tab to see the 3 files
```

## After Installation

### Test in Development
```bash
cd apps/web
pnpm dev
```

### Test on Deployed Site
After PR is merged to main:
1. Deployment will automatically trigger
2. Check production site at your-domain.com
3. Search modal should work there too

### Clean Up (Optional)
```bash
# Remove backup files if everything works
rm apps/web/src/lib/redux/slices/uiSlice.ts.backup
rm apps/web/src/components/Navbar.tsx.backup

# Remove setup script
rm setup-search-modal.sh SearchModal.tsx uiSlice.ts Navbar.tsx
```

## What Gets Committed

Your development branch will have:

```diff
+ apps/web/src/components/search/SearchModal.tsx (New file - 180 lines)
~ apps/web/src/lib/redux/slices/uiSlice.ts (Updated - +13 lines)
~ apps/web/src/components/Navbar.tsx (Updated - +3 lines)
```

Total changes:
- **3 files changed**
- **196 insertions**
- **0 deletions** (backward compatible)

## Security Note

⚠️ **Important:** Never commit your GitHub token to git!

The token in the instructions is for reference only. Git operations use:
- SSH key (if configured) OR
- GitHub CLI credentials OR
- Stored git credentials

The script doesn't store or use the token directly.

## Support

If you encounter issues:

1. **Read error messages carefully** - they indicate what went wrong
2. **Check prerequisites**:
   - [ ] In repo root directory
   - [ ] All 4 files present
   - [ ] Git is installed
   - [ ] Have write access to repo
3. **Check file paths**:
   - [ ] `apps/web/src/components/search/` exists
   - [ ] `apps/web/src/lib/redux/slices/` exists
   - [ ] `apps/web/src/components/` exists
4. **Check git status**:
   ```bash
   git status
   git branch
   git log --oneline -5
   ```

## Next Steps After Installation

1. ✅ Run setup script
2. ✅ Push to GitHub
3. ✅ Create Pull Request on GitHub
4. ✅ Request code review
5. ✅ Merge to main after approval
6. ✅ Test on production
7. ✅ (Optional) Deploy

## Timeline

- **Setup:** 2 minutes
- **Testing:** 5 minutes
- **Code review:** 1-2 hours
- **Merge:** Depends on approval
- **Deployment:** Automatic after merge

---

**That's it! Your search modal will be live! 🎉**

