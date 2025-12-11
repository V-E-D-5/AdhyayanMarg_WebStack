import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  BookOpen,
  Map,
  Building2,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  Target,
  Globe,
  MessageCircle,
  GraduationCap,
  Briefcase,
  Heart,
  Zap,
} from "lucide-react";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: t("home.features.quiz.title"),
      description: t("home.features.quiz.description"),
      link: "/quiz",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: t("home.features.roadmap.title"),
      description: t("home.features.roadmap.description"),
      link: "/roadmap",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: t("home.features.colleges.title"),
      description: t("home.features.colleges.description"),
      link: "/colleges",
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Career Counselor",
      description:
        "Get personalized career guidance from our intelligent AI assistant",
      link: "/chatbot",
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const stats = [
    {
      label: "Students Helped",
      value: "25,847",
      icon: <Users className="w-6 h-6" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      trend: "+12%",
      description: "Active users this month",
    },
    {
      label: "Career Paths",
      value: "150+",
      icon: <Map className="w-6 h-6" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900",
      trend: "+8%",
      description: "Detailed roadmaps available",
    },
    {
      label: "Colleges Listed",
      value: "2,500+",
      icon: <Building2 className="w-6 h-6" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      trend: "+15%",
      description: "Institutions across India",
    },
    {
      label: "Success Stories",
      value: "1,200+",
      icon: <Star className="w-6 h-6" />,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900",
      trend: "+25%",
      description: "Inspiring journeys shared",
    },
    {
      label: "AI Queries",
      value: "50,000+",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900",
      trend: "+45%",
      description: "Answered by our AI assistant",
    },
    {
      label: "Scholarships",
      value: "500+",
      icon: <Award className="w-6 h-6" />,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900",
      trend: "+20%",
      description: "Funding opportunities listed",
    },
  ];

  const achievements = [
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      title: "95% Success Rate",
      description:
        "Students who follow our guidance get placed in top companies",
      color: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "98% Accuracy",
      description:
        "Career assessment quiz accuracy in matching students with right paths",
      color: "border-green-200 dark:border-green-800",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "24/7 AI Support",
      description:
        "Round-the-clock assistance from our intelligent career counselor",
      color: "border-yellow-200 dark:border-yellow-800",
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: "Multi-Language",
      description:
        "Available in English, Hindi, and Kannada for better accessibility",
      color: "border-purple-200 dark:border-purple-800",
    },
  ];

  const platformStats = [
    {
      category: "User Engagement",
      metrics: [
        {
          label: "Average Session Time",
          value: "12.5 min",
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          label: "Page Views",
          value: "2.1M+",
          icon: <Globe className="w-4 h-4" />,
        },
        {
          label: "Return Users",
          value: "78%",
          icon: <Heart className="w-4 h-4" />,
        },
      ],
    },
    {
      category: "Career Success",
      metrics: [
        {
          label: "Job Placements",
          value: "8,500+",
          icon: <Briefcase className="w-4 h-4" />,
        },
        {
          label: "Top Companies",
          value: "200+",
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          label: "Average Salary",
          value: "₹12.5L",
          icon: <Award className="w-4 h-4" />,
        },
      ],
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      content:
        "Yukti helped me discover my passion for technology and guided me through the entire journey from college selection to landing my dream job.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Rahul Kumar",
      role: "Data Scientist at Microsoft",
      content:
        "The career assessment quiz was incredibly accurate. It helped me understand my strengths and choose the right path in data science.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Anita Singh",
      role: "Doctor at AIIMS",
      content:
        "The roadmap feature provided me with a clear path to achieve my medical career goals. Highly recommended for aspiring doctors.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center py-12 sm:py-16 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-responsive-3xl font-bold text-white mb-6 sm:mb-8 leading-tight">
                {t("home.title")}
              </h1>
              <p className="text-responsive-lg text-primary-100 mb-8 sm:mb-10 leading-relaxed">
                {t("home.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link to="/quiz">
                  <Button
                    size="lg"
                    className="bg-white text-primary-600 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 touch-target w-full sm:w-auto min-h-[52px] text-base sm:text-lg"
                  >
                    {t("home.cta")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/roadmap">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 touch-target w-full sm:w-auto min-h-[52px] text-base sm:text-lg"
                  >
                    Explore Roadmaps
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 lg:mt-0 lg:ml-8 xl:ml-12"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Career Assessment Complete</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-sm text-primary-100">
                      Recommended: Software Engineering
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>95% Match with your interests</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-4">Platform Statistics</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Empowering students with data-driven career guidance and
              comprehensive resources
            </p>
          </motion.div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.description}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Platform Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h3 className="heading-3 text-center mb-12">
              Platform Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="group"
                >
                  <Card
                    className={`p-6 text-center border-2 ${achievement.color} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                  >
                    <div className="flex justify-center mb-4">
                      {achievement.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {achievement.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Detailed Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="heading-3 text-center mb-12">Detailed Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {platformStats.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{
                    opacity: 0,
                    x: categoryIndex % 2 === 0 ? -20 : 20,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + categoryIndex * 0.1,
                  }}
                >
                  <Card className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                      {category.category}
                    </h4>
                    <div className="space-y-4">
                      {category.metrics.map((metric, metricIndex) => (
                        <div
                          key={metric.label}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-primary-600 dark:text-primary-400">
                              {metric.icon}
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {metric.label}
                            </span>
                          </div>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">
              Everything You Need for Career Success
            </h2>
            <p className="text-body max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Our comprehensive platform provides all the tools and resources
              you need to make informed career decisions and achieve your goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full text-center flex flex-col">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-xl mb-6 mx-auto`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="heading-4 mb-3 text-gray-900 dark:text-white flex-grow-0">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-auto">
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full min-h-[44px]">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">
              How Yukti Works
            </h2>
            <p className="text-body max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Our proven 3-step process helps you discover, plan, and achieve
              your career goals with confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  1
                </span>
              </div>
              <h3 className="heading-4 mb-4 text-gray-900 dark:text-white">
                Discover Your Path
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Take our comprehensive career assessment quiz to understand your
                interests, strengths, and personality type.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  2
                </span>
              </div>
              <h3 className="heading-4 mb-4 text-gray-900 dark:text-white">
                Plan Your Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get detailed roadmaps, course recommendations, and step-by-step
                guidance tailored to your career goals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  3
                </span>
              </div>
              <h3 className="heading-4 mb-4 text-gray-900 dark:text-white">
                Achieve Success
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Find the right colleges, apply for scholarships, and connect
                with opportunities that match your aspirations.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link to="/quiz">
              <Button size="lg" className="min-h-[52px] text-lg px-8">
                Start Your Journey Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-4 text-gray-900 dark:text-white">
              What Our Users Say
            </h2>
            <p className="text-body max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Join thousands of students who have found their perfect career
              path with our guidance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic flex-grow leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center mt-auto">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-primary text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-2 text-white mb-4">
              {isAuthenticated
                ? "Welcome to Your Career Dashboard!"
                : "Ready to Start Your Career Journey?"}
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              {isAuthenticated
                ? "Access your personalized dashboard to track your progress, view recommendations, and continue your career development journey."
                : "Take our comprehensive career assessment quiz and discover your ideal career path in just 10 minutes."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-primary-600 hover:bg-gray-50 min-h-[52px] text-lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/quiz">
                    <Button
                      size="lg"
                      className="bg-white text-primary-600 hover:bg-gray-50 min-h-[52px] text-lg"
                    >
                      Take Know-Me
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-primary-600 min-h-[52px] text-lg"
                    onClick={() => navigate("/login")}
                  >
                    Login/Signup to Get Started
                  </Button>
                </>
              )}
              <Link to="/stories">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600 min-h-[52px] text-lg"
                >
                  Read Success Stories
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
