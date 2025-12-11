#!/bin/bash

# Azure VM MongoDB Setup Script
echo "🚀 Setting up MongoDB on Azure VM - Never Stops Running..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install MongoDB
echo "🔧 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org

# Configure MongoDB for remote access
echo "⚙️ Configuring MongoDB for 24/7 operation..."
sudo sed -i 's/bindIp: 127.0.0.1/bindIp: 0.0.0.0/' /etc/mongod.conf

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Wait for MongoDB to start
sleep 5

# Create application database and user
echo "👤 Creating application user..."
mongosh --eval "
use adhyayanmarg;
db.createUser({
  user: 'app_user',
  pwd: 'azure_secure_password_2024',
  roles: [{ role: 'readWrite', db: 'adhyayanmarg' }]
});

// Create admin user
db.createUser({
  user: 'admin',
  pwd: 'admin_secure_password_2024',
  roles: [
    { role: 'userAdminAnyDatabase', db: 'admin' },
    { role: 'dbAdminAnyDatabase', db: 'admin' },
    { role: 'readWriteAnyDatabase', db: 'admin' }
  ]
});

// Create initial collections
db.createCollection('users');
db.createCollection('roadmaps');
db.createCollection('colleges');
db.createCollection('stories');
db.createCollection('faqs');
db.createCollection('quizresults');

// Insert admin user
db.users.insertOne({
  name: 'System Administrator',
  email: 'admin@adhyayanmarg.com',
  password: '\$2a\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8hQO.2nJ2a',
  role: 'admin',
  isActive: true,
  isVerified: true,
  createdAt: new Date(),
  lastLogin: null
});

print('✅ Database setup complete!');
"

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me)

echo ""
echo "🎉 Azure VM MongoDB setup completed!"
echo ""
echo "📋 Connection Information:"
echo "   Public IP: $PUBLIC_IP"
echo "   Port: 27017"
echo ""
echo "🔗 Connection Strings:"
echo "   App User: mongodb://app_user:azure_secure_password_2024@$PUBLIC_IP:27017/adhyayanmarg"
echo "   Admin User: mongodb://admin:admin_secure_password_2024@$PUBLIC_IP:27017/adhyayanmarg?authSource=admin"
echo ""
echo "🛡️ Your MongoDB runs 24/7 without auto-pause!"

