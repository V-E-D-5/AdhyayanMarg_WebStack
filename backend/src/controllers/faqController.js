const Faq = require("../models/Faq");
const { dummyFaqs } = require("../data/dummyData");
const aiService = require("../services/aiService");

// Get all FAQs
const getAllFaqs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sortBy = "priority",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = { isActive: true };
    if (category) query.category = category;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Try to find in database first
    let faqs;
    try {
      const skip = (page - 1) * limit;
      faqs = await Faq.find(query).sort(sort).skip(skip).limit(parseInt(limit));
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      faqs = [];
    }

    // If no data in database, use dummy data
    if (faqs.length === 0) {
      faqs = dummyFaqs.filter((faq) => {
        if (category && faq.category !== category) return false;
        return true;
      });

      // Apply sorting to dummy data
      faqs.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortOrder === "desc") {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });

      // Apply pagination
      const skip = (page - 1) * limit;
      faqs = faqs.slice(skip, skip + parseInt(limit));
    }

    res.json({
      success: true,
      data: faqs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: faqs.length,
      },
    });
  } catch (error) {
    console.error("Get all FAQs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get FAQ by ID
const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find in database first
    let faq;
    try {
      faq = await Faq.findById(id);
      if (faq) {
        // Increment view count
        await faq.incrementViews();
      }
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      faq = null;
    }

    // If not found in database, use dummy data
    if (!faq) {
      faq = dummyFaqs.find(
        (f) =>
          f._id === id || f.question.toLowerCase().includes(id.toLowerCase())
      );

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: "FAQ not found",
        });
      }
    }

    res.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Get FAQ by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Search FAQs
const searchFaqs = async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Try to search in database first
    let faqs;
    try {
      const query = {
        $and: [
          { isActive: true },
          {
            $or: [
              { question: { $regex: q, $options: "i" } },
              { answer: { $regex: q, $options: "i" } },
              { tags: { $in: [new RegExp(q, "i")] } },
            ],
          },
        ],
      };

      if (category) query.$and.push({ category });

      faqs = await Faq.find(query)
        .sort({ priority: -1, views: -1 })
        .limit(parseInt(limit));
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      faqs = [];
    }

    // If no data in database, search dummy data
    if (faqs.length === 0) {
      const searchTerm = q.toLowerCase();
      faqs = dummyFaqs.filter((faq) => {
        const matchesSearch =
          faq.question.toLowerCase().includes(searchTerm) ||
          faq.answer.toLowerCase().includes(searchTerm) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

        const matchesCategory = !category || faq.category === category;

        return matchesSearch && matchesCategory;
      });

      // Sort by priority and views
      faqs.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.views - a.views;
      });
    }

    res.json({
      success: true,
      data: faqs,
      query: q,
      results: faqs.length,
    });
  } catch (error) {
    console.error("Search FAQs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get FAQ categories
const getFaqCategories = async (req, res) => {
  try {
    // Try to get from database first
    let categories;
    try {
      categories = await Faq.distinct("category", { isActive: true });
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      categories = [];
    }

    // If no data in database, use dummy data
    if (categories.length === 0) {
      categories = [...new Set(dummyFaqs.map((faq) => faq.category))];
    }

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get FAQ categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Submit FAQ query (for chatbot)
const submitFaqQuery = async (req, res) => {
  try {
    const { query, useAI = true, aiProvider } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // If AI is enabled, try to get AI response first
    if (useAI) {
      try {
        const bestProvider = aiProvider || aiService.getBestProvider();

        if (bestProvider) {
          console.log(`Using AI provider: ${bestProvider}`);
          const aiResponse = await aiService.generateResponse(
            query,
            bestProvider
          );

          // Also try to find related FAQs for additional context
          let relatedFaqs = [];
          try {
            const searchTerm = query.toLowerCase();
            relatedFaqs = dummyFaqs
              .filter((faq) => {
                return (
                  faq.question.toLowerCase().includes(searchTerm) ||
                  faq.answer.toLowerCase().includes(searchTerm) ||
                  faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
                );
              })
              .slice(0, 3);
          } catch (dbError) {
            console.log("Could not fetch related FAQs");
          }

          return res.json({
            success: true,
            data: {
              found: true,
              answer: aiResponse.response,
              aiProvider: aiResponse.provider,
              aiModel: aiResponse.model,
              relatedQuestions: relatedFaqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer.substring(0, 200) + "...",
              })),
              suggestions: [
                "What are the admission requirements?",
                "How to prepare for entrance exams?",
                "What are the career opportunities?",
                "How to apply for scholarships?",
              ],
            },
          });
        } else {
          // No AI provider available, use enhanced fallback
          console.log("No AI provider available, using enhanced fallback");
          const enhancedResponse = generateEnhancedResponse(query);
          return res.json({
            success: true,
            data: {
              found: true,
              answer: enhancedResponse.answer,
              aiProvider: "Yukti Assistant",
              aiModel: "Enhanced Knowledge Base",
              relatedQuestions: enhancedResponse.relatedQuestions,
              suggestions: enhancedResponse.suggestions,
            },
          });
        }
      } catch (aiError) {
        console.error("AI Service Error:", aiError);
        // Fall back to enhanced response
        const enhancedResponse = generateEnhancedResponse(query);
        return res.json({
          success: true,
          data: {
            found: true,
            answer: enhancedResponse.answer,
            aiProvider: "Praniti Assistant",
            aiModel: "Enhanced Knowledge Base",
            relatedQuestions: enhancedResponse.relatedQuestions,
            suggestions: enhancedResponse.suggestions,
          },
        });
      }
    } else {
      // AI is disabled, use enhanced response
      const enhancedResponse = generateEnhancedResponse(query);
      return res.json({
        success: true,
        data: {
          found: true,
          answer: enhancedResponse.answer,
          aiProvider: "Praniti Assistant",
          aiModel: "Enhanced Knowledge Base",
          relatedQuestions: enhancedResponse.relatedQuestions,
          suggestions: enhancedResponse.suggestions,
        },
      });
    }

    // Fallback to FAQ search if AI is disabled or fails
    let matchingFaqs;
    try {
      matchingFaqs = await Faq.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { question: { $regex: query, $options: "i" } },
              { answer: { $regex: query, $options: "i" } },
              { tags: { $in: [new RegExp(query, "i")] } },
            ],
          },
        ],
      })
        .sort({ priority: -1, views: -1 })
        .limit(3);
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      matchingFaqs = [];
    }

    // If no data in database, search dummy data
    if (matchingFaqs.length === 0) {
      const searchTerm = query.toLowerCase();
      matchingFaqs = dummyFaqs.filter((faq) => {
        return (
          faq.question.toLowerCase().includes(searchTerm) ||
          faq.answer.toLowerCase().includes(searchTerm) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      });

      // Sort by priority and views
      matchingFaqs.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.views - a.views;
      });

      matchingFaqs = matchingFaqs.slice(0, 3);
    }

    // Generate response
    let response;
    if (matchingFaqs.length > 0) {
      const topMatch = matchingFaqs[0];
      response = {
        found: true,
        answer: topMatch.answer,
        relatedQuestions: matchingFaqs.slice(1).map((faq) => ({
          question: faq.question,
          answer: faq.answer.substring(0, 200) + "...",
        })),
        confidence: calculateConfidence(query, topMatch),
      };
    } else {
      response = {
        found: false,
        answer:
          "I couldn't find a specific answer to your question. Please try rephrasing your query or contact our support team for assistance.",
        suggestions: [
          "What are the admission requirements?",
          "How to prepare for entrance exams?",
          "What are the career opportunities?",
          "How to apply for scholarships?",
        ],
      };
    }

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Submit FAQ query error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get available AI providers
const getAIProviders = async (req, res) => {
  try {
    const availableProviders = aiService.getAvailableProviders();
    const bestProvider = aiService.getBestProvider();

    res.json({
      success: true,
      data: {
        available: availableProviders,
        best: bestProvider,
        providers: {
          openai: {
            name: "OpenAI ChatGPT",
            available: availableProviders.includes("openai"),
            model: "gpt-3.5-turbo",
          },
          gemini: {
            name: "Google Gemini",
            available: availableProviders.includes("gemini"),
            model: "gemini-1.5-flash",
          },
          deepseek: {
            name: "DeepSeek",
            available: availableProviders.includes("deepseek"),
            model: "deepseek-chat",
          },
        },
      },
    });
  } catch (error) {
    console.error("Get AI providers error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Mark FAQ as helpful
const markFaqHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { isHelpful } = req.body;

    if (typeof isHelpful !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isHelpful must be a boolean value",
      });
    }

    // Try to find in database first
    let faq;
    try {
      faq = await Faq.findById(id);
      if (faq) {
        await faq.markHelpful(isHelpful);
      }
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      faq = null;
    }

    // If not found in database, use dummy data
    if (!faq) {
      faq = dummyFaqs.find((f) => f._id === id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: "FAQ not found",
        });
      }

      // Simulate helpful feedback
      if (isHelpful) {
        faq.helpful.yes += 1;
      } else {
        faq.helpful.no += 1;
      }
    }

    res.json({
      success: true,
      message: "Feedback recorded successfully",
      data: {
        helpful: faq.helpful,
        helpfulPercentage:
          faq.helpfulPercentage ||
          Math.round(
            (faq.helpful.yes / (faq.helpful.yes + faq.helpful.no)) * 100
          ),
      },
    });
  } catch (error) {
    console.error("Mark FAQ helpful error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Helper function to calculate confidence score
function calculateConfidence(query, faq) {
  const queryWords = query.toLowerCase().split(" ");
  const questionWords = faq.question.toLowerCase().split(" ");
  const answerWords = faq.answer.toLowerCase().split(" ");

  let matches = 0;
  queryWords.forEach((word) => {
    if (questionWords.includes(word) || answerWords.includes(word)) {
      matches++;
    }
  });

  const confidence = Math.min(
    95,
    Math.round((matches / queryWords.length) * 100)
  );
  return confidence;
}

// Enhanced response generator for better chatbot experience
function generateEnhancedResponse(query) {
  const queryLower = query.toLowerCase();

  // Greeting responses
  if (
    queryLower.includes("hello") ||
    queryLower.includes("hi") ||
    queryLower.includes("helo") ||
    queryLower.includes("hey")
  ) {
    return {
      answer: `Hello! 👋 Welcome to Yukti! I'm your career guidance assistant.

**I can help you with:**
• College selection & admissions
• Career planning & exploration  
• Exam preparation strategies
• Engineering colleges (IITs, NITs, Private)
• Career options after 12th/graduation
• JEE, NEET preparation tips

What would you like to know about your career journey?`,
      relatedQuestions: [
        {
          question: "What are the best engineering colleges in India?",
          answer:
            "Top engineering colleges include IITs, NITs, and private institutions...",
        },
        {
          question: "How to prepare for JEE exam?",
          answer: "JEE preparation requires systematic study and practice...",
        },
        {
          question: "What career options are available after 12th?",
          answer:
            "After 12th, you have multiple career paths in various fields...",
        },
      ],
      suggestions: [
        "What are the top engineering colleges?",
        "How to prepare for competitive exams?",
        "What are the best career options?",
        "How to choose the right college?",
      ],
    };
  }

  // Career guidance responses
  if (
    queryLower.includes("career") ||
    queryLower.includes("job") ||
    queryLower.includes("profession")
  ) {
    return {
      answer: `**Career Guidance Summary:**

**Top Career Fields:**
• **Technology**: Software Development, Data Science, Cybersecurity
• **Healthcare**: Medicine, Nursing, Allied Health
• **Business**: Management, Accounting, Marketing
• **Engineering**: Computer, Mechanical, Civil, Electrical
• **Creative Arts**: Design, Media, Writing

**I can help you with:**
• Career exploration based on your interests
• Education planning for your goals
• Job market insights & salary expectations
• Skill development recommendations
• Career growth strategies

Which field interests you most?`,
      relatedQuestions: [
        {
          question: "What are the best career options after engineering?",
          answer:
            "Engineering graduates have diverse opportunities in tech, management, research...",
        },
        {
          question: "How to choose the right career path?",
          answer:
            "Consider your interests, skills, values, and market demand...",
        },
        {
          question: "What skills are in demand in 2024?",
          answer:
            "Tech skills, data analysis, AI/ML, soft skills are highly valued...",
        },
      ],
      suggestions: [
        "What are the highest paying careers?",
        "How to switch careers successfully?",
        "What are the best careers for introverts?",
        "How to start a career in tech?",
      ],
    };
  }

  // College and education responses
  if (
    queryLower.includes("college") ||
    queryLower.includes("university") ||
    queryLower.includes("admission") ||
    queryLower.includes("engineering college")
  ) {
    return {
      answer: `**Top Engineering Colleges in India:**

**IITs**: IIT Delhi, IIT Bombay, IIT Madras, IIT Kanpur, IIT Kharagpur
**NITs**: NIT Trichy, NIT Surathkal, NIT Warangal, NIT Rourkela  
**Private**: BITS Pilani, VIT Vellore, SRM University, Manipal Institute

**Admission Process:**
• JEE Main → NITs & other colleges
• JEE Advanced → IITs & IISc
• State Exams → State colleges
• Direct Admission → Private colleges (12th marks)

**Popular Branches:**
• Computer Science (CSE)
• Electronics & Communication (ECE)
• Mechanical, Civil, Electrical Engineering

**Selection Criteria:**
• 10th & 12th marks
• Entrance exam scores
• Personal interview (some colleges)
• Extracurricular activities

Need specific college information?`,
      relatedQuestions: [
        {
          question: "What is the JEE Main exam pattern?",
          answer: "JEE Main has 90 questions (30 each subject) in 3 hours...",
        },
        {
          question: "How to prepare for JEE Advanced?",
          answer: "Focus on problem-solving skills and advanced concepts...",
        },
        {
          question: "What are the cutoffs for top engineering colleges?",
          answer: "Cutoffs vary yearly based on difficulty and applications...",
        },
      ],
      suggestions: [
        "What are the best engineering colleges in Bangalore?",
        "How to get admission in IIT?",
        "What is the fee structure for engineering colleges?",
        "Which engineering branch has best placement?",
      ],
    };
  }

  // Exam preparation responses
  if (
    queryLower.includes("exam") ||
    queryLower.includes("preparation") ||
    queryLower.includes("study") ||
    queryLower.includes("jee") ||
    queryLower.includes("neet")
  ) {
    return {
      answer: `**Exam Preparation Summary:**

**JEE Main:**
• 90 questions (30 each: Physics, Chemistry, Math)
• 3 hours duration
• Focus on NCERT books + previous year papers
• Time management crucial

**JEE Advanced:**
• Higher difficulty level
• Problem-solving & conceptual understanding
• Advanced books + mock tests
• Complex problem practice

**Study Strategy:**
• Create & follow study schedule
• Regular revision
• Mock tests for progress assessment
• Focus on weak areas
• Maintain health & sleep

**Best Resources:**
• NCERT (foundation)
• HC Verma (Physics), OP Tandon (Chemistry), RD Sharma (Math)
• Online: Khan Academy, Unacademy, Vedantu

Which exam are you preparing for?`,
      relatedQuestions: [
        {
          question: "How to manage time during JEE preparation?",
          answer: "Create daily/weekly schedules, prioritize weak subjects...",
        },
        {
          question: "What are the best books for JEE preparation?",
          answer: "Start with NCERT, then move to advanced books...",
        },
        {
          question: "How to stay motivated during exam preparation?",
          answer: "Set small goals, track progress, take breaks...",
        },
      ],
      suggestions: [
        "How to prepare for NEET exam?",
        "What is the best study schedule for JEE?",
        "How to improve problem-solving speed?",
        "What are the common mistakes in JEE preparation?",
      ],
    };
  }

  // Engineering specific responses
  if (
    queryLower.includes("engineering") ||
    queryLower.includes("iit") ||
    queryLower.includes("nit") ||
    queryLower.includes("btech") ||
    queryLower.includes("b.tech")
  ) {
    return {
      answer: `**Engineering Colleges & Admissions:**

**Top Tier:**
• **IITs**: 23 institutes, JEE Advanced required
• **NITs**: 31 institutes, JEE Main required
• **IIITs**: 25 institutes, JEE Main required

**Private Top:**
• BITS Pilani, VIT Vellore, SRM University
• Manipal Institute, Thapar University
• Direct admission based on 12th marks

**Popular Branches:**
• **CSE**: Highest placement, good salary
• **ECE**: Electronics & communication
• **Mechanical**: Core engineering
• **Civil**: Infrastructure & construction
• **Electrical**: Power & energy systems

**Admission Process:**
• JEE Main (Jan & Apr) → NITs, IIITs
• JEE Advanced (May) → IITs
• State exams → State colleges
• Direct admission → Private colleges

Need specific college or branch info?`,
      relatedQuestions: [
        {
          question: "What is the JEE Main exam pattern?",
          answer: "90 questions in 3 hours, 30 each subject...",
        },
        {
          question: "Which engineering branch has best placement?",
          answer: "CSE typically has highest placement rates...",
        },
        {
          question: "How to prepare for JEE Advanced?",
          answer: "Focus on problem-solving and advanced concepts...",
        },
      ],
      suggestions: [
        "What are the best engineering colleges in Bangalore?",
        "How to get admission in IIT?",
        "Which engineering branch should I choose?",
        "What is the fee structure for engineering colleges?",
      ],
    };
  }

  // Simple response for basic queries
  if (
    queryLower.includes("what") ||
    queryLower.includes("how") ||
    queryLower.includes("when") ||
    queryLower.includes("where") ||
    queryLower.includes("why")
  ) {
    return {
      answer: `I understand you have a question about "${query}". 

**I can help you with:**
• College & university information
• Career guidance & planning
• Exam preparation strategies
• Course recommendations
• Admission processes

Could you be more specific about what you'd like to know? For example:
• "What are the best engineering colleges?"
• "How to prepare for JEE exam?"
• "What career options are available after 12th?"

This will help me provide you with the most relevant information!`,
      relatedQuestions: [
        {
          question: "What are the best engineering colleges in India?",
          answer:
            "Top engineering colleges include IITs, NITs, and private institutions...",
        },
        {
          question: "How to prepare for competitive exams?",
          answer:
            "Create a study schedule, focus on weak areas, practice regularly...",
        },
        {
          question: "What are the career options after 12th?",
          answer:
            "After 12th, you can pursue engineering, medicine, commerce, arts...",
        },
      ],
      suggestions: [
        "What are the best courses after 12th science?",
        "How to choose the right college?",
        "What are the career options in technology?",
        "How to prepare for JEE exam?",
      ],
    };
  }

  // General guidance response
  return {
    answer: `**I'm your career guidance assistant! Here's how I can help:**

**Education Guidance:**
• College selection & admission process
• Course recommendations based on interests
• Scholarship & financial aid information
• Study abroad opportunities

**Career Planning:**
• Career exploration & assessment
• Industry insights & job market trends
• Skill development recommendations
• Resume building & interview prep

**Academic Support:**
• Exam preparation strategies
• Study tips & techniques
• Subject-specific guidance
• Time management skills

**Popular Topics:**
• Engineering colleges & admissions
• Medical & healthcare careers
• Business & management programs
• Arts & humanities options
• Skill-based courses & certifications

Ask me about any specific topic for detailed guidance!`,
    relatedQuestions: [
      {
        question: "What are the best career options after 12th?",
        answer:
          "After 12th, you have multiple career paths in various fields...",
      },
      {
        question: "How to choose the right college?",
        answer:
          "Consider factors like reputation, courses, placement, location...",
      },
      {
        question: "What are the emerging career fields?",
        answer:
          "AI/ML, data science, cybersecurity, renewable energy are growing...",
      },
    ],
    suggestions: [
      "What are the best courses after 12th science?",
      "How to prepare for competitive exams?",
      "What are the career options in technology?",
      "How to choose between different engineering branches?",
    ],
  };
}

module.exports = {
  getAllFaqs,
  getFaqById,
  searchFaqs,
  getFaqCategories,
  submitFaqQuery,
  getAIProviders,
  markFaqHelpful,
};
