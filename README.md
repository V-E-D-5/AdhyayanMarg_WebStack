# Career Guidance Platform

A comprehensive full-stack career guidance platform built with React, Node.js, and Express.js. This project consists of two separate microservices: a frontend React application and a backend API service.

## 🏗️ Project Structure

```
SIH/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Node.js + Express.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (optional - runs with dummy data if not connected)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp env.example .env
   ```

4. Update `.env` with your configuration:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/career-guidance
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp env.example .env
   ```

4. Update `.env` with your configuration:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Career Guidance Platform
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 📁 Project Features

### Frontend Features

- **Home Page**: Landing page with feature overview and call-to-action
- **Know-Me**: Interactive assessment with personality analysis
- **Roadmap**: Detailed career path guides with timelines
- **Colleges**: College finder with comparison functionality
- **Success Stories**: Alumni stories and testimonials
- **Chatbot**: AI-powered career guidance assistant
- **Dashboard**: Analytics and insights (admin view)
- **Multi-language Support**: English and Hindi
- **Offline Support**: PWA with service worker
- **Responsive Design**: Mobile-first approach

### Backend Features

- **RESTful API**: Well-structured endpoints
- **Quiz System**: Career assessment with scoring
- **Roadmap Management**: Course and career path data
- **College Database**: Comprehensive college information
- **Story Management**: User-generated content
- **FAQ System**: Chatbot knowledge base
- **Analytics**: Usage statistics and insights
- **CORS Support**: Cross-origin resource sharing
- **Error Handling**: Comprehensive error management
- **Logging**: Request and error logging

## 🛠️ Technology Stack

### Frontend

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **Framer Motion**: Animation library
- **React i18next**: Internationalization
- **Recharts**: Data visualization
- **Lucide React**: Icon library

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **Morgan**: HTTP request logger
- **Joi**: Data validation
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication

## 📊 API Endpoints

### Quiz

- `POST /api/quiz` - Submit quiz results
- `GET /api/quiz/results` - Get user quiz results

### Roadmap

- `GET /api/roadmap` - Get all roadmaps
- `GET /api/roadmap/:course` - Get specific roadmap
- `GET /api/roadmap/search` - Search roadmaps
- `GET /api/roadmap/categories` - Get categories

### Colleges

- `GET /api/colleges` - Get all colleges
- `GET /api/colleges/:id` - Get specific college
- `GET /api/colleges/search` - Search colleges
- `POST /api/colleges/compare` - Compare colleges
- `GET /api/colleges/stats` - Get statistics

### Stories

- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get specific story
- `GET /api/stories/search` - Search stories
- `GET /api/stories/featured` - Get featured stories
- `POST /api/stories/:id/like` - Like a story
- `POST /api/stories/:id/comments` - Add comment

### FAQ

- `GET /api/faq` - Get all FAQs
- `GET /api/faq/:id` - Get specific FAQ
- `GET /api/faq/search` - Search FAQs
- `POST /api/faq/query` - Submit chatbot query
- `POST /api/faq/:id/helpful` - Mark FAQ as helpful

### Analytics

- `GET /api/analytics` - Get dashboard data
- `GET /api/analytics/engagement` - Get engagement metrics
- `GET /api/analytics/performance` - Get performance data
- `GET /api/analytics/health` - Get system health

## 🗄️ Database Models

### User

- Personal information and preferences
- Quiz results and progress
- Authentication data

### QuizResult

- User answers and scores
- Personality analysis
- Recommended courses

### Roadmap

- Course information and timelines
- Career paths and resources
- Market demand data

### College

- Institution details and rankings
- Courses and facilities
- Placement statistics

### Story

- Alumni success stories
- Career journeys and advice
- User engagement metrics

### FAQ

- Question and answer pairs
- Categories and tags
- Helpfulness ratings

## 🌐 Deployment

### Backend Deployment

1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or AWS
4. Set up CORS for frontend domain

### Frontend Deployment

1. Build the production bundle: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Configure environment variables
4. Set up custom domain (optional)

## 🔧 Development

### Code Structure

- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Hooks**: Custom React hooks
- **Utils**: Helper functions and utilities
- **Services**: API integration
- **Context**: Global state management

### Best Practices

- Component-based architecture
- Responsive design principles
- Accessibility considerations
- Performance optimization
- Error boundary implementation
- Code splitting and lazy loading

## 📱 PWA Features

- **Offline Support**: Service worker caching
- **Installable**: Add to home screen
- **Responsive**: Works on all devices
- **Fast Loading**: Optimized assets
- **Background Sync**: Data synchronization

## 🌍 Internationalization

- **English**: Default language
- **Hindi**: Full translation support
- **Extensible**: Easy to add more languages
- **RTL Support**: Right-to-left text support

## 🔒 Security

- **CORS**: Cross-origin protection
- **Helmet**: Security headers
- **Rate Limiting**: Request throttling
- **Input Validation**: Data sanitization
- **Error Handling**: Secure error messages

## 📈 Performance

- **Code Splitting**: Lazy loading
- **Image Optimization**: WebP support
- **Caching**: Browser and service worker
- **Bundle Analysis**: Webpack bundle analyzer
- **Lighthouse**: Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the API endpoints
- Test with the provided dummy data

## 🎯 Future Enhancements

- User authentication and profiles
- Real-time notifications
- Advanced analytics dashboard
- Mobile app development
- AI-powered recommendations
- Video content integration
- Social features and communities
- Payment integration for premium features

---

**Note**: This project uses dummy data for demonstration purposes. Connect to MongoDB Atlas for production use by adding your connection string to the environment variables.
