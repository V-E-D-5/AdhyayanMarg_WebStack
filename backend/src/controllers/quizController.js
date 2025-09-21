const QuizResult = require("../models/QuizResult");
const { dummyAnalytics } = require("../data/dummyData");

// Get quiz questions based on user authentication status
const getQuizQuestions = async (req, res) => {
  try {
    const isAuthenticated = !!req.user;

    if (isAuthenticated) {
      // Return detailed 15 questions for authenticated users
      const detailedQuestions = getDetailedQuestions();
      res.json({
        success: true,
        data: {
          questions: detailedQuestions,
          quizType: "detailed",
          totalQuestions: detailedQuestions.length,
          userType: "authenticated",
        },
      });
    } else {
      // Return mock 5 questions for guest users
      const mockQuestions = getMockQuestions();
      res.json({
        success: true,
        data: {
          questions: mockQuestions,
          quizType: "mock",
          totalQuestions: mockQuestions.length,
          userType: "guest",
        },
      });
    }
  } catch (error) {
    console.error("Get quiz questions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Submit quiz results
const submitQuiz = async (req, res) => {
  try {
    const { answers, completionTime, sessionId } = req.body;
    const isAuthenticated = !!req.user;

    // Validate input
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz answers are required",
      });
    }

    // Determine quiz type and user type
    const quizType = answers.length <= 5 ? "mock" : "detailed";
    const userType = isAuthenticated ? "authenticated" : "guest";

    // Calculate scores based on answers
    const scores = calculateScores(answers, quizType);

    // Determine personality type based on highest score
    const personalityType = determinePersonalityType(scores);

    // Generate recommended courses based on personality type
    const recommendedCourses = generateRecommendedCourses(
      personalityType,
      scores
    );

    // Enhance answers with question and category information
    const enhancedAnswers = answers.map((answer) => {
      // Find the question details from the appropriate question set
      const questions =
        quizType === "mock" ? getMockQuestions() : getDetailedQuestions();
      const questionData = questions.find((q) => q.id === answer.questionId);

      return {
        questionId: answer.questionId,
        question: questionData?.question || "Unknown question",
        selectedOption: answer.selectedOption,
        category: questionData?.category || "general",
      };
    });

    // Create quiz result object
    const quizResult = {
      userId: isAuthenticated ? req.user.id : null,
      sessionId: !isAuthenticated ? sessionId : null,
      userType,
      quizType,
      answers: enhancedAnswers,
      scores,
      recommendedCourses,
      personalityType,
      strengths: generateStrengths(personalityType),
      areasForImprovement: generateAreasForImprovement(personalityType),
      completionTime: completionTime || Math.floor(Math.random() * 300) + 300,
      version: "2.0",
    };

    // Save to database
    let savedResult;
    try {
      savedResult = await QuizResult.create(quizResult);
      console.log(`Quiz result saved for ${userType} user, ${quizType} quiz`);
    } catch (dbError) {
      console.error("Database error:", dbError);
      savedResult = { ...quizResult, _id: "dummy_id_" + Date.now() };
    }

    res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        quizResult: savedResult,
        recommendations: {
          courses: recommendedCourses,
          nextSteps: generateNextSteps(personalityType),
          resources: generateResources(personalityType),
        },
        isGuestUser: !isAuthenticated,
        message: !isAuthenticated
          ? "Sign up to get detailed career insights!"
          : "Your detailed results are ready!",
      },
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get quiz results for a user
const getQuizResults = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const results = await QuizResult.find({ userId })
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get quiz results error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get mock questions for guest users (5 questions)
function getMockQuestions() {
  return [
    {
      id: "mock_q1",
      question: "What type of work environment do you prefer?",
      category: "work_environment",
      options: [
        {
          id: "a",
          text: "Collaborative team environment",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "b",
          text: "Independent and quiet workspace",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "c",
          text: "Creative and flexible environment",
          score: { creative: 3, social: 1 },
        },
        {
          id: "d",
          text: "Fast-paced and challenging",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "mock_q2",
      question: "Which activity interests you most?",
      category: "interests",
      options: [
        {
          id: "a",
          text: "Solving complex problems",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "b",
          text: "Creating art or design",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Helping others",
          score: { social: 3, leadership: 1 },
        },
        {
          id: "d",
          text: "Leading projects",
          score: { leadership: 3, social: 2 },
        },
      ],
    },
    {
      id: "mock_q3",
      question: "What motivates you most?",
      category: "motivation",
      options: [
        {
          id: "a",
          text: "Making a positive impact",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "b",
          text: "Learning new technologies",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "c",
          text: "Expressing creativity",
          score: { creative: 3, social: 1 },
        },
        {
          id: "d",
          text: "Achieving recognition",
          score: { leadership: 3, analytical: 1 },
        },
      ],
    },
    {
      id: "mock_q4",
      question: "How do you prefer to learn?",
      category: "learning_style",
      options: [
        {
          id: "a",
          text: "Hands-on practice",
          score: { technical: 3, analytical: 2 },
        },
        {
          id: "b",
          text: "Visual learning with videos",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Group discussions",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Structured courses",
          score: { analytical: 3, technical: 1 },
        },
      ],
    },
    {
      id: "mock_q5",
      question: "What type of challenges do you enjoy?",
      category: "challenges",
      options: [
        {
          id: "a",
          text: "Technical and logical problems",
          score: { technical: 3, analytical: 2 },
        },
        {
          id: "b",
          text: "Creative challenges",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Social and communication challenges",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Strategic planning challenges",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
  ];
}

// Get detailed questions for authenticated users (15 questions)
function getDetailedQuestions() {
  return [
    // Basic questions (same as mock)
    ...getMockQuestions(),
    // Additional detailed questions
    {
      id: "detailed_q6",
      question: "What is your ideal work schedule?",
      category: "work_life_balance",
      options: [
        {
          id: "a",
          text: "Traditional 9-5 with clear boundaries",
          score: { analytical: 2, social: 2 },
        },
        {
          id: "b",
          text: "Flexible hours with remote work",
          score: { creative: 3, technical: 2 },
        },
        {
          id: "c",
          text: "Variable schedule with travel",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Intensive periods with breaks",
          score: { technical: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "detailed_q7",
      question: "What type of problems do you find most satisfying to solve?",
      category: "problem_solving",
      options: [
        {
          id: "a",
          text: "Data analysis and finding patterns",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "b",
          text: "Design problems requiring aesthetics",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Interpersonal conflicts and team dynamics",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Strategic business problems",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "detailed_q8",
      question: "How do you prefer to communicate your ideas?",
      category: "communication_style",
      options: [
        {
          id: "a",
          text: "Through detailed reports and data",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "b",
          text: "Through visual presentations and graphics",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Through face-to-face meetings",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Through executive summaries",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "detailed_q9",
      question: "What type of career growth appeals to you most?",
      category: "career_aspirations",
      options: [
        {
          id: "a",
          text: "Becoming a subject matter expert",
          score: { technical: 3, analytical: 2 },
        },
        {
          id: "b",
          text: "Building a creative portfolio",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Mentoring others and building relationships",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Advancing to senior management",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "detailed_q10",
      question: "What values are most important to you in a career?",
      category: "values",
      options: [
        {
          id: "a",
          text: "Intellectual stimulation and learning",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "b",
          text: "Creative freedom and self-expression",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Making a difference in people's lives",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Achievement and financial success",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "detailed_q11",
      question: "How do you handle stress and pressure?",
      category: "stress_management",
      options: [
        {
          id: "a",
          text: "Analyze the problem systematically",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "b",
          text: "Take a creative break and brainstorm",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Seek support from colleagues",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Take charge and delegate tasks",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "detailed_q12",
      question: "What type of feedback do you prefer?",
      category: "feedback_preference",
      options: [
        {
          id: "a",
          text: "Detailed analytical feedback with data",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "b",
          text: "Visual feedback with examples",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Personal and empathetic feedback",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Direct and results-oriented feedback",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "detailed_q13",
      question: "How do you approach learning new skills?",
      category: "learning_approach",
      options: [
        {
          id: "a",
          text: "Start with theory and fundamentals",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "b",
          text: "Learn through experimentation and trial",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Learn from others and mentors",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Focus on practical applications",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "detailed_q14",
      question: "What motivates you to work hard?",
      category: "motivation_deep",
      options: [
        {
          id: "a",
          text: "Solving complex puzzles and challenges",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "b",
          text: "Creating something beautiful or innovative",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Helping others succeed and grow",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Achieving goals and recognition",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
    {
      id: "detailed_q15",
      question: "How do you make important decisions?",
      category: "decision_making",
      options: [
        {
          id: "a",
          text: "Gather data and analyze pros/cons",
          score: { analytical: 3, technical: 2 },
        },
        {
          id: "b",
          text: "Follow intuition and creative insight",
          score: { creative: 3, social: 1 },
        },
        {
          id: "c",
          text: "Consult with others and seek consensus",
          score: { social: 3, leadership: 2 },
        },
        {
          id: "d",
          text: "Consider long-term strategic impact",
          score: { leadership: 3, analytical: 2 },
        },
      ],
    },
  ];
}

// Calculate scores based on answers
function calculateScores(answers, quizType) {
  const scores = {
    technical: 0,
    creative: 0,
    analytical: 0,
    social: 0,
    leadership: 0,
  };

  answers.forEach((answer) => {
    // Find the question and selected option
    const questions =
      quizType === "mock" ? getMockQuestions() : getDetailedQuestions();
    const question = questions.find((q) => q.id === answer.questionId);

    if (question) {
      const option = question.options.find(
        (opt) => opt.id === answer.selectedOption
      );
      if (option && option.score) {
        Object.keys(option.score).forEach((key) => {
          scores[key] += option.score[key];
        });
      }
    }
  });

  return scores;
}

// Determine personality type based on scores
function determinePersonalityType(scores) {
  const maxScore = Math.max(...Object.values(scores));
  const personalityMap = {
    analytical: "Analyst",
    creative: "Creator",
    social: "Helper",
    leadership: "Leader",
    technical: "Analyst", // Default to Analyst for technical
  };

  for (const [key, value] of Object.entries(scores)) {
    if (value === maxScore) {
      return personalityMap[key] || "Analyst";
    }
  }

  return "Analyst";
}

// Helper functions
function generateRecommendedCourses(personalityType, scores) {
  const courseRecommendations = {
    Analyst: [
      {
        courseName: "Data Science & Analytics",
        matchPercentage: 95,
        description: "Perfect for analytical minds who love working with data",
        careerPaths: [
          "Data Scientist",
          "Business Analyst",
          "Research Scientist",
        ],
      },
      {
        courseName: "Computer Science Engineering",
        matchPercentage: 88,
        description: "Strong foundation in programming and algorithms",
        careerPaths: [
          "Software Engineer",
          "System Analyst",
          "Technical Architect",
        ],
      },
    ],
    Creator: [
      {
        courseName: "Graphic Design & Multimedia",
        matchPercentage: 92,
        description: "Express your creativity through visual design",
        careerPaths: [
          "Graphic Designer",
          "UI/UX Designer",
          "Creative Director",
        ],
      },
      {
        courseName: "Architecture",
        matchPercentage: 85,
        description: "Combine creativity with technical skills",
        careerPaths: ["Architect", "Interior Designer", "Urban Planner"],
      },
    ],
    Helper: [
      {
        courseName: "Medicine",
        matchPercentage: 90,
        description: "Serve others through healthcare",
        careerPaths: ["Doctor", "Nurse", "Medical Researcher"],
      },
      {
        courseName: "Psychology",
        matchPercentage: 87,
        description: "Help people with mental health and well-being",
        careerPaths: ["Psychologist", "Counselor", "Therapist"],
      },
    ],
    Leader: [
      {
        courseName: "Business Administration",
        matchPercentage: 93,
        description: "Develop leadership and management skills",
        careerPaths: ["Manager", "Entrepreneur", "Executive"],
      },
      {
        courseName: "Political Science",
        matchPercentage: 80,
        description: "Lead and influence public policy",
        careerPaths: ["Politician", "Policy Analyst", "Public Administrator"],
      },
    ],
    Explorer: [
      {
        courseName: "Journalism & Mass Communication",
        matchPercentage: 89,
        description: "Explore the world and share stories",
        careerPaths: ["Journalist", "Content Creator", "Media Producer"],
      },
      {
        courseName: "Environmental Science",
        matchPercentage: 84,
        description: "Explore and protect our planet",
        careerPaths: [
          "Environmental Scientist",
          "Conservationist",
          "Researcher",
        ],
      },
    ],
  };

  return (
    courseRecommendations[personalityType] || courseRecommendations["Analyst"]
  );
}

function generateStrengths(personalityType) {
  const strengths = {
    Analyst: [
      "Problem Solving",
      "Critical Thinking",
      "Data Analysis",
      "Logical Reasoning",
    ],
    Creator: ["Creativity", "Innovation", "Visual Thinking", "Artistic Skills"],
    Helper: ["Empathy", "Communication", "Patience", "Teamwork"],
    Leader: [
      "Leadership",
      "Decision Making",
      "Strategic Thinking",
      "Motivation",
    ],
    Explorer: ["Curiosity", "Adaptability", "Communication", "Research Skills"],
  };
  return strengths[personalityType] || strengths["Analyst"];
}

function generateAreasForImprovement(personalityType) {
  const improvements = {
    Analyst: ["Social Skills", "Creativity", "Public Speaking"],
    Creator: ["Technical Skills", "Time Management", "Business Acumen"],
    Helper: ["Technical Skills", "Analytical Thinking", "Leadership"],
    Leader: ["Technical Skills", "Patience", "Detail Orientation"],
    Explorer: ["Focus", "Technical Skills", "Planning"],
  };
  return improvements[personalityType] || improvements["Analyst"];
}

function generateNextSteps(personalityType) {
  return [
    "Research recommended courses in detail",
    "Connect with professionals in your field of interest",
    "Start building relevant skills through online courses",
    "Consider internships or volunteer opportunities",
  ];
}

function generateResources(personalityType) {
  return [
    "Online courses on Coursera and Udemy",
    "Professional networking on LinkedIn",
    "Industry blogs and publications",
    "Mentorship programs",
  ];
}

module.exports = {
  getQuizQuestions,
  submitQuiz,
  getQuizResults,
};
