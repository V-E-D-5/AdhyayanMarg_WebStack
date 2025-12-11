import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, User, LogOut, Shield } from "lucide-react";
import { cn } from "../../utils/helpers";
import Button from "../UI/Button";
import ThemeToggle from "../UI/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const baseNavigation = [
    { name: t("nav.home"), href: "/", current: location.pathname === "/" },
    {
      name: t("nav.quiz"),
      href: "/quiz",
      current: location.pathname === "/quiz",
    },
    {
      name: t("nav.roadmap"),
      href: "/roadmap",
      current: location.pathname === "/roadmap",
    },
    {
      name: t("nav.colleges"),
      href: "/colleges",
      current: location.pathname === "/colleges",
    },
    {
      name: t("nav.chatbot"),
      href: "/chatbot",
      current: location.pathname === "/chatbot",
    },
  ];

  // Add navigation items based on user role
  const navigation = isAuthenticated
    ? [
        ...baseNavigation,
        // Add role-specific navigation
        ...(user?.role === "student"
          ? [
              {
                name: t("nav.dashboard"),
                href: "/dashboard",
                current: location.pathname === "/dashboard",
              },
            ]
          : []),
        ...(user?.role === "mentor"
          ? [
              {
                name: "Mentor Portal",
                href: "/mentor",
                current: location.pathname === "/mentor",
              },
            ]
          : []),
        // Add admin link only for admin users
        ...(user?.role === "admin"
          ? [
              {
                name: "Admin",
                href: "/admin",
                current: location.pathname === "/admin",
              },
            ]
          : []),
      ]
    : baseNavigation;

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsLanguageOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
      <div className="container-wide">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18 transition-all duration-300">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-105">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient
                    id="mainGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="25%" stopColor="#0ea5e9" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="75%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient
                    id="starGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <path
                  d="M6 24 Q8 20 10 18 Q12 16 14 18 Q16 20 18 18 Q20 16 22 18 Q24 20 26 24 Q24 26 22 28 Q20 30 18 28 Q16 26 14 28 Q12 30 10 28 Q8 26 6 24 Z"
                  fill="url(#mainGradient)"
                />
                <path
                  d="M20 8 L22 12 L26 12 L23 15 L24 19 L20 17 L16 19 L17 15 L14 12 L18 12 Z"
                  fill="url(#starGradient)"
                />
              </svg>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white transition-all duration-300">
              <span className="hidden sm:inline">Yukti</span>
              <span className="sm:hidden">Y</span>
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on smaller screens */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-md touch-target",
                  item.current
                    ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Theme Toggle */}
            <div className="touch-target">
              <ThemeToggle />
            </div>

            {/* Language Selector - Responsive visibility */}
            <div className="relative hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 px-3 py-2 touch-target min-h-[44px] min-w-[44px]"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden md:block text-sm">
                  {languages.find((lang) => lang.code === i18n.language)?.flag}
                </span>
              </Button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-in slide-in-from-top-2 duration-200">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        changeLanguage(language.code);
                        setIsLanguageOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-gray-100 touch-target transition-colors duration-200",
                        i18n.language === language.code &&
                          "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                      )}
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* User Info - Responsive */}
                <div className="flex items-center space-x-1 sm:space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 sm:px-3 py-1.5 rounded-lg touch-target">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span
                    className="hidden sm:block truncate max-w-20 md:max-w-32 lg:max-w-40 font-medium"
                    title={user?.name}
                  >
                    {user?.name}
                  </span>
                </div>

                {/* Logout Button - Responsive */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 touch-target transition-all duration-200"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:block font-medium">
                    {t("auth.signOut")}
                  </span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Admin Login Button - Responsive */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/login")}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 font-medium touch-target transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:block font-medium">
                    Admin Login
                  </span>
                </Button>

                {/* Login Button - Responsive */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 font-medium touch-target transition-all duration-200"
                >
                  <span className="font-medium">Login/Signup</span>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden ml-1 touch-target min-h-[44px] min-w-[44px] p-2"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-in slide-in-from-top-2 duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-4 text-base font-medium rounded-lg transition-all duration-200 touch-target min-h-[48px] flex items-center",
                    item.current
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Selector */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Language
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        changeLanguage(language.code);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "px-4 py-3 text-sm rounded-md border transition-all duration-200 touch-target min-h-[56px] flex flex-col items-center justify-center",
                        i18n.language === language.code
                          ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-sm"
                      )}
                    >
                      <span className="text-xl mb-1">{language.flag}</span>
                      <span className="text-xs font-medium">
                        {language.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-3 px-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full justify-start touch-target hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("auth.signOut")}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 px-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        navigate("/login");
                        setIsOpen(false);
                      }}
                      className="w-full touch-target min-h-[48px] text-base"
                    >
                      Login/Signup
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => {
                        navigate("/admin/login");
                        setIsOpen(false);
                      }}
                      className="w-full touch-target min-h-[48px] text-base text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 flex items-center justify-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Login</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
