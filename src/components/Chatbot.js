import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle } from 'lucide-react';

const buildInitialContext = (summaryData, allChartData) => {
  if (!summaryData || !allChartData) return '';

  const summary = [
    `**Total Revenue**: ₹${summaryData.totalRevenue.toLocaleString()}`,
    `**Total Items Sold**: ${summaryData.totalItemsSold}`,
    `**Avg Order Value**: ₹${summaryData.averageOrderValue.toFixed(2)}`,
    `**Monthly Growth**: ${summaryData.monthComparison.percentageGrowth}%`,
    `**Top Products**: ${summaryData.topProducts.map(p => `${p.name} (${p.unitsSold})`).join(', ')}`,
    `**Category Revenue**: ${summaryData.categoryShare.map(c => `${c.category} (₹${c.revenue})`).join(', ')}`
  ].join('\n');

  const recent7 = allChartData.slice(-7);
  const productTotals = {};

  recent7.forEach(day => {
    for (const [key, value] of Object.entries(day)) {
      if (key !== 'date') {
        productTotals[key] = (productTotals[key] || 0) + value;
      }
    }
  });

  const topRecent = Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([p, q]) => `${p} (${q})`).join(', ');

  return `${summary}\n\n**Recent Sales (7 days)**: ${topRecent}`;
};

const Chatbot = ({ summaryData, allChartData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hi! Ask me anything about your store.' }]);
  const [input, setInput] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const body = {
      prompt: input,
      ...(hasInitialized ? {} : { context: buildInitialContext(summaryData, allChartData) })
    };

    try {
      const res = await fetch('https://walmart-back.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const json = await res.json();
      setMessages([...newMessages, { role: 'ai', text: json.response }]);
      setHasInitialized(true);
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', text: 'Error reaching AI.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#39E0C7',
          color: '#000',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(57, 224, 199, 0.8)',
          animation: 'pulse 2s infinite'
        }}
      >
        <MessageCircle size={28} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '350px',
            maxHeight: '500px',
            background: '#111',
            color: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px', fontWeight: 'bold', background: '#222' }}>
            🤖 AI Assistant
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', fontSize: '14px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: '12px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <div style={{ marginBottom: '4px', fontSize: '12px', opacity: 0.6 }}>
                  {msg.role === 'user' ? 'You' : 'AI'}
                </div>
                <div
                  style={{
                    background: msg.role === 'user' ? '#39E0C7' : '#333',
                    color: msg.role === 'user' ? '#000' : '#fff',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                  }}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ fontStyle: 'italic', fontSize: '13px', color: '#aaa' }}>AI is thinking...</div>
            )}
            <div ref={messageEndRef} />
          </div>

          <div style={{ display: 'flex', borderTop: '1px solid #333' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask something..."
              style={{ flex: 1, padding: '10px 12px', background: '#000', color: 'white', border: 'none' }}
            />
            <button
              onClick={sendMessage}
              style={{ padding: '10px 16px', background: '#39E0C7', color: 'black', border: 'none', cursor: 'pointer' }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(57, 224, 199, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(57, 224, 199, 0); }
            100% { box-shadow: 0 0 0 0 rgba(57, 224, 199, 0); }
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
