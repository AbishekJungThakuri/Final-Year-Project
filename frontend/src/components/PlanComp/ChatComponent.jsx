import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatSession, addChatMessage } from "../../features/plan/chatSlice";
import { sendEditWebSocketMessage, connectToEditPlanWebSocket , disconnectEditWebSocket} from '../../features/plan/EditPlanWebsocket';
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ChatComponent = ({ planId }) => {
  const dispatch = useDispatch();
  const { messages, loading, error, loadedPlanId } = useSelector((state) => state.aiChat); 
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
  
    const messageToSend = inputValue.trim();
  
    // Add to Redux chat
    dispatch(addChatMessage({ message: messageToSend, sender: 'user' }));
  
    // Send to WebSocket
    const token = localStorage.getItem("token")
    connectToEditPlanWebSocket(dispatch, planId, messageToSend, token)
   
    if (!sent) {
      console.warn("[ChatComponent] Failed to send via WebSocket");
      // Optionally show a UI error
    }
  
    setInputValue('');
  };
  
  useEffect(() => {
    if (planId) {
      dispatch(fetchChatSession(planId));
    }
  }, [planId]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          
          <div
            key={message.index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {message.sender === 'ai' && (
                <Avatar className="h-6 w-6 mt-1">
                  <AvatarFallback className="bg-muted text-xs">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}>
                {message.message}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex p-2 border-t">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 mr-2"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}><Send size={16} /></Button>
      </div>
    </div>
  );
};

export default ChatComponent;
