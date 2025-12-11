import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  MessageSquare,
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  BookOpen,
  Star,
  Plus,
  Eye,
  Edit,
  Send,
  Award,
  Brain,
  Briefcase,
  Calendar,
  FileText,
  ThumbsUp,
  AlertCircle,
  X,
  Activity,
  TrendingDown,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Trophy,
  Clock3,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  ChevronDown,
  Bell,
  Settings,
  Download,
  RefreshCw,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../utils/api";

const MentorPortal = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [studentTimeline, setStudentTimeline] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    assignedStudents: 0,
    unassignedStudents: 0,
    activeStudents: 0,
    avgProgress: 0,
    avgAptitude: 0,
  });

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMentorStudents({
        search: searchTerm,
        filter: filter,
        page: 1,
        limit: 50,
      });

      if (response.data.success) {
        setStudents(response.data.students);
        setStats((prev) => ({
          ...prev,
          totalStudents: response.data.students.length,
          assignedStudents: response.data.students.filter((s) => s.isAssigned)
            .length,
          unassignedStudents: response.data.students.filter(
            (s) => !s.isAssigned
          ).length,
        }));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assigned students
  const fetchAssignedStudents = async () => {
    try {
      const response = await apiService.getMentorAssignedStudents();
      if (response.data.success) {
        setAssignedStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching assigned students:", error);
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await apiService.getMentorDashboardStats();
      if (response.data.success) {
        setStats((prev) => ({
          ...prev,
          ...response.data.stats,
        }));
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch comprehensive analytics
  const fetchAnalytics = async () => {
    try {
      const response = await apiService.getMentorAnalytics();
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  // Fetch session history
  const fetchSessions = async () => {
    try {
      const response = await apiService.getSessionHistory();
      if (response.data.success) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await apiService.getMessages();
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch student timeline
  const fetchStudentTimeline = async (studentId) => {
    try {
      const response = await apiService.getStudentTimeline(studentId);
      if (response.data.success) {
        setStudentTimeline(response.data.timeline);
      }
    } catch (error) {
      console.error("Error fetching student timeline:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStudents();
    fetchAssignedStudents();
    fetchStats();
    fetchAnalytics();
    fetchSessions();
    fetchMessages();
  }, []);

  // Refetch students when search term or filter changes
  useEffect(() => {
    if (searchTerm.length > 2 || searchTerm.length === 0) {
      fetchStudents();
    }
  }, [searchTerm, filter]);

  // Assign students to mentor
  const handleAssignStudents = async (studentIds) => {
    try {
      const response = await apiService.assignStudents({ studentIds });
      if (response.data.success) {
        fetchStudents();
        fetchAssignedStudents();
        fetchStats();
      }
    } catch (error) {
      console.error("Error assigning students:", error);
    }
  };

  // Unassign students from mentor
  const handleUnassignStudents = async (studentIds) => {
    try {
      const response = await apiService.unassignStudents({ studentIds });
      if (response.data.success) {
        fetchStudents();
        fetchAssignedStudents();
        fetchStats();
      }
    } catch (error) {
      console.error("Error unassigning students:", error);
    }
  };

  // View student details
  const handleViewStudent = async (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  // Record guidance session
  const handleRecordGuidanceSession = async (sessionData) => {
    try {
      const response = await apiService.recordGuidanceSession({
        studentId: selectedStudent._id,
        ...sessionData,
      });
      if (response.data.success) {
        setShowGuidanceModal(false);
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Error recording guidance session:", error);
    }
  };

  // Submit performance feedback
  const handleSubmitFeedback = async (feedbackData) => {
    try {
      const response = await apiService.submitPerformanceFeedback({
        studentId: selectedStudent._id,
        ...feedbackData,
      });
      if (response.data.success) {
        setShowFeedbackModal(false);
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "students", label: "All Students", icon: Users },
    { id: "assigned", label: "My Students", icon: UserCheck },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "sessions", label: "Sessions", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mentor Portal
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || "Mentor"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Assigned Students
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.assignedStudents}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalStudents}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assigned
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.assignedStudents}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeStudents}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.avgProgress}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div>
            {/* Enhanced Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Overview Cards */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {analytics?.overview?.totalStudents || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Students
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {analytics?.overview?.activeStudents || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Active Students
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {analytics?.overview?.newStudents || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        New This Month
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {analytics?.insights?.engagementRate || 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Engagement Rate
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setActiveTab("students")}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View All Students
                    </Button>
                    <Button
                      onClick={() => setActiveTab("sessions")}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Record Session
                    </Button>
                    <Button
                      onClick={() => setActiveTab("messages")}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      onClick={() => setActiveTab("analytics")}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Performance Insights */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Top Performers
                  </h3>
                  <div className="space-y-3">
                    {analytics.performance?.topPerformers?.map(
                      (student, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {student.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {student.hours} hours, {student.interactions}{" "}
                                interactions
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Performance Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Average Progress
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {analytics.performance?.avgProgress || 0} hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Average Interactions
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {analytics.performance?.avgInteractions || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        High Performers
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {analytics.insights?.highPerformers || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Need Attention
                      </span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {analytics.insights?.needsAttention || 0}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Weekly Activity
                  </h3>
                  <div className="space-y-3">
                    {analytics.trends?.weeklyActivity?.map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {day.day}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(day.activity / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {day.activity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Monthly Progress Chart */}
            {analytics && (
              <div className="mb-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Monthly Progress Trend
                  </h3>
                  <div className="grid grid-cols-6 gap-4">
                    {analytics.trends?.monthlyProgress?.map((month, index) => (
                      <div key={index} className="text-center">
                        <div className="mb-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-32 flex items-end">
                            <div
                              className="bg-gradient-to-t from-blue-500 to-blue-400 w-full rounded-full"
                              style={{ height: `${month.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {month.month}
                        </p>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {month.progress}%
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Student Performance Overview */}
            <div className="mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Student Performance Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {stats.totalStudents}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Students
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {stats.assignedStudents}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Assigned
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                      {stats.activeStudents}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Active
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {stats.avgProgress}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Progress
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Sessions
                </h3>
                <div className="space-y-3">
                  {sessions.slice(0, 3).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {session.studentName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {session.sessionType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {session.duration} min
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Messages
                </h3>
                <div className="space-y-3">
                  {messages.slice(0, 3).map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {message.studentName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {message.message}
                        </p>
                      </div>
                      <div className="text-right">
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mb-1"></div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Stats and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  This Week's Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Sessions Conducted
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      3
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Messages Sent
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      12
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Students Helped
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      8
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Hours Spent
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      15
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Upcoming Tasks
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Follow up with John Doe
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Career guidance session
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Review Jane's progress
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Performance feedback
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Schedule group session
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Team building activity
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => setActiveTab("students")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View All Students
                  </Button>
                  <Button
                    onClick={() => setShowGuidanceModal(true)}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Record Session
                  </Button>
                  <Button
                    onClick={() => setShowMessageModal(true)}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    onClick={() => setActiveTab("analytics")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div>
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Students</option>
                    <option value="assigned">Assigned</option>
                    <option value="unassigned">Unassigned</option>
                  </select>
                  <Button className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Loading students...
                  </p>
                </div>
              ) : students.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No students found
                  </p>
                </div>
              ) : (
                students.map((student) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`p-6 hover:shadow-lg transition-shadow duration-200 ${
                        student.isAssigned
                          ? "border-green-200 dark:border-green-800"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-400 font-semibold">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {student.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {student.email}
                            </p>
                            {student.isAssigned && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Assigned to:{" "}
                                {student.assignedMentor?.name || "Unknown"}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {student.isAssigned ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Assigned
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {student.analytics?.totalHours || 0} hours
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Interactions
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {student.analytics?.totalInteractions || 0}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleViewStudent(student)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {!student.isAssigned && (
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handleAssignStudents([student._id])
                                }
                              >
                                <UserCheck className="w-4 h-4 mr-1" />
                                Assign
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "assigned" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                My Assigned Students
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {assignedStudents.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No assigned students yet
                  </p>
                </div>
              ) : (
                assignedStudents.map((student) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-green-200 dark:border-green-800">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {student.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Assigned
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {student.analytics?.totalHours || 0} hours
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Interactions
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {student.analytics?.totalInteractions || 0}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowGuidanceModal(true);
                              }}
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Session
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowFeedbackModal(true);
                              }}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Feedback
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Analytics Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.totalStudents}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.assignedStudents}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Assigned Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.activeStudents}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.avgProgress}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average Progress
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "sessions" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Guidance Sessions
              </h2>
              <Button
                onClick={() => setShowGuidanceModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Record Session</span>
              </Button>
            </div>

            {sessions.length === 0 ? (
              <Card className="p-6">
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No sessions recorded yet. Start a guidance session with your
                    students!
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {session.studentName}
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {session.sessionType}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {session.notes}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {session.duration} minutes
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(session.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              {session.topics?.join(", ")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Messages
              </h2>
              <Button
                onClick={() => setShowMessageModal(true)}
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </Button>
            </div>

            {messages.length === 0 ? (
              <Card className="p-6">
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No messages yet. Start a conversation with your students!
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`p-6 ${
                        !message.isRead
                          ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {message.studentName}
                            </h3>
                            {!message.isRead && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                New
                              </span>
                            )}
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              {message.type.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {message.message}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          {!message.isRead && (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Student Profile
                </h2>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold text-xl">
                      {selectedStudent.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedStudent.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Hours
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedStudent.analytics?.totalHours || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Interactions
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedStudent.analytics?.totalInteractions || 0}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setShowStudentModal(false);
                      setShowGuidanceModal(true);
                    }}
                    className="flex-1"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Record Session
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowStudentModal(false);
                      setShowFeedbackModal(true);
                    }}
                    className="flex-1"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guidance Session Modal */}
      {showGuidanceModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Record Guidance Session
                </h2>
                <button
                  onClick={() => setShowGuidanceModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleRecordGuidanceSession({
                    sessionType: formData.get("sessionType"),
                    duration: parseInt(formData.get("duration")),
                    notes: formData.get("notes"),
                    topics: formData
                      .get("topics")
                      .split(",")
                      .map((t) => t.trim()),
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Session Type
                    </label>
                    <select
                      name="sessionType"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select session type</option>
                      <option value="career_guidance">Career Guidance</option>
                      <option value="academic_support">Academic Support</option>
                      <option value="personal_development">
                        Personal Development
                      </option>
                      <option value="skill_building">Skill Building</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (minutes)
                    </label>
                    <Input
                      type="number"
                      name="duration"
                      required
                      min="1"
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Topics Discussed
                    </label>
                    <Input
                      type="text"
                      name="topics"
                      placeholder="Career planning, Skill development, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Session Notes
                    </label>
                    <textarea
                      name="notes"
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Detailed notes about the session..."
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Record Session
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowGuidanceModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Performance Feedback Modal */}
      {showFeedbackModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Submit Performance Feedback
                </h2>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleSubmitFeedback({
                    feedback: formData.get("feedback"),
                    rating: parseInt(formData.get("rating")),
                    areas: formData
                      .get("areas")
                      .split(",")
                      .map((a) => a.trim()),
                    recommendations: formData.get("recommendations"),
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Overall Rating (1-5)
                    </label>
                    <select
                      name="rating"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select rating</option>
                      <option value="1">1 - Needs Improvement</option>
                      <option value="2">2 - Below Average</option>
                      <option value="3">3 - Average</option>
                      <option value="4">4 - Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Areas of Focus
                    </label>
                    <Input
                      type="text"
                      name="areas"
                      placeholder="Technical skills, Communication, Leadership"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Feedback
                    </label>
                    <textarea
                      name="feedback"
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Detailed feedback about the student's performance..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recommendations
                    </label>
                    <textarea
                      name="recommendations"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Specific recommendations for improvement..."
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowFeedbackModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Send Message
                </h2>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const studentId = formData.get("studentId");
                  const message = formData.get("message");
                  const type = formData.get("type");

                  if (studentId && message) {
                    apiService
                      .sendMessageToStudent({
                        studentId,
                        message,
                        type,
                      })
                      .then(() => {
                        setShowMessageModal(false);
                        fetchMessages();
                      });
                  }
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Select Student
                    </label>
                    <select
                      name="studentId"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Choose a student</option>
                      {assignedStudents.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message Type
                    </label>
                    <select
                      name="type"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="guidance">Guidance</option>
                      <option value="feedback">Feedback</option>
                      <option value="reminder">Reminder</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMessageModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorPortal;
