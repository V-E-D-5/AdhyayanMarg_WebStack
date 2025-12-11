import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminProtectedRoute from "./components/Auth/AdminProtectedRoute";
import RoleProtectedRoute from "./components/Auth/RoleProtectedRoute";
import ThemeFavicon from "./components/ThemeFavicon";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Lazy load pages for better performance
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const Quiz = React.lazy(() => import("./pages/Quiz"));
const Roadmap = React.lazy(() => import("./pages/Roadmap"));
const Colleges = React.lazy(() => import("./pages/Colleges"));
const Chatbot = React.lazy(() => import("./pages/Chatbot"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const MentorPortal = React.lazy(() => import("./pages/MentorPortal"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeFavicon />
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="roadmap" element={<Roadmap />} />
                <Route path="colleges" element={<Colleges />} />
                <Route path="chatbot" element={<Chatbot />} />
                <Route
                  path="dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={["student"]}>
                      <Dashboard />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="mentor"
                  element={
                    <RoleProtectedRoute allowedRoles={["mentor"]}>
                      <MentorPortal />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
