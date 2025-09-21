import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";

const LoginForm = ({ onSuccess, onError, loading = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL?.replace("/api", "") ||
          "http://localhost:5000"
        }/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem("authToken", data.token);
        onSuccess?.(data.user, data.token);
      } else {
        setErrors({ general: data.message });
        onError?.(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Network error. Please try again." });
      onError?.(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("auth.signIn")}
            </h2>
            <p className="text-gray-600">{t("auth.signInSubtitle")}</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div>
            <Input
              type="email"
              name="email"
              placeholder={t("auth.email")}
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
              error={errors.email}
              disabled={loading}
            />
          </div>

          <div>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("auth.password")}
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              error={errors.password}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>

          <div className="text-center">
            <p className="text-gray-600">
              {t("auth.noAccount")}{" "}
              <button
                type="button"
                onClick={() => onSuccess?.("register")}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t("auth.createAccount")}
              </button>
            </p>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
