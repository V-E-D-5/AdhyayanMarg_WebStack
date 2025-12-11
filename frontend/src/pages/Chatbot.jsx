import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Loader2,
  Settings,
  Zap,
  Brain,
  Sparkles,
  Minimize2,
  Maximize2,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import { useMutation, useQuery } from "react-query";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import { apiService } from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const Chatbot = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your career guidance assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAIProvider, setSelectedAIProvider] = useState("gemini");
  const [useAI, setUseAI] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const scrollDebounceRef = useRef(null);

  const suggestedQuestions = [
    "What are the best engineering colleges in India?",
    "How to prepare for JEE Advanced?",
    "What career options are available after B.Tech?",
    "How to choose the right specialization?",
    "What are the job prospects in data science?",
    "How to improve my chances of getting placed?",
  ];

  // Fetch AI providers
  const { data: aiProvidersData, isLoading: aiProvidersLoading } = useQuery(
    "aiProviders",
    apiService.getAIProviders,
    {
      onSuccess: (data) => {
        if (data.data.best) {
          setSelectedAIProvider(data.data.best);
        }
      },
    }
  );

  const submitQueryMutation = useMutation(apiService.submitFaqQuery, {
    onSuccess: (response) => {
      setIsTyping(false);

      // Check if we have the expected response structure
      if (response?.data?.success && response?.data?.data?.answer) {
        const botResponse = {
          id: Date.now(),
          type: "bot",
          content: response.data.data.answer,
          timestamp: new Date(),
          helpful: response.data.data.found || false,
          relatedQuestions: response.data.data.relatedQuestions || [],
          aiProvider: response.data.data.aiProvider || "Yukti Assistant",
          aiModel: response.data.data.aiModel || "Enhanced Knowledge Base",
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        const errorResponse = {
          id: Date.now(),
          type: "bot",
          content:
            "I apologize, but I couldn't generate a response. Please try again.",
          timestamp: new Date(),
          helpful: false,
        };
        setMessages((prev) => [...prev, errorResponse]);
      }
    },
    onError: (error) => {
      console.error("Chatbot error:", error);
      setIsTyping(false);
      const errorResponse = {
        id: Date.now(),
        type: "bot",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
        helpful: false,
      };
      setMessages((prev) => [...prev, errorResponse]);
    },
  });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Enhanced auto-scroll when new messages are added
  useEffect(() => {
    // Only auto-scroll if user hasn't manually scrolled up and isn't actively scrolling
    if (autoScrollEnabled && messages.length > 0 && !isUserScrolling) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100); // Slightly increased delay for smoother scrolling
      return () => clearTimeout(timer);
    }
  }, [messages.length, autoScrollEnabled, isUserScrolling]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
      }
    };
  }, []);

  // Enhanced scroll detection for better auto-scroll behavior with debouncing
  const handleScroll = () => {
    // Clear previous debounce timeout
    if (scrollDebounceRef.current) {
      clearTimeout(scrollDebounceRef.current);
    }

    // Debounce scroll handling to prevent multiple updates
    scrollDebounceRef.current = setTimeout(() => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // Increased threshold for better UX

        // Mark that user is actively scrolling
        setIsUserScrolling(true);
        setAutoScrollEnabled(isAtBottom);

        // Clear previous timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Set timeout to mark scrolling as finished
        scrollTimeoutRef.current = setTimeout(() => {
          setIsUserScrolling(false);
        }, 150); // Increased timeout for more stable behavior
      }
    }, 50); // Debounce scroll events by 50ms
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Enable auto-scroll when user sends a message
    setAutoScrollEnabled(true);
    setIsUserScrolling(false);

    // Clear any pending scroll timeouts to ensure clean state
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    if (scrollDebounceRef.current) {
      clearTimeout(scrollDebounceRef.current);
    }

    // Prepare query data with AI settings
    const queryData = {
      query: inputMessage,
      useAI: useAI,
      aiProvider:
        selectedAIProvider === "auto" ? undefined : selectedAIProvider,
    };

    // Update analytics for AI interaction
    if (user) {
      apiService.updateUserAnalytics({
        field: "totalInteractions",
        increment: 1,
      });
    }

    // Simulate typing delay
    setTimeout(() => {
      submitQueryMutation.mutate(queryData);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
    // Temporarily disable auto-scroll when user interacts
    setIsUserScrolling(true);
    setTimeout(() => setIsUserScrolling(false), 1000);
  };

  const handleFeedback = (messageId, isHelpful) => {
    // In a real app, you would send this feedback to the backend
    toast.success(`Thank you for your feedback!`);
    // Temporarily disable auto-scroll when user interacts
    setIsUserScrolling(true);
    setTimeout(() => setIsUserScrolling(false), 500);
  };

  const handleCopyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard!");
      // Temporarily disable auto-scroll when user interacts
      setIsUserScrolling(true);
      setTimeout(() => setIsUserScrolling(false), 500);
    } catch (err) {
      toast.error("Failed to copy message");
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        content:
          "Hello! I'm your career guidance assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    toast.success("Chat cleared!");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${
        isFullscreen ? "fixed inset-0 z-50" : "py-4"
      }`}
    >
      <div
        className={`${
          isFullscreen ? "h-full flex flex-col" : "container-custom"
        }`}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center ${isFullscreen ? "mb-4 pt-6" : "mb-4"}`}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h1 className="heading-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("chatbot.title")}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-body max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            {t("chatbot.subtitle")}
          </p>
        </motion.div>

        {/* AI Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Settings
                </h3>

                <div className="space-y-4">
                  {/* Enable/Disable AI */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable AI Assistant
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Use AI for more intelligent responses
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useAI}
                        onChange={(e) => setUseAI(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  {/* AI Provider Selection */}
                  {useAI && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        AI Provider
                      </label>
                      <select
                        value={selectedAIProvider}
                        onChange={(e) => setSelectedAIProvider(e.target.value)}
                        className="input w-full"
                        disabled={aiProvidersLoading}
                      >
                        <option value="gemini">Google Gemini</option>
                      </select>
                      {aiProvidersData?.data?.best && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Currently using:{" "}
                          {
                            aiProvidersData.data.providers[
                              aiProvidersData.data.best
                            ]?.name
                          }
                        </p>
                      )}
                    </div>
                  )}

                  {/* Gemini Status */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      AI Provider Status:
                    </p>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Google Gemini - Active
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`${
            isFullscreen ? "flex-1 flex flex-col" : "max-w-6xl mx-auto"
          }`}
        >
          <div
            className={`${
              isFullscreen
                ? "flex-1 flex gap-6"
                : "grid grid-cols-1 lg:grid-cols-4 gap-6"
            }`}
          >
            {/* Chat Interface */}
            <div
              className={`${
                isFullscreen ? "flex-1 flex flex-col" : "lg:col-span-3"
              }`}
            >
              <Card
                className={`${
                  isFullscreen
                    ? "flex-1 flex flex-col"
                    : "h-[600px] flex flex-col"
                } shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm`}
              >
                {/* Messages */}
                <div
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                  style={{
                    maxHeight: isFullscreen ? "calc(100vh - 200px)" : "480px",
                    minHeight: isFullscreen ? "calc(100vh - 200px)" : "480px",
                  }}
                >
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-start space-x-3 max-w-[80%] ${
                            message.type === "user"
                              ? "flex-row-reverse space-x-reverse"
                              : ""
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                : "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {message.type === "user" ? (
                              <User className="w-5 h-5" />
                            ) : (
                              <Bot className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 group">
                            <div
                              className={`rounded-2xl p-4 shadow-md transition-all duration-200 hover:shadow-lg ${
                                message.type === "user"
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto max-w-[85%]"
                                  : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 max-w-[90%]"
                              }`}
                            >
                              <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown
                                  components={{
                                    p: ({ children }) => (
                                      <p className="mb-2 last:mb-0">
                                        {children}
                                      </p>
                                    ),
                                    ul: ({ children }) => (
                                      <ul className="list-disc list-inside mb-2 space-y-1">
                                        {children}
                                      </ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="list-decimal list-inside mb-2 space-y-1">
                                        {children}
                                      </ol>
                                    ),
                                    li: ({ children }) => (
                                      <li className="text-sm">{children}</li>
                                    ),
                                    strong: ({ children }) => (
                                      <strong className="font-semibold text-primary-600 dark:text-primary-400">
                                        {children}
                                      </strong>
                                    ),
                                    em: ({ children }) => (
                                      <em className="italic">{children}</em>
                                    ),
                                    code: ({ children }) => (
                                      <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded text-xs font-mono">
                                        {children}
                                      </code>
                                    ),
                                    blockquote: ({ children }) => (
                                      <blockquote className="border-l-4 border-primary-500 pl-4 italic my-2">
                                        {children}
                                      </blockquote>
                                    ),
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>

                              {/* AI Provider Info for bot messages */}
                              {message.type === "bot" && message.aiProvider && (
                                <div className="mt-2 flex items-center gap-2">
                                  <Sparkles className="w-3 h-3 text-blue-500" />
                                  <span className="text-xs text-blue-600 dark:text-blue-400">
                                    Powered by {message.aiProvider}
                                    {message.aiModel && ` (${message.aiModel})`}
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-2">
                                <p
                                  className={`text-xs ${
                                    message.type === "user"
                                      ? "text-blue-100"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {message.timestamp.toLocaleTimeString()}
                                </p>

                                {/* Copy button for bot messages */}
                                {message.type === "bot" && (
                                  <button
                                    onClick={() =>
                                      handleCopyMessage(message.content)
                                    }
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                    title="Copy message"
                                  >
                                    {copiedMessageId === message.id ? (
                                      <Check className="w-3 h-3 text-green-600" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-gray-500" />
                                    )}
                                  </button>
                                )}
                              </div>

                              {/* Feedback for bot messages */}
                              {message.type === "bot" &&
                                message.helpful !== undefined && (
                                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                      {t("chatbot.helpful")}
                                    </p>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() =>
                                          handleFeedback(message.id, true)
                                        }
                                        className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 px-2 py-1 rounded transition-colors"
                                      >
                                        <ThumbsUp className="w-3 h-3" />
                                        <span>{t("chatbot.yes")}</span>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleFeedback(message.id, false)
                                        }
                                        className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors"
                                      >
                                        <ThumbsDown className="w-3 h-3" />
                                        <span>{t("chatbot.no")}</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                              {/* Related Questions */}
                              {message.relatedQuestions &&
                                message.relatedQuestions.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                      Related Questions:
                                    </p>
                                    <div className="space-y-1">
                                      {message.relatedQuestions.map(
                                        (relatedQ, index) => (
                                          <button
                                            key={index}
                                            onClick={() =>
                                              handleSuggestedQuestion(
                                                relatedQ.question
                                              )
                                            }
                                            className="block text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition-colors"
                                          >
                                            {relatedQ.question}
                                          </button>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shadow-lg">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {t("chatbot.thinking")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Auto-scroll to bottom button */}
                  {!autoScrollEnabled && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-center pt-4"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAutoScrollEnabled(true);
                          setIsUserScrolling(false);
                          // Clear any pending scroll timeouts
                          if (scrollTimeoutRef.current) {
                            clearTimeout(scrollTimeoutRef.current);
                          }
                          if (scrollDebounceRef.current) {
                            clearTimeout(scrollDebounceRef.current);
                          }
                          scrollToBottom();
                        }}
                        className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Zap className="w-4 h-4" />
                        Scroll to Bottom
                      </Button>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex space-x-3">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t("chatbot.placeholder")}
                      className="flex-1 border-0 bg-white dark:bg-gray-700 shadow-sm focus:shadow-md transition-shadow"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <span>{inputMessage.length}/1000</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div
              className={`${
                isFullscreen ? "w-80 flex-shrink-0" : "lg:col-span-1"
              }`}
              style={{
                position: isFullscreen ? "sticky" : "relative",
                top: isFullscreen ? "20px" : "auto",
                height: isFullscreen ? "calc(100vh - 40px)" : "580px",
                overflowY: "auto",
              }}
            >
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4">
                <h3 className="heading-4 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  {t("chatbot.suggestions")}
                </h3>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-2.5 text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-900 dark:text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-blue-100 dark:border-gray-600 leading-relaxed"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </Card>

              <Card className="mt-4 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4">
                <h3 className="heading-4 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Quick Tips
                </h3>
                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="leading-relaxed">
                      Be specific with your questions for better answers
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="leading-relaxed">
                      Ask about career paths, colleges, or preparation tips
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ThumbsUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="leading-relaxed">
                      Rate responses to help improve the chatbot
                    </span>
                  </div>
                </div>
              </Card>

              {/* Chat Stats */}
              <Card className="mt-4 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4">
                <h3 className="heading-4 mb-3 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-green-600" />
                  Chat Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Messages
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {messages.length - 1}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      AI Provider
                    </span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {useAI ? "Gemini AI" : "Knowledge Base"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Auto-scroll
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        autoScrollEnabled
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {autoScrollEnabled ? "On" : "Off"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
