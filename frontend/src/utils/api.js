import axios from "axios";
import toast from "react-hot-toast";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response time for debugging
    if (response.config.metadata) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(
        `API ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${duration}ms`
      );
    }

    // For quiz questions, log the response data
    if (response.config.url?.includes("/quiz/questions")) {
      console.log("Quiz questions API response:", response.data);
    }

    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("authToken");
          toast.error("Session expired. Please login again.");
          break;
        case 403:
          toast.error("Access denied. You do not have permission.");
          break;
        case 404:
          toast.error("Resource not found.");
          break;
        case 429:
          toast.error("Too many requests. Please try again later.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(data?.message || "An error occurred.");
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection.");
    } else {
      // Other error
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Quiz
  quiz: {
    questions: "/quiz/questions",
    submit: "/quiz",
    results: "/quiz/results",
  },

  // Roadmap
  roadmap: {
    list: "/roadmap",
    get: (course) => `/roadmap/${course}`,
    search: "/roadmap/search",
    categories: "/roadmap/categories",
  },

  // Colleges
  colleges: {
    list: "/colleges",
    get: (id) => `/colleges/${id}`,
    search: "/colleges/search",
    compare: "/colleges/compare",
    stats: "/colleges/stats",
  },

  // Stories
  stories: {
    list: "/stories",
    get: (id) => `/stories/${id}`,
    search: "/stories/search",
    featured: "/stories/featured",
    categories: "/stories/categories",
    like: (id) => `/stories/${id}/like`,
    comment: (id) => `/stories/${id}/comments`,
  },

  // FAQ
  faq: {
    list: "/faq",
    get: (id) => `/faq/${id}`,
    search: "/faq/search",
    categories: "/faq/categories",
    query: "/faq/query",
    aiProviders: "/faq/ai-providers",
    helpful: (id) => `/faq/${id}/helpful`,
  },

  // Analytics
  analytics: {
    dashboard: "/analytics",
    engagement: "/analytics/engagement",
    performance: "/analytics/performance",
    health: "/analytics/health",
    user: "/analytics/user",
    update: "/analytics/user/update",
    reset: "/analytics/user/reset",
  },

  // Admin
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    updateUserStatus: (userId) => `/admin/users/${userId}/status`,
    quizData: "/admin/quiz-data",
  },

  // Auth
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
    logout: "/auth/logout",
    verify: "/auth/verify",
  },
};

// API functions
export const apiService = {
  // Quiz
  getQuizQuestions: () => api.get(endpoints.quiz.questions),
  submitQuiz: (data) => api.post(endpoints.quiz.submit, data),
  getQuizResults: () => api.get(endpoints.quiz.results),

  // Roadmap
  getRoadmaps: (params) => api.get(endpoints.roadmap.list, { params }),
  getRoadmap: (course) => api.get(endpoints.roadmap.get(course)),
  searchRoadmaps: (params) => api.get(endpoints.roadmap.search, { params }),
  getRoadmapCategories: () => api.get(endpoints.roadmap.categories),

  // Colleges
  getColleges: (params) => api.get(endpoints.colleges.list, { params }),
  getCollege: (id) => api.get(endpoints.colleges.get(id)),
  searchColleges: (params) => api.get(endpoints.colleges.search, { params }),
  compareColleges: (data) => api.post(endpoints.colleges.compare, data),
  getCollegeStats: () => api.get(endpoints.colleges.stats),

  // Stories
  getStories: (params) => api.get(endpoints.stories.list, { params }),
  getStory: (id) => api.get(endpoints.stories.get(id)),
  searchStories: (params) => api.get(endpoints.stories.search, { params }),
  getFeaturedStories: (params) =>
    api.get(endpoints.stories.featured, { params }),
  getStoryCategories: () => api.get(endpoints.stories.categories),
  likeStory: (id) => api.post(endpoints.stories.like(id)),
  addComment: (id, data) => api.post(endpoints.stories.comment(id), data),

  // FAQ
  getFaqs: (params) => api.get(endpoints.faq.list, { params }),
  getFaq: (id) => api.get(endpoints.faq.get(id)),
  searchFaqs: (params) => api.get(endpoints.faq.search, { params }),
  getFaqCategories: () => api.get(endpoints.faq.categories),
  submitFaqQuery: (data) => api.post(endpoints.faq.query, data),
  getAIProviders: () => api.get(endpoints.faq.aiProviders),
  markFaqHelpful: (id, data) => api.post(endpoints.faq.helpful(id), data),

  // Analytics
  getAnalytics: () => api.get(endpoints.analytics.dashboard),
  getUserEngagement: (params) =>
    api.get(endpoints.analytics.engagement, { params }),
  getContentPerformance: () => api.get(endpoints.analytics.performance),
  getSystemHealth: () => api.get(endpoints.analytics.health),
  getUserAnalytics: () => api.get(endpoints.analytics.user),
  updateUserAnalytics: (data) => api.post(endpoints.analytics.update, data),
  resetUserAnalytics: () => api.post(endpoints.analytics.reset),

  // Auth
  login: (credentials) => api.post(endpoints.auth.login, credentials),
  register: (userData) => api.post(endpoints.auth.register, userData),
  getCurrentUser: () => api.get(endpoints.auth.me),
  logout: () => api.post(endpoints.auth.logout),
  verifyToken: (token) => api.post(endpoints.auth.verify, { token }),

  // Admin
  getAdminDashboard: () => api.get(endpoints.admin.dashboard),
  getAdminUsers: (params) => api.get(endpoints.admin.users, { params }),
  updateUserStatus: (userId, data) =>
    api.patch(endpoints.admin.updateUserStatus(userId), data),
  getAdminQuizData: () => api.get(endpoints.admin.quizData),
};

export default api;
