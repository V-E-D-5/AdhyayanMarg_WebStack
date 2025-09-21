import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Users,
  Award,
  TrendingUp,
  Building2,
  Plus,
  Minus,
  BarChart3,
} from "lucide-react";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import { apiService } from "../utils/api";

const Colleges = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // Mock data for colleges
  const mockColleges = [
    {
      _id: "1",
      name: "Indian Institute of Technology Delhi",
      shortName: "IIT Delhi",
      type: "Government",
      location: {
        city: "New Delhi",
        state: "Delhi",
        country: "India",
      },
      established: 1961,
      accreditation: {
        naac: { grade: "A++", score: 3.8 },
        nirf: { rank: 2, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹2.5 L", total: "₹10 L" },
          seats: 120,
          eligibility: "JEE Advanced",
          entranceExam: ["JEE Advanced"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 2000, fees: "₹1.2 L/year" },
        library: { books: 500000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 500,
        phd: 450,
        studentRatio: "1:12",
      },
      placement: {
        averagePackage: "₹15 LPA",
        highestPackage: "₹1.2 CPA",
        placementPercentage: 95,
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple"],
        year: 2023,
      },
      reviews: [
        {
          rating: 5,
          comment: "Excellent faculty and infrastructure",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "2",
      name: "Indian Institute of Technology Bombay",
      shortName: "IIT Bombay",
      type: "Government",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
      },
      established: 1958,
      accreditation: {
        naac: { grade: "A++", score: 3.9 },
        nirf: { rank: 1, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹2.5 L", total: "₹10 L" },
          seats: 120,
          eligibility: "JEE Advanced",
          entranceExam: ["JEE Advanced"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 2500, fees: "₹1.2 L/year" },
        library: { books: 600000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 600,
        phd: 550,
        studentRatio: "1:10",
      },
      placement: {
        averagePackage: "₹18 LPA",
        highestPackage: "₹1.5 CPA",
        placementPercentage: 98,
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple"],
        year: 2023,
      },
      reviews: [
        {
          rating: 5,
          comment: "Best engineering college in India",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "3",
      name: "National Institute of Technology Trichy",
      shortName: "NIT Trichy",
      type: "Government",
      location: {
        city: "Tiruchirappalli",
        state: "Tamil Nadu",
        country: "India",
      },
      established: 1964,
      accreditation: {
        naac: { grade: "A+", score: 3.6 },
        nirf: { rank: 5, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹1.5 L", total: "₹6 L" },
          seats: 120,
          eligibility: "JEE Main",
          entranceExam: ["JEE Main"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 1500, fees: "₹80K/year" },
        library: { books: 300000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 300,
        phd: 250,
        studentRatio: "1:15",
      },
      placement: {
        averagePackage: "₹12 LPA",
        highestPackage: "₹50 LPA",
        placementPercentage: 90,
        topRecruiters: ["TCS", "Infosys", "Wipro", "Microsoft"],
        year: 2023,
      },
      reviews: [
        {
          rating: 4,
          comment: "Good college with decent placements",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "4",
      name: "Indian Institute of Technology Madras",
      shortName: "IIT Madras",
      type: "Government",
      location: {
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
      },
      established: 1959,
      accreditation: {
        naac: { grade: "A++", score: 3.8 },
        nirf: { rank: 3, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹2.5 L", total: "₹10 L" },
          seats: 120,
          eligibility: "JEE Advanced",
          entranceExam: ["JEE Advanced"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 2200, fees: "₹1.2 L/year" },
        library: { books: 550000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 550,
        phd: 500,
        studentRatio: "1:11",
      },
      placement: {
        averagePackage: "₹16 LPA",
        highestPackage: "₹1.3 CPA",
        placementPercentage: 96,
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple"],
        year: 2023,
      },
      reviews: [
        {
          rating: 5,
          comment: "Excellent research opportunities and faculty",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "5",
      name: "Birla Institute of Technology and Science",
      shortName: "BITS Pilani",
      type: "Private",
      location: {
        city: "Pilani",
        state: "Rajasthan",
        country: "India",
      },
      established: 1964,
      accreditation: {
        naac: { grade: "A+", score: 3.7 },
        nirf: { rank: 4, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹4.5 L", total: "₹18 L" },
          seats: 120,
          eligibility: "BITSAT",
          entranceExam: ["BITSAT"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 1800, fees: "₹1.5 L/year" },
        library: { books: 400000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 400,
        phd: 350,
        studentRatio: "1:13",
      },
      placement: {
        averagePackage: "₹14 LPA",
        highestPackage: "₹1.0 CPA",
        placementPercentage: 92,
        topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs"],
        year: 2023,
      },
      reviews: [
        {
          rating: 4,
          comment: "Great campus life and placements",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "6",
      name: "National Institute of Technology Surathkal",
      shortName: "NIT Surathkal",
      type: "Government",
      location: {
        city: "Mangalore",
        state: "Karnataka",
        country: "India",
      },
      established: 1960,
      accreditation: {
        naac: { grade: "A+", score: 3.5 },
        nirf: { rank: 6, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹1.5 L", total: "₹6 L" },
          seats: 120,
          eligibility: "JEE Main",
          entranceExam: ["JEE Main"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 1600, fees: "₹80K/year" },
        library: { books: 350000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 350,
        phd: 280,
        studentRatio: "1:14",
      },
      placement: {
        averagePackage: "₹11 LPA",
        highestPackage: "₹45 LPA",
        placementPercentage: 88,
        topRecruiters: ["TCS", "Infosys", "Wipro", "Microsoft"],
        year: 2023,
      },
      reviews: [
        {
          rating: 4,
          comment: "Good college with decent infrastructure",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "7",
      name: "Vellore Institute of Technology",
      shortName: "VIT Vellore",
      type: "Private",
      location: {
        city: "Vellore",
        state: "Tamil Nadu",
        country: "India",
      },
      established: 1984,
      accreditation: {
        naac: { grade: "A+", score: 3.4 },
        nirf: { rank: 8, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹3.2 L", total: "₹12.8 L" },
          seats: 120,
          eligibility: "VITEEE",
          entranceExam: ["VITEEE"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 2000, fees: "₹1.2 L/year" },
        library: { books: 300000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 500,
        phd: 400,
        studentRatio: "1:16",
      },
      placement: {
        averagePackage: "₹8 LPA",
        highestPackage: "₹35 LPA",
        placementPercentage: 85,
        topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"],
        year: 2023,
      },
      reviews: [
        {
          rating: 4,
          comment: "Good placements and campus facilities",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "8",
      name: "Indian Institute of Science",
      shortName: "IISc Bangalore",
      type: "Government",
      location: {
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
      },
      established: 1909,
      accreditation: {
        naac: { grade: "A++", score: 3.9 },
        nirf: { rank: 1, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹2.5 L", total: "₹10 L" },
          seats: 60,
          eligibility: "JEE Advanced",
          entranceExam: ["JEE Advanced"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 1200, fees: "₹1.2 L/year" },
        library: { books: 700000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 400,
        phd: 380,
        studentRatio: "1:8",
      },
      placement: {
        averagePackage: "₹20 LPA",
        highestPackage: "₹2.0 CPA",
        placementPercentage: 99,
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple"],
        year: 2023,
      },
      reviews: [
        {
          rating: 5,
          comment: "Premier research institute with excellent faculty",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "9",
      name: "Delhi Technological University",
      shortName: "DTU Delhi",
      type: "Government",
      location: {
        city: "New Delhi",
        state: "Delhi",
        country: "India",
      },
      established: 1941,
      accreditation: {
        naac: { grade: "A+", score: 3.3 },
        nirf: { rank: 12, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹1.2 L", total: "₹4.8 L" },
          seats: 120,
          eligibility: "JEE Main",
          entranceExam: ["JEE Main"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 1000, fees: "₹60K/year" },
        library: { books: 250000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 300,
        phd: 250,
        studentRatio: "1:18",
      },
      placement: {
        averagePackage: "₹9 LPA",
        highestPackage: "₹40 LPA",
        placementPercentage: 82,
        topRecruiters: ["TCS", "Infosys", "Wipro", "Microsoft"],
        year: 2023,
      },
      reviews: [
        {
          rating: 4,
          comment: "Good college in Delhi with decent placements",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "10",
      name: "Manipal Institute of Technology",
      shortName: "MIT Manipal",
      type: "Private",
      location: {
        city: "Manipal",
        state: "Karnataka",
        country: "India",
      },
      established: 1957,
      accreditation: {
        naac: { grade: "A+", score: 3.2 },
        nirf: { rank: 15, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹3.5 L", total: "₹14 L" },
          seats: 120,
          eligibility: "MET",
          entranceExam: ["MET"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 1800, fees: "₹1.0 L/year" },
        library: { books: 280000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 400,
        phd: 320,
        studentRatio: "1:17",
      },
      placement: {
        averagePackage: "₹7 LPA",
        highestPackage: "₹30 LPA",
        placementPercentage: 80,
        topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"],
        year: 2023,
      },
      reviews: [
        {
          rating: 4,
          comment: "Good private college with decent facilities",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "11",
      name: "SRM Institute of Science and Technology",
      shortName: "SRM University",
      type: "Private",
      location: {
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
      },
      established: 1985,
      accreditation: {
        naac: { grade: "A+", score: 3.1 },
        nirf: { rank: 18, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹2.8 L", total: "₹11.2 L" },
          seats: 120,
          eligibility: "SRMJEE",
          entranceExam: ["SRMJEE"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 1500, fees: "₹90K/year" },
        library: { books: 200000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 350,
        phd: 280,
        studentRatio: "1:19",
      },
      placement: {
        averagePackage: "₹6 LPA",
        highestPackage: "₹25 LPA",
        placementPercentage: 75,
        topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"],
        year: 2023,
      },
      reviews: [
        {
          rating: 3,
          comment: "Average college with basic facilities",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
    {
      _id: "12",
      name: "Anna University",
      shortName: "Anna University",
      type: "Government",
      location: {
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
      },
      established: 1978,
      accreditation: {
        naac: { grade: "A+", score: 3.4 },
        nirf: { rank: 20, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹1.0 L", total: "₹4 L" },
          seats: 120,
          eligibility: "TNEA",
          entranceExam: ["TNEA"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 1200, fees: "₹50K/year" },
        library: { books: 300000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 500,
        phd: 400,
        studentRatio: "1:20",
      },
      placement: {
        averagePackage: "₹5 LPA",
        highestPackage: "₹20 LPA",
        placementPercentage: 70,
        topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"],
        year: 2023,
      },
      reviews: [
        {
          rating: 3,
          comment: "Good government college with affordable fees",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
    },
  ];

  const cities = [
    "All",
    "New Delhi",
    "Mumbai",
    "Tiruchirappalli",
    "Bangalore",
    "Chennai",
    "Pilani",
    "Mangalore",
    "Vellore",
    "Manipal",
  ];
  const types = [
    "All",
    "Government",
    "Private",
    "Deemed University",
    "Autonomous",
  ];

  const filteredColleges = mockColleges.filter((college) => {
    const matchesSearch =
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.location.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      !selectedCity ||
      selectedCity === "All" ||
      college.location.city === selectedCity;
    const matchesType =
      !selectedType || selectedType === "All" || college.type === selectedType;

    return matchesSearch && matchesCity && matchesType;
  });

  const addToCompare = (college) => {
    if (
      compareList.length < 4 &&
      !compareList.find((c) => c._id === college._id)
    ) {
      setCompareList([...compareList, college]);
    }
  };

  const removeFromCompare = (collegeId) => {
    setCompareList(compareList.filter((c) => c._id !== collegeId));
  };

  const isInCompareList = (collegeId) => {
    return compareList.some((c) => c._id === collegeId);
  };

  const canAddToCompare = (collegeId) => {
    return compareList.length < 4 && !isInCompareList(collegeId);
  };

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
            {t("colleges.title")}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            {t("colleges.subtitle")}
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
                  placeholder={t("colleges.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                  className="w-full touch-target min-h-[44px]"
                />
              </div>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input w-full touch-target min-h-[44px] text-sm sm:text-base"
              >
                <option value="">City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input w-full touch-target min-h-[44px] text-sm sm:text-base"
              >
                <option value="">Type</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <Card className="bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <BarChart3 className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span className="font-medium text-primary-900 dark:text-primary-100 text-sm sm:text-base">
                    {compareList.length} colleges selected for comparison
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(true)}
                    disabled={compareList.length < 2}
                    className="w-full sm:w-auto touch-target min-h-[40px] text-xs sm:text-sm"
                  >
                    Compare Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCompareList([])}
                    className="w-full sm:w-auto touch-target min-h-[40px] text-xs sm:text-sm"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredColleges.map((college, index) => (
            <motion.div
              key={college._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full p-4 sm:p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight">
                          {college.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3">
                          {college.shortName}
                        </p>
                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {college.location.city}, {college.location.state}
                          </span>
                        </div>
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
                        {college.type}
                      </span>
                      <span className="badge-secondary text-xs px-2 py-1">
                        Est. {college.established}
                      </span>
                      {college.accreditation.nirf && (
                        <span className="badge-success text-xs px-2 py-1">
                          NIRF #{college.accreditation.nirf.rank}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {college.placement.averagePackage}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Avg Package
                        </div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {college.placement.placementPercentage}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Placement
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 sm:mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                        Top Recruiters:
                      </h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {college.placement.topRecruiters
                          .slice(0, 3)
                          .map((recruiter, recruiterIndex) => (
                            <span
                              key={recruiterIndex}
                              className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded"
                            >
                              {recruiter}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <Button className="flex-1 w-full sm:w-auto touch-target min-h-[44px] text-sm">
                        {t("colleges.viewDetails")}
                      </Button>
                      <div className="flex gap-2">
                        {canAddToCompare(college._id) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCompare(college)}
                            className="touch-target min-h-[44px] min-w-[44px] flex-shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        ) : isInCompareList(college._id) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCompare(college._id)}
                            className="touch-target min-h-[44px] min-w-[44px] flex-shrink-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            title="Maximum 4 colleges can be compared"
                            className="touch-target min-h-[44px] min-w-[44px] flex-shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No colleges found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Colleges;
