# 🧹 CODE CLEANUP REQUIRED

## 1. Remove Unused Imports

```javascript
// frontend/src/App.jsx
// Remove line 13:
const UnifiedLogin = React.lazy(() => import("./pages/UnifiedLogin"));

// Fix route on line 30:
<Route path="/login" element={<Login />} />; // Use Login, not UnifiedLogin
```

## 2. Fix Dead Code

```javascript
// backend/src/routes/auth.js
// Remove lines 214-218 and replace with:
const user = await User.findById(req.user.id);
```

## 3. Standardize Naming

```javascript
// Use consistent camelCase throughout:
const isDbConnected = () => { ... }
const ensureDbConnection = () => { ... }
const getDbStatus = () => { ... }
```

## 4. Remove Unused Files

```bash
# These files can be deleted:
- backend/.env.backup*
- backend/.env.local
- All migration scripts (migrate-to-azure.sh, etc.)
- test files that are no longer needed
```

## 5. Add Missing Imports

```javascript
// backend/src/routes/auth.js - Add missing import:
const { isDbConnected } = require("../utils/database");
```
