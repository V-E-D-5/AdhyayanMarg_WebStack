#!/bin/bash

echo "🚀 Updating AdhyayanMarg to use Azure Cosmos DB..."

# Azure connection string (URL encoded password)
AZURE_URI="mongodb+srv://AdhyayanMargAdmin:%3CTeDxE85wcWtfmq7Q0g%23C%3E@adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"

# Create backup of current .env
if [ -f "backend/.env" ]; then
    cp backend/.env backend/.env.backup.$(date +%Y%m%d-%H%M%S)
    echo "✅ Backed up current .env file"
fi

# Create new .env file
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

echo "✅ Updated backend/.env with Azure Cosmos DB connection"
echo "🎉 Migration complete! Your application now uses Azure Cosmos DB"
echo ""
echo "🚀 Next steps:"
echo "  1. Start your backend: cd backend && npm run dev"
echo "  2. Test your application"
echo "  3. Your MongoDB now runs 24/7 without auto-pause!"

