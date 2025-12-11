# 🗄️ MongoDB Setup Guide for AdhyayanMarg

## 🎯 **Goal**: Persistent MongoDB Connection with Auto-Reconnection

Your application is now configured to:

- ✅ **Connect directly to MongoDB** (no dummy mode)
- ✅ **Auto-reconnect** if connection drops
- ✅ **Maintain persistent connections** with connection pooling
- ✅ **Monitor database health** with enhanced health checks

## 🚀 **Quick Start Options**

### **Option 1: Local MongoDB with Docker (Recommended)**

```bash
# Start MongoDB with Docker
cd /home/lalith/testcase1/AdhyayanMarg_WebStack
./start-mongodb.sh

# Start your application
cd backend && npm run dev
```

**Benefits:**

- ✅ Fully persistent and reliable
- ✅ No external dependencies
- ✅ Automatic restarts
- ✅ Database management UI included

### **Option 2: Fix MongoDB Atlas**

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Resume your cluster** (free tier auto-pauses)
3. **Add IP to whitelist**: `152.57.130.186`
4. **Reset database user password**
5. **Update connection string** in `.env`

## 🔧 **Enhanced Features Implemented**

### **1. Persistent Connection Manager**

- **Connection Pooling**: 5-10 concurrent connections
- **Auto-Reconnection**: Exponential backoff retry logic
- **Health Monitoring**: Real-time connection status
- **Graceful Shutdown**: Clean disconnection on exit

### **2. Database Configuration**

```javascript
// Connection Options
{
  maxPoolSize: 10,              // Connection pool size
  minPoolSize: 5,               // Minimum connections
  serverSelectionTimeoutMS: 5000,    // Server selection timeout
  connectTimeoutMS: 10000,           // Connection timeout
  socketTimeoutMS: 45000,            // Socket timeout
  maxIdleTimeMS: 30000,              // Idle connection timeout
  heartbeatFrequencyMS: 10000,       // Health check frequency
  retryWrites: true,                 // Retry failed writes
  retryReads: true                   // Retry failed reads
}
```

### **3. Health Check Endpoint**

```bash
curl http://localhost:5000/health
```

**Response includes:**

- Database connection status
- Connection pool information
- Retry attempts count
- Host and port details

### **4. Automatic Reconnection**

- **Exponential Backoff**: 5s, 10s, 20s, 30s delays
- **Maximum Retries**: 10 attempts
- **Event-Driven**: Responds to connection events
- **Graceful Recovery**: Maintains application state

## 📊 **Monitoring & Management**

### **Database Management UI**

- **URL**: http://localhost:8081
- **Admin**: admin/admin123
- **Features**: Browse collections, run queries, manage data

### **Health Monitoring**

```bash
# Check application health
curl http://localhost:5000/health | jq '.database'

# Check MongoDB container
docker ps | grep mongodb

# View MongoDB logs
docker logs adhyayanmarg-mongodb
```

## 🔄 **Connection Lifecycle**

1. **Startup**: Attempts connection with retry logic
2. **Connected**: Maintains connection pool
3. **Disconnected**: Automatically starts reconnection
4. **Reconnected**: Resumes normal operations
5. **Shutdown**: Gracefully closes all connections

## 🛠️ **Troubleshooting**

### **Connection Issues**

```bash
# Test MongoDB connection
docker exec adhyayanmarg-mongodb mongosh --eval "db.adminCommand('ping')"

# Check container status
docker ps -a | grep mongodb

# View connection logs
docker logs adhyayanmarg-mongodb --tail 50
```

### **Application Issues**

```bash
# Check application logs
cd backend && npm run dev

# Test health endpoint
curl http://localhost:5000/health

# Verify environment
cat backend/.env | grep MONGODB_URI
```

## 🎉 **Benefits of This Setup**

- **✅ No Dummy Mode**: Direct MongoDB connection only
- **✅ Persistent Storage**: Data survives restarts
- **✅ Auto-Recovery**: Handles network issues gracefully
- **✅ Connection Pooling**: Efficient resource usage
- **✅ Health Monitoring**: Real-time status tracking
- **✅ Easy Management**: Docker-based setup
- **✅ Development Ready**: Includes management UI

## 🚀 **Next Steps**

1. **Choose your setup** (Docker or Atlas)
2. **Run the startup script** or fix Atlas credentials
3. **Start your application** with `npm run dev`
4. **Verify connection** with health check endpoint
5. **Test persistence** by creating users/data

Your application will now maintain a robust, persistent connection to MongoDB with automatic reconnection capabilities!

