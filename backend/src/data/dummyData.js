// Dummy data for development and testing

const dummyRoadmaps = [
  {
    courseName: "Computer Science Engineering",
    description:
      "Comprehensive roadmap for Computer Science Engineering covering programming, algorithms, and software development.",
    category: "Engineering",
    duration: "4 years",
    difficulty: "Advanced",
    prerequisites: ["Mathematics", "Physics", "Chemistry"],
    careerPaths: [
      {
        title: "Software Engineer",
        description: "Develop and maintain software applications",
        salaryRange: "₹6-15 LPA",
        growthProspect: "High",
      },
      {
        title: "Data Scientist",
        description: "Analyze data to extract insights",
        salaryRange: "₹8-20 LPA",
        growthProspect: "Very High",
      },
    ],
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
        ],
        skills: ["Programming", "Mathematics", "Problem Solving"],
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
    marketDemand: {
      current: "Very High",
      future: "Booming",
      salaryRange: {
        entry: "₹6-8 LPA",
        mid: "₹12-18 LPA",
        senior: "₹25-50 LPA",
      },
    },
    tags: ["programming", "technology", "software", "algorithms"],
  },
];

const dummyColleges = [
  {
    name: "Indian Institute of Technology Delhi",
    shortName: "IIT Delhi",
    type: "Government",
    location: {
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110016",
      address: "Hauz Khas, New Delhi",
    },
    contact: {
      phone: ["+91-11-2659-7135"],
      email: ["info@iitd.ac.in"],
      website: "https://www.iitd.ac.in",
      admissionEmail: "admission@iitd.ac.in",
    },
    established: 1961,
    accreditation: {
      naac: { grade: "A++", score: 3.8 },
      nirf: { rank: 2, year: 2023 },
      other: ["NBA Accredited"],
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
      other: ["Gym", "Swimming Pool", "Auditorium"],
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
    admission: {
      process: "JEE Advanced + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["JEE Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹2000", registration: "₹5000" },
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
    images: ["iit-delhi-1.jpg", "iit-delhi-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/iitdelhi",
      twitter: "https://twitter.com/iitdelhi",
      instagram: "https://instagram.com/iitdelhi",
      linkedin: "https://linkedin.com/school/iit-delhi",
    },
  },
];

const dummyStories = [
  {
    _id: "1",
    title:
      "From Small Town to Silicon Valley: My Journey as a Software Engineer",
    author: {
      name: "Priya Sharma",
      currentRole: "Senior Software Engineer",
      company: "Google",
      experience: "5 years",
      profileImage: "priya-sharma.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/priya-sharma",
        twitter: "https://twitter.com/priya_sharma",
      },
    },
    content:
      "Growing up in a small town in Rajasthan, I never imagined I would one day work at Google in Silicon Valley. My journey began with a simple dream of becoming a computer engineer...",
    summary:
      "A inspiring story of how determination and hard work helped a small-town girl achieve her dreams in the tech industry.",
    category: "Success Story",
    tags: ["software engineering", "career growth", "motivation"],
    course: {
      name: "Computer Science Engineering",
      college: "IIT Delhi",
      year: 2018,
    },
    careerPath: {
      from: "Student",
      to: "Senior Software Engineer",
      timeline: "5 years",
    },
    keyAchievements: [
      "Graduated from IIT Delhi with distinction",
      "Got placed at Google through campus placement",
      "Led multiple high-impact projects",
      "Mentored 20+ junior engineers",
    ],
    challenges: [
      "Language barrier in initial days",
      "Adapting to fast-paced tech environment",
      "Work-life balance in demanding role",
    ],
    advice: [
      "Never give up on your dreams",
      "Continuous learning is key",
      "Build strong professional network",
      "Take calculated risks",
    ],
    images: ["priya-journey-1.jpg", "priya-journey-2.jpg"],
    readTime: 8,
    likes: 245,
    views: 1250,
    comments: [
      {
        author: "Rahul Kumar",
        content: "Very inspiring story! Thank you for sharing.",
        date: new Date(),
        likes: 12,
      },
    ],
    isFeatured: true,
    isApproved: true,
  },
  {
    _id: "2",
    title: "From Dropout to Data Science Success: My Unconventional Journey",
    author: {
      name: "Rahul Kumar",
      currentRole: "Senior Data Scientist",
      company: "Microsoft",
      experience: "4 years",
      profileImage: "rahul-kumar.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/rahul-kumar",
        twitter: "https://twitter.com/rahul_kumar",
      },
    },
    content:
      "I dropped out of college after my second year, but that didn't stop me from pursuing my passion for data science. Through online courses, personal projects, and sheer determination, I built a successful career in one of the most competitive fields...",
    summary:
      "An inspiring story of how self-learning and determination led to a successful career in data science without a formal degree.",
    category: "Career Change",
    tags: ["data science", "self-learning", "career change"],
    course: {
      name: "Self-taught Data Science",
      college: "Online Learning",
      year: 2020,
    },
    careerPath: {
      from: "College Dropout",
      to: "Senior Data Scientist",
      timeline: "4 years",
    },
    keyAchievements: [
      "Completed 20+ online courses",
      "Built 50+ data science projects",
      "Landed job at Microsoft",
      "Mentored 100+ aspiring data scientists",
    ],
    challenges: [
      "Learning without formal structure",
      "Proving skills to employers",
      "Building credibility in the field",
      "Staying updated with latest trends",
    ],
    advice: [
      "Focus on practical projects",
      "Build a strong portfolio",
      "Network with professionals",
      "Never stop learning",
    ],
    images: ["rahul-journey-1.jpg", "rahul-journey-2.jpg"],
    readTime: 12,
    likes: 189,
    views: 890,
    comments: [],
    isFeatured: true,
    isApproved: true,
  },
  {
    _id: "3",
    title: "Building a Tech Startup: Lessons from the Trenches",
    author: {
      name: "Anita Singh",
      currentRole: "Founder & CEO",
      company: "TechStart India",
      experience: "3 years",
      profileImage: "anita-singh.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/anita-singh",
        twitter: "https://twitter.com/anita_singh",
      },
    },
    content:
      "Starting a tech company was never part of my plan, but when I saw a problem that needed solving, I couldn't ignore it. Here's my journey from idea to a successful startup that's now helping thousands of students...",
    summary:
      "A candid account of the challenges and triumphs of building a tech startup from scratch.",
    category: "Entrepreneurship",
    tags: ["startup", "entrepreneurship", "technology"],
    course: {
      name: "Computer Science Engineering",
      college: "IIT Bombay",
      year: 2018,
    },
    careerPath: {
      from: "Software Engineer",
      to: "Founder & CEO",
      timeline: "3 years",
    },
    keyAchievements: [
      "Raised $2M in funding",
      "Built team of 25+ people",
      "Served 10,000+ students",
      "Expanded to 3 cities",
    ],
    challenges: [
      "Finding product-market fit",
      "Raising initial funding",
      "Building the right team",
      "Scaling the business",
    ],
    advice: [
      "Start with a real problem",
      "Validate before building",
      "Focus on customer feedback",
      "Be prepared for long hours",
    ],
    images: ["anita-startup-1.jpg", "anita-startup-2.jpg"],
    readTime: 15,
    likes: 156,
    views: 720,
    comments: [],
    isFeatured: false,
    isApproved: true,
  },
  {
    _id: "4",
    title: "From Medicine to Machine Learning: A Doctor's Journey into AI",
    author: {
      name: "Dr. Vikram Patel",
      currentRole: "AI Research Scientist",
      company: "DeepMind",
      experience: "6 years",
      profileImage: "vikram-patel.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/vikram-patel",
        twitter: "https://twitter.com/vikram_patel",
      },
    },
    content:
      "After completing my MBBS and working as a doctor for 3 years, I realized my true passion lay in using technology to solve healthcare problems. This is how I transitioned from practicing medicine to becoming an AI researcher at DeepMind, working on cutting-edge medical AI applications...",
    summary:
      "An inspiring story of a doctor who found his calling in AI and is now revolutionizing healthcare through technology.",
    category: "Career Change",
    tags: ["AI", "healthcare", "career change", "machine learning"],
    course: {
      name: "MBBS + Self-taught AI/ML",
      college: "AIIMS Delhi + Online Learning",
      year: 2017,
    },
    careerPath: {
      from: "Medical Doctor",
      to: "AI Research Scientist",
      timeline: "6 years",
    },
    keyAchievements: [
      "Published 15+ research papers in top AI journals",
      "Developed AI models for early disease detection",
      "Led team of 10+ AI researchers",
      "Received Google AI Research Award",
    ],
    challenges: [
      "Learning complex AI/ML concepts from scratch",
      "Balancing medical practice with learning",
      "Proving credibility in tech industry",
      "Managing imposter syndrome",
    ],
    advice: [
      "Leverage your domain expertise",
      "Start with practical applications",
      "Join AI communities and forums",
      "Don't be afraid to start over",
    ],
    images: ["vikram-ai-1.jpg", "vikram-ai-2.jpg"],
    readTime: 10,
    likes: 312,
    views: 1450,
    comments: [
      {
        author: "Dr. Sarah Johnson",
        content:
          "This is exactly what I needed to hear! Thank you for sharing your journey.",
        date: new Date(),
        likes: 8,
      },
    ],
    isFeatured: true,
    isApproved: true,
  },
  {
    _id: "5",
    title: "Breaking Barriers: First Woman Engineer from My Village",
    author: {
      name: "Kavya Reddy",
      currentRole: "Senior Civil Engineer",
      company: "L&T Construction",
      experience: "7 years",
      profileImage: "kavya-reddy.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/kavya-reddy",
        twitter: "https://twitter.com/kavya_reddy",
      },
    },
    content:
      "Growing up in a small village in Andhra Pradesh, engineering was considered a 'man's field'. But I was determined to prove that women can excel in any field they choose. Today, I'm proud to be the first woman engineer from my village, working on major infrastructure projects...",
    summary:
      "A powerful story of breaking gender stereotypes and achieving success in a traditionally male-dominated field.",
    category: "Success Story",
    tags: [
      "women in engineering",
      "breaking barriers",
      "civil engineering",
      "inspiration",
    ],
    course: {
      name: "Civil Engineering",
      college: "NIT Warangal",
      year: 2016,
    },
    careerPath: {
      from: "Village Student",
      to: "Senior Civil Engineer",
      timeline: "7 years",
    },
    keyAchievements: [
      "First woman engineer from her village",
      "Led construction of 5 major bridges",
      "Mentored 50+ women engineers",
      "Received 'Woman Engineer of the Year' award",
    ],
    challenges: [
      "Fighting gender stereotypes",
      "Lack of support from community",
      "Proving competence in male-dominated field",
      "Balancing work and family expectations",
    ],
    advice: [
      "Believe in yourself and your abilities",
      "Find mentors who support you",
      "Don't let others define your limits",
      "Use your success to help others",
    ],
    images: ["kavya-construction-1.jpg", "kavya-construction-2.jpg"],
    readTime: 9,
    likes: 278,
    views: 1680,
    comments: [
      {
        author: "Priya Nair",
        content:
          "You're such an inspiration! Thank you for paving the way for other women.",
        date: new Date(),
        likes: 15,
      },
    ],
    isFeatured: true,
    isApproved: true,
  },
  {
    _id: "6",
    title: "From Arts to Analytics: My Unconventional Career Pivot",
    author: {
      name: "Arjun Mehta",
      currentRole: "Lead Data Analyst",
      company: "Amazon",
      experience: "4 years",
      profileImage: "arjun-mehta.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/arjun-mehta",
        twitter: "https://twitter.com/arjun_mehta",
      },
    },
    content:
      "With a degree in English Literature, everyone expected me to become a teacher or writer. But I discovered my love for numbers and patterns during a part-time job. Today, I'm a Lead Data Analyst at Amazon, proving that your degree doesn't define your career path...",
    summary:
      "A refreshing story of how following your interests can lead to unexpected and successful career paths.",
    category: "Career Change",
    tags: [
      "career pivot",
      "data analytics",
      "arts to tech",
      "unconventional path",
    ],
    course: {
      name: "English Literature + Data Analytics Certification",
      college: "Delhi University + Online Learning",
      year: 2019,
    },
    careerPath: {
      from: "English Literature Graduate",
      to: "Lead Data Analyst",
      timeline: "4 years",
    },
    keyAchievements: [
      "Completed 12+ data science certifications",
      "Built 30+ analytical dashboards",
      "Led data-driven decision making for $50M+ projects",
      "Mentored 20+ career changers",
    ],
    challenges: [
      "Learning technical skills from scratch",
      "Overcoming imposter syndrome",
      "Explaining career change to family",
      "Competing with CS graduates",
    ],
    advice: [
      "Your background gives you unique perspective",
      "Focus on transferable skills",
      "Build a strong portfolio",
      "Network with people in your target field",
    ],
    images: ["arjun-analytics-1.jpg", "arjun-analytics-2.jpg"],
    readTime: 11,
    likes: 198,
    views: 920,
    comments: [
      {
        author: "Sneha Gupta",
        content:
          "This gives me hope! I'm also from arts background and want to switch to tech.",
        date: new Date(),
        likes: 6,
      },
    ],
    isFeatured: false,
    isApproved: true,
  },
];

const dummyFaqs = [
  {
    question: "What is the eligibility criteria for JEE Advanced?",
    answer:
      "To be eligible for JEE Advanced, you must have qualified JEE Main and be among the top 2,50,000 candidates. You should also have passed Class 12 or equivalent examination in 2022, 2023, or appearing in 2024.",
    category: "Admissions",
    subcategory: "JEE",
    tags: ["JEE Advanced", "eligibility", "admission"],
    priority: 10,
    helpful: { yes: 150, no: 5 },
    views: 2500,
  },
  {
    question: "How to prepare for computer science engineering?",
    answer:
      "To prepare for computer science engineering, focus on mathematics, physics, and chemistry for entrance exams. Learn programming languages like C, C++, Python. Practice problem-solving and develop logical thinking skills.",
    category: "Career Guidance",
    subcategory: "Engineering",
    tags: ["computer science", "preparation", "programming"],
    priority: 9,
    helpful: { yes: 200, no: 10 },
    views: 3200,
  },
  {
    question:
      "What are the career opportunities after B.Tech in Computer Science?",
    answer:
      "After B.Tech in Computer Science, you can work as Software Engineer, Data Scientist, Web Developer, Mobile App Developer, DevOps Engineer, or pursue higher studies like M.Tech, MBA, or PhD.",
    category: "Career Guidance",
    subcategory: "Engineering",
    tags: ["career", "computer science", "opportunities"],
    priority: 8,
    helpful: { yes: 180, no: 8 },
    views: 2800,
  },
];

const dummyAnalytics = {
  totalUsers: 15420,
  totalQuizAttempts: 28450,
  totalStories: 1250,
  totalColleges: 850,
  totalFaqs: 200,
  monthlyStats: {
    newUsers: 1250,
    quizCompletions: 2100,
    storyViews: 15000,
    collegeSearches: 8500,
  },
  popularCourses: [
    { name: "Computer Science Engineering", searches: 4500 },
    { name: "Mechanical Engineering", searches: 3200 },
    { name: "Electronics Engineering", searches: 2800 },
    { name: "Civil Engineering", searches: 2100 },
  ],
  topColleges: [
    { name: "IIT Delhi", views: 8500 },
    { name: "IIT Bombay", views: 7800 },
    { name: "IIT Madras", views: 7200 },
    { name: "NIT Trichy", views: 6500 },
  ],
};

module.exports = {
  dummyRoadmaps,
  dummyColleges,
  dummyStories,
  dummyFaqs,
  dummyAnalytics,
};
