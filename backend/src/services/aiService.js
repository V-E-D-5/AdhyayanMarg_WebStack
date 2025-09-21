const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

class AIService {
  constructor() {
    this.providers = {
      openai: null,
      gemini: null,
      deepseek: null,
    };

    this.initializeProviders();
  }

  initializeProviders() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.providers.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Initialize Google Gemini
    if (process.env.GEMINI_API_KEY) {
      this.providers.gemini = new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
      );
    }

    // DeepSeek uses OpenAI-compatible API
    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.deepseek = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: "https://api.deepseek.com/v1",
      });
    }
  }

  async generateResponse(query, provider = "gemini") {
    try {
      // Add career guidance context to the query
      const contextualQuery = `You are a career guidance counselor AI assistant. Help students with their career and education questions. Be helpful, encouraging, and provide practical advice.

User Question: ${query}

Please provide a comprehensive and helpful response that addresses their career guidance needs.`;

      switch (provider) {
        case "openai":
          return await this.generateOpenAIResponse(contextualQuery);
        case "gemini":
          return await this.generateGeminiResponse(contextualQuery);
        case "deepseek":
          return await this.generateDeepSeekResponse(contextualQuery);
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      console.error(`AI Service Error (${provider}):`, error);
      throw error;
    }
  }

  async generateOpenAIResponse(query) {
    if (!this.providers.openai) {
      throw new Error("OpenAI API key not configured");
    }

    const completion = await this.providers.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful career guidance counselor. Provide clear, actionable advice for students seeking career and education guidance.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      response: completion.choices[0].message.content,
      provider: "OpenAI",
      model: "gpt-3.5-turbo",
    };
  }

  async generateGeminiResponse(query) {
    if (!this.providers.gemini) {
      throw new Error("Gemini API key not configured");
    }

    const model = this.providers.gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    return {
      response: text,
      provider: "Google Gemini",
      model: "gemini-1.5-flash",
    };
  }

  async generateDeepSeekResponse(query) {
    if (!this.providers.deepseek) {
      throw new Error("DeepSeek API key not configured");
    }

    const completion = await this.providers.deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful career guidance counselor. Provide clear, actionable advice for students seeking career and education guidance.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      response: completion.choices[0].message.content,
      provider: "DeepSeek",
      model: "deepseek-chat",
    };
  }

  // Get available providers
  getAvailableProviders() {
    const available = [];

    if (this.providers.openai) available.push("openai");
    if (this.providers.gemini) available.push("gemini");
    if (this.providers.deepseek) available.push("deepseek");

    return available;
  }

  // Get the best available provider (priority: gemini only)
  getBestProvider() {
    const available = this.getAvailableProviders();

    // Only use Gemini if available
    if (available.includes("gemini")) return "gemini";

    return null;
  }
}

module.exports = new AIService();
