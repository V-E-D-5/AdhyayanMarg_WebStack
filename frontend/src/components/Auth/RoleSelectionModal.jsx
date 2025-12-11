import React from "react";
import { motion } from "framer-motion";
import { Shield, User, X } from "lucide-react";
import Button from "../UI/Button";

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelect }) => {
  if (!isOpen) return null;

  const handleRoleSelect = (role) => {
    onRoleSelect(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Choose Your Role
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Please select your role to continue with the login process
        </p>

        {/* Role Options */}
        <div className="space-y-4">
          {/* Student Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 cursor-pointer"
            onClick={() => handleRoleSelect("student")}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Student
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Access your dashboard, take quizzes, and explore career paths
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Create account or login with existing credentials
                </p>
              </div>
            </div>
          </motion.div>

          {/* Admin Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
            onClick={() => handleRoleSelect("admin")}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Administrator
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Access admin dashboard to manage users and system settings
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Login only - Admin accounts are created by system
                  administrators
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cancel Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionModal;
