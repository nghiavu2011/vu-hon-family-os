import { useState, useRef, useEffect } from 'react';
import { askFamilyAi } from '../services/familyAiService.js';
import { playTempleBell } from '../services/heritageAudioService.js';

const QUICK_PROMPTS = [
  '👑 Thần tích Thủy tổ Vũ Hồn & Mộ Trạch?',
  '🌳 Nhánh cụ Vũ Hữu Dũng & Vũ Trọng Nghĩa?',
  '🧭 Cách xưng hô ông trẻ / bà cô trong họ?',
  '📜 Bài văn khấn cúng giỗ chuẩn gia tiên?',
];

export default function FamilyAiChatModal({ people, events, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Chào con cháu dòng họ Vũ! Ta là Cụ Đồ Ảo - người trông coi kho sử liệu và phả ký Mộ Trạch. Con có điều chi thắc mắc về cội nguồn tiên tổ, thế thứ dòng họ hay lễ tiết cúng giỗ, hãy hỏi ta nhé!',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend = null) => {
    const question = (typeof textToSend === 'string' ? textToSend : inputText).trim();
    if (!question) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Mô phỏng độ trễ suy ngẫm của Cụ Đồ (400ms - 800ms)
    setTimeout(() => {
      const answer = askFamilyAi(question, people, events);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answer,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      // Gõ chuông nhẹ khi trả lời
      playTempleBell();
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="aiChatDialog pad panel" onClick={(e) => e.stopPropagation()}>
        {/* Chat Header */}
        <div className="aiChatHeader">
          <div className="aiChatTitle">
            <img src="/assets/seal-vu.png" alt="" className="aiAvatar" />
            <div>
              <h3>Cụ Đồ Ảo Họ Vũ</h3>
              <span className="aiStatusText">🟢 Trợ lý Gia tộc AI · Am hiểu sử liệu Mộ Trạch</span>
            </div>
          </div>
          <div className="aiHeaderActions">
            <button
              type="button"
              className="btn smallBtn clearChatBtn"
              onClick={() => {
                setMessages([
                  {
                    id: `init-${Date.now()}`,
                    sender: 'ai',
                    text: 'Cụ Đồ sẵn sàng giải đáp thắc mắc mới cho con!',
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              title="Xóa lịch sử trò chuyện"
            >
              🔄 Làm mới
            </button>
            <button type="button" className="closeBtn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Quick Question Pills */}
        <div className="quickPromptRow">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="quickPromptPill"
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="aiMessagesContainer">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chatBubbleWrapper ${msg.sender === 'user' ? 'userBubbleWrapper' : 'aiBubbleWrapper'}`}
            >
              {msg.sender === 'ai' && (
                <img src="/assets/avatar-default.png" alt="Cụ Đồ" className="chatSenderAvatar" />
              )}
              <div className={`chatBubble ${msg.sender === 'user' ? 'userBubble' : 'aiBubble'}`}>
                <div className="bubbleText">
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <span className="bubbleTime">{msg.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chatBubbleWrapper aiBubbleWrapper">
              <img src="/assets/avatar-default.png" alt="Cụ Đồ" className="chatSenderAvatar" />
              <div className="chatBubble aiBubble typingBubble">
                <span className="typingDot" />
                <span className="typingDot" />
                <span className="typingDot" />
                <span className="typingText">Cụ Đồ đang tra cứu gia phả...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="aiChatInputRow">
          <textarea
            rows={2}
            placeholder="Hỏi Cụ Đồ về cội nguồn, thế thứ, xưng hô hoặc văn khấn... (Bấm Enter để gửi)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="aiInputField"
          />
          <button
            type="button"
            className="btn primary aiSendBtn"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
          >
            Gửi ➜
          </button>
        </div>
      </div>
    </div>
  );
}
