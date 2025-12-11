import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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

  // Password reset state
  const [passwordResetModal, setPasswordResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Delete user state
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Create user modal state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [createUserErrors, setCreateUserErrors] = useState({});

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
    console.log("User:", user);
    console.log("User role:", user?.role);
    console.log("Quiz data state:", quizData);

    // Only fetch data if user is authenticated and data is not already loaded
    if (user && user.role === "admin") {
      // Sequential loading to prevent overwhelming the server
      const loadData = async () => {
        try {
          if (!dashboardData) {
            console.log("Fetching dashboard data...");
            await fetchDashboardData();
          }
          if (users.length === 0) {
            console.log("Fetching users...");
            await fetchUsers();
          }
          // Always fetch quiz data on component load for admin users
          console.log("Fetching quiz data on component load...");
          await fetchQuizData();
        } catch (error) {
          console.error("Error loading admin dashboard data:", error);
          // Don't show toast here, let individual functions handle their own errors
        }
      };

      loadData();
    }
  }, [user]); // Add user as dependency

  // Auto-refresh quiz data every 60 seconds when quiz tab is active (reduced frequency)
  useEffect(() => {
    if (activeTab === "quiz") {
      // Fetch quiz data immediately when quiz tab is accessed
      if (!quizData) {
        console.log("Quiz tab accessed, fetching quiz data...");
        fetchQuizData();
      }

      const interval = setInterval(() => {
        console.log("Auto-refreshing quiz data...");
        fetchQuizData(true); // Force refresh for auto-refresh
      }, 60000); // 60 seconds (reduced from 30 seconds)

      return () => clearInterval(interval);
    }
  }, [activeTab, quizData]);

  const fetchDashboardData = async (forceRefresh = false) => {
    // Simple cache: only fetch if data is older than 30 seconds or force refresh
    const now = Date.now();
    const cacheTime = 30 * 1000; // 30 seconds
    if (
      !forceRefresh &&
      lastFetchTime &&
      now - lastFetchTime < cacheTime &&
      dashboardData
    ) {
      console.log("Using cached dashboard data");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      console.log("Fetching dashboard data...");

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 15000); // 15 second timeout
      });

      const response = await Promise.race([
        apiService.getAdminDashboard(),
        timeoutPromise,
      ]);

      console.log("Dashboard data response:", response.data);

      if (response.data.success) {
        setDashboardData(response.data.data);
        setLastFetchTime(now);
        setError(null); // Clear any previous errors
      } else {
        throw new Error(
          response.data.message || "Failed to fetch dashboard data"
        );
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      let errorMessage = "Failed to load dashboard data";

      if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (error.response?.status === 503) {
        errorMessage =
          "Database not connected. Please ensure MongoDB is running and properly configured.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error.code === "ECONNABORTED" ||
        error.message === "Request timeout"
      ) {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page = 1, search = "", role = "", status = "") => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      console.log("Fetching users...");
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(role && { role }),
        ...(status && { status }),
      };

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 15000); // 15 second timeout
      });

      const response = await Promise.race([
        apiService.getAdminUsers(params),
        timeoutPromise,
      ]);

      console.log("Users data response:", response.data);

      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
        setError(null); // Clear any previous errors
      } else {
        throw new Error(response.data.message || "Failed to fetch users data");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      let errorMessage = "Failed to load users data";

      if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (error.response?.status === 503) {
        errorMessage =
          "Database not connected. Please ensure MongoDB is running and properly configured.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error.code === "ECONNABORTED" ||
        error.message === "Request timeout"
      ) {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
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

  const fetchQuizData = async (forceRefresh = false) => {
    try {
      setQuizLoading(true);
      console.log(
        "Fetching quiz data...",
        forceRefresh ? "(Force refresh)" : ""
      );
      console.log(
        "API service getAdminQuizData function:",
        apiService.getAdminQuizData
      );

      // Add cache busting parameter for force refresh
      const response = await apiService.getAdminQuizData(forceRefresh);
      console.log("Quiz data response:", response.data);
      console.log("Quiz data response status:", response.status);
      console.log("Quiz data response success:", response.data.success);

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
        console.log("Setting quiz data state...");
        setQuizData(mappedData);
        setLastQuizRefresh(new Date());
        console.log("Quiz data state set successfully");

        // Show success message for manual refresh
        if (forceRefresh) {
          setSuccessMessage("✅ Quiz data refreshed successfully!");
          setShowSuccessPopup(true);
          setTimeout(() => {
            setShowSuccessPopup(false);
          }, 3000);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);

      // Show error message for manual refresh
      if (forceRefresh) {
        setSuccessMessage("❌ Failed to refresh quiz data. Please try again.");
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }

      // Only reset data if this is the initial load, not a refresh
      if (!forceRefresh) {
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
      }
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

  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = {};
    if (!createUserForm.name.trim()) {
      errors.name = "Name is required";
    }
    if (!createUserForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(createUserForm.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!createUserForm.password) {
      errors.password = "Password is required";
    } else if (createUserForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (createUserForm.password !== createUserForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!createUserForm.role) {
      errors.role = "Role is required";
    }

    setCreateUserErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setCreateUserLoading(true);
    try {
      const response = await apiService.createUser({
        name: createUserForm.name,
        email: createUserForm.email,
        password: createUserForm.password,
        role: createUserForm.role,
      });

      if (response.data.success) {
        setShowCreateUserModal(false);
        setCreateUserForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "student",
        });
        setCreateUserErrors({});

        // Refresh users list
        fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);

        // Show success message
        setSuccessMessage("✅ User created successfully!");
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      } else {
        setCreateUserErrors({
          general: response.data.message || "Failed to create user",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setCreateUserErrors({
        general:
          error.response?.data?.message ||
          "Failed to create user. Please try again.",
      });
    } finally {
      setCreateUserLoading(false);
    }
  };

  // Password reset functions
  const handlePasswordReset = (user) => {
    console.log("Opening password reset modal for user:", user);
    console.log("User ID:", user.id);
    console.log("User _id:", user._id);
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordResetModal(true);
  };

  const handlePasswordResetSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      setSuccessMessage("❌ Password must be at least 6 characters long");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSuccessMessage("❌ Passwords do not match");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      return;
    }

    setPasswordResetLoading(true);
    try {
      console.log("Attempting password reset for user:", selectedUser);
      console.log("User ID:", selectedUser.id);
      console.log("New password:", newPassword);
      console.log("Auth token:", localStorage.getItem("authToken"));

      // Test the API call manually
      const endpoint = `/admin/users/${selectedUser.id}/password`;
      console.log("API endpoint:", endpoint);
      console.log("Request data:", { newPassword });

      const response = await apiService.resetUserPassword(selectedUser.id, {
        newPassword,
      });
      console.log("Password reset response:", response);

      // Show success popup
      setSuccessMessage(
        `Password reset successfully for ${selectedUser.name}!`
      );
      setShowSuccessPopup(true);

      // Close password reset modal
      setPasswordResetModal(false);
      setSelectedUser(null);
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);

      // Auto-hide success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error resetting password:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      console.error("Full error object:", error);

      let errorMessage = "Failed to reset password. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show error popup
      setSuccessMessage(`❌ ${errorMessage}`);
      setShowSuccessPopup(true);

      // Auto-hide error popup after 4 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 4000);
    } finally {
      setPasswordResetLoading(false);
    }
  };

  // Delete user functions
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setAdminPassword("");
    setDeleteUserModal(true);
  };

  const handleDeleteUserSubmit = async () => {
    if (!adminPassword) {
      setSuccessMessage("❌ Admin password is required");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      return;
    }

    setDeleteUserLoading(true);
    try {
      await apiService.deleteUser(userToDelete.id, { adminPassword });

      // Show success popup
      setSuccessMessage(`User ${userToDelete.name} deleted successfully!`);
      setShowSuccessPopup(true);

      // Close delete modal
      setDeleteUserModal(false);
      setUserToDelete(null);
      setAdminPassword("");

      // Refresh users list
      fetchUsers();

      // Auto-hide success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      console.error("Full error object:", error);

      let errorMessage = "Failed to delete user. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show error popup
      setSuccessMessage(`❌ ${errorMessage}`);
      setShowSuccessPopup(true);

      // Auto-hide error popup after 4 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 4000);
    } finally {
      setDeleteUserLoading(false);
    }
  };

  // Optimized refresh - only refresh what's currently visible
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh only the active tab data in parallel
      const refreshPromises = [];

      // Always refresh dashboard data
      refreshPromises.push(fetchDashboardData(true));

      // Only refresh other data if their tabs are active
      if (activeTab === "users" || users.length === 0) {
        refreshPromises.push(fetchUsers());
      }

      if (activeTab === "quiz" || !quizData) {
        refreshPromises.push(fetchQuizData(true));
      }

      // Execute all refreshes in parallel
      await Promise.allSettled(refreshPromises);

      setSuccessMessage("✅ Data refreshed successfully!");
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Refresh error:", error);
      setSuccessMessage("❌ Failed to refresh data. Please try again.");
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } finally {
      setRefreshing(false);
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
                Welcome, {user?.name}! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
              >
                <svg
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {refreshing ? "Refreshing..." : "Refresh Data"}
                </span>
              </button>
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
                      Total Mentors
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardData?.userStats?.mentorUsers || 0}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center mt-1">
                      <Users className="w-3 h-3 mr-1" />
                      Active mentors in the system
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                            : user.role === "mentor"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
                <button
                  onClick={() =>
                    fetchUsers(
                      currentPage,
                      searchTerm,
                      roleFilter,
                      statusFilter
                    )
                  }
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-sm">Refresh</span>
                </button>
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
                  <option value="mentor">Mentor</option>
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
                                : user.role === "mentor"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
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
                            {user.role !== "admin" && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
                              >
                                Delete
                              </button>
                            )}
                            <button
                              onClick={() => handlePasswordReset(user)}
                              className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                            >
                              Reset Password
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
                    {!quizData && !quizLoading && (
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                        No quiz data loaded. Click "Load Data" to fetch quiz
                        statistics.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={() => fetchQuizData(true)}
                      disabled={quizLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {quizLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      <span>
                        {quizLoading
                          ? "Refreshing..."
                          : !quizData
                          ? "Load Data"
                          : "Refresh Data"}
                      </span>
                    </button>
                    {lastQuizRefresh && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last updated: {lastQuizRefresh.toLocaleTimeString()}
                        {quizLoading && (
                          <span className="ml-2 text-primary-600 dark:text-primary-400">
                            • Refreshing...
                          </span>
                        )}
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
                          {quizLoading ? (
                            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span
                              onClick={() =>
                                console.log("Current quizData:", quizData)
                              }
                            >
                              {quizData?.totalQuizzes || 0}
                            </span>
                          )}
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
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Quiz Submissions
                      </h3>
                      {quizLoading && (
                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                          Updating submissions...
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => fetchQuizData(true)}
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
                      defaultValue="Yukti"
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

        {/* Password Reset Modal */}
        {passwordResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Reset Password for {selectedUser?.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setPasswordResetModal(false);
                      setSelectedUser(null);
                      setNewPassword("");
                      setConfirmPassword("");
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordResetSubmit}
                    disabled={passwordResetLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg"
                  >
                    {passwordResetLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete User Confirmation Modal */}
        {deleteUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delete User: {userToDelete?.name}
              </h3>
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>Warning:</strong> This action cannot be undone.
                      The user will be permanently deleted from the database.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter your admin password to confirm deletion
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter admin password"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setDeleteUserModal(false);
                      setUserToDelete(null);
                      setAdminPassword("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUserSubmit}
                    disabled={deleteUserLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg"
                  >
                    {deleteUserLoading ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100">
              <div className="mb-4">
                {successMessage.includes("❌") ? (
                  <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  successMessage.includes("❌")
                    ? "text-red-900 dark:text-red-100"
                    : "text-green-900 dark:text-green-100"
                }`}
              >
                {successMessage.includes("❌") ? "Error" : "Success!"}
              </h3>
              <p
                className={`text-sm ${
                  successMessage.includes("❌")
                    ? "text-red-700 dark:text-red-300"
                    : "text-green-700 dark:text-green-300"
                }`}
              >
                {successMessage.replace("❌ ", "")}
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${
                  successMessage.includes("❌")
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Account
              </h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                {createUserErrors.general && (
                  <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm">
                    {createUserErrors.general}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={createUserForm.name}
                    onChange={(e) =>
                      setCreateUserForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter full name"
                  />
                  {createUserErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {createUserErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={createUserForm.email}
                    onChange={(e) =>
                      setCreateUserForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter email address"
                  />
                  {createUserErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {createUserErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={createUserForm.role}
                    onChange={(e) =>
                      setCreateUserForm((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {createUserErrors.role && (
                    <p className="text-red-500 text-xs mt-1">
                      {createUserErrors.role}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={createUserForm.password}
                    onChange={(e) =>
                      setCreateUserForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter password"
                  />
                  {createUserErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {createUserErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={createUserForm.confirmPassword}
                    onChange={(e) =>
                      setCreateUserForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Confirm password"
                  />
                  {createUserErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {createUserErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateUserModal(false);
                      setCreateUserForm({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        role: "student",
                      });
                      setCreateUserErrors({});
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createUserLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-lg"
                  >
                    {createUserLoading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
