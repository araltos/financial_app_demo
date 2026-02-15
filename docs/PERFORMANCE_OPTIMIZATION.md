# Performance Optimization - FinTrack Demo

## Frontend Optimizations Implemented

### 1. Client-Side Caching (Dashboard)
**Implementation:** Dashboard data caching for `/api/subscriptions`
- **Cache Duration:** 60 seconds
- **Storage:** Browser `localStorage`
- **Benefit:** Reduces repeated API calls when navigating between pages
- **Invalidation:** Cache is cleared after a new CSV upload (Dashboard reloads fresh data)

**Code location:** `src/pages/Dashboard.tsx` (`loadData` and `renderDashboard`)

### 2. Currency Preference Optimization
**Implementation:** User currency preference stored locally
- **Storage:** Browser `localStorage` key `currency`
- **Usage:** Dashboard reads the saved currency and displays correct symbol (`$`, `€`, `£`)
- **Benefit:** Instant currency changes without extra backend calls

**Code location:** `src/pages/Settings.tsx` and `src/pages/Dashboard.tsx`

### 3. Build & Asset Optimization
- **Build tool:** Vite (ES modules, fast dev server, optimized production build)
- **Features:**
  - Automatic code splitting
  - Tree-shaking unused code
  - Minification for JS/CSS

To view bundle stats:
```bash
npm run build