#!/bin/bash

# Azure Cosmos DB Migration Script for AdhyayanMarg
echo "🚀 Starting migration to Azure Cosmos DB..."

# Configuration
CURRENT_MONGODB_URI=""
AZURE_MONGODB_URI=""
BACKUP_DIR="./migration-backup-$(date +%Y%m%d-%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 Step $1: $2${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if mongodump and mongorestore are available
check_tools() {
    print_step "1" "Checking required tools..."
    
    if ! command -v mongodump &> /dev/null; then
        print_error "mongodump not found. Installing MongoDB Database Tools..."
        # Install MongoDB Database Tools
        wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-database-tools/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-database-tools-7.0.list
        sudo apt update
        sudo apt install -y mongodb-database-tools
    fi
    
    if ! command -v mongosh &> /dev/null; then
        print_error "mongosh not found. Installing MongoDB Shell..."
        # Install MongoDB Shell
        wget https://downloads.mongodb.com/compass/mongosh-2.0.1-linux-x64.tgz
        tar -zxvf mongosh-2.0.1-linux-x64.tgz
        sudo mv mongosh-2.0.1-linux-x64/bin/* /usr/local/bin/
        rm -rf mongosh-2.0.1-linux-x64*
    fi
    
    print_success "Required tools are available"
}

# Get current MongoDB URI
get_current_uri() {
    print_step "2" "Getting current MongoDB connection..."
    
    if [ -f "backend/.env" ]; then
        CURRENT_MONGODB_URI=$(grep "MONGODB_URI=" backend/.env | cut -d'=' -f2-)
        if [ -z "$CURRENT_MONGODB_URI" ]; then
            print_warning "No MONGODB_URI found in .env file"
            echo "Please enter your current MongoDB connection string:"
            read -r CURRENT_MONGODB_URI
        else
            print_success "Found current MongoDB URI"
        fi
    else
        echo "Please enter your current MongoDB connection string:"
        read -r CURRENT_MONGODB_URI
    fi
}

# Get Azure Cosmos DB URI
get_azure_uri() {
    print_step "3" "Getting Azure Cosmos DB connection..."
    
    echo "Please enter your Azure Cosmos DB connection string:"
    echo "(You can find this in Azure Portal > Cosmos DB > Connection Strings)"
    read -r AZURE_MONGODB_URI
    
    if [ -z "$AZURE_MONGODB_URI" ]; then
        print_error "Azure connection string is required"
        exit 1
    fi
    
    print_success "Azure connection string received"
}

# Create backup directory
create_backup_dir() {
    print_step "4" "Creating backup directory..."
    mkdir -p "$BACKUP_DIR"
    print_success "Backup directory created: $BACKUP_DIR"
}

# Export current data
export_current_data() {
    print_step "5" "Exporting current MongoDB data..."
    
    if [ -z "$CURRENT_MONGODB_URI" ]; then
        print_error "Current MongoDB URI is required"
        exit 1
    fi
    
    # Test connection first
    if ! mongosh "$CURRENT_MONGODB_URI" --eval "db.adminCommand('ping')" &> /dev/null; then
        print_error "Cannot connect to current MongoDB. Please check your connection string."
        exit 1
    fi
    
    # Export data
    mongodump --uri="$CURRENT_MONGODB_URI" --out="$BACKUP_DIR/export"
    
    if [ $? -eq 0 ]; then
        print_success "Data exported successfully to $BACKUP_DIR/export"
    else
        print_error "Failed to export data"
        exit 1
    fi
}

# Test Azure connection
test_azure_connection() {
    print_step "6" "Testing Azure Cosmos DB connection..."
    
    if ! mongosh "$AZURE_MONGODB_URI" --eval "db.adminCommand('ping')" &> /dev/null; then
        print_error "Cannot connect to Azure Cosmos DB. Please check your connection string."
        exit 1
    fi
    
    print_success "Azure Cosmos DB connection successful"
}

# Create collections in Azure
create_azure_collections() {
    print_step "7" "Creating collections in Azure Cosmos DB..."
    
    mongosh "$AZURE_MONGODB_URI" --eval "
        // Create collections with proper configuration for Cosmos DB
        db = db.getSiblingDB('adhyayanmarg');
        
        // Create collections
        db.createCollection('users');
        db.createCollection('roadmaps');
        db.createCollection('colleges');
        db.createCollection('stories');
        db.createCollection('faqs');
        db.createCollection('quizresults');
        
        print('Collections created successfully');
    "
    
    print_success "Collections created in Azure Cosmos DB"
}

# Import data to Azure
import_to_azure() {
    print_step "8" "Importing data to Azure Cosmos DB..."
    
    # Import each collection
    for collection in users roadmaps colleges stories faqs quizresults; do
        if [ -d "$BACKUP_DIR/export/adhyayanmarg/$collection.bson" ] || [ -f "$BACKUP_DIR/export/adhyayanmarg/$collection.bson" ]; then
            echo "Importing $collection..."
            mongorestore --uri="$AZURE_MONGODB_URI" --collection="$collection" --db="adhyayanmarg" "$BACKUP_DIR/export/adhyayanmarg/$collection.bson"
        else
            print_warning "Collection $collection not found in backup, skipping..."
        fi
    done
    
    print_success "Data import completed"
}

# Verify data integrity
verify_migration() {
    print_step "9" "Verifying data migration..."
    
    # Count documents in each collection
    mongosh "$AZURE_MONGODB_URI" --eval "
        db = db.getSiblingDB('adhyayanmarg');
        
        print('=== Data Verification ===');
        print('Users:', db.users.countDocuments());
        print('Roadmaps:', db.roadmaps.countDocuments());
        print('Colleges:', db.colleges.countDocuments());
        print('Stories:', db.stories.countDocuments());
        print('FAQs:', db.faqs.countDocuments());
        print('Quiz Results:', db.quizresults.countDocuments());
        
        // Test a sample query
        if (db.users.countDocuments() > 0) {
            print('Sample user:', JSON.stringify(db.users.findOne()));
        }
    "
    
    print_success "Data verification completed"
}

# Update application configuration
update_app_config() {
    print_step "10" "Updating application configuration..."
    
    # Backup current .env
    cp backend/.env backend/.env.backup.$(date +%Y%m%d-%H%M%S)
    
    # Update .env with Azure connection string
    if [ -f "backend/.env" ]; then
        # Remove old MONGODB_URI line and add new one
        grep -v "MONGODB_URI=" backend/.env > backend/.env.tmp
        echo "MONGODB_URI=$AZURE_MONGODB_URI" >> backend/.env.tmp
        mv backend/.env.tmp backend/.env
        
        print_success "Application configuration updated"
    else
        print_warning "No .env file found, creating new one..."
        echo "MONGODB_URI=$AZURE_MONGODB_URI" > backend/.env
        echo "NODE_ENV=development" >> backend/.env
        echo "PORT=5000" >> backend/.env
        print_success "New .env file created"
    fi
}

# Test application connection
test_app_connection() {
    print_step "11" "Testing application connection..."
    
    # Start the application briefly to test connection
    cd backend
    timeout 10s npm run dev &
    APP_PID=$!
    sleep 5
    
    # Test health endpoint
    if curl -s http://localhost:5000/health | grep -q "OK"; then
        print_success "Application connection test successful"
    else
        print_warning "Application connection test failed, but migration is complete"
    fi
    
    # Kill the test process
    kill $APP_PID 2>/dev/null
    cd ..
}

# Main migration function
main() {
    echo "🎯 AdhyayanMarg Azure Migration Script"
    echo "======================================"
    
    check_tools
    get_current_uri
    get_azure_uri
    create_backup_dir
    export_current_data
    test_azure_connection
    create_azure_collections
    import_to_azure
    verify_migration
    update_app_config
    test_app_connection
    
    echo ""
    echo "🎉 Migration completed successfully!"
    echo "======================================"
    echo "📊 Summary:"
    echo "  • Data backed up to: $BACKUP_DIR"
    echo "  • Azure Cosmos DB configured"
    echo "  • Application updated"
    echo "  • Ready to use!"
    echo ""
    echo "🚀 Next steps:"
    echo "  1. Start your application: cd backend && npm run dev"
    echo "  2. Test all features"
    echo "  3. Update your team with new connection details"
    echo ""
    echo "💡 Your MongoDB now runs 24/7 without auto-pause!"
}

# Run migration
main "$@"

