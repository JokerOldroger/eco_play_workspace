import { useState } from 'react';
import { Send, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Energy Assistant. I can help you understand campus energy usage, provide tips for saving energy, and answer questions about the EcoPlay system. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: generateAIResponse(input),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('energy') || lowerInput.includes('save')) {
      return "Great question! To save energy on campus, try adjusting thermostats moderately, turning off lights when leaving rooms, and using natural ventilation when possible. Engineering Hall A has saved 12% this month!";
    } else if (lowerInput.includes('temperature') || lowerInput.includes('cold') || lowerInput.includes('warm')) {
      return "Current temperature is 23.5°C with 55% humidity. Most students find this comfortable. You can vote on the Vote page to share your feedback, which helps optimize HVAC settings.";
    } else if (lowerInput.includes('leaderboard') || lowerInput.includes('ranking')) {
      return "The Library Building is currently leading with -15% energy reduction! Check the Stats page to see the full leaderboard and track your building's progress.";
    } else if (lowerInput.includes('co2') || lowerInput.includes('carbon')) {
      return "Current CO₂ level is 650 ppm, which is within the optimal range. Our campus has offset 90 tonnes of CO₂e this semester through energy efficiency measures!";
    } else {
      return "I'm here to help with energy-related questions! Try asking me about energy savings tips, current temperature conditions, building rankings, or CO₂ levels.";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white py-5 text-center border-b">
        <h1 className="text-2xl font-bold">AI Energy Assistant</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'ai' ? 'bg-green-600' : 'bg-blue-600'
              }`}>
                {message.sender === 'ai' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white font-bold">U</span>
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-50 text-gray-800 border border-green-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about energy savings, tips, or campus data..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
