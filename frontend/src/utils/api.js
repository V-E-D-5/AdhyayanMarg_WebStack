import axios from "axios";
import toast from "react-hot-toast";

// Simple cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 30 * 1000; // 30 seconds

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 8000, // Reduced from 10 seconds to 8 seconds
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

    // Add cache busting headers for quiz data requests
    if (config.url?.includes("/admin/quiz-data")) {
      config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      config.headers["Pragma"] = "no-cache";
      config.headers["Expires"] = "0";
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
          // Only show toast for 401 errors that are not from login attempts
          // Login 401 errors should be handled by the component, not the interceptor
          if (!error.config?.url?.includes("/auth/login")) {
            localStorage.removeItem("authToken");
            toast.error("Session expired. Please login again.");
          }
          break;
        case 403:
          // Don't show automatic toast for 403 - let components handle it
          console.warn("Access denied for:", error.config?.url);
          break;
        case 404:
          // Don't show automatic toast for 404 - let components handle it
          console.warn("Resource not found:", error.config?.url);
          break;
        case 429:
          toast.error("Too many requests. Please try again later.");
          break;
        case 500:
          // Don't show automatic toast for 500 - let components handle it
          console.warn("Server error for:", error.config?.url);
          break;
        default:
          // Don't show automatic toast for other errors - let components handle it
          console.warn("API error for:", error.config?.url, data?.message);
      }
    } else if (error.request) {
      // Network error - don't show automatic toasts, let components handle their own errors
      console.warn("Network error for:", error.config?.url, error.message);
      // Components will handle their own error messages
    } else {
      // Other error - don't show automatic toasts
      console.warn("API error:", error.message);
      // Components will handle their own error messages
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
    createUser: "/admin/users",
    updateUserStatus: (userId) => `/admin/users/${userId}/status`,
    resetUserPassword: (userId) => `/admin/users/${userId}/password`,
    deleteUser: (userId) => `/admin/users/${userId}`,
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

  // Mentor
  mentor: {
    students: "/mentor/students",
    assignedStudents: "/mentor/assigned-students",
    assignStudents: "/mentor/assign-students",
    unassignStudents: "/mentor/unassign-students",
    sendMessage: "/mentor/send-message",
    dashboardStats: "/mentor/dashboard-stats",
    studentProfile: (studentId) => `/mentor/student/${studentId}/profile`,
    studentAptitude: (studentId) => `/mentor/student/${studentId}/aptitude`,
    careerRecommendations: (studentId) =>
      `/mentor/student/${studentId}/career-recommendations`,
    guidanceSession: "/mentor/guidance-session",
    performanceFeedback: "/mentor/performance-feedback",
    analytics: "/mentor/analytics",
    studentTimeline: (studentId) => `/mentor/student/${studentId}/timeline`,
    sessions: "/mentor/sessions",
    messages: "/mentor/messages",
    sendMessageToStudent: "/mentor/send-message-to-student",
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

  // Admin with caching
  getAdminDashboard: () => {
    const cacheKey = "admin-dashboard";
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return Promise.resolve(cached.response);
    }
    return api.get(endpoints.admin.dashboard).then((response) => {
      apiCache.set(cacheKey, { response, timestamp: Date.now() });
      return response;
    });
  },
  getAdminUsers: (params) => api.get(endpoints.admin.users, { params }),
  updateUserStatus: (userId, data) =>
    api.patch(endpoints.admin.updateUserStatus(userId), data),
  resetUserPassword: (userId, data) =>
    api.patch(endpoints.admin.resetUserPassword(userId), data),
  deleteUser: (userId, data) =>
    api.delete(endpoints.admin.deleteUser(userId), { data }),
  getAdminQuizData: (forceRefresh = false) => {
    const url = forceRefresh
      ? `${endpoints.admin.quizData}?t=${Date.now()}`
      : endpoints.admin.quizData;
    return api.get(url);
  },
  createUser: (userData) => api.post(endpoints.admin.createUser, userData),

  // Mentor
  getMentorStudents: (params) => api.get(endpoints.mentor.students, { params }),
  getMentorAssignedStudents: () => api.get(endpoints.mentor.assignedStudents),
  assignStudents: (data) => api.post(endpoints.mentor.assignStudents, data),
  unassignStudents: (data) => api.post(endpoints.mentor.unassignStudents, data),
  sendMessageToStudents: (data) => api.post(endpoints.mentor.sendMessage, data),
  getMentorDashboardStats: () => api.get(endpoints.mentor.dashboardStats),

  // New mentor functionalities
  getStudentProfile: (studentId) =>
    api.get(endpoints.mentor.studentProfile(studentId)),
  getStudentAptitude: (studentId) =>
    api.get(endpoints.mentor.studentAptitude(studentId)),
  getCareerRecommendations: (studentId) =>
    api.get(endpoints.mentor.careerRecommendations(studentId)),
  recordGuidanceSession: (data) =>
    api.post(endpoints.mentor.guidanceSession, data),
  submitPerformanceFeedback: (data) =>
    api.post(endpoints.mentor.performanceFeedback, data),

  // Enhanced mentor functionalities
  getMentorAnalytics: () => api.get(endpoints.mentor.analytics),
  getStudentTimeline: (studentId) =>
    api.get(endpoints.mentor.studentTimeline(studentId)),
  getSessionHistory: (params) => api.get(endpoints.mentor.sessions, { params }),
  getMessages: (params) => api.get(endpoints.mentor.messages, { params }),
  sendMessageToStudent: (data) =>
    api.post(endpoints.mentor.sendMessageToStudent, data),
};

export default api;
