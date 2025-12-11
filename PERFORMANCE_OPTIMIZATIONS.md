# ⚡ PERFORMANCE OPTIMIZATIONS

## 1. Database Query Optimization

```javascript
// backend/src/controllers/analyticsController.js
// Replace multiple queries with aggregation:
const userStats = await User.aggregate([
  {
    $group: {
      _id: "$role",
      count: { $sum: 1 },
      active: { $sum: { $cond: ["$isActive", 1, 0] } },
      verified: { $sum: { $cond: ["$isVerified", 1, 0] } },
    },
  },
]);

// Convert to object format
const stats = userStats.reduce((acc, stat) => {
  acc[stat._id] = {
    total: stat.count,
    active: stat.active,
    verified: stat.verified,
  };
  return acc;
}, {});
```

## 2. Add Database Indexes

```javascript
// backend/src/models/User.js
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// backend/src/models/QuizResult.js
quizResultSchema.index({ userId: 1, submittedAt: -1 });
quizResultSchema.index({ sessionId: 1 });
```

## 3. Frontend Bundle Optimization

```javascript
// frontend/src/App.jsx - Already using lazy loading ✅
const Home = React.lazy(() => import("./pages/Home"));
const Quiz = React.lazy(() => import("./pages/Quiz"));

// Add React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Use dynamic imports for heavy libraries
const loadChart = () => import("recharts").then((module) => module.BarChart);
```

## 4. API Response Caching

```javascript
// backend/src/middleware/cache.js
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached) {
      return res.json(cached);
    }

    res.sendResponse = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.sendResponse(body);
    };

    next();
  };
};
```

