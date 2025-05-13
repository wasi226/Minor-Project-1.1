import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Camera, Loader, X, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../../types';
import axios from 'axios';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your Virtual Herbal Garden Assistant. I can help you learn about medicinal plants, their uses, and cultivation methods. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSend = async () => {
    if (input.trim() === '') return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);
    
    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
        message: input
      });
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Failed to get chatbot response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleFileUpload = () => {
    setIsUploading(true);
    setShowSuggestions(false);
    
    // Simulate file upload and processing
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        text: "I've identified this plant as Tulsi (Holy Basil). Tulsi is one of the most sacred plants in India and is used extensively in Ayurveda for its remarkable healing properties including adaptogenic, anti-inflammatory, and immunomodulatory effects.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsUploading(false);
    }, 2000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    handleSend();
  };

  const suggestedQuestions = [
    "What are the health benefits of Tulsi?",
    "How do I grow Ashwagandha at home?",
    "What herbs are good for stress relief?",
    "Tell me about the medicinal properties of Turmeric",
    "What's the difference between Ayurveda and Unani systems?",
    "Which plants help with digestive health?",
    "How is Neem used in traditional medicine?",
    "What are the best herbs for boosting immunity?"
  ];
  
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden h-[700px] max-h-[85vh]">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-semibold flex items-center">
            <Bot className="mr-3 h-6 w-6" />
            Virtual Herbal Assistant
          </h2>
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-success-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
            </span>
            <span className="text-sm text-primary-100">Online</span>
          </div>
        </div>
        <p className="text-primary-100 text-sm">
          Ask me anything about medicinal plants, their uses, and cultivation methods in AYUSH systems.
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex mb-4 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-t-2xl rounded-l-2xl'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-t-2xl rounded-r-2xl'
                } p-4 shadow-sm`}
              >
                <div className={`flex-shrink-0 mr-3 ${
                  message.sender === 'user' ? 'order-2 ml-3 mr-0' : ''
                }`}>
                  {message.sender === 'user' ? (
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                </div>
                <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                  <p className="text-sm mb-1">{message.text}</p>
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex mb-4 justify-start"
          >
            <div className="bg-white border border-gray-200 text-gray-800 rounded-t-2xl rounded-r-2xl p-4 shadow-sm flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-primary-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex mb-4 justify-start"
          >
            <div className="bg-white border border-gray-200 text-gray-800 rounded-t-2xl rounded-r-2xl p-4 shadow-sm flex items-center">
              <Loader className="h-5 w-5 text-primary-600 animate-spin mr-2" />
              <span className="text-sm">Analyzing your plant image...</span>
            </div>
          </motion.div>
        )}
        
        {showSuggestions && messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Suggested Questions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition-colors text-sm text-gray-700"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFileUpload}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Upload plant image for identification"
          >
            <Camera className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about medicinal plants..."
              className="block w-full pl-4 pr-10 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
            />
            {input && (
              <button
                onClick={() => setInput('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-3 rounded-lg transition-colors ${
              input.trim()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-2 flex items-center justify-center">
          <HelpCircle className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">
            Type your question or click a suggestion above
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;