#!/bin/bash

echo "🔧 Final fix for Azure Cosmos DB connection..."

# Azure connection string with correct database name
AZURE_URI="mongodb+srv://AdhyayanMargAdmin:TeDxE85wcWtfmq7Q0g%23C@adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com/adhyayanmarg?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"

# Create backup of current .env
if [ -f "backend/.env" ]; then
    cp backend/.env backend/.env.backup3.$(date +%Y%m%d-%H%M%S)
    echo "✅ Backed up current .env file"
fi

# Create new .env file with correct database name
cat > backend/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration - Azure Cosmos DB
MONGODB_URI=$AZURE_URI

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-this-very-long-and-random
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# AI Service Configuration (Optional - for enhanced responses)
# GEMINI_API_KEY=your_gemini_api_key_here
# OPENAI_API_KEY=your_openai_api_key_here
# DEEPSEEK_API_KEY=your_deepseek_api_key_here
EOF

echo "✅ Updated backend/.env with correct database name (adhyayanmarg)"
echo "🎉 Final fix applied!"
echo ""
echo "🚀 Next steps:"
echo "  1. Restart your backend: pkill -f 'npm run dev' && cd backend && npm run dev"
echo "  2. Test the connection - it should now connect to the adhyayanmarg database"

