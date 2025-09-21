import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import Button from "../components/UI/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
            <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-primary-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="heading-2 mb-4 text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-body mb-8 text-gray-600 dark:text-gray-300">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/quiz"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Career Quiz
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Find your path
                </div>
              </Link>
              <Link
                to="/roadmap"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Roadmaps
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Career guides
                </div>
              </Link>
              <Link
                to="/colleges"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Colleges
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Find colleges
                </div>
              </Link>
              <Link
                to="/stories"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Stories
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Success stories
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
