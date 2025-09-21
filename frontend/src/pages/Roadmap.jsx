import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  MapPin,
  ChevronRight,
  Star,
} from "lucide-react";
import { useQuery } from "react-query";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { apiService } from "../utils/api";

const Roadmap = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Mock data for roadmaps
  const mockRoadmaps = [
    {
      _id: "1",
      courseName: "Computer Science Engineering",
      description:
        "Comprehensive roadmap for Computer Science Engineering covering programming, algorithms, and software development.",
      category: "Engineering",
      duration: "4 years",
      difficulty: "Advanced",
      marketDemand: {
        current: "Very High",
        future: "Booming",
        salaryRange: {
          entry: "₹6-8 LPA",
          mid: "₹12-18 LPA",
          senior: "₹25-50 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Year 1)",
          duration: "12 months",
          milestones: [
            {
              title: "Programming Basics",
              description: "Learn C, C++, Python fundamentals",
              resources: ["Codecademy", "GeeksforGeeks"],
              completed: false,
            },
            {
              title: "Mathematics",
              description: "Discrete Mathematics, Calculus, Linear Algebra",
              resources: ["Khan Academy", "MIT OpenCourseWare"],
              completed: false,
            },
          ],
          skills: ["Programming", "Mathematics", "Problem Solving"],
        },
        {
          phase: "Core Development (Year 2)",
          duration: "12 months",
          milestones: [
            {
              title: "Data Structures & Algorithms",
              description: "Master fundamental algorithms and data structures",
              resources: ["LeetCode", "Coursera"],
              completed: false,
            },
          ],
          skills: ["Algorithms", "Data Structures", "System Design"],
        },
      ],
      resources: {
        books: ["Introduction to Algorithms", "Clean Code"],
        onlineCourses: ["CS50", "Algorithms Specialization"],
        certifications: ["AWS", "Google Cloud"],
        tools: ["VS Code", "Git", "Docker"],
      },
      institutions: [
        {
          name: "IIT Delhi",
          location: "New Delhi",
          ranking: 1,
          fees: "₹2.5 LPA",
          admissionProcess: "JEE Advanced",
        },
      ],
      tags: ["programming", "technology", "software", "algorithms"],
    },
    {
      _id: "2",
      courseName: "Data Science & Analytics",
      description:
        "Complete guide to becoming a data scientist with hands-on projects and real-world applications.",
      category: "Technology",
      duration: "2 years",
      difficulty: "Intermediate",
      marketDemand: {
        current: "High",
        future: "Booming",
        salaryRange: {
          entry: "₹8-12 LPA",
          mid: "₹15-25 LPA",
          senior: "₹30-60 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Months 1-6)",
          duration: "6 months",
          milestones: [
            {
              title: "Python Programming",
              description: "Learn Python for data science",
              resources: ["Python.org", "DataCamp"],
              completed: false,
            },
          ],
          skills: ["Python", "Statistics", "Mathematics"],
        },
      ],
      resources: {
        books: [
          "Python for Data Analysis",
          "The Elements of Statistical Learning",
        ],
        onlineCourses: [
          "Data Science Specialization",
          "Machine Learning Course",
        ],
        certifications: ["Google Data Analytics", "IBM Data Science"],
        tools: ["Jupyter", "Pandas", "Scikit-learn"],
      },
      institutions: [
        {
          name: "IIIT Hyderabad",
          location: "Hyderabad",
          ranking: 2,
          fees: "₹3 LPA",
          admissionProcess: "GATE",
        },
      ],
      tags: ["data science", "machine learning", "python", "analytics"],
    },
    {
      _id: "3",
      courseName: "Artificial Intelligence & Machine Learning",
      description:
        "Master AI and ML technologies including deep learning, neural networks, and AI applications.",
      category: "Technology",
      duration: "2 years",
      difficulty: "Advanced",
      marketDemand: {
        current: "Very High",
        future: "Revolutionary",
        salaryRange: {
          entry: "₹10-15 LPA",
          mid: "₹20-35 LPA",
          senior: "₹40-80 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Months 1-8)",
          duration: "8 months",
          milestones: [
            {
              title: "Mathematics for ML",
              description: "Linear Algebra, Calculus, Probability, Statistics",
              resources: ["3Blue1Brown", "Khan Academy"],
              completed: false,
            },
            {
              title: "Python & Libraries",
              description: "NumPy, Pandas, Matplotlib, Scikit-learn",
              resources: ["Python.org", "Kaggle"],
              completed: false,
            },
          ],
          skills: ["Mathematics", "Python", "Statistics", "Data Analysis"],
        },
      ],
      resources: {
        books: ["Pattern Recognition", "Deep Learning", "Hands-On ML"],
        onlineCourses: ["Andrew Ng's ML Course", "Fast.ai"],
        certifications: ["Google ML Engineer", "AWS ML Specialty"],
        tools: ["TensorFlow", "PyTorch", "Keras", "Jupyter"],
      },
      institutions: [
        {
          name: "IIT Bombay",
          location: "Mumbai",
          ranking: 3,
          fees: "₹2.8 LPA",
          admissionProcess: "JEE Advanced",
        },
        {
          name: "IIIT Bangalore",
          location: "Bangalore",
          ranking: 5,
          fees: "₹3.2 LPA",
          admissionProcess: "GATE",
        },
      ],
      tags: [
        "artificial intelligence",
        "machine learning",
        "deep learning",
        "neural networks",
      ],
    },
    {
      _id: "4",
      courseName: "Cybersecurity",
      description:
        "Learn to protect digital assets and systems from cyber threats and attacks.",
      category: "Technology",
      duration: "2 years",
      difficulty: "Advanced",
      marketDemand: {
        current: "High",
        future: "Critical",
        salaryRange: {
          entry: "₹8-12 LPA",
          mid: "₹18-30 LPA",
          senior: "₹35-70 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Months 1-6)",
          duration: "6 months",
          milestones: [
            {
              title: "Network Security",
              description:
                "Understanding networks, protocols, and vulnerabilities",
              resources: ["Cisco Networking", "CompTIA Security+"],
              completed: false,
            },
          ],
          skills: ["Network Security", "Cryptography", "Risk Assessment"],
        },
      ],
      resources: {
        books: ["Hacking: Art of Exploitation", "Network Security Essentials"],
        onlineCourses: ["Cybrary", "SANS", "TryHackMe"],
        certifications: ["CEH", "CISSP", "CompTIA Security+"],
        tools: ["Wireshark", "Nmap", "Metasploit", "Burp Suite"],
      },
      institutions: [
        {
          name: "NIT Trichy",
          location: "Tiruchirappalli",
          ranking: 8,
          fees: "₹2.2 LPA",
          admissionProcess: "JEE Main",
        },
      ],
      tags: [
        "cybersecurity",
        "information security",
        "ethical hacking",
        "network security",
      ],
    },
    {
      _id: "5",
      courseName: "Medicine (MBBS)",
      description:
        "Comprehensive medical education covering human anatomy, physiology, pathology, and clinical practice.",
      category: "Medicine",
      duration: "5.5 years",
      difficulty: "Very Advanced",
      marketDemand: {
        current: "Always High",
        future: "Essential",
        salaryRange: {
          entry: "₹8-15 LPA",
          mid: "₹20-40 LPA",
          senior: "₹50-100 LPA",
        },
      },
      timeline: [
        {
          phase: "Pre-clinical (Years 1-2)",
          duration: "24 months",
          milestones: [
            {
              title: "Basic Sciences",
              description: "Anatomy, Physiology, Biochemistry",
              resources: ["Gray's Anatomy", "Guyton Physiology"],
              completed: false,
            },
          ],
          skills: ["Medical Knowledge", "Patient Care", "Clinical Skills"],
        },
      ],
      resources: {
        books: ["Gray's Anatomy", "Harrison's Medicine", "Robbins Pathology"],
        onlineCourses: ["Osmosis", "Medscape", "UpToDate"],
        certifications: ["MBBS", "MD/MS", "Specialization"],
        tools: ["Stethoscope", "Medical Apps", "Clinical Software"],
      },
      institutions: [
        {
          name: "AIIMS Delhi",
          location: "New Delhi",
          ranking: 1,
          fees: "₹1.5 LPA",
          admissionProcess: "NEET",
        },
        {
          name: "CMC Vellore",
          location: "Vellore",
          ranking: 2,
          fees: "₹4.5 LPA",
          admissionProcess: "NEET",
        },
      ],
      tags: ["medicine", "healthcare", "clinical practice", "patient care"],
    },
    {
      _id: "6",
      courseName: "Business Administration (MBA)",
      description:
        "Master business strategy, management, finance, marketing, and leadership skills.",
      category: "Commerce",
      duration: "2 years",
      difficulty: "Advanced",
      marketDemand: {
        current: "High",
        future: "Stable",
        salaryRange: {
          entry: "₹12-20 LPA",
          mid: "₹25-50 LPA",
          senior: "₹60-150 LPA",
        },
      },
      timeline: [
        {
          phase: "Core Modules (Year 1)",
          duration: "12 months",
          milestones: [
            {
              title: "Business Fundamentals",
              description: "Finance, Marketing, Operations, Strategy",
              resources: ["Harvard Business Review", "Coursera MBA"],
              completed: false,
            },
          ],
          skills: ["Leadership", "Strategy", "Finance", "Marketing"],
        },
      ],
      resources: {
        books: ["Good to Great", "Blue Ocean Strategy", "Lean Startup"],
        onlineCourses: ["Harvard Business School", "Wharton", "INSEAD"],
        certifications: ["MBA", "CFA", "PMP"],
        tools: ["Excel", "Tableau", "Salesforce", "SAP"],
      },
      institutions: [
        {
          name: "IIM Ahmedabad",
          location: "Ahmedabad",
          ranking: 1,
          fees: "₹23 LPA",
          admissionProcess: "CAT",
        },
        {
          name: "IIM Bangalore",
          location: "Bangalore",
          ranking: 2,
          fees: "₹21 LPA",
          admissionProcess: "CAT",
        },
      ],
      tags: ["business", "management", "leadership", "strategy"],
    },
    {
      _id: "7",
      courseName: "Digital Marketing",
      description:
        "Master online marketing strategies, SEO, social media, content marketing, and analytics.",
      category: "Commerce",
      duration: "1 year",
      difficulty: "Beginner",
      marketDemand: {
        current: "Very High",
        future: "Growing",
        salaryRange: {
          entry: "₹4-8 LPA",
          mid: "₹10-18 LPA",
          senior: "₹20-40 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Months 1-4)",
          duration: "4 months",
          milestones: [
            {
              title: "Digital Marketing Basics",
              description: "SEO, SEM, Social Media, Content Marketing",
              resources: ["Google Digital Garage", "HubSpot Academy"],
              completed: false,
            },
          ],
          skills: ["SEO", "Social Media", "Content Creation", "Analytics"],
        },
      ],
      resources: {
        books: ["Digital Marketing for Dummies", "SEO 2023"],
        onlineCourses: ["Google Analytics", "Facebook Blueprint", "HubSpot"],
        certifications: ["Google Ads", "Facebook Marketing", "HubSpot"],
        tools: ["Google Analytics", "Hootsuite", "Canva", "Mailchimp"],
      },
      institutions: [
        {
          name: "MICA Ahmedabad",
          location: "Ahmedabad",
          ranking: 1,
          fees: "₹18 LPA",
          admissionProcess: "CAT/MICAT",
        },
      ],
      tags: ["digital marketing", "seo", "social media", "content marketing"],
    },
    {
      _id: "8",
      courseName: "Graphic Design & UI/UX",
      description:
        "Learn visual design, user experience, interface design, and creative software tools.",
      category: "Arts",
      duration: "2 years",
      difficulty: "Intermediate",
      marketDemand: {
        current: "High",
        future: "Growing",
        salaryRange: {
          entry: "₹4-8 LPA",
          mid: "₹10-20 LPA",
          senior: "₹25-50 LPA",
        },
      },
      timeline: [
        {
          phase: "Design Fundamentals (Months 1-8)",
          duration: "8 months",
          milestones: [
            {
              title: "Design Principles",
              description: "Typography, Color Theory, Layout Design",
              resources: ["Adobe Creative Suite", "Behance"],
              completed: false,
            },
          ],
          skills: [
            "Visual Design",
            "User Research",
            "Prototyping",
            "Adobe Suite",
          ],
        },
      ],
      resources: {
        books: ["Don't Make Me Think", "Design of Everyday Things"],
        onlineCourses: ["Udemy Design", "Skillshare", "Interaction Design"],
        certifications: ["Adobe Certified", "Google UX Design"],
        tools: ["Figma", "Adobe XD", "Sketch", "Photoshop"],
      },
      institutions: [
        {
          name: "NID Ahmedabad",
          location: "Ahmedabad",
          ranking: 1,
          fees: "₹2.5 LPA",
          admissionProcess: "NID Entrance Exam",
        },
      ],
      tags: [
        "graphic design",
        "ui design",
        "ux design",
        "visual communication",
      ],
    },
    {
      _id: "9",
      courseName: "Civil Engineering",
      description:
        "Design and construct infrastructure including buildings, roads, bridges, and water systems.",
      category: "Engineering",
      duration: "4 years",
      difficulty: "Advanced",
      marketDemand: {
        current: "High",
        future: "Stable",
        salaryRange: {
          entry: "₹4-8 LPA",
          mid: "₹10-20 LPA",
          senior: "₹25-50 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Year 1)",
          duration: "12 months",
          milestones: [
            {
              title: "Engineering Mathematics",
              description: "Calculus, Differential Equations, Statistics",
              resources: ["Engineering Mathematics", "Khan Academy"],
              completed: false,
            },
          ],
          skills: ["Structural Analysis", "Project Management", "AutoCAD"],
        },
      ],
      resources: {
        books: ["Structural Analysis", "Concrete Technology", "Soil Mechanics"],
        onlineCourses: ["Coursera Engineering", "edX MIT"],
        certifications: ["PMP", "AutoCAD", "Revit"],
        tools: ["AutoCAD", "Revit", "STAAD Pro", "ETABS"],
      },
      institutions: [
        {
          name: "IIT Madras",
          location: "Chennai",
          ranking: 4,
          fees: "₹2.5 LPA",
          admissionProcess: "JEE Advanced",
        },
      ],
      tags: [
        "civil engineering",
        "construction",
        "infrastructure",
        "structural design",
      ],
    },
    {
      _id: "10",
      courseName: "Psychology",
      description:
        "Study human behavior, mental processes, and psychological principles for therapy and research.",
      category: "Science",
      duration: "3 years",
      difficulty: "Intermediate",
      marketDemand: {
        current: "Moderate",
        future: "Growing",
        salaryRange: {
          entry: "₹3-6 LPA",
          mid: "₹8-15 LPA",
          senior: "₹20-40 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Year 1)",
          duration: "12 months",
          milestones: [
            {
              title: "Introduction to Psychology",
              description: "Basic psychological principles and theories",
              resources: ["Introduction to Psychology", "Khan Academy"],
              completed: false,
            },
          ],
          skills: [
            "Research Methods",
            "Counseling",
            "Psychological Assessment",
          ],
        },
      ],
      resources: {
        books: ["Introduction to Psychology", "Abnormal Psychology"],
        onlineCourses: ["Coursera Psychology", "edX MIT"],
        certifications: ["Licensed Psychologist", "Clinical Psychology"],
        tools: ["SPSS", "Psychological Tests", "Assessment Tools"],
      },
      institutions: [
        {
          name: "Delhi University",
          location: "New Delhi",
          ranking: 1,
          fees: "₹50,000/year",
          admissionProcess: "CUET",
        },
      ],
      tags: ["psychology", "mental health", "counseling", "behavioral science"],
    },
    {
      _id: "11",
      courseName: "Environmental Science",
      description:
        "Study environmental issues, sustainability, climate change, and conservation strategies.",
      category: "Science",
      duration: "3 years",
      difficulty: "Intermediate",
      marketDemand: {
        current: "Growing",
        future: "Critical",
        salaryRange: {
          entry: "₹4-8 LPA",
          mid: "₹10-20 LPA",
          senior: "₹25-50 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Year 1)",
          duration: "12 months",
          milestones: [
            {
              title: "Environmental Basics",
              description: "Ecology, Climate Science, Sustainability",
              resources: ["Environmental Science", "Coursera"],
              completed: false,
            },
          ],
          skills: ["Environmental Assessment", "Sustainability", "Research"],
        },
      ],
      resources: {
        books: [
          "Environmental Science",
          "Silent Spring",
          "The Sixth Extinction",
        ],
        onlineCourses: ["Coursera Environment", "edX MIT"],
        certifications: ["Environmental Impact Assessment", "LEED"],
        tools: ["GIS", "Remote Sensing", "Environmental Modeling"],
      },
      institutions: [
        {
          name: "TERI University",
          location: "New Delhi",
          ranking: 1,
          fees: "₹3 LPA",
          admissionProcess: "Entrance Exam",
        },
      ],
      tags: ["environment", "sustainability", "climate change", "conservation"],
    },
    {
      _id: "12",
      courseName: "Journalism & Mass Communication",
      description:
        "Learn media production, news reporting, broadcasting, and digital communication skills.",
      category: "Arts",
      duration: "3 years",
      difficulty: "Intermediate",
      marketDemand: {
        current: "Moderate",
        future: "Evolving",
        salaryRange: {
          entry: "₹3-6 LPA",
          mid: "₹8-15 LPA",
          senior: "₹20-40 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Year 1)",
          duration: "12 months",
          milestones: [
            {
              title: "Media Fundamentals",
              description: "News Writing, Broadcasting, Digital Media",
              resources: ["AP Stylebook", "Journalism.org"],
              completed: false,
            },
          ],
          skills: ["Writing", "Video Production", "Social Media", "Editing"],
        },
      ],
      resources: {
        books: ["Elements of Journalism", "On Writing Well"],
        onlineCourses: ["Poynter", "Coursera Journalism"],
        certifications: ["Journalism Certification", "Video Production"],
        tools: ["Adobe Premiere", "Canon Cameras", "WordPress"],
      },
      institutions: [
        {
          name: "IIMC Delhi",
          location: "New Delhi",
          ranking: 1,
          fees: "₹1.5 LPA",
          admissionProcess: "Entrance Exam",
        },
      ],
      tags: ["journalism", "media", "broadcasting", "communication"],
    },
  ];

  const categories = [
    "All",
    "Engineering",
    "Technology",
    "Medicine",
    "Arts",
    "Commerce",
    "Science",
  ];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredRoadmaps = mockRoadmaps.filter((roadmap) => {
    const matchesSearch =
      roadmap.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "All" ||
      roadmap.category === selectedCategory;
    const matchesDifficulty =
      !selectedDifficulty ||
      selectedDifficulty === "All" ||
      roadmap.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-4 sm:py-6 lg:py-12">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6">
            {t("roadmap.title")}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            {t("roadmap.subtitle")}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8 lg:mb-10"
        >
          <Card className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="sm:col-span-2 lg:col-span-2">
                <Input
                  placeholder={t("roadmap.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                  className="w-full touch-target min-h-[44px]"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input w-full touch-target min-h-[44px] text-sm sm:text-base"
              >
                <option value="">{t("roadmap.category")}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input w-full touch-target min-h-[44px] text-sm sm:text-base"
              >
                <option value="">{t("roadmap.difficulty")}</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {filteredRoadmaps.map((roadmap, index) => (
            <motion.div
              key={roadmap._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full p-4 sm:p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight">
                          {roadmap.courseName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                          {roadmap.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-sm font-medium">
                          4.8
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      <span className="badge-primary text-xs px-2 py-1">
                        {roadmap.category}
                      </span>
                      <span className="badge-secondary text-xs px-2 py-1">
                        {roadmap.difficulty}
                      </span>
                      <span className="badge-secondary text-xs px-2 py-1">
                        {roadmap.duration}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {roadmap.marketDemand.current}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Demand
                        </div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {roadmap.marketDemand.salaryRange.entry}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Starting Salary
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 sm:mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                        Top Skills:
                      </h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {roadmap.timeline[0]?.skills
                          ?.slice(0, 3)
                          .map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="mb-4 sm:mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                        Top Institutions:
                      </h4>
                      <div className="space-y-2">
                        {roadmap.institutions
                          .slice(0, 2)
                          .map((institution, instIndex) => (
                            <div
                              key={instIndex}
                              className="flex items-start space-x-2 text-xs sm:text-sm"
                            >
                              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <span className="text-gray-600 dark:text-gray-300 font-medium">
                                  {institution.name}
                                </span>
                                <span className="text-gray-400 dark:text-gray-500 ml-1">
                                  •
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  {institution.location}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <Button className="w-full touch-target min-h-[44px] text-sm sm:text-base">
                      {t("roadmap.view")}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredRoadmaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No roadmaps found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;
