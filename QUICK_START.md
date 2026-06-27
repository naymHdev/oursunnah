# Search Modal - Quick Start Guide

## 🚀 Installation (2 Minutes)

### 1. Copy the 3 files to your repo:

```bash
# From outputs folder, copy to your project:

# File 1: New Search Modal Component
cp SearchModal.tsx apps/web/src/components/search/

# File 2: Updated Redux UI Slice
cp uiSlice.ts apps/web/src/lib/redux/slices/

# File 3: Updated Navbar Component
cp Navbar.tsx apps/web/src/components/
```

### 2. Verify no import errors:

The files are already updated with correct imports, so just:

```bash
cd apps/web
pnpm dev
```

### 3. Test it:

1. Open http://localhost:3000
2. Click the **Search icon** (magnifying glass) in navbar
3. Full-width modal opens
4. Type any product name (e.g., "hijab", "prayer", "dress")
5. Results appear automatically
6. Click a product → Product page opens & modal closes
7. Press `Escape` → Modal closes

## 📝 What Each File Does

### `SearchModal.tsx` (NEW)
```typescript
- Full-width search modal component
- Real-time product search with debounce
- Product grid display (20 results)
- Category filter pills
- Keyboard support (Escape to close)
- Auto-focus on input
```

### `uiSlice.ts` (UPDATED)
```typescript
Added to Redux state:
- searchModalOpen: boolean
- searchQuery: string

Added actions:
- openSearchModal()
- closeSearchModal()
- setSearchQuery(query)

Added selectors:
- selectSearchModalOpen
- selectSearchQuery
```

### `Navbar.tsx` (UPDATED)
```typescript
Changes:
- Import SearchModal component
- Import openSearchModal action
- Add onClick handler to search icon (desktop)
- Add onClick handler to search button (mobile)
- Render <SearchModal /> component
```

## 🎯 How It Works (Flow)

```
User clicks Search Icon
         ↓
    Redux action: openSearchModal()
         ↓
    searchModalOpen = true
         ↓
    SearchModal component renders
         ↓
    User types in input field
         ↓
    300ms debounce timer starts
         ↓
    setSearchQuery() updates Redux
         ↓
    useGetProductsQuery() fetches from API
         ↓
    GET /api/v1/products?search=query
         ↓
    Products display in grid
         ↓
    User clicks product/category
         ↓
    closeSearchModal() + navigate()
         ↓
    Modal closes, page opens
```

## 🧪 Test Cases

✅ **Basic Search**
- Click search icon
- Type "hijab"
- See results appear

✅ **Product Navigation**
- Click any product card
- Should navigate to product page
- Modal should close

✅ **Category Filter**
- In search results, click category pill
- Should navigate to category page
- Modal should close

✅ **Keyboard Support**
- Press Escape while modal is open
- Modal should close

✅ **Backdrop Click**
- Click gray area outside modal
- Modal should close

✅ **Empty Search**
- Type gibberish like "asdfghjkl"
- Should show "No products found"

✅ **Mobile**
- Resize browser to mobile width
- Click hamburger menu
- Click "Search" button
- Modal should open and work same way

## ⚠️ Common Issues & Fixes

### "SearchModal is not defined"
**Fix:** Make sure file is in `apps/web/src/components/search/SearchModal.tsx`

### Modal doesn't open
**Fix:** 
```bash
# Clear cache and rebuild
rm -rf apps/web/.next
pnpm dev
```

### Search not working
**Fix:** Check backend is running
```bash
# In another terminal
cd apps/api
npm run dev
# Should be on port 5001
```

### No results appearing
**Fix:** Check network tab
1. Open DevTools (F12)
2. Go to Network tab
3. Type in search
4. Should see `/api/v1/products?search=...` request
5. Check response has `success: true` and `data: [...]`

## 📊 API Integration

**No changes needed!** ✅

Backend already supports:
```
GET /api/v1/products?search=keyword
Response: { success, data: ProductListItem[], meta }
```

## 🎨 Customization

### Change debounce time (300ms):
In `SearchModal.tsx` line ~35:
```typescript
const timer = setTimeout(() => {
  // Change 300 to 500 for slower debounce
}, 300);
```

### Change result limit (20 products):
In `SearchModal.tsx` line ~52:
```typescript
limit: 20,  // Change to 30, 50, etc.
```

### Change modal colors:
In `SearchModal.tsx`, find Tailwind classes:
```typescript
bg-brand-cream        // Background
text-brand-charcoal   // Text
text-brand-gold       // Accents
```

## 🔧 Dependencies

Already installed:
- ✅ React (useState, useEffect, useRef)
- ✅ Next.js (Link, navigation)
- ✅ Redux Toolkit (useAppDispatch, useAppSelector)
- ✅ RTK Query (useGetProductsQuery)
- ✅ Lucide React (icons)
- ✅ Tailwind CSS

No new packages needed!

## 📖 File Locations

```
/apps/web/src/
├── components/
│   ├── Navbar.tsx                    ← UPDATED
│   └── search/
│       └── SearchModal.tsx           ← NEW
└── lib/redux/slices/
    └── uiSlice.ts                    ← UPDATED
```

## ✅ Checklist

- [ ] Copy SearchModal.tsx to `components/search/`
- [ ] Copy uiSlice.ts to `lib/redux/slices/`
- [ ] Copy Navbar.tsx to `components/`
- [ ] Run `pnpm dev`
- [ ] Test search modal opens
- [ ] Test search works
- [ ] Test product navigation
- [ ] Test category filter
- [ ] Test keyboard support
- [ ] Test mobile view

## 🎉 Done!

Your search modal is ready to use. No backend changes needed, no new dependencies, fully integrated with Redux and RTK Query.

**Questions?** Check the detailed `IMPLEMENTATION_GUIDE.md` for more info.

---

**Everything is production-ready!** ✨
