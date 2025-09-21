import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Clock,
  User,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { apiService } from "../utils/api";

const Stories = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFeatured, setShowFeatured] = useState(false);
  const [stories, setStories] = useState([]);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load stories from API
  useEffect(() => {
    loadStories();
    loadFeaturedStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading stories from API...");
      const response = await apiService.getStories();
      console.log("📡 API Response:", response);
      console.log("📊 Response Data:", response.data);

      if (response.data.success) {
        console.log(
          "✅ Stories loaded successfully:",
          response.data.data.length
        );
        console.log("📚 First story:", response.data.data[0]);
        setStories(response.data.data);
      } else {
        console.error("❌ API returned success: false", response.data);
        setError("Failed to load stories");
      }
    } catch (err) {
      console.error("💥 Error loading stories:", err);
      setError("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedStories = async () => {
    try {
      const response = await apiService.getFeaturedStories();
      if (response.data.success) {
        setFeaturedStories(response.data.data);
      }
    } catch (err) {
      console.error("Error loading featured stories:", err);
    }
  };

  const categories = [
    "All",
    "Success Story",
    "Career Change",
    "Entrepreneurship",
    "Academic Journey",
    "Industry Insights",
  ];

  // Use API data only
  const storiesToUse = stories;
  const featuredToUse = featuredStories;

  const filteredStories = storiesToUse.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "All" ||
      story.category === selectedCategory;
    const matchesFeatured = !showFeatured || story.isFeatured;

    return matchesSearch && matchesCategory && matchesFeatured;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="container-custom">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="container-custom">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Error Loading Stories
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadStories}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 sm:py-12 lg:py-16"
        >
          <h1 className="text-responsive-3xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6">
            {t("stories.title")}
          </h1>
          <p className="text-responsive-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t("stories.subtitle")}
          </p>
        </motion.div>

        {/* Featured Stories */}
        {!showFeatured && featuredToUse.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 sm:mb-12 lg:mb-16"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-6 h-6 text-primary-500 mr-2" />
                {t("stories.featured")}
              </h2>
              <Button
                variant="outline"
                onClick={() => setShowFeatured(true)}
                className="touch-target w-full sm:w-auto"
              >
                View All Featured
              </Button>
            </div>
            <div className="grid-responsive-3 gap-6 lg:gap-8">
              {featuredToUse.slice(0, 3).map((story, index) => (
                <StoryCard
                  key={story._id || `featured-${index}`}
                  story={story}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <Card className="p-4 sm:p-6 lg:p-8 shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <div className="space-y-4">
              <h3 className="text-responsive-lg font-semibold text-gray-900 dark:text-white">
                {t("stories.filterStories")}
              </h3>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search stories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                    className="w-full touch-target"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 lg:flex-shrink-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input w-full sm:w-auto min-w-[150px] touch-target"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant={showFeatured ? "primary" : "outline"}
                    onClick={() => setShowFeatured(!showFeatured)}
                    className="w-full sm:w-auto whitespace-nowrap touch-target"
                  >
                    {showFeatured ? "Show All" : "Featured Only"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid-responsive-3 gap-6 lg:gap-8">
          {filteredStories.map((story, index) => (
            <StoryCard
              key={story._id || `story-${index}`}
              story={story}
              index={index}
            />
          ))}
        </div>

        {filteredStories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 lg:py-20"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-responsive-lg font-medium text-gray-900 dark:text-white mb-3">
              No stories found
            </h3>
            <p className="text-responsive-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search criteria or browse all stories
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setShowFeatured(false);
              }}
              className="mt-6 touch-target"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Story Card Component
const StoryCard = ({ story, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(story.likes);
  const [showFullContent, setShowFullContent] = useState(false);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liking) return;

    // If no _id, just update UI locally
    if (!story._id) {
      setIsLiked(!isLiked);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      return;
    }

    try {
      setLiking(true);
      const response = await apiService.likeStory(story._id);
      if (response.data.success) {
        setIsLiked(!isLiked);
        setLikes(response.data.data.likes);
      }
    } catch (err) {
      console.error("Error liking story:", err);
      // Still update UI for better UX
      setIsLiked(!isLiked);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    } finally {
      setLiking(false);
    }
  };

  const contentToShow = showFullContent
    ? story.content
    : story.content.substring(0, 200) + "...";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full"
    >
      <Card
        hover
        className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 group overflow-hidden"
      >
        {/* Author Info */}
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0 shadow-lg">
            {story.author.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate text-responsive-sm">
              {story.author.name}
            </h4>
            <p className="text-responsive-xs text-gray-600 dark:text-gray-300 truncate">
              {story.author.currentRole} at {story.author.company}
            </p>
          </div>
        </div>

        {/* Story Content */}
        <div className="mb-4 sm:mb-6 flex-1 flex flex-col">
          <h3 className="text-responsive-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 line-clamp-2 leading-tight">
            {story.title}
          </h3>
          <p className="text-responsive-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 flex-1 line-clamp-4 leading-relaxed">
            {contentToShow}
          </p>
          {!showFullContent && (
            <button
              onClick={() => setShowFullContent(true)}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-responsive-xs font-medium transition-colors duration-200 self-start touch-target"
            >
              {t("stories.readMore")}
            </button>
          )}
          {showFullContent && (
            <button
              onClick={() => setShowFullContent(false)}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-responsive-xs font-medium transition-colors duration-200 self-start touch-target"
            >
              {t("stories.readLess")}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <span className="badge-primary text-responsive-xs px-3 py-1.5 rounded-full">
            {story.category}
          </span>
          {story.tags.slice(0, 2).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="badge-secondary text-responsive-xs px-3 py-1.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Key Achievements */}
        {showFullContent && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              Key Achievements:
            </h5>
            <ul className="space-y-1">
              {story.keyAchievements
                .slice(0, 3)
                .map((achievement, achIndex) => (
                  <li
                    key={achIndex}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span>{achievement}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Story Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{story.readTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{story.views} views</span>
            </div>
          </div>
          <span>{new Date(story.publishedAt).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700 gap-4">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center space-x-2 text-responsive-sm transition-all duration-200 touch-target ${
                isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
              } ${liking ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isLiked ? "fill-current" : ""
                }`}
              />
              <span className="font-medium">{likes}</span>
              {liking && <LoadingSpinner size="sm" />}
            </button>
            <button className="flex items-center space-x-2 text-responsive-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 touch-target">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">{story.comments.length}</span>
            </button>
            <button className="flex items-center space-x-2 text-responsive-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 touch-target">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium">Share</span>
            </button>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Stories;
