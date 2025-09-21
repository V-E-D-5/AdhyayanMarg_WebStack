import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "../../contexts/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = (user, token) => {
    if (user === "login" || user === "register") {
      setMode(user);
      return;
    }

    login(user);
    onClose();
  };

  const handleAuthError = (error) => {
    console.error("Auth error:", error);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6">
            {mode === "login" ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
                loading={loading}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
                loading={loading}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;


