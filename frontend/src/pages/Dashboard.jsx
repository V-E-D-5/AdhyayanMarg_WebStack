import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "react-query";
import {
  MessageCircle,
  Briefcase,
  Award,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Clock,
  ExternalLink,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Filter,
  Search,
  ChevronRight,
  Play,
  Download,
  Share2,
  Heart,
  Eye,
  MessageSquare,
  BarChart3,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../utils/api";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [userAnalytics, setUserAnalytics] = useState({
    totalInteractions: 0,
    completedCourses: 0,
    appliedInternships: 0,
    appliedScholarships: 0,
    totalHours: 0,
    achievements: 0,
  });

  // Fetch user analytics
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery("userAnalytics", apiService.getUserAnalytics, {
    onSuccess: (data) => {
      if (data.success) {
        setUserAnalytics(data.data);
      }
    },
    onError: (error) => {
      console.error("Failed to fetch analytics:", error);
      // Keep default values (0) on error
    },
  });

  // Reset analytics mutation
  const resetAnalyticsMutation = useMutation(apiService.resetUserAnalytics, {
    onSuccess: (data) => {
      if (data.success) {
        setUserAnalytics(data.data);
        refetchAnalytics();
      }
    },
    onError: (error) => {
      console.error("Failed to reset analytics:", error);
    },
  });

  // Update analytics mutation
  const updateAnalyticsMutation = useMutation(apiService.updateUserAnalytics, {
    onSuccess: (data) => {
      if (data.success) {
        setUserAnalytics(data.data);
        refetchAnalytics();
      }
    },
    onError: (error) => {
      console.error("Failed to update analytics:", error);
    },
  });

  // Note: Analytics are now only reset during user registration, not on every login

  // Update page title
  useEffect(() => {
    document.title = "Overview - Career Guidance Platform";
    return () => {
      document.title = "Career Guidance Platform";
    };
  }, []);

  // Mock data for different sections
  const mockData = {
    chatHistory: [
      {
        id: 1,
        title: "Career Guidance for Computer Science",
        lastMessage: "What are the best career paths after CS?",
        timestamp: "2 hours ago",
        messageCount: 15,
        category: "Career Guidance",
        status: "completed",
      },
      {
        id: 2,
        title: "College Selection Help",
        lastMessage: "Which IITs should I apply to?",
        timestamp: "1 day ago",
        messageCount: 8,
        category: "College Selection",
        status: "active",
      },
      {
        id: 3,
        title: "Scholarship Information",
        lastMessage: "Tell me about government scholarships",
        timestamp: "3 days ago",
        messageCount: 12,
        category: "Scholarships",
        status: "completed",
      },
    ],
    internships: [
      // Google Internships
      {
        id: 1,
        title: "Software Engineering Intern",
        company: "Google",
        location: "Bangalore, India",
        duration: "12-14 weeks",
        stipend: "₹1,20,000/month",
        type: "Full-time",
        deadline: "2024-03-15",
        requirements: [
          "Computer Science or related field",
          "Strong programming skills in C++, Java, or Python",
          "Data structures and algorithms knowledge",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Work on Google's core products and infrastructure. Contribute to projects that impact billions of users worldwide while learning from world-class engineers.",
        rating: 4.9,
        applicants: 2500,
        isApplied: false,
        isBookmarked: false,
        source: "Google Careers",
        metadata: {
          website: "https://careers.google.com/jobs/results/?q=intern",
          applicationMode: "Online through Google Careers Portal",
          eligibility: "Students in 2nd year or above",
          benefits: [
            "Mentorship",
            "Free meals",
            "Transportation",
            "Health insurance",
          ],
          interviewProcess: [
            "Online Assessment",
            "Technical Interview",
            "Behavioral Interview",
          ],
          documentsRequired: [
            "Resume",
            "Cover Letter",
            "Academic Transcripts",
            "Portfolio (if applicable)",
          ],
        },
      },
      {
        id: 2,
        title: "Product Management Intern",
        company: "Google",
        location: "Mumbai, India",
        duration: "12 weeks",
        stipend: "₹1,00,000/month",
        type: "Full-time",
        deadline: "2024-03-20",
        requirements: [
          "Business, Engineering, or related field",
          "Strong analytical and communication skills",
          "Experience with data analysis tools",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Work closely with product managers to define product strategy, analyze user data, and drive product decisions for Google's consumer and enterprise products.",
        rating: 4.8,
        applicants: 1800,
        isApplied: false,
        isBookmarked: false,
        source: "Google Careers",
        metadata: {
          website:
            "https://careers.google.com/jobs/results/?q=product%20management%20intern",
          applicationMode: "Online through Google Careers Portal",
          eligibility: "Students in 2nd year or above",
          benefits: [
            "Mentorship",
            "Free meals",
            "Transportation",
            "Health insurance",
          ],
          interviewProcess: [
            "Case Study",
            "Product Sense Interview",
            "Behavioral Interview",
          ],
          documentsRequired: [
            "Resume",
            "Cover Letter",
            "Academic Transcripts",
            "Case Study Examples",
          ],
        },
      },
      // Microsoft Internships
      {
        id: 3,
        title: "Software Development Intern",
        company: "Microsoft",
        location: "Hyderabad, India",
        duration: "12 weeks",
        stipend: "₹90,000/month",
        type: "Full-time",
        deadline: "2024-04-01",
        requirements: [
          "Computer Science or related field",
          "Proficiency in C#, .NET, or similar technologies",
          "Understanding of cloud computing concepts",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Build innovative solutions using Microsoft technologies. Work on Azure, Office 365, or Windows products while contributing to real-world projects.",
        rating: 4.7,
        applicants: 2200,
        isApplied: false,
        isBookmarked: false,
        source: "Microsoft Careers",
        metadata: {
          website:
            "https://careers.microsoft.com/us/en/search-results?keywords=intern",
          applicationMode: "Online through Microsoft Careers Portal",
          eligibility: "Students in 2nd year or above",
          benefits: [
            "Mentorship",
            "Free meals",
            "Transportation",
            "Health insurance",
            "Gym membership",
          ],
          interviewProcess: [
            "Online Assessment",
            "Technical Interview",
            "System Design Interview",
          ],
          documentsRequired: [
            "Resume",
            "Cover Letter",
            "Academic Transcripts",
            "Code Samples",
          ],
        },
      },
      {
        id: 4,
        title: "Data Science Intern",
        company: "Microsoft",
        location: "Bangalore, India",
        duration: "12 weeks",
        stipend: "₹95,000/month",
        type: "Full-time",
        deadline: "2024-04-05",
        requirements: [
          "Data Science, Statistics, or related field",
          "Python, R, or SQL proficiency",
          "Machine Learning knowledge",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Analyze large datasets to derive insights and build machine learning models. Work on projects that impact Microsoft's products and services.",
        rating: 4.6,
        applicants: 1900,
        isApplied: false,
        isBookmarked: false,
        source: "Microsoft Careers",
        metadata: {
          website:
            "https://careers.microsoft.com/us/en/search-results?keywords=data%20science%20intern",
          applicationMode: "Online through Microsoft Careers Portal",
          eligibility: "Students in 2nd year or above",
          benefits: [
            "Mentorship",
            "Free meals",
            "Transportation",
            "Health insurance",
            "Gym membership",
          ],
          interviewProcess: [
            "Technical Assessment",
            "Data Analysis Interview",
            "Machine Learning Interview",
          ],
          documentsRequired: [
            "Resume",
            "Cover Letter",
            "Academic Transcripts",
            "Data Science Portfolio",
          ],
        },
      },
      // Amazon Internships
      {
        id: 5,
        title: "Software Development Engineer Intern",
        company: "Amazon",
        location: "Bangalore, India",
        duration: "12-16 weeks",
        stipend: "₹1,10,000/month",
        type: "Full-time",
        deadline: "2024-03-25",
        requirements: [
          "Computer Science or related field",
          "Strong programming skills in Java, C++, or Python",
          "Data structures and algorithms knowledge",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Design and develop software solutions for Amazon's e-commerce platform. Work on scalable systems that serve millions of customers worldwide.",
        rating: 4.8,
        applicants: 2800,
        isApplied: false,
        isBookmarked: false,
        source: "Amazon Jobs",
        metadata: {
          website:
            "https://www.amazon.jobs/en/search?base_query=intern&offset=0&result_limit=10",
          applicationMode: "Online through Amazon Jobs Portal",
          eligibility: "Students in 2nd year or above",
          benefits: [
            "Mentorship",
            "Free meals",
            "Transportation",
            "Health insurance",
            "Stock options",
          ],
          interviewProcess: [
            "Online Assessment",
            "Technical Interview",
            "System Design Interview",
            "Behavioral Interview",
          ],
          documentsRequired: [
            "Resume",
            "Cover Letter",
            "Academic Transcripts",
            "Code Samples",
          ],
        },
      },
      {
        id: 6,
        title: "Product Manager Intern",
        company: "Amazon",
        location: "Mumbai, India",
        duration: "12 weeks",
        stipend: "₹85,000/month",
        type: "Full-time",
        deadline: "2024-03-30",
        requirements: [
          "Business, Engineering, or related field",
          "Strong analytical and problem-solving skills",
          "Experience with data analysis",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Drive product strategy and roadmap for Amazon's consumer products. Work with cross-functional teams to deliver customer-focused solutions.",
        rating: 4.7,
        applicants: 1600,
        isApplied: false,
        isBookmarked: false,
        source: "Amazon Jobs",
        metadata: {
          website:
            "https://www.amazon.jobs/en/search?base_query=product%20manager%20intern",
          applicationMode: "Online through Amazon Jobs Portal",
          eligibility: "Students in 2nd year or above",
          benefits: [
            "Mentorship",
            "Free meals",
            "Transportation",
            "Health insurance",
            "Stock options",
          ],
          interviewProcess: [
            "Case Study",
            "Product Sense Interview",
            "Behavioral Interview",
          ],
          documentsRequired: [
            "Resume",
            "Cover Letter",
            "Academic Transcripts",
            "Product Analysis Examples",
          ],
        },
      },
      // Meta (Facebook) Internships
      {
        id: 7,
        title: "Software Engineering Intern",
        company: "Meta",
        location: "Mumbai, India",
        duration: "12-16 weeks",
        stipend: "₹1,15,000/month",
        type: "Full-time",
        deadline: "2024-04-10",
        requirements: [
          "Computer Science or related field",
          "Proficiency in React, JavaScript, or similar technologies",
          "Understanding of web technologies",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Build products that connect people worldwide. Work on Facebook, Instagram, WhatsApp, or Reality Labs products while learning from industry experts.",
        rating: 4.9,
        applicants: 2100,
        isApplied: false,
        isBookmarked: false,
        source: "Meta Careers",
        metadata: {
          website: "https://www.metacareers.com/jobs/?q=intern",
          applicationMode: "Online through Meta Careers Portal",
          eligibility: "Students in 2nd year or above",
          benefits: [
            "Mentorship",
            "Free meals",
            "Transportation",
            "Health insurance",
            "Gym membership",
          ],
          interviewProcess: [
            "Online Assessment",
            "Technical Interview",
            "System Design Interview",
          ],
          documentsRequired: [
            "Resume",
            "Cover Letter",
            "Academic Transcripts",
            "Portfolio",
          ],
        },
      },
      // Apple Internships
      {
        id: 8,
        title: "iOS Development Intern",
        company: "Apple",
        location: "Hyderabad, India",
        duration: "12 weeks",
        stipend: "₹1,05,000/month",
        type: "Full-time",
        deadline: "2024-04-15",
        requirements: [
          "Computer Science or related field",
          "Swift or Objective-C experience",
          "iOS development knowledge",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Develop innovative iOS applications for Apple's ecosystem. Work on apps that millions of users interact with daily on their iPhones and iPads.",
        rating: 4.8,
        applicants: 1700,
        isApplied: false,
        isBookmarked: false,
        source: "Apple Jobs",
        metadata: {
          website: "https://jobs.apple.com/en-us/search?search=intern",
          applicationMode: "Online through Apple Jobs Portal",
          eligibility: "Students in 2nd year or above",
          benefits: [
            "Mentorship",
            "Free meals",
            "Transportation",
            "Health insurance",
            "Product discounts",
          ],
          interviewProcess: [
            "Technical Assessment",
            "iOS Development Interview",
            "Behavioral Interview",
          ],
          documentsRequired: [
            "Resume",
            "Cover Letter",
            "Academic Transcripts",
            "iOS App Portfolio",
          ],
        },
      },
      // Netflix Internships
      {
        id: 9,
        title: "Data Engineering Intern",
        company: "Netflix",
        location: "Mumbai, India",
        duration: "12 weeks",
        stipend: "₹1,00,000/month",
        type: "Full-time",
        deadline: "2024-04-20",
        requirements: [
          "Computer Science or Data Engineering field",
          "Python, SQL, and big data technologies",
          "Understanding of data pipelines",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Build and maintain data infrastructure that powers Netflix's recommendation engine and content delivery. Work with massive datasets to improve user experience.",
        rating: 4.7,
        applicants: 1400,
        isApplied: false,
        isBookmarked: false,
        source: "Netflix Jobs",
        metadata: {
          website: "https://jobs.netflix.com/search?q=intern",
          applicationMode: "Online through Netflix Jobs Portal",
          eligibility: "Students in 2nd year or above",
          benefits: [
            "Mentorship",
            "Free meals",
            "Transportation",
            "Health insurance",
            "Netflix subscription",
          ],
          interviewProcess: [
            "Technical Assessment",
            "Data Engineering Interview",
            "System Design Interview",
          ],
          documentsRequired: [
            "Resume",
            "Cover Letter",
            "Academic Transcripts",
            "Data Engineering Projects",
          ],
        },
      },
    ],
    scholarships: [
      // NSP (National Scholarship Portal) Scholarships
      {
        id: 1,
        title: "Post Matric Scholarship for SC/ST/OBC Students",
        provider: "Ministry of Social Justice and Empowerment",
        source: "NSP (National Scholarship Portal)",
        amount: "₹10,000 - ₹1,20,000/year",
        deadline: "2024-12-31",
        eligibility: "SC/ST/OBC students pursuing higher education",
        description:
          "Central government scholarship for students from reserved categories pursuing post-matriculation courses.",
        requirements: [
          "SC/ST/OBC Category Certificate",
          "Income Certificate (Family income < ₹2.5 Lakh)",
          "Admission in recognized institution",
          "Aadhaar Card",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
        metadata: {
          website: "https://scholarships.gov.in",
          applicationMode: "Online through NSP",
          renewalRequired: true,
          documentsRequired: [
            "Caste Certificate",
            "Income Certificate",
            "Fee Receipt",
            "Bank Details",
          ],
        },
      },
      {
        id: 2,
        title:
          "Merit Cum Means Scholarship for Professional and Technical Courses",
        provider: "Ministry of Minority Affairs",
        source: "NSP (National Scholarship Portal)",
        amount: "₹5,000 - ₹30,000/year",
        deadline: "2024-12-31",
        eligibility: "Minority community students with 50% marks",
        description:
          "Scholarship for students from minority communities pursuing professional and technical courses.",
        requirements: [
          "Minority Community Certificate",
          "Income Certificate (Family income < ₹2.5 Lakh)",
          "Minimum 50% marks in previous exam",
          "Admission in recognized institution",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
        metadata: {
          website: "https://scholarships.gov.in",
          applicationMode: "Online through NSP",
          renewalRequired: true,
          documentsRequired: [
            "Minority Certificate",
            "Income Certificate",
            "Marksheet",
            "Admission Proof",
          ],
        },
      },
      {
        id: 3,
        title: "Central Sector Scholarship Scheme",
        provider: "Ministry of Education",
        source: "NSP (National Scholarship Portal)",
        amount: "₹10,000 - ₹20,000/year",
        deadline: "2024-12-31",
        eligibility: "Meritorious students from economically weaker sections",
        description:
          "Merit-based scholarship for students from economically weaker sections pursuing higher education.",
        requirements: [
          "Income Certificate (Family income < ₹4.5 Lakh)",
          "Minimum 80% marks in Class 12",
          "Admission in recognized institution",
          "Aadhaar Card",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
        metadata: {
          website: "https://scholarships.gov.in",
          applicationMode: "Online through NSP",
          renewalRequired: true,
          documentsRequired: [
            "Income Certificate",
            "Class 12 Marksheet",
            "Admission Proof",
            "Bank Details",
          ],
        },
      },
      // Buddy4Study Scholarships
      {
        id: 4,
        title: "Reliance Foundation Undergraduate Scholarships",
        provider: "Reliance Foundation",
        source: "Buddy4Study",
        amount: "₹2,00,000/year",
        deadline: "2024-03-31",
        eligibility: "Meritorious students from economically weaker sections",
        description:
          "Comprehensive scholarship program supporting undergraduate students with financial assistance and mentorship.",
        requirements: [
          "Family income < ₹15 Lakh per annum",
          "Minimum 60% marks in Class 12",
          "Admission in recognized university",
          "Indian citizenship",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
        metadata: {
          website:
            "https://www.buddy4study.com/scholarship/reliance-foundation-undergraduate-scholarships",
          applicationMode: "Online through Buddy4Study",
          renewalRequired: true,
          documentsRequired: [
            "Income Certificate",
            "Class 12 Marksheet",
            "Admission Letter",
            "Bank Details",
            "Passport Size Photo",
          ],
        },
      },
      {
        id: 5,
        title: "HDFC Bank Parivartan's ECS Scholarship",
        provider: "HDFC Bank",
        source: "Buddy4Study",
        amount: "₹75,000/year",
        deadline: "2024-04-15",
        eligibility: "Students pursuing professional courses",
        description:
          "Scholarship for students pursuing professional courses like Engineering, Medicine, Law, etc.",
        requirements: [
          "Family income < ₹6 Lakh per annum",
          "Minimum 60% marks in Class 12",
          "Admission in recognized institution",
          "Age between 18-25 years",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
        metadata: {
          website:
            "https://www.buddy4study.com/scholarship/hdfc-bank-parivartan-ecs-scholarship",
          applicationMode: "Online through Buddy4Study",
          renewalRequired: true,
          documentsRequired: [
            "Income Certificate",
            "Class 12 Marksheet",
            "Admission Proof",
            "ID Proof",
            "Bank Details",
          ],
        },
      },
      {
        id: 6,
        title: "SBI Foundation Youth for India Fellowship",
        provider: "SBI Foundation",
        source: "Buddy4Study",
        amount: "₹15,000/month + other benefits",
        deadline: "2024-05-30",
        eligibility: "Graduates willing to work in rural areas",
        description:
          "Fellowship program for graduates to work on rural development projects across India.",
        requirements: [
          "Graduate degree in any discipline",
          "Age between 21-32 years",
          "Willingness to work in rural areas",
          "Indian citizenship",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
        metadata: {
          website:
            "https://www.buddy4study.com/scholarship/sbi-foundation-youth-for-india-fellowship",
          applicationMode: "Online through Buddy4Study",
          renewalRequired: false,
          documentsRequired: [
            "Graduation Certificate",
            "ID Proof",
            "Statement of Purpose",
            "Resume",
            "Passport Size Photo",
          ],
        },
      },
      // State Scholarship Portal (SSP) Scholarships
      {
        id: 7,
        title: "Karnataka State Scholarship for SC/ST Students",
        provider: "Karnataka State Government",
        source: "SSP (State Scholarship Portal)",
        amount: "₹5,000 - ₹50,000/year",
        deadline: "2024-11-30",
        eligibility: "SC/ST students from Karnataka",
        description:
          "State government scholarship for SC/ST students pursuing higher education in Karnataka.",
        requirements: [
          "Karnataka Domicile Certificate",
          "SC/ST Category Certificate",
          "Income Certificate",
          "Admission in recognized institution in Karnataka",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
        metadata: {
          website: "https://ssp.karnataka.gov.in",
          applicationMode: "Online through Karnataka SSP",
          renewalRequired: true,
          documentsRequired: [
            "Domicile Certificate",
            "Caste Certificate",
            "Income Certificate",
            "Admission Proof",
            "Bank Details",
          ],
        },
      },
      {
        id: 8,
        title: "Maharashtra State Merit Scholarship",
        provider: "Maharashtra State Government",
        source: "SSP (State Scholarship Portal)",
        amount: "₹10,000 - ₹25,000/year",
        deadline: "2024-10-31",
        eligibility: "Meritorious students from Maharashtra",
        description:
          "Merit-based scholarship for students from Maharashtra pursuing higher education.",
        requirements: [
          "Maharashtra Domicile Certificate",
          "Minimum 75% marks in Class 12",
          "Family income < ₹8 Lakh per annum",
          "Admission in recognized institution",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
        metadata: {
          website: "https://mahadbt.gov.in",
          applicationMode: "Online through Maharashtra SSP",
          renewalRequired: true,
          documentsRequired: [
            "Domicile Certificate",
            "Class 12 Marksheet",
            "Income Certificate",
            "Admission Proof",
            "Bank Details",
          ],
        },
      },
      {
        id: 9,
        title: "Tamil Nadu State Scholarship for Girls",
        provider: "Tamil Nadu State Government",
        source: "SSP (State Scholarship Portal)",
        amount: "₹8,000 - ₹20,000/year",
        deadline: "2024-09-30",
        eligibility: "Girl students from Tamil Nadu",
        description:
          "Special scholarship for girl students from Tamil Nadu pursuing higher education.",
        requirements: [
          "Tamil Nadu Domicile Certificate",
          "Female gender",
          "Minimum 60% marks in previous exam",
          "Admission in recognized institution",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
        metadata: {
          website: "https://www.tn.gov.in/scholarship",
          applicationMode: "Online through Tamil Nadu SSP",
          renewalRequired: true,
          documentsRequired: [
            "Domicile Certificate",
            "Gender Certificate",
            "Marksheet",
            "Admission Proof",
            "Bank Details",
          ],
        },
      },
    ],
    courses: [
      // Google Courses
      {
        id: 1,
        title: "Google IT Support Professional Certificate",
        provider: "Google",
        duration: "6 months",
        level: "Beginner",
        rating: 4.8,
        students: 500000,
        price: "Free",
        certificate: true,
        skills: [
          "IT Support",
          "Troubleshooting",
          "Customer Service",
          "Operating Systems",
          "Networking",
        ],
        description:
          "Prepare for a career in IT support with Google's comprehensive program covering hardware, software, networking, and customer service.",
        isEnrolled: false,
        isBookmarked: false,
        source: "Coursera",
        metadata: {
          website:
            "https://www.coursera.org/professional-certificates/google-it-support",
          platform: "Coursera",
          language: "English",
          prerequisites: "No prior experience required",
          completionTime: "6 months (10 hours/week)",
          certificateType: "Professional Certificate",
          skillsGained: [
            "IT Support",
            "Troubleshooting",
            "Customer Service",
            "Operating Systems",
            "Networking",
          ],
          careerOutcomes: [
            "IT Support Specialist",
            "Help Desk Technician",
            "Desktop Support Analyst",
          ],
        },
      },
      {
        id: 2,
        title: "Google Data Analytics Professional Certificate",
        provider: "Google",
        duration: "6 months",
        level: "Beginner",
        rating: 4.7,
        students: 300000,
        price: "Free",
        certificate: true,
        skills: [
          "Data Analysis",
          "SQL",
          "R Programming",
          "Tableau",
          "Spreadsheets",
        ],
        description:
          "Learn data analysis skills using Google's tools and methodologies. No prior experience required.",
        isEnrolled: false,
        isBookmarked: false,
        source: "Coursera",
        metadata: {
          website:
            "https://www.coursera.org/professional-certificates/google-data-analytics",
          platform: "Coursera",
          language: "English",
          prerequisites: "No prior experience required",
          completionTime: "6 months (10 hours/week)",
          certificateType: "Professional Certificate",
          skillsGained: [
            "Data Analysis",
            "SQL",
            "R Programming",
            "Tableau",
            "Spreadsheets",
          ],
          careerOutcomes: [
            "Data Analyst",
            "Business Analyst",
            "Marketing Analyst",
          ],
        },
      },
      // Microsoft Courses
      {
        id: 3,
        title: "Microsoft Azure Fundamentals",
        provider: "Microsoft",
        duration: "4 weeks",
        level: "Beginner",
        rating: 4.6,
        students: 200000,
        price: "Free",
        certificate: true,
        skills: [
          "Cloud Computing",
          "Azure",
          "Virtual Machines",
          "Storage",
          "Networking",
        ],
        description:
          "Learn cloud computing fundamentals and Microsoft Azure services. Perfect for beginners in cloud technology.",
        isEnrolled: false,
        isBookmarked: false,
        source: "Microsoft Learn",
        metadata: {
          website:
            "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/",
          platform: "Microsoft Learn",
          language: "English",
          prerequisites: "Basic understanding of cloud concepts",
          completionTime: "4 weeks (5-10 hours/week)",
          certificateType: "Microsoft Certification",
          skillsGained: [
            "Cloud Computing",
            "Azure",
            "Virtual Machines",
            "Storage",
            "Networking",
          ],
          careerOutcomes: [
            "Cloud Administrator",
            "Solutions Architect",
            "DevOps Engineer",
          ],
        },
      },
      {
        id: 4,
        title: "Microsoft 365 Fundamentals",
        provider: "Microsoft",
        duration: "3 weeks",
        level: "Beginner",
        rating: 4.5,
        students: 150000,
        price: "Free",
        certificate: true,
        skills: [
          "Microsoft 365",
          "Office 365",
          "Teams",
          "SharePoint",
          "Power Platform",
        ],
        description:
          "Master Microsoft 365 productivity tools and cloud services for modern workplace collaboration.",
        isEnrolled: false,
        isBookmarked: false,
        source: "Microsoft Learn",
        metadata: {
          website:
            "https://learn.microsoft.com/en-us/certifications/microsoft-365-fundamentals/",
          platform: "Microsoft Learn",
          language: "English",
          prerequisites: "Basic computer skills",
          completionTime: "3 weeks (5-8 hours/week)",
          certificateType: "Microsoft Certification",
          skillsGained: [
            "Microsoft 365",
            "Office 365",
            "Teams",
            "SharePoint",
            "Power Platform",
          ],
          careerOutcomes: [
            "Office Administrator",
            "IT Support",
            "Business User",
          ],
        },
      },
      // IBM Courses
      {
        id: 5,
        title: "IBM Data Science Professional Certificate",
        provider: "IBM",
        duration: "8 months",
        level: "Beginner",
        rating: 4.7,
        students: 400000,
        price: "Free",
        certificate: true,
        skills: [
          "Python",
          "SQL",
          "Machine Learning",
          "Data Visualization",
          "Jupyter Notebooks",
        ],
        description:
          "Comprehensive data science program covering Python, SQL, machine learning, and data visualization using IBM tools.",
        isEnrolled: false,
        isBookmarked: false,
        source: "Coursera",
        metadata: {
          website:
            "https://www.coursera.org/professional-certificates/ibm-data-science",
          platform: "Coursera",
          language: "English",
          prerequisites: "No prior experience required",
          completionTime: "8 months (10 hours/week)",
          certificateType: "Professional Certificate",
          skillsGained: [
            "Python",
            "SQL",
            "Machine Learning",
            "Data Visualization",
            "Jupyter Notebooks",
          ],
          careerOutcomes: [
            "Data Scientist",
            "Data Analyst",
            "Machine Learning Engineer",
          ],
        },
      },
      // Meta (Facebook) Courses
      {
        id: 6,
        title: "Meta Front-End Developer Professional Certificate",
        provider: "Meta",
        duration: "7 months",
        level: "Beginner",
        rating: 4.8,
        students: 250000,
        price: "Free",
        certificate: true,
        skills: ["React", "JavaScript", "HTML", "CSS", "Git", "Bootstrap"],
        description:
          "Learn front-end development with React and modern web technologies. Build real-world projects and portfolio.",
        isEnrolled: false,
        isBookmarked: false,
        source: "Coursera",
        metadata: {
          website:
            "https://www.coursera.org/professional-certificates/meta-front-end-developer",
          platform: "Coursera",
          language: "English",
          prerequisites: "No prior experience required",
          completionTime: "7 months (10 hours/week)",
          certificateType: "Professional Certificate",
          skillsGained: [
            "React",
            "JavaScript",
            "HTML",
            "CSS",
            "Git",
            "Bootstrap",
          ],
          careerOutcomes: [
            "Front-End Developer",
            "Web Developer",
            "UI Developer",
          ],
        },
      },
      // AWS Courses
      {
        id: 7,
        title: "AWS Cloud Practitioner Essentials",
        provider: "Amazon Web Services",
        duration: "6 weeks",
        level: "Beginner",
        rating: 4.6,
        students: 300000,
        price: "Free",
        certificate: true,
        skills: ["Cloud Computing", "AWS", "EC2", "S3", "Cloud Security"],
        description:
          "Learn AWS cloud fundamentals and prepare for the AWS Cloud Practitioner certification exam.",
        isEnrolled: false,
        isBookmarked: false,
        source: "AWS Training",
        metadata: {
          website:
            "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
          platform: "AWS Training",
          language: "English",
          prerequisites: "Basic understanding of IT concepts",
          completionTime: "6 weeks (5-10 hours/week)",
          certificateType: "AWS Certification",
          skillsGained: [
            "Cloud Computing",
            "AWS",
            "EC2",
            "S3",
            "Cloud Security",
          ],
          careerOutcomes: [
            "Cloud Practitioner",
            "Solutions Architect",
            "Cloud Administrator",
          ],
        },
      },
      // FreeCodeCamp Courses
      {
        id: 8,
        title: "JavaScript Algorithms and Data Structures",
        provider: "FreeCodeCamp",
        duration: "300 hours",
        level: "Intermediate",
        rating: 4.9,
        students: 1000000,
        price: "Free",
        certificate: true,
        skills: [
          "JavaScript",
          "Algorithms",
          "Data Structures",
          "ES6",
          "Regular Expressions",
        ],
        description:
          "Master JavaScript programming with 300 hours of hands-on coding challenges and projects.",
        isEnrolled: false,
        isBookmarked: false,
        source: "FreeCodeCamp",
        metadata: {
          website:
            "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
          platform: "FreeCodeCamp",
          language: "English",
          prerequisites: "Basic HTML/CSS knowledge",
          completionTime: "300 hours (self-paced)",
          certificateType: "FreeCodeCamp Certificate",
          skillsGained: [
            "JavaScript",
            "Algorithms",
            "Data Structures",
            "ES6",
            "Regular Expressions",
          ],
          careerOutcomes: [
            "JavaScript Developer",
            "Full-Stack Developer",
            "Software Engineer",
          ],
        },
      },
      // Harvard CS50
      {
        id: 9,
        title: "CS50's Introduction to Computer Science",
        provider: "Harvard University",
        duration: "12 weeks",
        level: "Beginner",
        rating: 4.9,
        students: 500000,
        price: "Free",
        certificate: true,
        skills: ["C Programming", "Python", "SQL", "HTML", "CSS", "JavaScript"],
        description:
          "Harvard's famous CS50 course covering computer science fundamentals and programming languages.",
        isEnrolled: false,
        isBookmarked: false,
        source: "edX",
        metadata: {
          website:
            "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
          platform: "edX",
          language: "English",
          prerequisites: "No prior experience required",
          completionTime: "12 weeks (10-20 hours/week)",
          certificateType: "Harvard Certificate",
          skillsGained: [
            "C Programming",
            "Python",
            "SQL",
            "HTML",
            "CSS",
            "JavaScript",
          ],
          careerOutcomes: [
            "Software Developer",
            "Computer Scientist",
            "Programmer",
          ],
        },
      },
    ],
    analytics: {
      totalInteractions: 45,
      completedCourses: 3,
      appliedInternships: 2,
      appliedScholarships: 1,
      totalHours: 120,
      achievements: 8,
    },
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "internships", label: "Internships", icon: Briefcase },
    { id: "scholarships", label: "Scholarships", icon: Award },
    { id: "courses", label: "Free Courses", icon: GraduationCap },
  ];

  const handleApply = (type, id) => {
    console.log(`Applied to ${type} ${id}`);
    // Here you would implement the actual application logic
  };

  const handleBookmark = (type, id) => {
    console.log(`Bookmarked ${type} ${id}`);
    // Here you would implement the bookmark logic
  };

  // Function to update analytics when user interacts
  const updateAnalytics = (field, increment = 1) => {
    updateAnalyticsMutation.mutate({ field, increment });
  };

  // Function to simulate user interactions for demo purposes
  const simulateInteraction = (type) => {
    switch (type) {
      case "ai_chat":
        updateAnalytics("totalInteractions");
        break;
      case "course_complete":
        updateAnalytics("completedCourses");
        updateAnalytics("totalHours", 5); // Assume 5 hours per course
        break;
      case "internship_apply":
        updateAnalytics("appliedInternships");
        break;
      case "scholarship_apply":
        updateAnalytics("appliedScholarships");
        break;
      case "achievement":
        updateAnalytics("achievements");
        break;
      default:
        break;
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 sm:p-6 lg:p-8 text-white"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">
          Welcome back, {user?.name || "Student"}! 👋
        </h2>
        <p className="text-primary-100 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
          Here's your personalized dashboard with all your learning progress and
          opportunities.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {userAnalytics.totalInteractions}
            </div>
            <div className="text-xs sm:text-sm text-primary-100">
              AI Interactions
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {userAnalytics.completedCourses}
            </div>
            <div className="text-xs sm:text-sm text-primary-100">
              Courses Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {userAnalytics.appliedInternships}
            </div>
            <div className="text-xs sm:text-sm text-primary-100">
              Internships Applied
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {userAnalytics.achievements}
            </div>
            <div className="text-xs sm:text-sm text-primary-100">
              Achievements
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card
            hover
            className="p-4 sm:p-6 text-center cursor-pointer h-full touch-target"
            onClick={() => {
              setActiveTab("chat");
              simulateInteraction("ai_chat");
            }}
          >
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mx-auto mb-2 sm:mb-3" />
            <h4 className="font-semibold mb-2 text-sm sm:text-base">
              Start AI Chat
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Get personalized career guidance
            </p>
          </Card>
          <Card
            hover
            className="p-4 sm:p-6 text-center cursor-pointer h-full touch-target"
            onClick={() => {
              setActiveTab("internships");
              simulateInteraction("internship_apply");
            }}
          >
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2 sm:mb-3" />
            <h4 className="font-semibold mb-2 text-sm sm:text-base">
              Browse Internships
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Find your next opportunity
            </p>
          </Card>
          <Card
            hover
            className="p-4 sm:p-6 text-center cursor-pointer h-full touch-target"
            onClick={() => {
              setActiveTab("courses");
              simulateInteraction("course_complete");
            }}
          >
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2 sm:mb-3" />
            <h4 className="font-semibold mb-2 text-sm sm:text-base">
              Explore Courses
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Learn new skills for free
            </p>
          </Card>
        </div>
      </motion.div>

      {/* Demo Analytics Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Test Analytics Tracking
        </h3>
        <Card className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <Button
              size="sm"
              onClick={() => simulateInteraction("ai_chat")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm touch-target min-h-[40px] sm:min-h-[44px]"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">AI Chat</span>
              <span className="sm:hidden">Chat</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateInteraction("course_complete")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm touch-target min-h-[40px] sm:min-h-[44px]"
            >
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Complete Course</span>
              <span className="sm:hidden">Course</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateInteraction("internship_apply")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm touch-target min-h-[40px] sm:min-h-[44px]"
            >
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Apply Internship</span>
              <span className="sm:hidden">Apply</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateInteraction("scholarship_apply")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm touch-target min-h-[40px] sm:min-h-[44px]"
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Apply Scholarship</span>
              <span className="sm:hidden">Scholarship</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateInteraction("achievement")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm touch-target min-h-[40px] sm:min-h-[44px]"
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Get Achievement</span>
              <span className="sm:hidden">Achievement</span>
            </Button>
          </div>
          <div className="mt-4 flex justify-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center px-4">
              Analytics are automatically tracked as you use the platform
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Recent Activity
        </h3>
        <Card className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-3 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                  Completed: Data Science Fundamentals
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  2 days ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                  Applied to: Microsoft Data Science Intern
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  1 week ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                  Earned: Web Development Certificate
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  2 weeks ago
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderChatHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">AI Chat History</h3>
        <Button variant="primary" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="space-y-4">
        {mockData.chatHistory.map((chat) => (
          <Card key={chat.id} hover className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {chat.title}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      chat.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {chat.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{chat.lastMessage}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {chat.timestamp}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {chat.messageCount} messages
                  </span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                    {chat.category}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderInternships = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold">
          Available Internships
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Input
            placeholder="Search internships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            className="w-full sm:w-64 touch-target min-h-[44px]"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input w-full sm:w-auto min-w-[150px] touch-target min-h-[44px]"
          >
            <option value="all">All Companies</option>
            <option value="google">Google</option>
            <option value="microsoft">Microsoft</option>
            <option value="amazon">Amazon</option>
            <option value="meta">Meta</option>
            <option value="apple">Apple</option>
            <option value="netflix">Netflix</option>
            <option value="tech">Technology</option>
            <option value="product">Product Management</option>
            <option value="data">Data Science</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {mockData.internships
          .filter((internship) => {
            const matchesSearch =
              internship.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              internship.company
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              internship.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesFilter =
              filterCategory === "all" ||
              (filterCategory === "google" &&
                internship.company.toLowerCase().includes("google")) ||
              (filterCategory === "microsoft" &&
                internship.company.toLowerCase().includes("microsoft")) ||
              (filterCategory === "amazon" &&
                internship.company.toLowerCase().includes("amazon")) ||
              (filterCategory === "meta" &&
                internship.company.toLowerCase().includes("meta")) ||
              (filterCategory === "apple" &&
                internship.company.toLowerCase().includes("apple")) ||
              (filterCategory === "netflix" &&
                internship.company.toLowerCase().includes("netflix")) ||
              (filterCategory === "tech" &&
                internship.title.toLowerCase().includes("software")) ||
              (filterCategory === "product" &&
                internship.title.toLowerCase().includes("product")) ||
              (filterCategory === "data" &&
                internship.title.toLowerCase().includes("data"));

            return matchesSearch && matchesFilter;
          })
          .map((internship) => (
            <Card key={internship.id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">
                    {internship.title}
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600">{internship.company}</p>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      {internship.source}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {internship.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {internship.duration}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {internship.stipend}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {internship.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {internship.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                  {internship.metadata && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Application Details:
                      </p>
                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                        <p>
                          <span className="font-medium">Mode:</span>{" "}
                          {internship.metadata.applicationMode}
                        </p>
                        <p>
                          <span className="font-medium">Eligibility:</span>{" "}
                          {internship.metadata.eligibility}
                        </p>
                        <p>
                          <span className="font-medium">Website:</span>
                          <a
                            href={internship.metadata.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                          >
                            Apply Here
                          </a>
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                          Benefits:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {internship.metadata.benefits.map(
                            (benefit, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                              >
                                {benefit}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                          Interview Process:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {internship.metadata.interviewProcess.map(
                            (step, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                              >
                                {step}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {internship.rating}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {internship.applicants} applicants
                      </span>
                      <span className="text-red-600 font-medium">
                        Deadline: {internship.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={internship.isApplied ? "outline" : "primary"}
                  size="sm"
                  onClick={() => handleApply("internship", internship.id)}
                  disabled={internship.isApplied}
                >
                  {internship.isApplied ? "Applied" : "Apply Now"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark("internship", internship.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      internship.isBookmarked ? "text-red-500 fill-current" : ""
                    }`}
                  />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );

  const renderScholarships = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h3 className="text-xl font-semibold">Available Scholarships</h3>
        <div className="flex space-x-3">
          <Input
            placeholder="Search scholarships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            className="w-64"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input"
          >
            <option value="all">All Sources</option>
            <option value="nsp">NSP (National Scholarship Portal)</option>
            <option value="buddy4study">Buddy4Study</option>
            <option value="ssp">SSP (State Scholarship Portal)</option>
            <option value="merit">Merit-based</option>
            <option value="need">Need-based</option>
            <option value="women">Women-specific</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockData.scholarships
          .filter((scholarship) => {
            const matchesSearch =
              scholarship.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              scholarship.provider
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              scholarship.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesFilter =
              filterCategory === "all" ||
              (filterCategory === "nsp" &&
                scholarship.source.includes("NSP")) ||
              (filterCategory === "buddy4study" &&
                scholarship.source.includes("Buddy4Study")) ||
              (filterCategory === "ssp" &&
                scholarship.source.includes("SSP")) ||
              (filterCategory === "merit" &&
                scholarship.eligibility.toLowerCase().includes("merit")) ||
              (filterCategory === "need" &&
                scholarship.eligibility.toLowerCase().includes("need")) ||
              (filterCategory === "women" &&
                scholarship.eligibility.toLowerCase().includes("women"));

            return matchesSearch && matchesFilter;
          })
          .map((scholarship) => (
            <Card key={scholarship.id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">
                    {scholarship.title}
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600">{scholarship.provider}</p>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {scholarship.source}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center font-semibold text-green-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {scholarship.amount}
                    </span>
                    <span className="text-red-600 font-medium">
                      Deadline: {scholarship.deadline}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {scholarship.description}
                  </p>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Eligibility:
                    </p>
                    <p className="text-sm text-gray-600">
                      {scholarship.eligibility}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Requirements:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  {scholarship.metadata && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Application Details:
                      </p>
                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                        <p>
                          <span className="font-medium">Mode:</span>{" "}
                          {scholarship.metadata.applicationMode}
                        </p>
                        <p>
                          <span className="font-medium">Renewal:</span>{" "}
                          {scholarship.metadata.renewalRequired
                            ? "Required"
                            : "Not Required"}
                        </p>
                        <p>
                          <span className="font-medium">Website:</span>
                          <a
                            href={scholarship.metadata.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                          >
                            Apply Here
                          </a>
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                          Documents Required:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {scholarship.metadata.documentsRequired.map(
                            (doc, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                              >
                                {doc}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        scholarship.status === "open"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {scholarship.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={scholarship.isApplied ? "outline" : "primary"}
                  size="sm"
                  onClick={() => handleApply("scholarship", scholarship.id)}
                  disabled={scholarship.isApplied}
                >
                  {scholarship.isApplied ? "Applied" : "Apply Now"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark("scholarship", scholarship.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      scholarship.isBookmarked
                        ? "text-red-500 fill-current"
                        : ""
                    }`}
                  />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h3 className="text-xl font-semibold">Free Certificate Courses</h3>
        <div className="flex space-x-3">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            className="w-64"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input"
          >
            <option value="all">All Platforms</option>
            <option value="coursera">Coursera</option>
            <option value="microsoft">Microsoft Learn</option>
            <option value="aws">AWS Training</option>
            <option value="freecodecamp">FreeCodeCamp</option>
            <option value="edx">edX</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockData.courses
          .filter((course) => {
            const matchesSearch =
              course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.provider
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              course.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesFilter =
              filterCategory === "all" ||
              (filterCategory === "coursera" &&
                course.source.toLowerCase().includes("coursera")) ||
              (filterCategory === "microsoft" &&
                course.source.toLowerCase().includes("microsoft")) ||
              (filterCategory === "aws" &&
                course.source.toLowerCase().includes("aws")) ||
              (filterCategory === "freecodecamp" &&
                course.source.toLowerCase().includes("freecodecamp")) ||
              (filterCategory === "edx" &&
                course.source.toLowerCase().includes("edx")) ||
              (filterCategory === "beginner" &&
                course.level.toLowerCase().includes("beginner")) ||
              (filterCategory === "intermediate" &&
                course.level.toLowerCase().includes("intermediate")) ||
              (filterCategory === "advanced" &&
                course.level.toLowerCase().includes("advanced"));

            return matchesSearch && matchesFilter;
          })
          .map((course) => (
            <Card key={course.id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">{course.title}</h4>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600">{course.provider}</p>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                      {course.source}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                      {course.level}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {course.rating}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {course.metadata && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Course Details:
                      </p>
                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                        <p>
                          <span className="font-medium">Platform:</span>{" "}
                          {course.metadata.platform}
                        </p>
                        <p>
                          <span className="font-medium">Language:</span>{" "}
                          {course.metadata.language}
                        </p>
                        <p>
                          <span className="font-medium">Prerequisites:</span>{" "}
                          {course.metadata.prerequisites}
                        </p>
                        <p>
                          <span className="font-medium">Completion Time:</span>{" "}
                          {course.metadata.completionTime}
                        </p>
                        <p>
                          <span className="font-medium">Certificate Type:</span>{" "}
                          {course.metadata.certificateType}
                        </p>
                        <p>
                          <span className="font-medium">Website:</span>
                          <a
                            href={course.metadata.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                          >
                            Enroll Here
                          </a>
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                          Career Outcomes:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {course.metadata.careerOutcomes.map(
                            (outcome, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                              >
                                {outcome}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">
                        {course.price}
                      </span>
                      {course.certificate && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Certificate
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={course.isEnrolled ? "outline" : "primary"}
                  size="sm"
                  onClick={() => handleApply("course", course.id)}
                  disabled={course.isEnrolled}
                >
                  {course.isEnrolled ? "Enrolled" : "Enroll Now"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark("course", course.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      course.isBookmarked ? "text-red-500 fill-current" : ""
                    }`}
                  />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "chat":
        return renderChatHistory();
      case "internships":
        return renderInternships();
      case "scholarships":
        return renderScholarships();
      case "courses":
        return renderCourses();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-4 sm:py-6 lg:py-8">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your learning journey, track progress, and discover
            opportunities.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
