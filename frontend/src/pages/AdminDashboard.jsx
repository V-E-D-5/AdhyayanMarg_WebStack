import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../utils/api";
import Button from "../components/UI/Button";
import {
  Shield,
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Eye,
  UserCheck,
  UserX,
  Globe,
  Smartphone,
  Laptop,
  Award,
  Target,
  Zap,
  Database,
  Settings,
  Bell,
  Mail,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Briefcase,
  Star,
  Heart,
  ThumbsUp,
  Download,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [lastQuizRefresh, setLastQuizRefresh] = useState(null);

  // Settings state
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationStatus: true,
    emailNotifications: true,
    passwordRequirements: true,
    twoFactorAuth: false,
    ipWhitelist: false,
    autoSaveResults: true,
    autoModerateStories: false,
    contentApprovalRequired: true,
    errorReporting: true,
    debugMode: false,
  });

  console.log("AdminDashboard rendered, user:", user);
  console.log("AdminDashboard loading state:", loading);

  // Check if user is admin
  if (user?.role !== "admin") {
    console.log("User is not admin, showing access denied");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log("AdminDashboard useEffect triggered");
    fetchDashboardData();
    fetchUsers();
    fetchQuizData();
  }, []);

  // Auto-refresh quiz data every 30 seconds when quiz tab is active
  useEffect(() => {
    if (activeTab === "quiz") {
      const interval = setInterval(() => {
        console.log("Auto-refreshing quiz data...");
        fetchQuizData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      const response = await apiService.getAdminDashboard();
      console.log("Dashboard data response:", response.data);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 503) {
        setError(
          "Database not connected. Please ensure MongoDB is running and properly configured."
        );
      } else {
        setError("Failed to load dashboard data");
      }
    }
  };

  const fetchUsers = async (page = 1, search = "", role = "", status = "") => {
    try {
      console.log("Fetching users...");
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(role && { role }),
        ...(status && { status }),
      };

      const response = await apiService.getAdminUsers(params);
      console.log("Users data response:", response.data);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 503) {
        setError(
          "Database not connected. Please ensure MongoDB is running and properly configured."
        );
      } else {
        setError("Failed to load users data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, searchTerm, roleFilter, statusFilter);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUsers(newPage, searchTerm, roleFilter, statusFilter);
  };

  const fetchQuizData = async () => {
    try {
      setQuizLoading(true);
      console.log("Fetching quiz data...");

      const response = await apiService.getAdminQuizData();
      console.log("Quiz data response:", response.data);

      if (response.data.success && response.data.data) {
        const backendData = response.data.data;

        // Map backend data structure to frontend expected structure
        const mappedData = {
          totalQuizzes: backendData.totalQuizzes || 0,
          guestQuizzes: backendData.guestQuizzes || 0,
          authenticatedQuizzes: backendData.authenticatedQuizzes || 0,
          personalityDistribution: {
            analytical: backendData.personalityDistribution?.Analyst || 0,
            creative: backendData.personalityDistribution?.Creator || 0,
            social: backendData.personalityDistribution?.Helper || 0,
            leadership: backendData.personalityDistribution?.Leader || 0,
            explorer: backendData.personalityDistribution?.Explorer || 0,
          },
          recentQuizzes: backendData.recentQuizzes || [],
          averageCompletionTime:
            backendData.quizStats?.averageCompletionTime || 0,
          totalAnswers: backendData.quizStats?.totalAnswers || 0,
          mostCommonPersonality:
            backendData.quizStats?.mostCommonPersonality || "analytical",
        };

        console.log("Mapped quiz data:", mappedData);
        setQuizData(mappedData);
        setLastQuizRefresh(new Date());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);

      // Set fallback data if API fails
      setQuizData({
        totalQuizzes: 0,
        guestQuizzes: 0,
        authenticatedQuizzes: 0,
        personalityDistribution: {
          analytical: 0,
          creative: 0,
          social: 0,
          leadership: 0,
          explorer: 0,
        },
        recentQuizzes: [],
        averageCompletionTime: 0,
        totalAnswers: 0,
        mostCommonPersonality: "analytical",
      });
    } finally {
      setQuizLoading(false);
    }
  };

  const handleUserStatusUpdate = async (userId, isActive) => {
    try {
      await apiService.updateUserStatus(userId, { isActive });
      // Refresh users list
      fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Toggle setting function
  const toggleSetting = (settingName) => {
    setSettings((prev) => ({
      ...prev,
      [settingName]: !prev[settingName],
    }));
  };

  // Toggle Button Component
  const ToggleButton = ({ isOn, onClick, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        isOn ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          isOn ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  // Skeleton Loading Component
  const SkeletonCard = ({ className = "" }) => (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
      </div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-40"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-8"></div>
      </div>
      <div className="h-72 bg-gray-200 dark:bg-gray-600 rounded"></div>
    </div>
  );

  const SkeletonStats = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-6"></div>
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-8"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-48"></div>
            </div>
            <div className="text-right">
              <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Show loading state with skeleton
  if (loading) {
    console.log("AdminDashboard showing skeleton loading state");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-64 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs Skeleton */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="-mb-px flex space-x-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2 py-2 px-1"
                  >
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overview Tab Skeleton */}
          <div className="space-y-8">
            {/* Key Metrics Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>

            {/* Charts Row Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SkeletonChart />
              <SkeletonStats />
            </div>

            {/* Recent Users Skeleton */}
            <SkeletonTable />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !dashboardData) {
    console.log("AdminDashboard showing error state");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Database Connection Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The admin dashboard requires a database connection to display
            real-time data. Please ensure MongoDB is properly configured and
            running.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchDashboardData();
                fetchUsers();
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 mr-2"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                setError(null);
                setDashboardData({
                  userStats: {
                    totalUsers: 0,
                    activeUsers: 0,
                    adminUsers: 0,
                    studentUsers: 0,
                    newUsersThisMonth: 0,
                    newUsersToday: 0,
                  },
                  userGrowth: [],
                  platformStats: {},
                  engagementData: [],
                  deviceData: [],
                  recentActivities: [],
                  recentUsers: [],
                });
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Continue with Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "users", name: "Users", icon: Users },
    { id: "quiz", name: "Quiz Data", icon: Target },
    { id: "analytics", name: "Analytics", icon: TrendingUp },
    { id: "content", name: "Content", icon: BookOpen },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  // Main dashboard content
  console.log("AdminDashboard rendering main content");
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user?.name}! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && dashboardData && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.userStats?.totalUsers || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />+
                      {dashboardData.userStats?.newUsersThisMonth || 0} this
                      month
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.userStats?.activeUsers || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                      <Activity className="w-3 h-3 mr-1" />
                      {Math.round(
                        (dashboardData.userStats?.activeUsers /
                          dashboardData.userStats?.totalUsers) *
                          100
                      ) || 0}
                      % of total
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      New Today
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.userStats?.newUsersToday || 0}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center mt-1">
                      <Zap className="w-3 h-3 mr-1" />
                      New registrations
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Quiz Submissions
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {quizData?.totalQuizzes || 0}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center mt-1">
                      <Target className="w-3 h-3 mr-1" />
                      {quizData?.authenticatedQuizzes || 0} detailed,{" "}
                      {quizData?.guestQuizzes || 0} mock
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    User Growth (6 Months)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      6M
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dashboardData.userGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="active"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Platform Stats */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Platform Statistics
                </h3>
                <div className="space-y-4">
                  {dashboardData.platformStats &&
                    Object.entries(dashboardData.platformStats).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Users
                </h3>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData.recentUsers?.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Management
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 dark:text-primary-400 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                user.isActive ? "bg-green-400" : "bg-gray-400"
                              }`}
                            ></div>
                            <span className="text-sm text-gray-900 dark:text-white capitalize">
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleUserStatusUpdate(user.id, !user.isActive)
                              }
                              className={`px-2 py-1 text-xs rounded ${
                                user.isActive
                                  ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
                                  : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                              }`}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(pagination.currentPage * 10, pagination.totalUsers)}{" "}
                  of {pagination.totalUsers} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-lg">
                    {pagination.currentPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quiz Data Tab */}
        {activeTab === "quiz" && (
          <div className="space-y-8">
            {quizLoading ? (
              <>
                {/* Quiz Statistics Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>

                {/* Charts Row Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <SkeletonChart />
                  <SkeletonChart />
                </div>

                {/* Insights Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>

                {/* Table Skeleton */}
                <SkeletonTable />
              </>
            ) : (
              <>
                {/* Quiz Data Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Quiz Analytics
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Track quiz submissions and user engagement
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={fetchQuizData}
                      disabled={quizLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {quizLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      <span>
                        {quizLoading ? "Refreshing..." : "Refresh Data"}
                      </span>
                    </button>
                    {lastQuizRefresh && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last updated: {lastQuizRefresh.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quiz Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Quizzes
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {quizData?.totalQuizzes || 0}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center mt-1">
                          <Target className="w-3 h-3 mr-1" />
                          All submissions
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Detailed Quizzes
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {quizData?.authenticatedQuizzes || 0}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Logged-in users
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                        <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Mock Quizzes
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {quizData?.guestQuizzes || 0}
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center mt-1">
                          <Users className="w-3 h-3 mr-1" />
                          Guest users
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Avg. Time
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {Math.round(quizData?.averageCompletionTime || 0)}s
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          Completion time
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personality Distribution Chart */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Personality Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={[
                            {
                              name: "Analytical",
                              value:
                                quizData?.personalityDistribution?.analytical ||
                                0,
                              color: "#3B82F6",
                            },
                            {
                              name: "Creative",
                              value:
                                quizData?.personalityDistribution?.creative ||
                                0,
                              color: "#8B5CF6",
                            },
                            {
                              name: "Social",
                              value:
                                quizData?.personalityDistribution?.social || 0,
                              color: "#10B981",
                            },
                            {
                              name: "Leadership",
                              value:
                                quizData?.personalityDistribution?.leadership ||
                                0,
                              color: "#F59E0B",
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            {
                              name: "Analytical",
                              value:
                                quizData?.personalityDistribution?.analytical ||
                                0,
                              color: "#3B82F6",
                            },
                            {
                              name: "Creative",
                              value:
                                quizData?.personalityDistribution?.creative ||
                                0,
                              color: "#8B5CF6",
                            },
                            {
                              name: "Social",
                              value:
                                quizData?.personalityDistribution?.social || 0,
                              color: "#10B981",
                            },
                            {
                              name: "Leadership",
                              value:
                                quizData?.personalityDistribution?.leadership ||
                                0,
                              color: "#F59E0B",
                            },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Quiz Type Distribution */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Quiz Type Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          {
                            name: "Mock Quiz",
                            value: quizData?.guestQuizzes || 0,
                            fill: "#3B82F6",
                          },
                          {
                            name: "Detailed Quiz",
                            value: quizData?.authenticatedQuizzes || 0,
                            fill: "#10B981",
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Additional Analysis Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personality Scores Breakdown */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Personality Scores Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          {
                            name: "Analytical",
                            score:
                              quizData?.personalityDistribution?.analytical ||
                              0,
                          },
                          {
                            name: "Creative",
                            score:
                              quizData?.personalityDistribution?.creative || 0,
                          },
                          {
                            name: "Social",
                            score:
                              quizData?.personalityDistribution?.social || 0,
                          },
                          {
                            name: "Leadership",
                            score:
                              quizData?.personalityDistribution?.leadership ||
                              0,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Completion Time Analysis */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Completion Time Analysis
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart
                        data={[
                          {
                            name: "Mock Quiz",
                            time: quizData?.averageCompletionTime
                              ? Math.round(quizData.averageCompletionTime * 0.6)
                              : 120,
                          },
                          {
                            name: "Detailed Quiz",
                            time: quizData?.averageCompletionTime || 300,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          label={{
                            value: "Seconds",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}s`, "Avg. Time"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="time"
                          stroke="#F59E0B"
                          fill="#F59E0B"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quiz Insights Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Key Insights
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Most Common Personality
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                          {quizData?.mostCommonPersonality || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Answers
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {quizData?.totalAnswers || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Completion Rate
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {quizData?.totalQuizzes > 0 ? "100%" : "0%"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      User Engagement
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Guest Participation
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {quizData?.guestQuizzes || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Registered Participation
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {quizData?.authenticatedQuizzes || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Avg. Time per Quiz
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {Math.round(quizData?.averageCompletionTime || 0)}s
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Popular Choices
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Analytical
                          </span>
                          <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                            {quizData?.personalityDistribution?.analytical || 0}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                            Creative
                          </span>
                          <span className="text-sm font-bold text-purple-900 dark:text-purple-100">
                            {quizData?.personalityDistribution?.creative || 0}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            Social
                          </span>
                          <span className="text-sm font-bold text-green-900 dark:text-green-100">
                            {quizData?.personalityDistribution?.social || 0}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            Leadership
                          </span>
                          <span className="text-sm font-bold text-orange-900 dark:text-orange-100">
                            {quizData?.personalityDistribution?.leadership || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Quiz Submissions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recent Quiz Submissions
                    </h3>
                    <button
                      onClick={fetchQuizData}
                      disabled={quizLoading}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {quizLoading ? (
                        <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-1" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-1" />
                      )}
                      {quizLoading ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Quiz Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Personality
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Completion Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Submitted
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {quizData?.recentQuizzes?.length > 0 ? (
                          quizData.recentQuizzes.map((quiz, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                                      {quiz.userId?.name
                                        ?.charAt(0)
                                        .toUpperCase() || "G"}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {quiz.userId?.name || "Guest User"}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {quiz.userId?.email || "No email"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    quiz.quizType === "detailed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  }`}
                                >
                                  {quiz.quizType === "detailed"
                                    ? "Detailed (15Q)"
                                    : "Mock (5Q)"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 capitalize">
                                  {quiz.personalityType || "N/A"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {Math.round(quiz.completionTime || 0)}s
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(quiz.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                            >
                              No quiz submissions yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Other tabs */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed insights and performance metrics
              </p>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Content Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage quizzes, roadmaps, and other content
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* System Settings Header */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                System Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Configure system preferences, security, and platform options
              </p>
            </div>

            {/* Settings Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* General Settings */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  General Settings
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Platform Name
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Display name for the platform
                      </p>
                    </div>
                    <input
                      type="text"
                      defaultValue="AdhyayanMarg"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-48"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Maintenance Mode
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Temporarily disable public access
                      </p>
                    </div>
                    <ToggleButton
                      isOn={settings.maintenanceMode}
                      onClick={() => toggleSetting("maintenanceMode")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Registration Status
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Allow new user registrations
                      </p>
                    </div>
                    <ToggleButton
                      isOn={settings.registrationStatus}
                      onClick={() => toggleSetting("registrationStatus")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Email Notifications
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Send system notifications via email
                      </p>
                    </div>
                    <ToggleButton
                      isOn={settings.emailNotifications}
                      onClick={() => toggleSetting("emailNotifications")}
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Password Requirements
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Minimum 8 characters, mixed case, numbers
                      </p>
                    </div>
                    <ToggleButton
                      isOn={settings.passwordRequirements}
                      onClick={() => toggleSetting("passwordRequirements")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Require 2FA for admin accounts
                      </p>
                    </div>
                    <ToggleButton
                      isOn={settings.twoFactorAuth}
                      onClick={() => toggleSetting("twoFactorAuth")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Session Timeout
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Auto-logout after inactivity
                      </p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="480">8 hours</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        IP Whitelist
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Restrict admin access to specific IPs
                      </p>
                    </div>
                    <ToggleButton
                      isOn={settings.ipWhitelist}
                      onClick={() => toggleSetting("ipWhitelist")}
                    />
                  </div>
                </div>
              </div>

              {/* Quiz Settings */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Quiz Settings
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Guest Quiz Limit
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Number of questions for guest users
                      </p>
                    </div>
                    <input
                      type="number"
                      defaultValue="5"
                      min="1"
                      max="20"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-20"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Detailed Quiz Limit
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Number of questions for logged-in users
                      </p>
                    </div>
                    <input
                      type="number"
                      defaultValue="15"
                      min="5"
                      max="50"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-20"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Quiz Time Limit
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Maximum time per quiz (minutes)
                      </p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                      <option value="0">No limit</option>
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Auto-Save Results
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Automatically save quiz results
                      </p>
                    </div>
                    <ToggleButton
                      isOn={settings.autoSaveResults}
                      onClick={() => toggleSetting("autoSaveResults")}
                    />
                  </div>
                </div>
              </div>

              {/* Content Settings */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Content Settings
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Auto-Moderate Stories
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Automatically approve user stories
                      </p>
                    </div>
                    <ToggleButton
                      isOn={settings.autoModerateStories}
                      onClick={() => toggleSetting("autoModerateStories")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Featured Content Limit
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Maximum featured items per category
                      </p>
                    </div>
                    <input
                      type="number"
                      defaultValue="5"
                      min="1"
                      max="20"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-20"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Content Approval Required
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Review all user submissions
                      </p>
                    </div>
                    <ToggleButton
                      isOn={settings.contentApprovalRequired}
                      onClick={() => toggleSetting("contentApprovalRequired")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Content Backup Frequency
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        How often to backup content
                      </p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Advanced Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Database Backup
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Create database backup
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Backup Now
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Clear Cache
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Clear system cache
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Clear Cache
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      System Logs
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      View system logs
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View Logs
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      API Rate Limit
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Requests per minute
                    </p>
                  </div>
                  <input
                    type="number"
                    defaultValue="100"
                    min="10"
                    max="1000"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-24"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Error Reporting
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Send error reports
                    </p>
                  </div>
                  <ToggleButton
                    isOn={settings.errorReporting}
                    onClick={() => toggleSetting("errorReporting")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Debug Mode
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Enable debug logging
                    </p>
                  </div>
                  <ToggleButton
                    isOn={settings.debugMode}
                    onClick={() => toggleSetting("debugMode")}
                  />
                </div>
              </div>
            </div>

            {/* Save Settings */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" size="lg">
                Reset to Defaults
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Save All Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
