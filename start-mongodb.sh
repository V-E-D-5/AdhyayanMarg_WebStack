#!/bin/bash

# MongoDB Startup Script for AdhyayanMarg
echo "🚀 Starting MongoDB for AdhyayanMarg..."

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "✅ Docker found"
    
    # Check if Docker daemon is running
    if docker info &> /dev/null; then
        echo "✅ Docker daemon is running"
        
        # Start MongoDB with Docker Compose
        echo "🔄 Starting MongoDB with Docker..."
        cd /home/lalith/testcase1/AdhyayanMarg_WebStack
        docker-compose up -d mongodb
        
        # Wait for MongoDB to be ready
        echo "⏳ Waiting for MongoDB to be ready..."
        sleep 10
        
        # Test connection
        if docker exec adhyayanmarg-mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            echo "✅ MongoDB is ready!"
            echo "📊 Database: adhyayanmarg"
            echo "👤 Admin User: admin/admin123"
            echo "👤 App User: app_user/app_password"
            echo "🌐 MongoDB Express: http://localhost:8081"
            
            # Switch to local configuration
            echo "🔄 Switching to local MongoDB configuration..."
            cp backend/.env.local backend/.env
            
            echo "🎉 MongoDB setup complete!"
            echo "💡 To start your application:"
            echo "   cd backend && npm run dev"
            
        else
            echo "❌ MongoDB failed to start"
            exit 1
        fi
        
    else
        echo "❌ Docker daemon is not running"
        echo "💡 Please start Docker or run: sudo systemctl start docker"
        exit 1
    fi
    
else
    echo "❌ Docker not found"
    echo "💡 Please install Docker or use MongoDB Atlas"
    exit 1
fi

