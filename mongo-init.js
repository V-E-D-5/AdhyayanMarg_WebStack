// MongoDB initialization script
db = db.getSiblingDB('adhyayanmarg');

// Create application user
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'adhyayanmarg'
    }
  ]
});

// Create initial collections
db.createCollection('users');
db.createCollection('roadmaps');
db.createCollection('colleges');
db.createCollection('stories');
db.createCollection('faqs');
db.createCollection('quizresults');

// Insert initial admin user
db.users.insertOne({
  name: 'System Administrator',
  email: 'admin@adhyayanmarg.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8hQO.2nJ2a', // admin123
  role: 'admin',
  isActive: true,
  isVerified: true,
  createdAt: new Date(),
  lastLogin: null
});

print('Database initialized successfully!');
